import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SEED_ORDERS } from "@/lib/supabase/seed-data";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey || url.includes("placeholder")) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET: Fetch buyer's orders or single order by ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    const adminClient = getAdminClient();
    const cookieStore = cookies();
    const mockName = cookieStore.get("fishlink_mock_name")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_name")!.value) : "";
    const mockPhone = cookieStore.get("fishlink_mock_phone")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_phone")!.value) : "";

    if (!adminClient) {
      if (orderId) {
        const found = SEED_ORDERS.find((o) => o.id === orderId);
        return NextResponse.json({ success: true, order: found || SEED_ORDERS[0] });
      }
      if (mockName === "Bambang Hartono" || !mockName) {
        return NextResponse.json({ success: true, orders: SEED_ORDERS });
      }
      return NextResponse.json({ success: true, orders: [] });
    }

    // If specific order requested
    if (orderId) {
      const { data: dbOrder } = await adminClient
        .from("orders")
        .select("*, buyer_profiles(*), order_items(*, products(*), suppliers(*)), tracking_events(*)")
        .eq("id", orderId)
        .maybeSingle();

      if (dbOrder) {
        const items = dbOrder.order_items || [];
        const itemSummary = items.length > 0
          ? items.map((it: any) => `${it.quantity_kg}kg ${it.products?.fish_name || "Ikan Segar"}`).join(", ")
          : "Pesanan Hasil Laut Segar";
        const supplierName = items[0]?.suppliers?.business_name || "Mitra Supplier Fishlink";

        return NextResponse.json({
          success: true,
          order: {
            ...dbOrder,
            itemSummary,
            supplierName,
            tracking_events: dbOrder.tracking_events || [],
          },
        });
      }

      // Check seed
      const seed = SEED_ORDERS.find((o) => o.id === orderId);
      return NextResponse.json({ success: true, order: seed || SEED_ORDERS[0] });
    }

    // Find Buyer Profile
    let buyerProfileId: string | null = null;
    if (mockPhone) {
      const cleanPhone = mockPhone.replace(/\D/g, "");
      const { data: profile } = await adminClient
        .from("profiles")
        .select("id")
        .or(`phone.eq.${cleanPhone},phone.eq.${mockPhone}`)
        .maybeSingle();
      if (profile) buyerProfileId = profile.id;
    }

    if (!buyerProfileId && mockName !== "Bambang Hartono") {
      const { data: anyBuyer } = await adminClient
        .from("buyer_profiles")
        .select("profile_id")
        .ilike("business_name", `%${mockName}%`)
        .maybeSingle();
      if (anyBuyer) buyerProfileId = anyBuyer.profile_id;
    }

    if (buyerProfileId) {
      const { data: dbOrders } = await adminClient
        .from("orders")
        .select("*, order_items(*, products(*), suppliers(*))")
        .eq("buyer_id", buyerProfileId)
        .order("created_at", { ascending: false });

      if (dbOrders && dbOrders.length > 0) {
        const mapped = dbOrders.map((o: any) => {
          const items = o.order_items || [];
          const itemSummary = items.length > 0
            ? items.map((it: any) => `${it.quantity_kg}kg ${it.products?.fish_name || "Hasil Laut"}`).join(", ")
            : "Pesanan Hasil Laut Segar";
          const supplierName = items[0]?.suppliers?.business_name || "Mitra Supplier Fishlink";
          return {
            ...o,
            itemSummary,
            supplierName,
          };
        });
        return NextResponse.json({ success: true, orders: mapped });
      }
    }

    // If demo account or no orders found yet
    if (mockName === "Bambang Hartono") {
      return NextResponse.json({ success: true, orders: SEED_ORDERS });
    }

    return NextResponse.json({ success: true, orders: [] });
  } catch (err: any) {
    console.error("GET /api/buyer/orders error:", err);
    return NextResponse.json({ success: true, orders: [] });
  }
}

