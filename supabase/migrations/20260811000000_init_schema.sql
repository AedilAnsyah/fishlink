-- ============================================================
-- Fishlink — Skema Database Supabase (PostgreSQL + PostGIS)
-- Jalankan berurutan dari atas ke bawah sebagai migration.
-- ============================================================

-- 1. Ekstensi -------------------------------------------------
create extension if not exists postgis;
create extension if not exists pgcrypto;

-- 2. Enum types -------------------------------------------------
create type user_role as enum ('buyer', 'supplier', 'admin');
create type supplier_type as enum ('nelayan_besar', 'nelayan_perorangan', 'pembudidaya');
create type order_status as enum (
  'menunggu_pembayaran', 'dibayar', 'diproses_supplier', 'dikirim_ke_gudang',
  'dalam_pengiriman', 'diterima', 'dibatalkan'
);
create type custom_order_status as enum ('mencari_mitra', 'ditemukan', 'disepakati', 'gagal');
create type cert_type as enum ('gap', 'anti_overfishing', 'lainnya');

-- 3. Profiles (1:1 dengan auth.users) ---------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- 4. Buyer profile detail -----------------------------------------
create table buyer_profiles (
  profile_id uuid primary key references profiles(id) on delete cascade,
  business_name text not null,
  business_type text not null,           -- restoran / hotel / industri pengolahan
  address text,
  location geography(Point, 4326),        -- untuk hitung jarak ke supplier/gudang
  subscription_tier text default 'gratis' -- 'gratis' | 'premium'
);

-- 5. Suppliers -------------------------------------------------
create table suppliers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  supplier_type supplier_type not null,
  business_name text not null,
  bio text,
  location geography(Point, 4326) not null,
  address_label text,                     -- ex: "Muara Angke, Jakarta Utara"
  is_trusted_badge boolean not null default false,
  average_rating numeric(2,1) default 0,
  created_at timestamptz not null default now()
);

create index idx_suppliers_location on suppliers using gist (location);

-- 6. Sertifikasi supplier -----------------------------------------
create table supplier_certifications (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references suppliers(id) on delete cascade,
  cert_type cert_type not null,
  file_url text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- 7. Gudang cold-chain --------------------------------------------
create table warehouses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location geography(Point, 4326) not null,
  address_label text
);

-- 8. Produk ------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references suppliers(id) on delete cascade,
  fish_name text not null,
  description text,
  price_per_kg numeric(12,2) not null,
  stock_kg numeric(10,2) not null default 0,
  catch_or_harvest_date date not null,
  season_tag text,                        -- ex: "musim tuna"
  photo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_products_supplier on products(supplier_id);
create index idx_products_active on products(is_active);

-- 9. Custom order requests -----------------------------------------
create table custom_order_requests (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references buyer_profiles(profile_id) on delete cascade,
  fish_name text not null,
  size_spec text,
  quantity_kg numeric(10,2) not null,
  target_price numeric(12,2),
  status custom_order_status not null default 'mencari_mitra',
  matched_supplier_id uuid references suppliers(id),
  created_at timestamptz not null default now()
);

-- 10. Orders -------------------------------------------------------
create table orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references buyer_profiles(profile_id) on delete cascade,
  status order_status not null default 'menunggu_pembayaran',
  delivery_schedule date,
  warehouse_id uuid references warehouses(id),
  subtotal numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  supplier_id uuid not null references suppliers(id),
  quantity_kg numeric(10,2) not null,
  price_per_kg_at_order numeric(12,2) not null
);

create index idx_order_items_order on order_items(order_id);

-- 11. Mock payments --------------------------------------------------
create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  amount numeric(12,2) not null,
  method text default 'mock_transfer',
  status text not null default 'pending', -- pending | paid | failed
  paid_at timestamptz
);

-- 12. Traceability / cold-chain tracking -------------------------------
create table tracking_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  event_label text not null,     -- "Tangkap", "Tiba di Gudang", "Dalam Pengiriman", "Diterima"
  location_label text,
  temperature_c numeric(4,1),
  occurred_at timestamptz not null default now()
);

create index idx_tracking_order on tracking_events(order_id);

