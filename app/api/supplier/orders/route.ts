import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SEED_SUPPLIER_ORDERS = [
  {
    id: "o1111111-1111-1111-1111-111111111111",
    buyerName: "Restoran Seafood Bahari (Senopati)",
    fishName: "Kakap Merah Segar Tangkapan Subuh",
    quantityKg: 50,
    subtotal: 4250000,
    status: "diproses_supplier",
    dateLabel: "Hari ini",
  },
  {
    id: "o2222222-2222-2222-2222-222222222222",
    buyerName: "Restoran Seafood Bahari",
    fishName: "Cumi-Cumi Segar Seret Malam",
    quantityKg: 30,
    subtotal: 2550000,
    status: "diterima",
    dateLabel: "2 hari lalu",
  },
];

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey || url.includes("placeholder")) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET: Fetch incoming orders for supplier
export async function GET(request: Request) {
  try {
    const adminClient = getAdminClient();
    const cookieStore = cookies();
    const mockName = cookieStore.get("fishlink_mock_name")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_name")!.value) : "";
    const mockPhone = cookieStore.get("fishlink_mock_phone")?.value ? decodeURIComponent(cookieStore.get("fishlink_mock_phone")!.value) : "";

    if (!adminClient) {
      if (mockName === "Pak Udung" || !mockName) {
        return NextResponse.json({ success: true, orders: SEED_SUPPLIER_ORDERS });
      }
      return NextResponse.json({ success: true, orders: [] });
    }

    if (mockName === "Pak Udung") {
      // Return seed orders + any real orders
      const { data: dbItems } = await adminClient
        .from("order_items")
        .select("*, orders(*, buyer_profiles(*)), products(*)")
        .order("created_at", { ascending: false });

      const mapped = (dbItems || []).map((it: any) => ({
        id: it.order_id || it.id,
        buyerName: it.orders?.buyer_profiles?.business_name || "Mitra Restoran B2B",
        fishName: it.products?.fish_name || "Hasil Laut Segar",
        quantityKg: Number(it.quantity_kg),
        subtotal: Number(it.price_per_kg_at_order) * Number(it.quantity_kg),
        status: it.orders?.status || "diproses_supplier",
        dateLabel: "Baru saja",
      }));

      return NextResponse.json({ success: true, orders: [...mapped, ...SEED_SUPPLIER_ORDERS] });
    }

    // Resolve supplier ID
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
      const { data: items } = await adminClient
        .from("order_items")
        .select("*, orders(*, buyer_profiles(*)), products(*)")
        .eq("supplier_id", supplierId);

      const mapped = (items || []).map((it: any) => ({
        id: it.order_id || it.id,
        buyerName: it.orders?.buyer_profiles?.business_name || "Mitra Pembeli",
        fishName: it.products?.fish_name || "Hasil Laut Segar",
        quantityKg: Number(it.quantity_kg),
        subtotal: Number(it.price_per_kg_at_order) * Number(it.quantity_kg),
        status: it.orders?.status || "diproses_supplier",
        dateLabel: "Terbaru",
      }));

      return NextResponse.json({ success: true, orders: mapped });
    }

    return NextResponse.json({ success: true, orders: [] });
  } catch (err: any) {
    console.error("GET /api/supplier/orders error:", err);
    return NextResponse.json({ success: true, orders: [] });
  }
}

// PATCH: Update order status & log tracking event
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status, locationLabel, temperatureC } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "Order ID and status required" }, { status: 400 });
    }

    const adminClient = getAdminClient();
    if (adminClient) {
      // Update order status
      await adminClient
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      // Insert tracking event
      const eventLabels: Record<string, string> = {
        dikirim_ke_gudang: "Ikan Diserahkan Supplier & Menuju Cold Storage Hub",
        dalam_pengiriman: "Dalam Pengiriman Armada Pendingin ke Restoran",
        diterima: "Pesanan Diterima Restoran dengan Segar",
      };

      await adminClient.from("tracking_events").insert({
        order_id: orderId,
        event_label: eventLabels[status] || `Status diperbarui: ${status}`,
        location_label: locationLabel || "Hub Cold Storage Fishlink",
        temperature_c: temperatureC || -2.5,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PATCH /api/supplier/orders error:", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui status order" }, { status: 500 });
  }
}