// POST: Create buyer order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, grandTotal, deliveryDate, paymentMethod, locationLabel } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Keranjang kosong" }, { status: 400 });
    }

    const adminClient = getAdminClient();
    const cookieStore = cookies();
    const mockName = cookieStore.get("fishlink_mock_name")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_name")!.value) : "Restoran Mitra";
    const mockPhone = cookieStore.get("fishlink_mock_phone")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_phone")!.value) : "";
    const mockBusiness = cookieStore.get("fishlink_mock_business")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_business")!.value) : "Restoran Seafood";

    let buyerProfileId: string | null = null;

    if (adminClient) {
      // Find buyer profile
      if (mockPhone) {
        const cleanPhone = mockPhone.replace(/\D/g, "");
        const { data: profile } = await adminClient
          .from("profiles")
          .select("id")
          .or(`phone.eq.${cleanPhone},phone.eq.${mockPhone}`)
          .maybeSingle();
        if (profile) buyerProfileId = profile.id;
      }

      if (!buyerProfileId) {
        const { data: anyBuyer } = await adminClient
          .from("buyer_profiles")
          .select("profile_id")
          .limit(1)
          .maybeSingle();
        if (anyBuyer) buyerProfileId = anyBuyer.profile_id;
      }

      if (!buyerProfileId) {
        const demoBuyerId = `u-buyer-${Date.now()}`;
        await adminClient.from("profiles").upsert({
          id: demoBuyerId,
          role: "buyer",
          full_name: mockName,
          phone: mockPhone || "081298765432",
        });
        await adminClient.from("buyer_profiles").upsert({
          profile_id: demoBuyerId,
          business_name: mockBusiness,
          business_type: "Restoran Seafood",
          address: locationLabel || "Jakarta Selatan",
        });
        buyerProfileId = demoBuyerId;
      }

      // Create Order in DB
      const { data: order, error: orderError } = await adminClient
        .from("orders")
        .insert({
          buyer_id: buyerProfileId,
          status: "diproses_supplier",
          delivery_schedule: deliveryDate || new Date().toISOString().split("T")[0],
          subtotal: Number(grandTotal),
        })
        .select("id")
        .single();

      if (order?.id) {
        // Insert order items
        for (const item of items) {
          let suppId = item.supplierId;
          if (!suppId || suppId.length < 10) {
            const { data: supp } = await adminClient.from("suppliers").select("id").limit(1).single();
            if (supp) suppId = supp.id;
          }

          let prodId = item.productId;
          if (!prodId || prodId.length < 10) {
            const { data: prod } = await adminClient.from("products").select("id").limit(1).single();
            if (prod) prodId = prod.id;
          }

          if (suppId && prodId) {
            await adminClient.from("order_items").insert({
              order_id: order.id,
              product_id: prodId,
              supplier_id: suppId,
              quantity_kg: Number(item.quantityKg),
              price_per_kg_at_order: Number(item.pricePerKg),
            });
          }
        }

        // Insert payment
        await adminClient.from("payments").insert({
          order_id: order.id,
          amount: Number(grandTotal),
          method: paymentMethod || "mock_transfer",
          status: "paid",
          paid_at: new Date().toISOString(),
        });

        // Insert initial tracking event
        await adminClient.from("tracking_events").insert({
          order_id: order.id,
          event_label: "Pesanan Dikonfirmasi & Sedang Disiapkan Supplier",
          location_label: locationLabel || "Hub Purwokerto / Pesisir Asal",
          temperature_c: -2.5,
        });

        return NextResponse.json({
          success: true,
          orderId: order.id,
        });
      }
    }

    // Fallback order ID
    const fallbackId = `o${Date.now().toString(36)}`;
    return NextResponse.json({ success: true, orderId: fallbackId });
  } catch (err: any) {
    console.error("POST /api/buyer/orders error:", err);
    return NextResponse.json({ success: false, error: "Gagal memproses pesanan" }, { status: 500 });
  }
}
