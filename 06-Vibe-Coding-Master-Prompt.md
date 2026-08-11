# Master Prompt — Vibe Coding Fishlink

Salin blok prompt di bawah ke AI coding assistant kamu (Claude Code, Cursor, v0, dsb). Unggah/lampirkan juga 4 dokumen lain (`01` s.d. `04`) di folder yang sama supaya AI bisa membacanya sebagai referensi — prompt ini merujuk ke dokumen tersebut.

Disarankan: jalankan per tahap (lihat §8 di `03-Technical-Architecture.md`) — jangan minta AI membangun semuanya dalam satu prompt raksasa, supaya hasilnya bisa direview dan konteksnya tidak melebihi batas.

---

## PROMPT — Tahap 0: Setup Project

```
Kamu membantu membangun MVP web bernama "Fishlink" — marketplace hasil laut B2B
yang menghubungkan nelayan/pembudidaya (supplier) dengan restoran/hotel/industri
(buyer), dengan fitur unggulan traceability cold-chain dan matching lokasi.

Baca dan patuhi dokumen berikut sebagai sumber kebenaran:
- 01-PRD-Fishlink.md          (fitur, persona, scope)
- 02-Design-System.md         (WAJIB diikuti persis: warna, tipografi, prinsip
                                anti-AI-slop, prinsip UX untuk nelayan)
- 03-Technical-Architecture.md (stack, struktur folder)
- 04-Database-Schema.sql       (skema Supabase — jangan diubah strukturnya
                                tanpa alasan kuat)
- 05-User-Flows-Sitemap.md     (alur & sitemap detail)

Tugas tahap ini:
1. Inisialisasi project Next.js 14 (App Router, TypeScript, Tailwind CSS).
2. Install & konfigurasi shadcn/ui, lucide-react, @supabase/supabase-js,
   @supabase/ssr, qrcode.react, recharts, maplibre-gl.
3. Terapkan token warna & font dari 02-Design-System.md ke tailwind.config
   dan globals.css (jangan pakai warna default Tailwind — pakai token custom
   ocean-900, sky-400, ink-*, dst).
4. Buat struktur folder persis seperti di 03-Technical-Architecture.md §2.
5. Setup Supabase client (browser + server) mengikuti pola @supabase/ssr
   terbaru untuk Next.js App Router.
6. Jangan buat halaman UI dulu di tahap ini — fokus fondasi saja.

Ingat prinsip penting dari design system: HINDARI tampilan generik ala
"AI-generated SaaS template" — tidak ada gradient ungu-biru dekoratif,
tidak ada ilustrasi 3D flat generik, tidak ada copy placeholder template.
Semua harus terasa spesifik untuk industri perikanan Indonesia.
```

## PROMPT — Tahap 1: Database & Auth

```
Jalankan skema dari 04-Database-Schema.sql sebagai migration Supabase
(supabase/migrations/0001_init.sql). Buat juga supabase/seed.sql berisi data
dummy realistis: minimal 3 supplier (satu dari tiap supplier_type), 8-10
produk ikan dengan foto placeholder yang relevan (gunakan URL gambar dari
Unsplash source untuk hasil laut/kapal nelayan — jangan pakai ilustrasi
kartun), 2 buyer, beberapa order dengan status berbeda-beda, dan tracking_events
untuk minimal satu order supaya traceability bisa langsung didemokan.

Lalu bangun:
1. Halaman /login, /daftar-buyer, /daftar-supplier sesuai flow di
   05-User-Flows-Sitemap.md — termasuk field lokasi (pakai geolocation
   browser + fallback input manual) untuk buyer & supplier.
2. Middleware role-based routing: buyer hanya bisa akses /beranda, /katalog,
   dst; supplier hanya bisa akses /supplier/*.
3. Generate types dari Supabase (types/database.types.ts).

Ikuti prinsip form dari 02-Design-System.md §5 (satu aksi utama per layar,
bahasa sederhana, target sentuh besar) — terutama untuk /daftar-supplier
karena target penggunanya termasuk nelayan dengan literasi digital rendah.
```

