# Sitemap & User Flow — Fishlink

## 1. Sitemap Lengkap

```
Fishlink
├── / (Landing)                      — hero value prop, cara kerja 3 langkah, testimoni, CTA daftar
├── /tentang                         — sejarah, misi, cerita nelayan mitra, anti-overfishing
├── /mitra-supplier                  — ajakan gabung + kalkulator estimasi pendapatan + form minat
├── /kontak                          — customer service (live chat simulasi)
├── /login
├── /daftar-buyer
├── /daftar-supplier
│
├── BUYER (butuh login, role=buyer)
│   ├── /beranda                     — rekomendasi musiman + katalog ringkas
│   ├── /katalog                     — filter: jenis ikan, musim, sertifikasi, asal, harga, jarak/kesegaran
│   │   └── /katalog/[id]            — detail produk: supplier, sertifikasi, stok, skor kesegaran, tombol pesan
│   ├── /custom-order                — form request khusus + status "mencari mitra"
│   ├── /keranjang
│   ├── /checkout                    — jadwal kirim + mock payment
│   ├── /dashboard                   — riwayat pesanan, status real-time, langganan, notifikasi ringkas
│   ├── /pesanan/[id]                — detail satu pesanan
│   ├── /lacak/[id]                  — traceability: scan QR (simulasi) → timeline asal ikan
│   ├── /notifikasi                  — riwayat notifikasi
│   └── /langganan                   — detail benefit paket premium
│
└── SUPPLIER (butuh login, role=supplier)
    ├── /supplier/beranda            — ringkasan: pesanan baru, stok aktif, pendapatan bulan ini
    ├── /supplier/stok-saya          — daftar stok yang diunggah
    │   └── /supplier/stok-saya/tambah — form upload stok (mode ringan/normal)
    ├── /supplier/pesanan-masuk
    │   └── /supplier/pesanan-masuk/[id] — update status kirim
    ├── /supplier/profil             — data diri, lokasi di peta, sertifikasi
    └── /supplier/perkiraan-pendapatan — grafik simulasi + kalkulator
```

## 2. Alur Utama Pembeli Baru (Restoran/Hotel)

1. **Landing Page** → lihat value proposition & cara kerja (3 langkah) → klik "Daftar/Masuk".
2. **Registrasi** → isi data restoran/hotel (nama, jenis usaha, **lokasi/alamat** — dipakai untuk fitur matching kesegaran).
3. **Beranda (setelah login)** → rekomendasi produk musiman + produk terdekat dari lokasi buyer.
4. **Katalog** → filter jenis ikan/musim/sertifikasi/asal, urutkan "Terdekat & Tersegar" (default) atau "Termurah".
5. **Detail Produk** → info supplier, sertifikasi, harga, **skor kesegaran & jarak** → pilih "Pesan Sekarang" **atau** "Request Custom Order".
6. **(Jika custom order)** → isi form spesifikasi ikan → sistem menampilkan status "mencari mitra yang sesuai" (diprioritaskan berdasarkan radius terdekat, lalu diperluas otomatis bila tidak ada yang cocok).
7. **Keranjang** → review pesanan, atur jadwal pengiriman.
8. **Checkout** → mock pembayaran → konfirmasi pesanan → notifikasi opsional dikirim via WhatsApp (`wa.me` link).
9. **Dashboard Pembeli** → pantau status pesanan real-time.
10. **Lacak Pesanan (Traceability)** → scan QR (simulasi) → lihat asal ikan, kapal/nelayan, rute cold-chain & suhu selama perjalanan.
11. **Setelah pesanan diterima** → beri rating ke supplier → opsi re-order otomatis / notifikasi stok berikutnya.

## 3. Alur Mitra Supplier — Nelayan Perorangan (paling kritis dari sisi kemudahan)

1. **Landing Page** → klik "Untuk Mitra Supplier" → baca info program kemitraan + coba kalkulator estimasi pendapatan.
2. **Daftar Supplier** → isi nama, jenis mitra (pilih "Nelayan Perorangan"), **tandai lokasi di peta** (bisa pakai GPS otomatis, satu ketukan — hindari input koordinat manual).
3. **Beranda Supplier** → tampilan sangat ringkas: tombol besar "📷 Tambah Stok Baru" jadi elemen paling dominan di layar.
4. **Tambah Stok** (mode ringan, ≤4 langkah):
   - Ambil/unggah foto ikan.
   - Pilih jenis ikan (dropdown bergambar, bukan teks panjang).
   - Isi estimasi berat & harga per kg.
   - Konfirmasi tanggal tangkap (default: hari ini).
   - Tekan "Pasang ke Katalog" → konfirmasi sukses dengan bahasa sederhana ("Ikanmu sudah bisa dilihat pembeli!").
5. **Pesanan Masuk** → notifikasi muncul saat ada buyer memesan → nelayan cukup menekan "Siap Dikirim" untuk update status (tanpa perlu mengisi form panjang).
6. **Update Status Kirim** → pilihan sederhana bertahap: "Disiapkan" → "Dikirim ke Gudang" → selesai (status berikutnya otomatis dilanjutkan pihak gudang/dummy).
7. **Riwayat & Pendapatan** → tampilan sederhana total pendapatan bulan ini, tanpa istilah akuntansi rumit.

## 4. Alur Mitra Supplier — Nelayan Besar / Pembudidaya (mode lebih detail)

1. Registrasi serupa, namun form profil bisa menampilkan field tambahan (kapasitas kapal, sertifikasi GAP) karena persona ini lebih terbiasa dengan input detail.
2. Dashboard menampilkan tabel pesanan & grafik permintaan musiman (fitur 7.4 di PRD) karena skala volume mereka lebih besar dan datanya lebih berguna untuk perencanaan.
3. Bisa mengunggah beberapa produk sekaligus (bukan satu per satu seperti mode nelayan perorangan).

## 5. Alur Fitur Matching Lokasi (lintas sisi)

1. Buyer membuka katalog / mengajukan custom order dengan lokasi terdaftar.
2. Sistem menjalankan query `nearby_products()` (lihat `04-Database-Schema.sql`) dalam radius awal (mis. 50km).
3. Jika hasil kosong/tidak cukup, sistem otomatis memperluas radius (mis. ke 150km) dan memberi tahu buyer bahwa hasil diperluas demi ketersediaan.
4. Untuk custom order: request masuk ke supplier-supplier terdekat lebih dulu (melalui notifikasi/dashboard "Pesanan Masuk" mereka berupa "Permintaan Custom") sebelum diperluas ke radius lebih jauh bila tidak ada yang merespons dalam waktu simulasi tertentu.
5. Skor kesegaran ditampilkan konsisten di kartu katalog, detail produk, dan hasil custom order.

## 6. Alur Sekunder — Calon Mitra Supplier (belum daftar)

1. Landing Page → klik "Untuk Mitra Supplier".
2. Baca info program kemitraan, syarat bergabung, manfaat.
3. Coba kalkulator estimasi pendapatan (opsional, tanpa perlu login).
4. Isi form minat bergabung **atau** langsung lanjut ke `/daftar-supplier` bila sudah yakin.
