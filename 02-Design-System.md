# Design System — Fishlink

Tujuan dokumen ini: memastikan siapa pun (manusia atau AI coding assistant) yang membangun UI menghasilkan tampilan yang **konsisten, terasa dibuat khusus untuk industri perikanan Indonesia, dan mudah dipakai nelayan sebagai pengguna baru** — bukan template dashboard generik.

---

## 1. Palet Warna (diambil dari file referensi klien)

Warna sumber diekstrak langsung dari gambar palet yang diberikan:

| Nama Token | Hex | Peran |
|---|---|---|
| `ocean-900` (Navy Laut Dalam) | `#135A86` | Warna utama brand — header, tombol primer, teks penting, ikon aktif |
| `sky-400` (Biru Air) | `#38BDF8` | Warna aksen/sekunder — highlight, badge info, elemen interaktif ringan, grafik |
| `off-white` | `#F7FAFB` | Latar utama, ruang negatif — off-white (bukan putih murni) supaya tidak menyilaukan di mata, terutama untuk pengguna yang sering membaca layar di luar ruangan (dermaga/kapal) |

Karena palet sumber hanya 3 warna, dokumen ini menurunkan **skala warna pendukung** yang tetap harmonis (dibangun dari hue yang sama, bukan warna acak) supaya UI punya kedalaman tanpa keluar dari identitas brand:

```css
:root {
  /* Brand */
  --ocean-900: #135A86; /* primary */
  --ocean-700: #1B729F; /* primary hover/active */
  --ocean-500: #2E8FBE; /* primary state di atas latar gelap */
  --sky-400:   #38BDF8; /* accent */
  --sky-200:   #B7E6FB; /* accent latar lembut / badge */
  --sky-50:    #EAF8FE; /* latar section sangat lembut */

  /* Netral (dibuat sedikit kebiruan, bukan abu-abu generik, agar selaras tema laut) */
  --ink-900:  #0E2530; /* teks utama */
  --ink-700:  #375363; /* teks sekunder */
  --ink-400:  #7C93A0; /* teks tersier / placeholder */
  --ink-200:  #D6E2E7; /* border */
  --ink-100:  #EDF3F5; /* latar kartu alternatif */
  --off-white: #F7FAFB; /* latar utama — bukan putih murni, agar tidak menyilaukan */

  /* Semantik (turunan hue laut supaya tetap satu keluarga, bukan merah/hijau standar Bootstrap) */
  --success-600: #1F8A5F; /* status "Tiba"/"Segar" */
  --success-100: #DFF4EA;
  --warning-600: #C77B15; /* status "Menunggu"/"Musiman" */
  --warning-100: #FBEBD3;
  --danger-600:  #C0392B; /* status "Dibatalkan"/error */
  --danger-100:  #F8DDD9;

  /* Suhu cold-chain (khusus fitur traceability) */
  --cold-chain-cool: #38BDF8; /* suhu ideal */
  --cold-chain-warn: #C77B15; /* suhu mendekati batas */
}
```

**Kontras**: `ocean-900` di atas `off-white` = rasio ~7.06:1 (masih lolos AAA untuk teks). `ink-900` di atas `off-white` = ~15.1:1. `sky-400` **jangan** dipakai untuk teks kecil di atas `off-white` (kontras ~2:1, terlalu rendah) — hanya untuk elemen besar, ikon, badge dengan latar solid, atau grafik.

**Kenapa off-white, bukan putih murni (`#FFFFFF`)**: putih murni di layar HP terasa menyilaukan, terutama untuk pengguna yang membaca di luar ruangan (dermaga, kapal, siang hari) — kasus yang sangat relevan untuk persona nelayan. `#F7FAFB` tetap terasa "bersih" dan netral tapi jauh lebih nyaman di mata untuk pemakaian lama.

## 2. Tipografi

Gunakan font gratis dari Google Fonts (tidak perlu lisensi berbayar):

- **Heading / branding:** `Plus Jakarta Sans` (700/600) — terasa modern-lokal, dipakai banyak produk fintech/teknologi Indonesia, tidak generik seperti Poppins yang terlalu sering dipakai template AI.
- **Body / UI text:** `Inter` (400/500/600) — keterbacaan tinggi di layar kecil, netral.
- **Angka besar (harga, berat, suhu):** gunakan `tabular-nums` agar rapi di tabel/kartu.

Skala ukuran (mobile-first, rem):
```
display: 2.25rem / 700   -> hero landing
h1: 1.875rem / 700
h2: 1.5rem / 600
h3: 1.25rem / 600
body-lg: 1.125rem / 400  -> dipakai di layar supplier (nelayan) agar lebih mudah dibaca
body: 1rem / 400
caption: 0.875rem / 400
```

Aturan khusus **sisi supplier**: naikkan ukuran body dasar ke `body-lg` (18px) dan line-height 1.6 — asumsikan sebagian pengguna membaca di layar kecil dengan pencahayaan luar ruangan (dermaga, kapal).

## 3. Prinsip "Anti-AI-Slop"

Hindari ciri-ciri visual yang membuat produk terasa dibuat asal-jadi oleh AI generator:

**Jangan:**
- Gradient ungu-ke-biru generik atau blob/shape abstrak tanpa makna sebagai hiasan latar.
- Ilustrasi flat 3D "characters" generik (orang tersenyum dengan proporsi aneh) yang tidak relevan dengan konteks perikanan.
- Ikon glossy/neumorphism berlebihan.
- Card shadow super tebal & rounded-corner ekstrem di semua elemen tanpa hierarki.
- Copywriting placeholder yang terasa template ("Solusi Terbaik untuk Kebutuhan Anda").