-- 13. Notifications --------------------------------------------------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 14. Reviews (buyer -> supplier) --------------------------------------
create table reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id),
  buyer_id uuid not null references buyer_profiles(profile_id),
  supplier_id uuid not null references suppliers(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table buyer_profiles enable row level security;
alter table suppliers enable row level security;
alter table supplier_certifications enable row level security;
alter table products enable row level security;
alter table custom_order_requests enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table tracking_events enable row level security;
alter table notifications enable row level security;
alter table reviews enable row level security;

-- Profiles: pengguna hanya boleh baca/ubah profil sendiri
create policy "profiles_self" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Buyer profiles: pemilik saja
create policy "buyer_profiles_self" on buyer_profiles
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- Suppliers: publik boleh baca (katalog), hanya pemilik boleh ubah
create policy "suppliers_public_read" on suppliers
  for select using (true);
create policy "suppliers_owner_write" on suppliers
  for insert with check (auth.uid() = profile_id);
create policy "suppliers_owner_update" on suppliers
  for update using (auth.uid() = profile_id);

-- Products: publik boleh baca produk aktif, hanya supplier pemilik boleh CRUD
create policy "products_public_read" on products
  for select using (is_active = true);
create policy "products_owner_all" on products
  for all using (
    supplier_id in (select id from suppliers where profile_id = auth.uid())
  ) with check (
    supplier_id in (select id from suppliers where profile_id = auth.uid())
  );

-- Custom order requests: buyer pemilik + supplier yang di-matched boleh lihat
create policy "custom_order_buyer" on custom_order_requests
  for all using (auth.uid() = buyer_id) with check (auth.uid() = buyer_id);

-- Orders: buyer pemilik pesanan
create policy "orders_buyer_own" on orders
  for all using (auth.uid() = buyer_id) with check (auth.uid() = buyer_id);

-- Order items: terlihat oleh buyer pemilik order ATAU supplier terkait
create policy "order_items_visibility" on order_items
  for select using (
    order_id in (select id from orders where buyer_id = auth.uid())
    or supplier_id in (select id from suppliers where profile_id = auth.uid())
  );
create policy "order_items_supplier_update" on order_items
  for update using (
    supplier_id in (select id from suppliers where profile_id = auth.uid())
  );

-- Payments: buyer pemilik order
create policy "payments_buyer_own" on payments
  for select using (
    order_id in (select id from orders where buyer_id = auth.uid())
  );

-- Tracking events: buyer pemilik order + supplier terkait boleh lihat; supplier boleh insert untuk order miliknya
create policy "tracking_read" on tracking_events
  for select using (
    order_id in (select id from orders where buyer_id = auth.uid())
    or order_id in (
      select order_id from order_items
      where supplier_id in (select id from suppliers where profile_id = auth.uid())
    )
  );
create policy "tracking_insert_supplier" on tracking_events
  for insert with check (
    order_id in (
      select order_id from order_items
      where supplier_id in (select id from suppliers where profile_id = auth.uid())
    )
  );

-- Notifications: pemilik saja
create policy "notifications_self" on notifications
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- Reviews: publik boleh baca, hanya buyer pemilik order boleh membuat
create policy "reviews_public_read" on reviews
  for select using (true);
create policy "reviews_buyer_write" on reviews
  for insert with check (auth.uid() = buyer_id);

-- ============================================================
-- TRIGGER: Otomatis buat profile & buyer/supplier row saat auth.users register
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'buyer'::public.user_role),
    coalesce(new.raw_user_meta_data->>'full_name', 'Pengguna Baru'),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;

  if (new.raw_user_meta_data->>'role' = 'supplier') then
    insert into public.suppliers (profile_id, supplier_type, business_name, location)
    values (
      new.id,
      'nelayan_perorangan',
      coalesce(new.raw_user_meta_data->>'business_name', 'Usaha Hasil Laut'),
      ST_MakePoint(109.2344, -7.4243)::geography
    )
    on conflict do nothing;
  else
    insert into public.buyer_profiles (profile_id, business_name, business_type)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'business_name', 'Usaha Pembeli'),
      'Restoran Seafood'
    )
    on conflict do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

