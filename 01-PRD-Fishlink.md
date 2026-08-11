# Product Requirements Document (PRD) — Fishlink

Versi: 1.0 · Untuk kebutuhan pembangunan prototype/MVP (vibe coding)
Sumber: Brief Pembangunan Prototype — Fishlink (klien) + penambahan fitur oleh tim produk

---

## 1. Latar Belakang & Tujuan Produk

Fishlink adalah platform yang menghubungkan **nelayan besar, nelayan perorangan, dan pembudidaya ikan** langsung dengan **pembeli** (restoran, hotel, industri pengolahan), memotong rantai distribusi yang panjang dan tidak transparan.

**Tujuan pembangunan prototype/MVP ini:**
1. Memvalidasi *core flow* pembelian hasil laut secara digital — dari eksplorasi katalog hingga pelacakan pesanan.
2. Menguji kejelasan *value proposition* Fishlink (kualitas terjamin, transparansi harga, ketertelusuran/*traceability*) lewat produk yang benar-benar bisa dicoba, bukan sekadar mockup statis.
3. **Perluasan dari brief awal:** brief asli hanya meminta sisi supplier sebagai satu halaman informasi. Untuk MVP ini kita naikkan levelnya menjadi **dashboard mitra fungsional yang sangat sederhana**, karena ini adalah nilai jual utama Fishlink (memberdayakan nelayan) dan investor/pembeli akan ingin melihat kedua sisi marketplace bekerja.

## 2. Prinsip Produk (wajib dipegang saat membangun)

1. **Nelayan dulu, baru estetika.** Mayoritas mitra supplier (terutama nelayan perorangan) punya keterbatasan literasi digital dan koneksi internet lambat. Setiap layar di sisi supplier harus bisa dipakai orang yang baru pertama kali pegang aplikasi serupa e-commerce.
2. **Kepercayaan lewat transparansi, bukan lewat janji.** Harga, asal ikan, dan status pesanan harus selalu terlihat jelas, bukan disembunyikan di balik banyak klik.
3. **Bukan template generik.** Desain harus terasa spesifik untuk industri perikanan Indonesia — bukan "SaaS dashboard" generik dengan ilustrasi flat 3D pasaran atau gradient ungu-biru khas AI. Lihat `02-Design-System.md`.
4. **Mobile-first di kedua sisi.** Buyer B2B tetap sering kerja dari HP saat di dapur/gudang; nelayan hampir pasti hanya pakai HP.
5. **Boleh "curang" untuk prototype** — data dummy, mock payment, simulasi cold-chain — asal *flow*-nya terasa nyata dan state-nya konsisten (tersimpan di database Supabase, bukan cuma UI statis).

## 3. Target Pengguna

### 3.1 Sisi Pembeli (Buyer) — Persona Utama

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| Manajer Pembelian Restoran/Hotel | Menjaga pasokan ikan segar kualitas ekspor untuk dapur restoran seafood/Japanese/hotel berbintang | Konsistensi kualitas, kepastian jadwal kirim, harga transparan, re-order mudah |
| Purchasing Industri Pengolahan | Membeli bahan baku ikan mentah volume besar (bakso ikan, produk beku) | Volume stabil, harga kompetitif, sertifikasi mutu, kontrak/langganan |
| Pemilik Restoran Skala Menengah | Ingin bahan baku setara impor tapi dari sumber lokal dengan harga efisien | Kepercayaan pada kualitas & keaslian sumber, transaksi mudah |

### 3.2 Sisi Mitra Supplier — Persona Sekunder (dinaikkan levelnya di MVP ini)

| Persona | Deskripsi | Kebutuhan Utama | Implikasi Desain |
|---|---|---|---|
| Nelayan Besar (kapal >10 GT) | Pasokan skala menengah-besar, volume & jadwal stabil | Visibilitas permintaan pasar, histori transaksi, harga wajar | Bisa menerima tampilan tabel/angka lebih detail |
| Nelayan Perorangan | Tangkapan musiman, volume kecil & fluktuatif, cocok untuk custom order | Cara upload stok super simpel, kejelasan kapan dibayar | UI ikon-besar, minim teks, alur super pendek (≤3 langkah) |
| Pembudidaya Ikan (GAP-certified) | Ketersediaan lebih terjadwal | Menunjukkan sertifikasi untuk harga lebih baik | Perlu tempat upload sertifikat dengan mudah |

## 4. Kategori Produk
Sesuai *Key Partners* pada BMC — setiap produk punya `source_type`:
- **Nelayan Besar**
- **Nelayan Perorangan**
- **Pembudidaya Ikan**

## 5. Ruang Lingkup MVP

### 5.1 Termasuk
- Seluruh alur sisi pembeli (registrasi → katalog → detail produk → custom order → keranjang → checkout mock → dashboard → traceability).
- **Dashboard mitra supplier fungsional-sederhana**: registrasi, upload stok (foto + info dasar), lihat pesanan masuk, update status kirim, riwayat pembayaran (mock).
- Fitur pencocokan lokasi (lihat §7.1) yang menghubungkan buyer dengan supplier terdekat demi menjaga kesegaran ikan.
- Data dummy realistis (produk, supplier, pesanan, tracking) tersimpan di Supabase — bukan hardcoded di frontend.
- Mock payment gateway (tanpa integrasi asli).
- Autentikasi nyata via Supabase Auth (email/password + opsi nomor HP untuk supplier).

### 5.2 Tidak Termasuk (di luar scope MVP awal)
- Dashboard mitra supplier tingkat lanjut (manajemen kontrak multi-buyer, analitik penjualan mendalam).
- Integrasi API logistik cold-chain pihak ketiga (3PL) sungguhan.
- Payment gateway sungguhan (Midtrans/Xendit — cukup disiapkan strukturnya untuk swap nanti).
- AI demand forecasting versi lengkap (cukup versi simulasi/statis untuk MVP, lihat §7.4).
- Aplikasi mobile native (cukup web responsif / PWA).

## 6. Fitur Inti (Wajib)

| Fitur | Deskripsi | Sisi |
|---|---|---|
| Katalog & Filter Produk | Filter jenis ikan, musim, sertifikasi, asal (kategori supplier), rentang harga, **jarak/lokasi** | Buyer |
| Detail Produk | Info supplier, sertifikasi, stok, estimasi kirim, harga, skor kesegaran, tombol pesan | Buyer |
| Request Custom Order | Form permintaan spesifik, simulasi "mencari mitra yang sesuai" (memakai logic matching lokasi+ketersediaan) | Buyer |
| Keranjang & Checkout | Ringkasan pesanan, jadwal kirim, mock payment | Buyer |
| Traceability / Lacak Pesanan | Simulasi scan QR → asal ikan → nelayan/kapal → gudang → rute cold-chain + suhu | Buyer |
| Dashboard Pembeli | Riwayat pesanan, status real-time, status langganan, notifikasi | Buyer |
| Registrasi & Profil Mitra | Data diri, jenis mitra, lokasi (titik peta), unggah sertifikasi (opsional) | Supplier |
| Upload Stok Sederhana | Form super ringkas: foto ikan, jenis, estimasi berat/jumlah, harga, tanggal tangkap | Supplier |
| Pesanan Masuk (Mitra) | Daftar pesanan yang perlu direspons/diproses, update status ("disiapkan", "dikirim ke gudang") | Supplier |
| Matching Lokasi Buyer–Supplier | Menyarankan mitra terdekat dari buyer/gudang untuk menjaga rantai dingin & kesegaran (§7.1) | Keduanya |

## 7. Fitur Tambahan Bernilai Tinggi (usulan, di luar brief asli)

### 7.1 Matching Buyer–Supplier Berbasis Lokasi & Kesegaran ⭐ (fitur unggulan yang diminta ditambahkan)
- Setiap supplier & gudang penampung punya titik koordinat (lat/long, PostGIS).
- Saat buyer melakukan custom order atau melihat katalog, sistem menghitung **jarak & estimasi waktu tempuh** dari titik tangkap/budidaya → gudang cold-chain terdekat → buyer, lalu menampilkan **"Skor Kesegaran"** (mis. berdasarkan jam sejak tangkap + jarak tempuh, bukan sekadar tanggal).
- Filter katalog "Terdekat & Tersegar" jadi opsi urutan default, bukan cuma "termurah".
- Untuk custom order: sistem memprioritaskan mitra dalam radius tertentu sebelum memperluas radius pencarian — mensimulasikan cara kerja *supply chain* nyata.
- Nilai bisnis: mengurangi waktu & jarak distribusi = ikan lebih segar = sesuai misi cold-chain & traceability Fishlink.

### 7.2 Mode "Sinyal Rendah" untuk Supplier (Nelayan)
- Toggle otomatis: bila koneksi lambat terdeteksi (atau supplier memilih manual), UI upload stok berubah jadi versi ultra-ringan — foto dikompres otomatis, form dipersingkat jadi 4 field wajib saja.
- Semua label pakai Bahasa Indonesia sederhana + ikon besar, hindari istilah teknis ("SKU", "inventory") — pakai "Stok Ikan Saya", "Pesanan Masuk".

### 7.3 Notifikasi via WhatsApp (simulasi tautan `wa.me`)
- Karena nelayan lebih terbiasa WhatsApp daripada notifikasi in-app, tombol "Kirim update ke WhatsApp saya" pada status pesanan/pembayaran men-generate pesan siap kirim melalui `wa.me` link (gratis, tanpa API berbayar). Ini realistis untuk MVP tanpa biaya WhatsApp Business API.

### 7.4 Simulasi Prediksi Permintaan (Demand Forecasting Ringan)
- Grafik sederhana (data historis dummy) yang menunjukkan tren permintaan jenis ikan per musim ke buyer maupun ke supplier ("Bulan depan permintaan tuna diprediksi naik 20%") — dibangun dari agregasi pesanan dummy, bukan model ML sungguhan untuk MVP.

### 7.5 Rating & Trust Badge Dua Arah
- Buyer memberi rating ke supplier (kualitas, ketepatan waktu) setelah pesanan selesai.
- Supplier dengan rating tinggi & sertifikasi lengkap mendapat badge "Mitra Terpercaya" — meningkatkan *trust building* sesuai misi Fishlink.

### 7.6 Kalkulator Estimasi Pendapatan untuk Calon Mitra
- Di halaman "Untuk Mitra Supplier", widget sederhana: masukkan jenis ikan & estimasi volume tangkap/bulan → sistem menampilkan estimasi pendapatan potensial berdasarkan harga pasar rata-rata di platform. Alat akuisisi mitra yang konkret, bukan cuma teks ajakan.

## 8. User Stories Inti

**Buyer**
- Sebagai manajer pembelian restoran, saya ingin memfilter katalog berdasarkan sertifikasi & jarak, supaya saya yakin ikan yang saya beli segar dan terverifikasi.
- Sebagai purchasing industri, saya ingin mengajukan custom order volume besar dan melihat mitra mana yang sanggup memenuhi, supaya saya tidak perlu menghubungi banyak pihak manual.
- Sebagai buyer, saya ingin memindai/klik "Lacak Pesanan" dan melihat perjalanan ikan dari laut ke dapur saya, supaya saya percaya pada klaim kesegaran.

**Supplier**
- Sebagai nelayan perorangan, saya ingin mengunggah hasil tangkapan hari ini hanya dengan foto + beberapa ketukan, supaya saya bisa langsung menjualnya tanpa ribet.
- Sebagai nelayan besar, saya ingin melihat pesanan masuk dan memperbarui statusnya, supaya buyer tahu kapan barang akan sampai.
- Sebagai pembudidaya, saya ingin mengunggah sertifikasi GAP saya, supaya produk saya bisa dihargai lebih baik dan mendapat badge kepercayaan.

## 9. Kebutuhan Non-Fungsional

- **Aksesibilitas & kemudahan pengguna baru**: kontras warna sesuai WCAG AA, ukuran target sentuh minimal 44×44px, alur inti maksimal 3–5 langkah, bahasa sederhana (hindari jargon Inggris berlebihan di sisi supplier).
- **Performa**: harus tetap terasa cepat di koneksi 3G/4G lemah (target Lighthouse Performance >80 di mobile, gambar dikompresi/next/image, lazy-load).
- **Biaya**: seluruh stack harus bisa berjalan di tingkat gratis (lihat `03-Technical-Architecture.md`).
- **Keamanan data**: Row Level Security (RLS) di Supabase — supplier hanya bisa melihat/mengubah data miliknya, buyer hanya melihat pesanannya sendiri.
- **Skalabilitas struktural**: skema data & arsitektur harus mudah "naik kelas" ke integrasi pembayaran & logistik sungguhan tanpa perombakan total.

## 10. Metrik Keberhasilan Prototype
- Tingkat penyelesaian alur checkout tanpa bantuan (target internal usability test >80%).
- Tingkat penyelesaian alur upload stok oleh persona nelayan perorangan tanpa bantuan (>70%, karena ini alur paling kritis dari sisi keterjangkauan digital).
- Waktu yang dibutuhkan buyer untuk memahami *value proposition* traceability (<2 menit dari landing page).

## 11. Referensi Dokumen Lain
- `02-Design-System.md` — palet warna, tipografi, komponen, prinsip anti-AI-slop.
- `03-Technical-Architecture.md` — stack, struktur folder, strategi deployment gratis.
- `04-Database-Schema.sql` — skema Supabase lengkap dengan RLS.
- `05-User-Flows-Sitemap.md` — sitemap & alur pengguna detail (buyer + supplier).
- `06-Vibe-Coding-Master-Prompt.md` — prompt siap pakai untuk AI coding assistant.
