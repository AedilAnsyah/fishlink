import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Anchor,
  Fish,
  HeartHandshake,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-sky-50 to-off-white py-12 lg:py-16 border-b border-ink-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-200 text-ocean-900 text-xs font-bold">
            <HeartHandshake className="w-4 h-4" />
            <span>Misi Keadilan Nelayan & Kelestarian Laut</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900">
            Menghubungkan Kekayaan Laut Indonesia dengan Keadilan Ekonomi
          </h1>
          <p className="text-base text-ink-700 leading-relaxed max-w-2xl mx-auto">
            Fishlink lahir dari fakta bahwa nelayan skala kecil sering mendapat bagian terkecil dari rantai pasok hasil laut, sementara restoran kesulitan mendapat jaminan kesegaran dan sertifikasi yang pasti.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section 1: Cerita Nelayan Mitra */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-ocean-900 font-bold text-sm">
                <Anchor className="w-5 h-5 text-sky-400" />
                <span>Cerita Mitra Kami</span>
              </div>
              <h2 className="text-2xl font-bold text-ink-900">
                Pemberdayaan Nelayan Tradisional di Pesisir Nusantara
              </h2>
              <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                Sebagian besar pasokan laut Indonesia ditangkap oleh nelayan perorangan dengan perahu kecil. Namun, tanpa akses pasar langsung, mereka terpaksa menjual tangkapan ke perantara dengan potongan harga yang tinggi.
              </p>
              <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                Di Fishlink, nelayan menentukan harga jual adil mereka sendiri. Dengan teknologi upload stok berbasis smartphone yang dirancang khusus untuk literasi digital sederhana, nelayan cukup memfoto hasil tangkapan di dermaga untuk langsung dihubungkan dengan buyer restoran di kota besar.
              </p>
            </div>
            <div className="md:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-ink-200 h-64 sm:h-80">
                <img
                  src="/hero-fisherman.png"
                  alt="Nelayan mitra Fishlink"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink-900/90 to-transparent p-4 text-white text-xs">
                  <p className="font-bold">Pak Udung — Nelayan Pancing Purwokerto</p>
                  <p className="text-[11px] text-sky-200">Mitra sejak 2025 • Spesialis Kakap & Cumi Segar</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-ink-200" />

          {/* Section 2: Program Anti-Overfishing */}
          <div className="bg-white p-8 rounded-2xl border border-ink-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-danger-100 text-danger-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink-900">
                  Komitmen Anti-Overfishing & Perlindungan Ekosistem
                </h2>
                <p className="text-xs text-ink-700">Menjaga keberlanjutan stok ikan untuk generasi mendatang</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
              Pengeksploitasian laut berlebihan (overfishing) dan penggunaan alat tangkap destruktif seperti pukat harimau (trawl) atau bom ikan merusak terumbu karang dan mengancam kehidupan pesisir.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                <h4 className="font-bold text-ocean-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success-600" /> Larangan Alat Destruktif
                </h4>
                <p className="text-ink-700">Semua mitra terverifikasi hanya menggunakan pancing ulur, jaring ramah lingkungan, atau tambak terukur.</p>
              </div>
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                <h4 className="font-bold text-ocean-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success-600" /> Ukuran Layak Tangkap
                </h4>
                <p className="text-ink-700">Menolak penjualan anakan ikan di bawah umur reproduksi untuk menjaga siklus pembiakan alami.</p>
              </div>
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                <h4 className="font-bold text-ocean-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success-600" /> Pencatatan Wilayah Tangkap
                </h4>
                <p className="text-ink-700">Pencatatan koordinat titik tangkap untuk mencegah pencurian ikan di zona perairan terlarang.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Sertifikasi GAP & Standar Cold-Chain */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 order-2 md:order-1">
              <div className="bg-sky-50 p-6 rounded-2xl border border-sky-200 space-y-4">
                <div className="flex items-center gap-2 text-ocean-900 font-bold">
                  <Award className="w-6 h-6 text-sky-400" />
                  <span>Sertifikasi Standar Usaha</span>
                </div>
                <ul className="space-y-3 text-xs text-ink-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-ink-900">Good Aquaculture Practice (GAP / CBIB)</strong>
                      Petambak mitra bersertifikat Cara Budidaya Ikan yang Baik bebas residu antibiotik terlarang.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-ink-900">Sertifikat Kelayakan Pengolahan (SKP)</strong>
                      Gudang penampungan cold-storage hub memenuhi kebersihan dan sanitasi standar Kementerian Kelautan dan Perikanan.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-ink-900">Cold-Chain Temperature Log</strong>
                      Histori suhu es & pendingin tercatat permanen pada QR Code traceability pesanan.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-6 order-1 md:order-2 space-y-4">
              <h2 className="text-2xl font-bold text-ink-900">
                Standar Kualitas & Sertifikasi Transparan
              </h2>
              <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                Bagi pembeli seperti hotel bintang 5 atau restoran terkemuka, kepastian sertifikasi dan jaminan sanitasi adalah mutlak. Fishlink memastikan setiap produk di katalog melampirkan status sertifikasi aktif dari supplier.
              </p>
              <div className="pt-2">
                <Link href="/daftar-buyer">
                  <Button className="bg-ocean-900 hover:bg-ocean-700 text-white font-bold gap-2">
                    Mulai Pesan Ikan Bersertifikat <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
