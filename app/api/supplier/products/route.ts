import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SEED_PRODUCTS } from "@/lib/supabase/seed-data";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey || url.includes("placeholder")) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || url.includes("placeholder")) return null;
  return createClient(url, anonKey);
}

// GET: Fetch products for current supplier
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterAll = searchParams.get("all") === "true"; // For buyer catalog

    const adminClient = getAdminClient() || getAnonClient();

    const cookieStore = cookies();
    const mockRole = cookieStore.get("fishlink_mock_role")?.value;
    const mockName = cookieStore.get("fishlink_mock_name")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_name")!.value) : "";
    const mockPhone = cookieStore.get("fishlink_mock_phone")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_phone")!.value) : "";

    const { getAdjustedStock } = await import("@/lib/mock-orders");

    const applyStockAdjustments = (prods: any[]) =>
      prods.map((p) => ({
        ...p,
        stock_kg: getAdjustedStock(p.id, Number(p.stock_kg || 0)),
      }));

    if (!adminClient) {
      // Fallback
      if (filterAll || mockName === "Pak Udung" || !mockName) {
        return NextResponse.json({ success: true, products: applyStockAdjustments(SEED_PRODUCTS) });
      }
      return NextResponse.json({ success: true, products: [] });
    }

    if (filterAll) {
      // Return all active products from DB + Seed
      const { data: dbProducts } = await adminClient
        .from("products")
        .select("*, suppliers(*)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      const mappedDb = (dbProducts || []).map((p: any) => ({
        ...p,
        suppliers: p.suppliers || {
          id: p.supplier_id,
          business_name: "Mitra Nelayan Lokal",
          supplier_type: "nelayan_perorangan",
          address_label: "Dermaga Pesisir",
          is_trusted_badge: true,
          average_rating: 4.9,
        },
      }));

      // Deduplicate DB & Seed products
      const dbIds = new Set(mappedDb.map((p: any) => p.id));
      const seedFiltered = SEED_PRODUCTS.filter((s) => !dbIds.has(s.id));
      const all = [...mappedDb, ...seedFiltered];
      return NextResponse.json({ success: true, products: applyStockAdjustments(all) });
    }

    // If specific supplier (Pak Udung or custom)
    if (mockName === "Pak Udung" || !mockName) {
      const { data: dbProducts } = await adminClient
        .from("products")
        .select("*, suppliers(*)")
        .order("created_at", { ascending: false });

      const seedPakUdung = SEED_PRODUCTS.filter((p) => p.supplier_id === "s1111111-1111-1111-1111-111111111111");
      const dbIds = new Set((dbProducts || []).map((p: any) => p.id));
      const seedFiltered = seedPakUdung.filter((s) => !dbIds.has(s.id));
      const combined = [...(dbProducts || []), ...seedFiltered];
      return NextResponse.json({ success: true, products: applyStockAdjustments(combined) });
    }

    // Find supplier row by phone or profile
    let supplierId: string | null = null;

    if (mockPhone) {
      const cleanPhone = mockPhone.replace(/\D/g, "");
      const { data: profile } = await adminClient
        .from("profiles")
        .select("id")
        .or(`phone.eq.${cleanPhone},phone.eq.${mockPhone}`)
        .maybeSingle();

      if (profile) {
        const { data: supp } = await adminClient
          .from("suppliers")
          .select("id")
          .eq("profile_id", profile.id)
          .maybeSingle();
        if (supp) supplierId = supp.id;
      }
    }

    if (!supplierId) {
      const { data: suppByName } = await adminClient
        .from("suppliers")
        .select("id")
        .ilike("business_name", `%${mockName}%`)
        .maybeSingle();
      if (suppByName) supplierId = suppByName.id;
    }

    if (supplierId) {
      const { data: myProducts } = await adminClient
        .from("products")
        .select("*, suppliers(*)")
        .eq("supplier_id", supplierId)
        .order("created_at", { ascending: false });

      return NextResponse.json({ success: true, products: applyStockAdjustments(myProducts || []) });
    }

    return NextResponse.json({ success: true, products: applyStockAdjustments(SEED_PRODUCTS) });
  } catch (err: any) {
    console.error("GET /api/supplier/products error:", err);
    return NextResponse.json({ success: true, products: [] });
  }
}

