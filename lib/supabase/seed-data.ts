/**
 * Fishlink — Centralized Seed / Demo Data
 * ────────────────────────────────────────
 * Semua dummy data yang sebelumnya tersebar di berbagai komponen
 * kini disentralisasi di sini. Digunakan sebagai fallback saat
 * Supabase belum terhubung (placeholder credentials).
 */

import { Product, Supplier, SupplierCertification, Order } from "@/types/database.types";

// Re-define ProductWithSupplier here to avoid circular dependency with products.ts
export interface SeedProductWithSupplier extends Product {
  suppliers: Supplier;
  distance_km?: number;
  certifications?: SupplierCertification[];
}

/* ──────────────────────────────────────────────────────────────
   SUPPLIERS
   ────────────────────────────────────────────────────────────── */
export const SEED_SUPPLIERS = {
  pak_udung: {
    id: "s1111111-1111-1111-1111-111111111111",
    profile_id: "u1111111-1111-1111-1111-111111111111",
    supplier_type: "nelayan_perorangan" as const,
    business_name: "Tangkapan Pak Udung",
    bio: "Nelayan tradisional Purwokerto berpengalaman 15 tahun.",
    location: null,
    address_label: "Dermaga 3 Purwokerto, Jakarta Utara",
    is_trusted_badge: true,
    average_rating: 4.9,
    created_at: new Date().toISOString(),
  },
  pt_laut: {
    id: "s2222222-2222-2222-2222-222222222222",
    profile_id: "u2222222-2222-2222-2222-222222222222",
    supplier_type: "nelayan_besar" as const,
    business_name: "PT Laut Nusantara Jaya",
    bio: "Perusahaan armada kapal penangkap samudra skala besar dengan fasilitas cold-storage modern.",
    location: null,
    address_label: "Pelabuhan Ratu, Sukabumi",
    is_trusted_badge: true,
    average_rating: 4.8,
    created_at: new Date().toISOString(),
  },
  koperasi_tambak: {
    id: "s3333333-3333-3333-3333-333333333333",
    profile_id: "u3333333-3333-3333-3333-333333333333",
    supplier_type: "pembudidaya" as const,
    business_name: "Koperasi Tambak Segar Mandiri",
    bio: "Budidaya udang vaname dan ikan bandeng kualitas tinggi dengan metode ramah lingkungan.",
    location: null,
    address_label: "Cilamaya, Karawang",
    is_trusted_badge: true,
    average_rating: 4.7,
    created_at: new Date().toISOString(),
  },
};

/* ──────────────────────────────────────────────────────────────
   PRODUCTS
   ────────────────────────────────────────────────────────────── */
const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

