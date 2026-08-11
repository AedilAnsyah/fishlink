import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { RevenueCalculator } from "@/components/supplier/RevenueCalculator";
import { Button } from "@/components/ui/button";
import {
  Anchor,
  ShieldCheck,
  Smartphone,
  Wallet,
  Truck,
  CheckCircle2,
  ArrowRight,
  Fish,
  Ship,
  Waves,
} from "lucide-react";

export default function MitraSupplierPage() {
  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-sky-50 via-off-white to-off-white py-12 lg:py-16 border-b border-ink-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ocean-900 text-white text-xs font-bold shadow-sm">
            <Anchor className="w-4 h-4 text-sky-400" />
            <span>Program Kemitraan Nelayan & Petambak Indonesia</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight">
            Jual Tangkapan Anda Langsung ke Restoran Tanpa Tengkulak
          </h1>
          <p className="text-base text-ink-700 leading-relaxed max-w-2xl mx-auto">
            Fishlink membuka akses langsung bagi nelayan tradisional, armada kapal, dan pembudidaya tambak untuk mendapatkan pembeli pasti dari industri restoran & hotel di kota besar.
          </p>

          <div className="pt-3">
            <Link href="/daftar-supplier">
              <Button size="lg" className="bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-base shadow-sm gap-2">
                <Anchor className="w-5 h-5 text-sky-400" /> Daftar Jadi Mitra Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Benefits Grid */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
                Mengapa Nelayan & Petambak Memilih Fishlink?
              </h2>
              <p className="text-sm text-ink-700 mt-1">
                Fitur dan dukungan yang dirancang khusus untuk kenyamanan nelayan di dermaga.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Benefit 1 */}
              <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-ocean-900 flex items-center justify-center border border-sky-200">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-ink-900 text-lg">Harga Adil & Tanpa Makelar</h3>
                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                  Anda menentukan harga jual sendiri. Tidak ada permainan harga lelang pasar yang merugikan nelayan setelah lelah berlayar.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-ocean-900 flex items-center justify-center border border-sky-200">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-ink-900 text-lg">Aplikasi Sangat Ringkas</h3>
                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                  Cukup foto ikan dengan HP, isi estimasi berat, lalu pasang. Didesain agar mudah digunakan siapa saja tanpa kerumitan formulir.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-ocean-900 flex items-center justify-center border border-sky-200">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-ink-900 text-lg">Akses Cold-Storage Hub</h3>
                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                  Ikan Anda ditampung di gudang pendingin terdekat dengan es dan suhu terkontrol, sehingga kualitas tetap terjaga hingga diterima buyer.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Section */}
          <div className="max-w-4xl mx-auto">
            <RevenueCalculator />
          </div>

          {/* Partner Categories Info */}
          <div className="bg-white p-8 rounded-2xl border border-ink-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-ink-900 text-center">
              Kategori Mitra yang Dapat Bergabung
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-off-white border border-ink-200 space-y-2 text-center">
                <div className="w-10 h-10 rounded-full bg-ocean-900 text-white flex items-center justify-center mx-auto">
                  <Anchor className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-ink-900 text-base">Nelayan Perorangan</h4>
                <p className="text-xs text-ink-700">
                  Nelayan tradisional pancing ulur / jaring harian yang mendarat di dermaga lokal.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-off-white border border-ink-200 space-y-2 text-center">
                <div className="w-10 h-10 rounded-full bg-ocean-900 text-white flex items-center justify-center mx-auto">
                  <Ship className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-ink-900 text-base">Nelayan Besar / Kapal</h4>
                <p className="text-xs text-ink-700">
                  Pemilik atau pengelola armada kapal tangkap laut dalam skala sedang hingga besar.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-off-white border border-ink-200 space-y-2 text-center">
                <div className="w-10 h-10 rounded-full bg-ocean-900 text-white flex items-center justify-center mx-auto">
                  <Waves className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-ink-900 text-base">Pembudidaya Tambak</h4>
                <p className="text-xs text-ink-700">
                  Petambak udang vaname, bandeng, atau komoditas budidaya air asin/payau.
                </p>
              </div>
            </div>

            <div className="pt-4 text-center">
              <Link href="/daftar-supplier">
                <Button size="lg" className="bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-base gap-2">
                  Daftarkan Usaha Nelayan / Petambak Anda <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