// POST: Add new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fishName,
      pricePerKg,
      stockKg,
      catchDate,
      photoUrl,
      seasonTag,
      description,
    } = body;

    if (!fishName || !pricePerKg || !stockKg) {
      return NextResponse.json(
        { success: false, error: "Mohon lengkapi data produk (nama, harga, berat)." },
        { status: 400 }
      );
    }

    const adminClient = getAdminClient() || getAnonClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, error: "Database Supabase belum terhubung." },
        { status: 500 }
      );
    }

    const cookieStore = cookies();
    const mockName = cookieStore.get("fishlink_mock_name")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_name")!.value) : "Mitra Supplier";
    const mockPhone = cookieStore.get("fishlink_mock_phone")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_phone")!.value) : "";
    const mockLocation = cookieStore.get("fishlink_mock_location")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_location")!.value) : "Dermaga / Tambak Nelayan";
    const mockSupplierType = cookieStore.get("fishlink_mock_supplier_type")?.value || "nelayan_perorangan";
    const mockBusiness = cookieStore.get("fishlink_mock_business")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_business")!.value) : `Tangkapan ${mockName}`;

    // 1. Resolve or Create Supplier in DB
    let supplierId: string | null = null;

    if (mockPhone) {
      const cleanPhone = mockPhone.replace(/\D/g, "");
      const { data: profile } = await adminClient
        .from("profiles")
        .select("id")
        .or(`phone.eq.${cleanPhone},phone.eq.${mockPhone}`)
        .maybeSingle();

      if (profile) {
        const { data: existingSupp } = await adminClient
          .from("suppliers")
          .select("id")
          .eq("profile_id", profile.id)
          .maybeSingle();

        if (existingSupp) {
          supplierId = existingSupp.id;
        } else {
          // Create supplier row
          const { data: newSupp } = await adminClient
            .from("suppliers")
            .insert({
              profile_id: profile.id,
              supplier_type: mockSupplierType,
              business_name: mockBusiness,
              address_label: mockLocation,
              location: "POINT(109.2344 -7.4243)",
            })
            .select("id")
            .single();
          if (newSupp) supplierId = newSupp.id;
        }
      }
    }

    // Fallback: If no supplier row found, find any or use demo
    if (!supplierId) {
      const { data: anySupp } = await adminClient
        .from("suppliers")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (anySupp) {
        supplierId = anySupp.id;
      } else {
        // Create demo profile & supplier
        const demoUserId = `u-seed-${Date.now()}`;
        await adminClient.from("profiles").upsert({
          id: demoUserId,
          role: "supplier",
          full_name: mockName,
          phone: mockPhone || "081234567890",
        });

        const { data: createdSupp } = await adminClient
          .from("suppliers")
          .insert({
            profile_id: demoUserId,
            supplier_type: mockSupplierType,
            business_name: mockBusiness,
            address_label: mockLocation,
            location: "POINT(109.2344 -7.4243)",
          })
          .select("id")
          .single();

        if (createdSupp) supplierId = createdSupp.id;
      }
    }

    if (!supplierId) {
      return NextResponse.json(
        { success: false, error: "Gagal menghubungkan profil supplier." },
        { status: 500 }
      );
    }

    // 2. Insert into products table
    const { data: newProduct, error: prodError } = await adminClient
      .from("products")
      .insert({
        supplier_id: supplierId,
        fish_name: fishName,
        price_per_kg: Number(pricePerKg),
        stock_kg: Number(stockKg),
        catch_or_harvest_date: catchDate || new Date().toISOString().split("T")[0],
        photo_url: photoUrl || "/fresh-fish.png",
        season_tag: seasonTag || "Segar Harian",
        description: description || `Pasokan segar langsung dari ${mockBusiness}`,
        is_active: true,
      })
      .select("*, suppliers(*)")
      .single();

    if (prodError) {
      console.error("Product insert error:", prodError);
      return NextResponse.json(
        { success: false, error: `Gagal menyimpan produk: ${prodError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product: newProduct,
    });
  } catch (err: any) {
    console.error("POST /api/supplier/products error:", err);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat menyimpan stok." },
      { status: 500 }
    );
  }
}

// PATCH: Toggle active or update stock
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, is_active, stock_kg, price_per_kg } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
    }

    const adminClient = getAdminClient() || getAnonClient();
    if (!adminClient) {
      return NextResponse.json({ success: true });
    }

    const updates: any = {};
    if (typeof is_active === "boolean") updates.is_active = is_active;
    if (typeof stock_kg === "number") updates.stock_kg = stock_kg;
    if (typeof price_per_kg === "number") updates.price_per_kg = price_per_kg;

    await adminClient.from("products").update(updates).eq("id", id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PATCH /api/supplier/products error:", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui produk" }, { status: 500 });
  }
}

// DELETE: Delete product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
    }

    const adminClient = getAdminClient() || getAnonClient();
    if (adminClient) {
      await adminClient.from("products").delete().eq("id", id);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/supplier/products error:", err);
    return NextResponse.json({ success: false, error: "Gagal menghapus produk" }, { status: 500 });
  }
}