export const SEED_PRODUCTS: SeedProductWithSupplier[] = [
  {
    id: "p1111111-1111-1111-1111-111111111111",
    supplier_id: SEED_SUPPLIERS.pt_laut.id,
    fish_name: "Tuna Sirip Kuning (Yellowfin) Grade A",
    description: "Dipotong dan dibekukan langsung di atas kapal cold-chain (-35°C). Sangat cocok untuk sasimi restoran Jepang & steak tuna hotel.",
    price_per_kg: 115000,
    stock_kg: 350.0,
    catch_or_harvest_date: today,
    season_tag: "Musim Puncak Tuna",
    photo_url: "/fresh-fish.png",
    is_active: true,
    created_at: new Date().toISOString(),
    distance_km: 42,
    suppliers: SEED_SUPPLIERS.pt_laut,
  },
  {
    id: "p2222222-2222-2222-2222-222222222222",
    supplier_id: SEED_SUPPLIERS.pak_udung.id,
    fish_name: "Kakap Merah Segar Tangkapan Subuh",
    description: "Hasil pancing nelayan tradisional Purwokerto. Daging tebal, mata bening, insang merah segar. Ukuran 1.5kg - 3kg per ekor.",
    price_per_kg: 85000,
    stock_kg: 120.0,
    catch_or_harvest_date: today,
    season_tag: "Segar Harian",
    photo_url: "/fresh-fish.png",
    is_active: true,
    created_at: new Date().toISOString(),
    distance_km: 12,
    suppliers: SEED_SUPPLIERS.pak_udung,
  },
  {
    id: "p3333333-3333-3333-3333-333333333333",
    supplier_id: SEED_SUPPLIERS.koperasi_tambak.id,
    fish_name: "Udang Vaname Size 40-50 Premium",
    description: "Hasil panen tambak Cilamaya Karawang. Diberi es serut langsung saat dipanen. Bebas kimia & antibiotik.",
    price_per_kg: 95000,
    stock_kg: 500.0,
    catch_or_harvest_date: today,
    season_tag: "Panen Raya Tambak",
    photo_url: "/fresh-fish.png",
    is_active: true,
    created_at: new Date().toISOString(),
    distance_km: 68,
    suppliers: SEED_SUPPLIERS.koperasi_tambak,
  },
  {
    id: "p4444444-4444-4444-4444-444444444444",
    supplier_id: SEED_SUPPLIERS.pak_udung.id,
    fish_name: "Cumi-Cumi Segar Seret Malam",
    description: "Tangkapan jaring cumi malam hari. Kulit masih mengkilap kehijauan, tidak berbau amis menyengat. Cocok untuk cumi goreng tepung/bakar.",
    price_per_kg: 78000,
    stock_kg: 80.0,
    catch_or_harvest_date: today,
    season_tag: "Musim Cumi",
    photo_url: "/fresh-fish.png",
    is_active: true,
    created_at: new Date().toISOString(),
    distance_km: 14,
    suppliers: SEED_SUPPLIERS.pak_udung,
  },
  {
    id: "p5555555-5555-5555-5555-555555555555",
    supplier_id: SEED_SUPPLIERS.pt_laut.id,
    fish_name: "Kerapu Bintang Live / Super Fresh",
    description: "Tangkapan laut lepas Pelabuhan Ratu. Tekstur lembut dan manis khas kerapu karang segar.",
    price_per_kg: 145000,
    stock_kg: 90.0,
    catch_or_harvest_date: yesterday,
    season_tag: "Tangkapan Khusus",
    photo_url: "/fresh-fish.png",
    is_active: true,
    created_at: new Date().toISOString(),
    distance_km: 45,
    suppliers: SEED_SUPPLIERS.pt_laut,
  },
  {
    id: "p6666666-6666-6666-6666-666666666666",
    supplier_id: SEED_SUPPLIERS.pak_udung.id,
    fish_name: "Ikan Tongkol Segar Sirip Hitam",
    description: "Ikan tongkol pancing harian. Tekstur padat, kaya Omega-3, favorit catering & restoran masakan Padang.",
    price_per_kg: 38000,
    stock_kg: 250.0,
    catch_or_harvest_date: today,
    season_tag: "Hasil Laut Melimpah",
    photo_url: "/fresh-fish.png",
    is_active: true,
    created_at: new Date().toISOString(),
    distance_km: 15,
    suppliers: SEED_SUPPLIERS.pak_udung,
  },
  {
    id: "p7777777-7777-7777-7777-777777777777",
    supplier_id: SEED_SUPPLIERS.pt_laut.id,
    fish_name: "Ikan Tenggiri Batang Super (Utuh)",
    description: "Ukuran 3 - 5 kg per ekor. Daging tebal dan putih berserat, pilihan utama pembuat pempek, otak-otak & chikuwa.",
    price_per_kg: 105000,
    stock_kg: 180.0,
    catch_or_harvest_date: today,
    season_tag: "Tangkapan Unggulan",
    photo_url: "/fresh-fish.png",
    is_active: true,
    created_at: new Date().toISOString(),
    distance_km: 43,
    suppliers: SEED_SUPPLIERS.pt_laut,
  },
  {
    id: "p8888888-8888-8888-8888-888888888888",
    supplier_id: SEED_SUPPLIERS.pak_udung.id,
    fish_name: "Kepiting Bakau Jantan Segar",
    description: "Kepiting hidup dengan capit tebal terikat rapi. Kualitas padat berisi 85%+. Isi 3-4 ekor per kg.",
    price_per_kg: 130000,
    stock_kg: 60.0,
    catch_or_harvest_date: today,
    season_tag: "Hasil Tangkapan Pesisir",
    photo_url: "/fresh-fish.png",
    is_active: true,
    created_at: new Date().toISOString(),
    distance_km: 11,
    suppliers: SEED_SUPPLIERS.pak_udung,
  },
  {
    id: "p9999999-9999-9999-9999-999999999999",
    supplier_id: SEED_SUPPLIERS.koperasi_tambak.id,
    fish_name: "Bandeng Tambak Segar Cabut Duri",
    description: "Bandeng budidaya tidak berbau lumpur. Sudah dibersihkan sisik & ditiadakan duri dominan.",
    price_per_kg: 48000,
    stock_kg: 300.0,
    catch_or_harvest_date: today,
    season_tag: "Hasil Tambak Karawang",
    photo_url: "/fresh-fish.png",
    is_active: true,
    created_at: new Date().toISOString(),
    distance_km: 65,
    suppliers: SEED_SUPPLIERS.koperasi_tambak,
  },
];

