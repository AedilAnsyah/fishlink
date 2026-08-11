# 🐟 Fishlink — Marketplace Hasil Laut B2B & Cold-Chain Traceability

**Fishlink** adalah platform marketplace B2B hasil laut segar yang menghubungkan nelayan tradisional, armada kapal, dan pembudidaya tambak Indonesia secara langsung dengan restoran, hotel, dan industri kuliner. Platform ini dilengkapi pencatatan suhu cold-chain transparan, *matching* lokasi geografis berbasis **PostGIS**, serta visualisasi peta pesisir berbasis **MapLibre GL JS**.

---

## 🌟 Fitur Utama

- ⚓ **Dual-Sided Marketplace**:
  - **Sisi Pembeli (Buyer/Restoran/Hotel)**: Dashboard pesanan, katalog pencarian PostGIS terdekat & tersegar, keranjang belanja per-supplier, custom order request, dan pelacakan QR Code / Suhu Cold-Chain.
  - **Sisi Supplier (Nelayan/Petambak)**: Mode upload stok harian (foto, berat, tanggal tangkap), kelola status pesanan masuk, perkiraan pendapatan, serta penanda titik lokasi dermaga di peta interaktif.
- ❄️ **Cold-Chain Traceability**: Pencatatan riwayat suhu pendinginan (-2°C) dari dermaga tangkap, transit gudang cold storage hub, hingga pengiriman armada armada mobil pendingin.
- 📍 **Matching Lokasi Pesisir (PostGIS)**: Algoritma pencarian dan perangkingan produk berdasarkan jarak geografis real-time antara lokasi pembeli dan lokasi tangkapan nelayan.
- 🔑 **Akun Pengujian Demo (Instant Role Switching)**: Fitur satu klik untuk mencoba seluruh alur platform sebagai *Buyer* maupun *Supplier*.

---

## 🛠️ Teknologi & Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React Server & Client Components)
- **Bahasa**: TypeScript
- **Styling**: TailwindCSS & Vanilla Utility Systems
- **Database & Backend**: [Supabase](https://supabase.com/) (PostgreSQL + **PostGIS Extension**, Realtime Subscription, Storage, Auth)
- **Peta Interaktif**: MapLibre GL JS
- **Icons**: Lucide React

---

## 🚀 Langkah Setup Lokal

### 1. Prasyarat Sistem
- **Node.js**: v18.0.0 atau lebih baru
- **npm** / **yarn** / **pnpm**

### 2. Kloning Repository & Install Dependensi
```bash
git clone https://github.com/AedilAnsyah/fishlink.git
cd fishlink
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Isikan kredensial Supabase Anda di `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Setup Database Supabase & PostGIS
1. Buka dashboard proyek **Supabase** Anda.
2. Masuk ke **Database** -> **Extensions**, lalu aktifkan ekstensi **`postgis`**.
3. Buka **SQL Editor** di Supabase, lalu jalankan script berikut:
   - Jalankan script skema tabel di [`supabase/seed.sql`](file:///c:/Users/Acer/Downloads/agentrouter/agentrouter/Fishlink/supabase/seed.sql) atau file migrasi yang tersedia di folder `supabase/`.
4. Script akan membuat tabel `profiles`, `buyer_profiles`, `suppliers`, `products`, `orders`, `order_items`, `tracking_events`, `warehouses`, serta fungsi PostGIS `nearby_products`.

### 5. Jalankan Server Dev Lokal
```bash
npm run dev
```
Buka browser di **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Akun Demo Pengujian (Test Accounts)

Platform menyediakan tombol akun test langsung di halaman Login ([`/login`](http://localhost:3000/login)):

| Role | Email | Password | Profil & Usaha |
| :--- | :--- | :--- | :--- |
| **Buyer (Pembeli)** | `buyer@fishlink.id` | `buyer123` | Bambang Hartono — Restoran Seafood Bahari (Senopati) |
| **Supplier (Nelayan)** | `supplier@fishlink.id` | `supplier123` | Pak Udung — Depo Seafood Purwokerto, Jawa Tengah |

---

## 📦 Langkah Deploy ke Vercel

1. **Push Repository ke GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete Fishlink B2B seafood marketplace platform"
   git remote add origin https://github.com/AedilAnsyah/fishlink.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy di Vercel Dashboard**:
   - Buka [Vercel](https://vercel.com/) dan pilih **Import Project**.
   - Hubungkan repository `AedilAnsyah/fishlink`.
   - Konfigurasi **Environment Variables**:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_SITE_URL` (Domain Vercel Anda)
   - Klik **Deploy**. (Build command default `npm run build` Next.js sudah dikonfigurasi).

---

## 📄 Lisensi

Platform dikembangkan untuk marketplace hasil laut B2B Indonesia.