## PROMPT — Tahap 2: Landing Page & Halaman Marketing

```
Bangun halaman berikut sesuai 05-User-Flows-Sitemap.md §1 dan gaya di
02-Design-System.md:
- / (landing): hero dengan value proposition jelas & jujur (bukan copy
  template), bagian "cara kerja 3 langkah" bergambar sederhana, testimoni
  restoran (dummy tapi spesifik/believable), CTA daftar buyer & CTA
  "Untuk Mitra Supplier" yang sama-sama menonjol (dua sisi marketplace).
- /tentang: cerita nelayan mitra, program anti-overfishing, sertifikasi GAP.
- /mitra-supplier: penjelasan program kemitraan + widget kalkulator estimasi
  pendapatan (interaktif, real-time menghitung saat user mengubah input
  jenis ikan & volume/bulan berdasarkan rata-rata price_per_kg di database).
- /kontak: form kontak + tampilan simulasi live chat (UI saja untuk MVP).

Pastikan mobile-first, dan hindari elemen dekoratif tanpa makna (baca ulang
prinsip anti-AI-slop di 02-Design-System.md §3 sebelum mulai).
```

## PROMPT — Tahap 3: Katalog, Detail Produk, Custom Order (Buyer)

```
Bangun sisi katalog buyer sesuai 01-PRD-Fishlink.md §6 dan
05-User-Flows-Sitemap.md §2 poin 4-6:

1. /katalog: grid kartu produk sesuai spesifikasi kartu di
   02-Design-System.md §4 (badge kategori sumber, skor kesegaran, jarak).
   Filter: jenis ikan, musim, sertifikasi, asal, rentang harga. Sorting
   default "Terdekat & Tersegar" menggunakan fungsi SQL nearby_products()
   di 04-Database-Schema.sql (perlu lokasi buyer dari profil/geolocation).
2. /katalog/[id]: detail lengkap + hitung & tampilkan Skor Kesegaran (buat
   lib/matching/freshness.ts yang mengombinasikan jam-sejak-tangkap +
   jarak, sesuai penjelasan di 03-Technical-Architecture.md §4.1).
3. /custom-order: form request (jenis ikan, ukuran, jumlah, target harga)
   yang saat disubmit membuat baris di custom_order_requests dan
   menampilkan animasi/status "Mencari mitra yang sesuai..." lalu
   menampilkan hasil supplier yang cocok (diprioritaskan dari radius
   terdekat, sesuai 05-User-Flows-Sitemap.md §5).

Semua data harus benar-benar diambil dari Supabase, bukan data hardcode di
komponen.
```

## PROMPT — Tahap 4: Keranjang, Checkout, Mock Payment

```
Bangun /keranjang dan /checkout sesuai alur di 05-User-Flows-Sitemap.md §2
poin 7-8. Checkout meliputi: ringkasan pesanan per supplier (karena satu
order bisa berisi produk dari beberapa supplier — order_items sudah
menyimpan supplier_id per item), pemilihan jadwal pengiriman, dan mock
payment (tombol "Bayar Sekarang" yang mengubah payments.status jadi 'paid'
serta orders.status jadi 'dibayar', lalu insert tracking_event pertama
"Pesanan Dikonfirmasi").

Setelah checkout sukses, tampilkan opsi "Kirim update ke WhatsApp saya"
yang membuka wa.me link berisi ringkasan pesanan (lihat
03-Technical-Architecture.md - notifikasi WA).
```

## PROMPT — Tahap 5: Dashboard Buyer & Traceability

```
Bangun /dashboard, /pesanan/[id], /lacak/[id], /notifikasi, /langganan
sesuai 01-PRD-Fishlink.md dan 02-Design-System.md §4 (Traceability
Timeline component). Traceability harus:
1. Generate QR code (qrcode.react) berisi order id di halaman /pesanan/[id].
2. /lacak/[id] menampilkan vertical stepper timeline dari tracking_events
   (Tangkap → Gudang → Distribusi → Diterima) dengan suhu simulasi di tiap
   titik, sesuai gaya visual di design system (bukan progress bar generik).
3. Gunakan Supabase Realtime supaya status di /dashboard & /pesanan/[id]
   ter-update otomatis tanpa refresh saat supplier mengubah status.

Setelah status 'diterima', tampilkan form rating singkat (1-5 bintang +
komentar opsional) yang menulis ke tabel reviews.
```