/* ──────────────────────────────────────────────────────────────
   ORDERS
   ────────────────────────────────────────────────────────────── */
export const SEED_ORDERS: (Order & { itemSummary: string; supplierName: string })[] = [
  {
    id: "o1111111-1111-1111-1111-111111111111",
    buyer_id: "u4444444-4444-4444-4444-444444444444",
    status: "dalam_pengiriman" as const,
    delivery_schedule: today,
    warehouse_id: "w1111111-1111-1111-1111-111111111111",
    subtotal: 4250000,
    created_at: new Date(Date.now() - 21600000).toISOString(),
    updated_at: new Date().toISOString(),
    itemSummary: "50 kg Kakap Merah Tangkapan Subuh",
    supplierName: "Tangkapan Pak Udung (Purwokerto)",
  },
  {
    id: "o2222222-2222-2222-2222-222222222222",
    buyer_id: "u4444444-4444-4444-4444-444444444444",
    status: "diterima" as const,
    delivery_schedule: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    warehouse_id: "w1111111-1111-1111-1111-111111111111",
    subtotal: 2550000,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    itemSummary: "30 kg Cumi-Cumi Segar Seret Malam",
    supplierName: "Tangkapan Pak Udung",
  },
  {
    id: "o3333333-3333-3333-3333-333333333333",
    buyer_id: "u4444444-4444-4444-4444-444444444444",
    status: "menunggu_pembayaran" as const,
    delivery_schedule: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    warehouse_id: "w2222222-2222-2222-2222-222222222222",
    subtotal: 5750000,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    itemSummary: "50 kg Tuna Sirip Kuning Grade A",
    supplierName: "PT Laut Nusantara Jaya",
  },
];

/* ──────────────────────────────────────────────────────────────
   TRACKING EVENTS
   ────────────────────────────────────────────────────────────── */
export const SEED_TRACKING_EVENTS = [
  {
    id: "t1111111-1111-1111-1111-111111111111",
    order_id: "o1111111-1111-1111-1111-111111111111",
    event_label: "Tangkap & Pengepakan Es Awal",
    location_label: "Dermaga 3 Purwokerto, Jakarta Utara (Kapal KM Subur)",
    temperature_c: 1.2,
    occurred_at: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: "t2222222-2222-2222-2222-222222222222",
    order_id: "o1111111-1111-1111-1111-111111111111",
    event_label: "Tiba di Gudang Cold Storage Hub",
    location_label: "Cold Storage Hub Purwokerto, Jakarta Utara",
    temperature_c: -2.5,
    occurred_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "t3333333-3333-3333-3333-333333333333",
    order_id: "o1111111-1111-1111-1111-111111111111",
    event_label: "Dalam Pengiriman Armada Mobil Pendingin",
    location_label: "Tol Dalam Kota KM 12 Menuju Senopati",
    temperature_c: -1.8,
    occurred_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

/* ──────────────────────────────────────────────────────────────
   BUYER / SUPPLIER PROFILES (for mock user context)
   ────────────────────────────────────────────────────────────── */
export const SEED_BUYER_PROFILE = {
  id: "u4444444-4444-4444-4444-444444444444",
  role: "buyer" as const,
  full_name: "Bambang Hartono",
  business_name: "Restoran Seafood Bahari",
  business_type: "Restoran Seafood",
  address: "Jl. Senopati No. 45, Jakarta Selatan",
  subscription_tier: "premium" as const,
};

export const SEED_SUPPLIER_PROFILE = {
  id: "u1111111-1111-1111-1111-111111111111",
  role: "supplier" as const,
  full_name: "Pak Udung",
  business_name: "Tangkapan Pak Udung",
  supplier_type: "nelayan_perorangan" as const,
  address: "Dermaga 3 Purwokerto, Jakarta Utara",
};
