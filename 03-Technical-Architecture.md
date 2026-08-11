# Arsitektur Teknis — Fishlink

Prinsip: **100% bisa dijalankan di tingkat gratis (free tier)** untuk kebutuhan prototype/MVP, deploy ke Vercel, database di Supabase.

---

## 1. Ringkasan Stack

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework Frontend + Backend | **Next.js 14 (App Router)** | Server Components + Server Actions memudahkan integrasi Supabase tanpa perlu backend terpisah; deploy native di Vercel gratis |
| Styling | **Tailwind CSS** + **shadcn/ui** | Gratis, cepat dikustom sesuai `02-Design-System.md`, tidak terasa generik seperti UI kit berbayar dengan tema bawaan |
| Bahasa | TypeScript | Type-safety untuk skema data yang cukup kompleks (order, tracking, matching) |
| Database & Auth & Storage | **Supabase** (Postgres + Auth + Storage + Realtime) | Free tier cukup untuk prototype: 500MB DB, 1GB storage, 50k monthly active users, Realtime included |
| Geolocation/Matching | **PostgreSQL + ekstensi PostGIS** (aktif di Supabase, gratis) | Untuk hitung jarak buyer↔supplier↔gudang secara akurat (`ST_Distance`) |
| Hosting/Deploy | **Vercel (Hobby plan, gratis)** | Terintegrasi git push → auto deploy, cocok untuk Next.js |
| Notifikasi | **`wa.me` deep link** (bukan WhatsApp Business API berbayar) + email via **Resend free tier** (3.000 email/bulan gratis) | Nol biaya untuk simulasi notifikasi realistis |
| QR Code (Traceability) | **`qrcode.react`** (client-side, gratis) | Generate QR pesanan tanpa layanan eksternal |
| Grafik (demand forecasting) | **Recharts** | Ringan, gratis, cocok untuk grafik tren sederhana |
| Icon | **lucide-react** | Gratis, konsisten dengan gaya line-icon di design system |
| Peta (matching lokasi) | **MapLibre GL JS** + tile gratis dari **OpenStreetMap/MapTiler free tier** | Alternatif gratis dari Google Maps yang berbayar setelah kuota |

> Catatan biaya: seluruh stack di atas berjalan penuh di tingkat gratis untuk skala prototype/demo. Titik yang perlu diawasi saat scale-up nyata: kuota Supabase storage (foto produk) dan kuota MapTiler.

## 2. Struktur Folder (Next.js App Router)

```
fishlink/
├── app/
│   ├── (marketing)/              # Landing, Tentang, Untuk Mitra Supplier, Kontak
│   │   ├── page.tsx
│   │   ├── tentang/
│   │   ├── mitra-supplier/
│   │   └── kontak/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── daftar-buyer/
│   │   └── daftar-supplier/
│   ├── (buyer)/
│   │   ├── beranda/
│   │   ├── katalog/
│   │   │   └── [productId]/
│   │   ├── custom-order/
│   │   ├── keranjang/
│   │   ├── checkout/
│   │   ├── dashboard/
│   │   ├── pesanan/[orderId]/
│   │   ├── lacak/[orderId]/      # traceability
│   │   ├── notifikasi/
│   │   └── langganan/
│   ├── (supplier)/
│   │   ├── beranda/
│   │   ├── stok-saya/
│   │   │   └── tambah/
│   │   ├── pesanan-masuk/[orderId]/
│   │   ├── profil/
│   │   └── perkiraan-pendapatan/
│   └── api/                      # route handlers bila perlu (webhook mock payment, dsb.)
├── components/
│   ├── ui/                       # shadcn primitives
│   ├── buyer/
│   ├── supplier/
│   └── shared/                   # StatusBadge, FreshnessScore, TraceabilityTimeline, dll
├── lib/
│   ├── supabase/                 # client.ts (browser), server.ts (server actions)
│   ├── matching/                 # logic skor kesegaran & pencocokan lokasi (PostGIS query wrapper)
│   └── utils.ts
├── types/
│   └── database.types.ts         # digenerate dari Supabase CLI (supabase gen types)
└── supabase/
    ├── migrations/                # lihat 04-Database-Schema.sql
    └── seed.sql                   # data dummy
```

## 3. Autentikasi & Peran Pengguna