**Lakukan:**
- Fotografi/ilustrasi yang **spesifik ke konteks**: siluet kapal nelayan, tekstur jaring, pola sisik ikan sebagai aksen tipis (bukan dominan), peta rute pengiriman nyata di traceability.
- Ilustrasi garis (line art) sederhana bertema laut untuk empty state, dengan satu warna aksen (`sky-400`) di atas `ink-900` — konsisten, bukan campuran gaya.
- Micro-interaction yang bermakna: progress bar rute cold-chain yang benar-benar bergerak sesuai status, bukan animasi hias.
- Copy yang spesifik dan jujur: "Tangkapan 4 jam lalu dari Muara Angke" lebih baik daripada "Ikan Segar Berkualitas Tinggi".
- Warna dipakai fungsional: `sky-400` = interaktif/informasi, `ocean-900` = aksi utama, warna semantik hanya untuk status.

## 4. Komponen Utama

### Tombol
- **Primer**: latar `ocean-900`, teks putih, radius 10px, padding 12–16px. Hover → `ocean-700`.
- **Sekunder/Outline**: border `ocean-900` 1.5px, teks `ocean-900`, latar transparan.
- **Aksen (jarang dipakai)**: latar `sky-400`, teks `ink-900` (bukan putih, demi kontras) — dipakai untuk CTA sekunder seperti "Lihat di Peta".
- Ukuran minimum tinggi tombol: 44px (target sentuh, penting untuk pengguna nelayan di layar kecil/sarung tangan basah).

### Kartu Produk (Katalog)
- Foto produk rasio 4:3, badge kategori sumber (Nelayan Besar/Perorangan/Pembudidaya) di pojok kiri atas dengan warna netral `ink-100`+teks `ink-900` (bukan warna mencolok, supaya badge kesegaran yang jadi sorotan).
- Badge "Skor Kesegaran" pakai warna semantik (hijau=segar, kuning=standar) — **selalu** ditampilkan di kartu, ini pembeda utama Fishlink.
- Info jarak ("±12 km dari lokasi Anda") ditampilkan dengan ikon pin kecil, warna `ink-700`.

### Status Badge (Pesanan/Cold-chain)
- Pill shape, radius penuh, latar warna semantik `-100`, teks warna semantik `-600`.
- Selalu sertakan ikon (bukan warna saja) untuk aksesibilitas — mis. centang untuk "Tiba", termometer untuk info suhu.

### Form (khusus alur Supplier — Upload Stok)
- Satu pertanyaan per layar pada mode "sinyal rendah" (lihat PRD §7.2), atau grouping maksimal 2 field per section pada mode normal.
- Input besar (min height 48px), label selalu terlihat (bukan hanya placeholder yang hilang saat mengetik).
- Tombol kamera sebagai aksi utama paling atas: "📷 Ambil Foto Ikan" — foto dulu, detail belakangan, karena ini alur paling natural untuk nelayan.

### Traceability Timeline
- Vertical stepper dengan titik-titik terhubung garis: Tangkap → Gudang/Cold-chain → Distribusi → Diterima. Titik yang sudah lewat = `ocean-900` solid; titik aktif = `sky-400` dengan denyut halus (pulse animation, gunakan berhati-hati, jangan berlebihan); titik belum tercapai = outline `ink-200`.

## 5. Prinsip UI/UX — Kemudahan untuk Pengguna Baru (termasuk Nelayan)

1. **Satu aksi utama per layar.** Hindari banyak CTA bersaing di satu layar, terutama di sisi supplier.
2. **Bahasa manusia, bukan istilah sistem.** "Ikan yang Sudah Terjual" bukan "Completed Orders"; "Uang yang Akan Masuk" bukan "Pending Settlement".
3. **Umpan balik instan & jelas.** Setiap aksi (upload foto, kirim pesanan) harus memberi konfirmasi visual jelas dalam <1 detik (loading state), dan pesan sukses/gagal dalam bahasa sederhana, bukan kode error teknis.
4. **Progressive disclosure.** Detail teknis (nomor kapal, ID sertifikasi) disembunyikan di balik "Lihat detail", tidak memenuhi layar utama.
5. **Konsistensi navigasi.** Bottom navigation bar (mobile) dengan maksimal 4–5 ikon + label teks (ikon saja berisiko membingungkan pengguna baru) — untuk buyer: Beranda, Katalog, Pesanan, Akun. Untuk supplier: Beranda, Stok Saya, Pesanan Masuk, Akun.
6. **Toleransi kesalahan.** Konfirmasi sebelum aksi tidak bisa dibatalkan (mis. kirim pesanan ke buyer), dan selalu ada opsi "Kembali"/"Batal" yang jelas.
7. **Onboarding kontekstual, bukan tutorial panjang.** Tooltip singkat muncul saat pertama kali membuka fitur baru (mis. saat pertama kali melihat traceability), bukan walkthrough 6 slide di awal yang biasa di-skip.

## 6. Ikonografi & Imagery
- Gunakan set ikon konsisten satu keluarga, contoh: [Lucide Icons](https://lucide.dev) (open-source, gratis, cocok untuk stroke-based line icon yang selaras dengan gaya "bukan AI slop").
- Untuk foto produk dummy, gunakan foto stok laut/perikanan yang realistis (bukan ilustrasi kartun ikan), agar terasa kredibel sebagai marketplace B2B.

## 7. Grid & Spacing
- Spacing scale 4px base: 4, 8, 12, 16, 24, 32, 48, 64.
- Container max-width desktop: 1200px, dengan breakpoint utama di 768px (tablet) dan 1024px (desktop) — tetap prioritaskan layout mobile sebagai basis (`min-width` breakpoints, bukan `max-width`).
