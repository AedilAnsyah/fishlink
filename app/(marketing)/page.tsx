"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import {
  Anchor,
  Truck,
  QrCode,
  Snowflake,
  Star,
  CheckCircle2,
  Building2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-sky-50 via-off-white to-off-white pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-ink-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Content (7 columns on lg screens for ample text & button space) */}
            <div className="lg:col-span-7 space-y-6 text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-200/70 border border-sky-400/30 text-ocean-900 text-xs font-bold shadow-xs">
                <Snowflake className="w-4 h-4 text-ocean-900 animate-pulse" />
                <span>Pelopor Traceability Cold-Chain & Matching Lokasi Laut B2B</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-900 leading-tight tracking-tight">
                Pasokan Hasil Laut Segar Langsung dari Dermaga ke Dapur Restoran Anda.
              </h1>

              <p className="text-base sm:text-lg text-ink-700 leading-relaxed max-w-2xl">
                Fishlink menghubungkan nelayan tradisional dan pembudidaya tambak Indonesia secara langsung dengan restoran, hotel, dan industri kuliner — lengkap dengan pencatatan suhu cold-chain dan skor kesegaran transparan.
              </p>

              {/* Two Prominent CTAs representing BOTH sides of marketplace (flex-wrap & responsive sizing) */}
              <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3">
                <Link href="/daftar-buyer">
                  <Button size="lg" className="w-full sm:w-auto bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-sm sm:text-base shadow-sm gap-2 hover:scale-105 transition-transform h-12 px-5">
                    <Building2 className="w-5 h-5 shrink-0" />
                    <span>Daftar Pembeli (Restoran/Hotel)</span>
                  </Button>
                </Link>

                <Link href="/daftar-supplier">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-ocean-900 text-ocean-900 hover:bg-sky-50 font-bold text-sm sm:text-base gap-2 hover:scale-105 transition-transform h-12 px-5">
                    <Anchor className="w-5 h-5 text-ocean-900 shrink-0" />
                    <span>Daftar Mitra Nelayan</span>
                  </Button>
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-ink-200/60 text-xs text-ink-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                  <span>Tanpa Perantara Tengkulak</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                  <span>Suhu Cold-Chain Terukur (-2°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                  <span>Jarak & Jam Tangkap Real-Time</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image (5 columns on lg screens, perfectly framed) */}
            <div className="lg:col-span-5 relative z-0">
              <div className="relative rounded-3xl overflow-hidden border-2 border-ocean-900/30 shadow-xl group">
                <img
                  src="/hero-fisherman.png"
                  alt="Armada nelayan dan perahu cadik tradisional Indonesia"
                  className="w-full h-[360px] sm:h-[420px] lg:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3-Step How It Works Section */}
      <section className="py-16 bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
              Cara Kerja Fishlink dalam 3 Langkah Sederhana
            </h2>
            <p className="text-sm text-ink-700">
              Transparan untuk pembeli, sangat praktis untuk mitra nelayan di lapangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-off-white border border-ink-200 relative flex flex-col justify-between hover:border-ocean-900 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-ocean-900 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="font-bold text-ink-900 text-lg mb-2 group-hover:text-ocean-900 transition-colors">
                  Nelayan Upload Stok
                </h3>
                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                  Mitra nelayan cukup mengambil foto ikan dari dermaga, memasukkan estimasi berat & tanggal tangkap melalui mode ringan yang mudah.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-ink-200 text-xs text-ocean-900 font-semibold flex items-center gap-1.5">
                <Anchor className="w-4 h-4" /> Alur super simpel untuk nelayan
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-off-white border border-ink-200 relative flex flex-col justify-between hover:border-ocean-900 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-ocean-900 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="font-bold text-ink-900 text-lg mb-2 group-hover:text-ocean-900 transition-colors">
                  Matching Lokasi & Cold-Chain
                </h3>
                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                  Sistem PostGIS menghitung jarak terdekat ke pembeli. Ikan disimpan & didistribusikan melalui cold-storage hub terjaga pada suhu -2°C.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-ink-200 text-xs text-ocean-900 font-semibold flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-sky-400" /> Sensor suhu real-time
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-off-white border border-ink-200 relative flex flex-col justify-between hover:border-ocean-900 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-ocean-900 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="font-bold text-ink-900 text-lg mb-2 group-hover:text-ocean-900 transition-colors">
                  Diterima & Scan Traceability
                </h3>
                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                  Restoran menerima pesanan tepat waktu. Pembeli dapat memindai QR code pada kemasan untuk memverifikasi asal kapal & rute perjalanan.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-ink-200 text-xs text-ocean-900 font-semibold flex items-center gap-1.5">
                <QrCode className="w-4 h-4" /> QR Code Traceability Publik
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Believable Restaurant & Fisherman Testimonials */}
      <section className="py-16 bg-off-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
              Dipercaya Pengusaha Kuliner & Mitra Nelayan
            </h2>
            <p className="text-sm text-ink-700 mt-1">
              Pengalaman nyata dari kedua sisi ekosistem perikanan Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-sm flex flex-col justify-between hover:border-ocean-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex text-warning-600 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-ink-700 italic leading-relaxed">
                  &ldquo;Kami butuh Kakap Merah dan Cumi segar setiap jam 6 pagi untuk operasional resto di Senopati. Di Fishlink, skor kesegaran & jam tangkapnya jujur, tidak pernah dikasih ikan es lama.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ink-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
                  alt="Pak Hendra"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-ink-900 text-xs">Pak Hendra</h4>
                  <p className="text-[11px] text-ink-700">Owner Restoran Seafood Bahari, Senopati</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-sm flex flex-col justify-between hover:border-ocean-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex text-warning-600 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-ink-700 italic leading-relaxed">
                  &ldquo;Standar HACCP di hotel bintang 5 mewajibkan histori suhu bahan mentah. Fitur QR traceability Fishlink membuktikan suhu tetap di bawah -2°C dari kapal hingga dock penerimaan kami.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ink-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100"
                  alt="Chef Ronald"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-ink-900 text-xs">Chef Ronald</h4>
                  <p className="text-[11px] text-ink-700">Executive Chef Hotel Grand Ocean, Jakarta</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-sm flex flex-col justify-between hover:border-ocean-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex text-warning-600 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-ink-700 italic leading-relaxed">
                  &ldquo;Dulu kalau sandar di pelabuhan Purwokerto harga ikan sering ditekan lelang pasar. Lewat Fishlink, ikan pancingan saya langsung dibeli harga wajar oleh restoran.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-ink-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=100"
                  alt="Pak Udung"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-ink-900 text-xs">Pak Udung</h4>
                  <p className="text-[11px] text-ink-700">Nelayan Pancing Harian, Depo Purwokerto, Jawa Tengah</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 bg-ocean-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Siap Mentransformasi Pasokan Hasil Laut Usaha Anda?
          </h2>
          <p className="text-sm sm:text-base text-sky-200 max-w-2xl mx-auto leading-relaxed">
            Bergabunglah dengan ratusan restoran, hotel, dan nelayan mitra yang sudah bertransaksi secara lebih transparan dan efisien.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/daftar-buyer">
              <Button size="lg" className="w-full sm:w-auto bg-sky-400 hover:bg-sky-200 text-ink-900 font-bold text-base hover:scale-105 transition-transform">
                Daftar Sebagai Pembeli
              </Button>
            </Link>
            <Link href="/daftar-supplier">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-ocean-700 font-bold text-base hover:scale-105 transition-transform">
                Gabung Jadi Mitra Nelayan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