## PROMPT — Tahap 6: Dashboard Supplier (buyer-facing marketplace, sisi mitra)

```
Ini bagian PALING PENTING untuk diperhatikan dari sisi kemudahan pengguna
— baca ulang 02-Design-System.md §5 dan 05-User-Flows-Sitemap.md §3 sebelum
mulai, karena target penggunanya termasuk nelayan perorangan dengan
literasi digital rendah.

Bangun:
1. /supplier/beranda: ringkasan besar & sederhana (pesanan baru, jumlah
   stok aktif, pendapatan bulan ini) dengan tombol dominan
   "📷 Tambah Stok Baru".
2. /supplier/stok-saya/tambah: form upload stok mode ringan, MAKSIMAL 4
   field wajib (foto, jenis ikan via dropdown bergambar, estimasi berat +
   harga, tanggal tangkap default hari ini). Pastikan kompresi foto otomatis
   sebelum upload ke Supabase Storage (bucket product-photos).
3. /supplier/pesanan-masuk & /supplier/pesanan-masuk/[id]: daftar pesanan
   masuk dengan aksi update status yang cukup satu tombol tekan per tahap
   ("Siap Dikirim" → "Dikirim ke Gudang") — setiap update juga insert baris
   baru ke tracking_events (supaya buyer bisa lihat progress real-time).
4. /supplier/profil: data diri, penanda lokasi di peta (MapLibre + geolocation
   browser sebagai default), upload sertifikasi (opsional, untuk badge
   "Mitra Terpercaya" bila diverifikasi is_trusted_badge).
5. /supplier/perkiraan-pendapatan: kalkulator + grafik tren permintaan
   sederhana (Recharts, dari agregasi order_items historis dummy).

Gunakan body-lg (18px) dan line-height lega untuk semua teks di halaman
supplier sesuai 02-Design-System.md §2. Bahasa harus manusiawi, hindari
istilah teknis e-commerce (lihat daftar contoh di 02-Design-System.md §5
poin 2).
```

## PROMPT — Tahap 7: Polish, Aksesibilitas, Deploy

```
Lakukan review akhir:
1. Cek kontras warna semua teks terhadap latarnya (WCAG AA minimum),
   perbaiki bila ada teks sky-400 kecil di atas off-white.
2. Pastikan semua target sentuh (tombol, link) minimal 44x44px.
3. Uji flow lengkap di viewport mobile (375px) untuk kedua sisi (buyer &
   supplier) — pastikan tidak ada elemen terpotong/overflow.
4. Jalankan Lighthouse (mobile) — target Performance >80, Accessibility >90.
5. Pastikan tidak ada data yang di-hardcode di komponen — semua dari Supabase.
6. Siapkan file .env.example sesuai 03-Technical-Architecture.md §6.
7. Tuliskan README.md singkat berisi langkah setup Supabase (aktifkan
   PostGIS, jalankan migration + seed) dan langkah deploy ke Vercel
   (environment variables, build command default Next.js sudah cukup).
```

---

## Catatan Pemakaian
- Jalankan tahap demi tahap; setelah tiap tahap, cek hasilnya sebelum lanjut ke tahap berikutnya — ini mencegah AI "berimprovisasi" jauh dari brief karena kehilangan konteks.
- Jika AI coding assistant mulai menghasilkan komponen yang terasa generik (gradient dekoratif, ilustrasi 3D flat, copy template), tempel ulang potongan `02-Design-System.md §3` sebagai pengingat di prompt lanjutan.
- Semua dokumen (`01`–`06`) sebaiknya disimpan di root repo (mis. folder `/docs`) supaya tetap jadi rujukan sepanjang pengembangan, bukan hanya dipakai sekali di awal.