- Gunakan **Supabase Auth** (email + password untuk MVP; nomor HP/OTP bisa ditambahkan belakangan untuk supplier yang lebih familiar SMS/WA dibanding email).
- Tabel `profiles` menyimpan `role`: `'buyer' | 'supplier' | 'admin'`, terhubung 1:1 ke `auth.users`.
- Middleware Next.js mengecek sesi + role untuk memproteksi route `(buyer)` dan `(supplier)` masing-masing.
- Row Level Security (RLS) di Supabase adalah **garis pertahanan utama** (bukan hanya middleware frontend) — lihat `04-Database-Schema.sql`.

## 4. Alur Data Kunci

### 4.1 Matching Lokasi & Skor Kesegaran
1. Setiap `suppliers` punya kolom `location geography(Point,4326)`.
2. Setiap `warehouses` (gudang cold-chain) juga punya titik lokasi.
3. Saat buyer membuka katalog atau mengajukan custom order, server action memanggil query PostGIS:
   ```sql
   select *, ST_Distance(supplier.location, buyer_location) as distance_m
   from products
   join suppliers on ...
   order by distance_m asc;
   ```
4. **Skor Kesegaran** dihitung di aplikasi (bukan trigger DB) dari kombinasi: `jam_sejak_tangkap` (dari `catch_date`) + `distance_m` → mapping ke label `Sangat Segar / Segar / Standar`. Rumus disederhanakan untuk MVP, didokumentasikan di `lib/matching/freshness.ts`.

### 4.2 Traceability
- Setiap `orders` punya rangkaian `tracking_events` (timestamp, lokasi, suhu simulasi, status). QR code yang di-generate berisi `orderId`; halaman `/lacak/[orderId]` publik-terbatas (hanya bisa diakses buyer pemilik pesanan, dicek via RLS) menampilkan timeline dari tabel ini.

### 4.3 Mock Payment
- Tabel `payments` dengan `status: pending -> paid` yang diubah lewat tombol simulasi "Bayar Sekarang" di checkout (tanpa gateway asli), tapi terstruktur seperti webhook asli supaya mudah diganti Midtrans/Xendit nanti.

## 5. Real-time
- Gunakan **Supabase Realtime** pada tabel `orders` dan `tracking_events` supaya dashboard buyer & supplier ter-update otomatis tanpa refresh saat status pesanan berubah (penting untuk demo yang terasa "hidup").

## 6. Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # hanya dipakai di server action/admin task
NEXT_PUBLIC_MAPTILER_KEY=        # free tier
RESEND_API_KEY=                  # free tier, untuk email notifikasi
```

## 7. Langkah Deployment

1. **Supabase**: buat project baru (free tier) → aktifkan ekstensi `postgis` → jalankan migrasi dari `04-Database-Schema.sql` → jalankan `seed.sql` untuk data dummy → catat URL & anon key.
2. **Repo**: push kode ke GitHub.
3. **Vercel**: import repo → set environment variables di atas → deploy otomatis (Hobby plan gratis, cukup untuk domain `*.vercel.app`; custom domain juga gratis jika sudah punya domain sendiri).
4. **Storage**: buat bucket Supabase Storage `product-photos` (public read, authenticated write) untuk foto produk dari supplier.
5. **Auth redirect URL**: daftarkan URL Vercel di setting Supabase Auth agar magic link/reset password berfungsi.

## 8. Urutan Pembangunan yang Disarankan (untuk sesi vibe coding)
1. Setup project Next.js + Tailwind + shadcn + koneksi Supabase.
2. Terapkan skema database & RLS (`04-Database-Schema.sql`) + seed data dummy.
3. Auth + role-based routing (buyer/supplier).
4. Landing page + halaman marketing statis (pakai Design System).
5. Katalog + detail produk + filter (termasuk filter lokasi/kesegaran).
6. Keranjang → checkout → mock payment.
7. Dashboard buyer + traceability + QR.
8. Dashboard supplier (upload stok, pesanan masuk).
9. Fitur matching lokasi (PostGIS) + skor kesegaran.
10. Fitur tambahan: notifikasi WA, rating, kalkulator pendapatan, grafik prediksi permintaan.
11. Polish aksesibilitas, responsive check, Lighthouse audit.
