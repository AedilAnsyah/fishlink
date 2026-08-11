-- ============================================================
-- Fishlink — Seed Data Realistic Dummy
-- ============================================================

-- 1. Insert Dummy Auth Users (Matching Supabase Auth structure if needed or dummy profiles)
-- Note: In real Supabase, profiles table references auth.users(id).
-- For dummy seeding without Supabase Auth instance active, we insert into profiles directly if constraint allows.

-- Insert Profiles
insert into profiles (id, role, full_name, phone, avatar_url, created_at) values
  ('u1111111-1111-1111-1111-111111111111', 'supplier', 'Pak Udung (Nelayan Purwokerto)', '081234567890', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150', now()),
  ('u2222222-2222-2222-2222-222222222222', 'supplier', 'PT Laut Nusantara Jaya', '081198765432', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', now()),
  ('u3333333-3333-3333-3333-333333333333', 'supplier', 'H. Sutarman (Koperasi Tambak Segar)', '081311223344', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', now()),
  ('u4444444-4444-4444-4444-444444444444', 'buyer', 'Bambang Hartono (Restoran Seafood Bahari)', '081855556666', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', now()),
  ('u5555555-5555-5555-5555-555555555555', 'buyer', 'Siska Putri (Hotel Grand Ocean)', '081977778888', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', now())
on conflict (id) do nothing;

-- 2. Buyer Profiles
insert into buyer_profiles (profile_id, business_name, business_type, address, location, subscription_tier) values
  ('u4444444-4444-4444-4444-444444444444', 'Restoran Seafood Bahari', 'Restoran Seafood', 'Jl. Senopati No. 45, Jakarta Selatan', ST_SetSRID(ST_MakePoint(106.8086, -6.2302), 4326)::geography, 'premium'),
  ('u5555555-5555-5555-5555-555555555555', 'Hotel Grand Ocean', 'Hotel Bintang 5', 'Jl. MH Thamrin No. 1, Jakarta Pusat', ST_SetSRID(ST_MakePoint(106.8231, -6.1950), 4326)::geography, 'gratis')
on conflict (profile_id) do nothing;

-- 3. Suppliers (3 types: nelayan_perorangan, nelayan_besar, pembudidaya)
insert into suppliers (id, profile_id, supplier_type, business_name, bio, location, address_label, is_trusted_badge, average_rating) values
  (
    's1111111-1111-1111-1111-111111111111',
    'u1111111-1111-1111-1111-111111111111',
    'nelayan_perorangan',
    'Tangkapan Pak Udung',
    'Nelayan tradisional Purwokerto berpengalaman lebih dari 15 tahun. Spesialis tangkapan harian segar seperti Kakap, Cumi, dan Tenggiri.',
    ST_SetSRID(ST_MakePoint(106.7735, -6.1070), 4326)::geography,
    'Dermaga 3 Purwokerto, Jakarta Utara',
    true,
    4.9
  ),
  (
    's2222222-2222-2222-2222-222222222222',
    'u2222222-2222-2222-2222-222222222222',
    'nelayan_besar',
    'PT Laut Nusantara Jaya',
    'Perusahaan armada kapal penangkap tangkal samudra skala besar dengan fasilitas cold-storage modern standar ekspor.',
    ST_SetSRID(ST_MakePoint(106.5500, -6.9833), 4326)::geography,
    'Pelabuhan Perikanan Samudera Pelabuhan Ratu, Sukabumi',
    true,
    4.8
  ),
  (
    's3333333-3333-3333-3333-333333333333',
    'u3333333-3333-3333-3333-333333333333',
    'pembudidaya',
    'Koperasi Tambak Segar Mandiri',
    'Budidaya udang vaname dan ikan bandeng kualitas tinggi dengan metode ramah lingkungan dan bebas antibiotik.',
    ST_SetSRID(ST_MakePoint(107.2942, -6.3054), 4326)::geography,
    'Kecamatan Cilamaya, Karawang',
    true,
    4.7
  )
on conflict (id) do nothing;

-- 4. Supplier Certifications
insert into supplier_certifications (id, supplier_id, cert_type, file_url, verified) values
  ('c1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'anti_overfishing', 'https://example.com/cert1.pdf', true),
  ('c2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', 'gap', 'https://example.com/cert2.pdf', true),
  ('c3333333-3333-3333-3333-333333333333', 's3333333-3333-3333-3333-333333333333', 'gap', 'https://example.com/cert3.pdf', true);

-- 5. Cold-chain Warehouses
insert into warehouses (id, name, location, address_label) values
  ('w1111111-1111-1111-1111-111111111111', 'Cold Storage Hub Purwokerto', ST_SetSRID(ST_MakePoint(106.8041, -6.1042), 4326)::geography, 'Purwokerto, Jakarta Utara'),
  ('w2222222-2222-2222-2222-222222222222', 'Cold Hub Pelabuhan Ratu', ST_SetSRID(ST_MakePoint(106.5500, -6.9833), 4326)::geography, 'Pelabuhan Ratu, Sukabumi')
on conflict (id) do nothing;

-- 6. Products (9 Realistic Seafood Items with Unsplash Fresh Seafood Photos)
insert into products (id, supplier_id, fish_name, description, price_per_kg, stock_kg, catch_or_harvest_date, season_tag, photo_url, is_active) values
  (
    'p1111111-1111-1111-1111-111111111111',
    's2222222-2222-2222-2222-222222222222',
    'Tuna Sirip Kuning (Yellowfin) Grade A',
    'Dipotong dan dibekukan langsung di atas kapal cold-chain (-35°C). Sangat cocok untuk sasyimi restoran Jepang & steak tuna hotel.',
    115000,
    350.00,
    CURRENT_DATE,
    'Musim Puncak Tuna',
    'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&q=80',
    true
  ),
  (
    'p2222222-2222-2222-2222-222222222222',
    's1111111-1111-1111-1111-111111111111',
    'Kakap Merah Segar Tangkapan Subuh',
    'Hasil pancing nelayan tradisional Purwokerto. Daging tebal, mata bening, insang merah segar. Ukuran 1.5kg - 3kg per ekor.',
    85000,
    120.00,
    CURRENT_DATE,
    'Segar Harian',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80',
    true
  ),
  (
    'p3333333-3333-3333-3333-333333333333',
    's3333333-3333-3333-3333-333333333333',
    'Udang Vaname Size 40-50 Premium',
    'Hasil panen tambak Cilamaya Karawang. Diberi es serut langsung saat dipanen. Bebas kimia & antibiotik.',
    95000,
    500.00,
    CURRENT_DATE,
    'Panen Raya Tambak',
    'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80',
    true
  ),
  (
    'p4444444-4444-4444-4444-444444444444',
    's1111111-1111-1111-1111-111111111111',
    'Cumi-Cumin Segar Seret Malam',
    'Tangkapan jaring cumi malam hari. Kulit masih mengkilap kehijauan, tidak berbau amis menyengat. Cocok untuk cumi goreng tepung/bakar.',
    78000,
    80.00,
    CURRENT_DATE,
    'Musim Cumi',
    'https://images.unsplash.com/photo-1545696563-af8f6ec2295a?w=600&q=80',
    true
  ),
  (
    'p5555555-5555-5555-5555-555555555555',
    's2222222-2222-2222-2222-222222222222',
    'Kerapu Bintang Live / Super Fresh',
    'Tangkapan laut lepas Pelabuhan Ratu. Tekstur lembut dan manis khas kerapu karang segar.',
    145000,
    90.00,
    CURRENT_DATE - INTERVAL '1 day',
    'Tangkapan Khusus',
    'https://images.unsplash.com/photo-1524704685729-37f90c609650?w=600&q=80',
    true
  ),
  (
    'p6666666-6666-6666-6666-666666666666',
    's1111111-1111-1111-1111-111111111111',
    'Ikan Tongkol Segar Sirip Hitam',
    'Ikan tongkol pancing harian. Tekstur padat, kaya Omega-3, favorit catering & restoran masakan Padang.',
    38000,
    250.00,
    CURRENT_DATE,
    'Hasil Laut Melimpah',
    'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600&q=80',
    true
  ),
  (
    'p7777777-7777-7777-7777-777777777777',
    's2222222-2222-2222-2222-222222222222',
    'Ikan Tenggiri Batang Super (Utuh)',
    'Ukuran 3 - 5 kg per ekor. Daging tebal dan putih berserat, pilihan utama pembuat pempek, otak-otak & chikuwa.',
    105000,
    180.00,
    CURRENT_DATE,
    'Tangkapan Unggulan',
    'https://images.unsplash.com/photo-1510130318145-ad4fbc46a4f7?w=600&q=80',
    true
  ),
  (
    'p8888888-8888-8888-8888-888888888888',
    's1111111-1111-1111-1111-111111111111',
    'Kepiting Bakau Jantan Segar',
    'Kepiting hidup dengan capit tebal terikat rapi. Kualitas padat berisi 85%+. Isi 3-4 ekor per kg.',
    130000,
    60.00,
    CURRENT_DATE,
    'Hasil Tangkapan Pesisir',
    'https://images.unsplash.com/photo-1559742811-822863c46f43?w=600&q=80',
    true
  ),
  (
    'p9999999-9999-9999-9999-999999999999',
    's3333333-3333-3333-3333-333333333333',
    'Bandeng Tambak Segar Cabut Duri',
    'Bandeng budidaya tidak berbau lumpur. Sudah dibersihkan sisik & ditiadakan duri dominan.',
    48000,
    300.00,
    CURRENT_DATE,
    'Hasil Tambak Karawang',
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&q=80',
    true
  )
on conflict (id) do nothing;

-- 7. Orders with diverse statuses
insert into orders (id, buyer_id, status, delivery_schedule, warehouse_id, subtotal, created_at, updated_at) values
  (
    'o1111111-1111-1111-1111-111111111111',
    'u4444444-4444-4444-4444-444444444444',
    'dalam_pengiriman',
    CURRENT_DATE,
    'w1111111-1111-1111-1111-111111111111',
    4250000.00,
    now() - INTERVAL '6 hours',
    now()
  ),
  (
    'o2222222-2222-2222-2222-222222222222',
    'u4444444-4444-4444-4444-444444444444',
    'diterima',
    CURRENT_DATE - INTERVAL '2 days',
    'w1111111-1111-1111-1111-111111111111',
    2550000.00,
    now() - INTERVAL '2 days',
    now() - INTERVAL '1 day'
  ),
  (
    'o3333333-3333-3333-3333-333333333333',
    'u5555555-5555-5555-5555-555555555555',
    'menunggu_pembayaran',
    CURRENT_DATE + INTERVAL '1 day',
    'w2222222-2222-2222-2222-222222222222',
    5750000.00,
    now() - INTERVAL '1 hour',
    now()
  )
on conflict (id) do nothing;

-- 8. Order Items
insert into order_items (id, order_id, product_id, supplier_id, quantity_kg, price_per_kg_at_order) values
  ('oi111111-1111-1111-1111-111111111111', 'o1111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 50.00, 85000.00),
  ('oi222222-2222-2222-2222-222222222222', 'o2222222-2222-2222-2222-222222222222', 'p4444444-4444-4444-4444-444444444444', 's1111111-1111-1111-1111-111111111111', 30.00, 78000.00),
  ('oi333333-3333-3333-3333-333333333333', 'o3333333-3333-3333-3333-333333333333', 'p1111111-1111-1111-1111-111111111111', 's2222222-2222-2222-2222-222222222222', 50.00, 115000.00)
on conflict (id) do nothing;

-- 9. Payments
insert into payments (id, order_id, amount, method, status, paid_at) values
  ('pay11111-1111-1111-1111-111111111111', 'o1111111-1111-1111-1111-111111111111', 4250000.00, 'mock_transfer', 'paid', now() - INTERVAL '5 hours'),
  ('pay22222-2222-2222-2222-222222222222', 'o2222222-2222-2222-2222-222222222222', 2550000.00, 'mock_transfer', 'paid', now() - INTERVAL '2 days'),
  ('pay33333-3333-3333-3333-333333333333', 'o3333333-3333-3333-3333-333333333333', 5750000.00, 'mock_transfer', 'pending', null)
on conflict (id) do nothing;

-- 10. Cold-chain Tracking Events (For order o1111111-... Traceability Demo)
insert into tracking_events (id, order_id, event_label, location_label, temperature_c, occurred_at) values
  (
    't1111111-1111-1111-1111-111111111111',
    'o1111111-1111-1111-1111-111111111111',
    'Tangkap & Pengepakan Es Awal',
    'Dermaga 3 Purwokerto, Jakarta Utara (Kapal KM Subur)',
    1.2,
    now() - INTERVAL '6 hours'
  ),
  (
    't2222222-2222-2222-2222-222222222222',
    'o1111111-1111-1111-1111-111111111111',
    'Tiba di Gudang Cold Storage Hub',
    'Cold Storage Hub Purwokerto, Jakarta Utara',
    -2.5,
    now() - INTERVAL '4 hours'
  ),
  (
    't3333333-3333-3333-3333-333333333333',
    'o1111111-1111-1111-1111-111111111111',
    'Dalam Pengiriman Armada Mobil Pendingin',
    'Tol Dalam Kota KM 12 Menuju Senopati',
    -1.8,
    now() - INTERVAL '1 hour'
  )
on conflict (id) do nothing;
