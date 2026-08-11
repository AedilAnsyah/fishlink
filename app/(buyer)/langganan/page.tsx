"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
  Crown,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LanggananPage() {
  const [currentTier, setCurrentTier] = useState<"gratis" | "premium">("premium");
  const [upgraded, setUpgraded] = useState(false);

  const handleUpgrade = () => {
    setUpgraded(true);
    setCurrentTier("premium");
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      <div className="bg-white border-b border-ink-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ocean-900 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>

      <section className="py-10 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-200 text-ocean-900 text-xs font-bold">
              <Crown className="w-4 h-4 text-ocean-900" />
              <span>Paket Keanggotaan Pembeli B2B</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900">
              Pilih Paket Layanan Fishlink
            </h1>
            <p className="text-sm text-ink-700">
              Dapatkan pasokan hasil laut segar prioritas dan fitur analitik cold-chain lengkap untuk restoran & hotel Anda.
            </p>
          </div>

          {upgraded && (
            <div className="p-4 bg-success-100 border border-success-600/30 text-success-600 rounded-2xl text-center font-bold text-xs">
              🎉 Selamat! Akun Anda telah berhasil diaktifkan ke Paket Keanggotaan Premium B2B.
            </div>
          )}

          {/* Pricing Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Free Tier Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ink-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-ink-900 text-xl">Paket B2B Gratis</h3>
                  <p className="text-xs text-ink-700 mt-1">
                    Cocok untuk warung makan atau usaha kuliner skala pemula.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-ink-900">Rp 0</span>
                  <span className="text-xs text-ink-700 font-normal">/ bulan</span>
                </div>

                <ul className="space-y-3 text-xs text-ink-900 pt-2 border-t border-ink-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                    <span>Akses Seluruh Katalog Ikan Tangkapan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                    <span>Matching Lokasi PostGIS Radius Standard (50 km)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                    <span>Scan QR Code Traceability Produk</span>
                  </li>
                  <li className="flex items-center gap-2 text-ink-400">
                    <XCircle className="w-4 h-4 text-ink-400 shrink-0" />
                    <span>Prioritas Alokasi Ikan Musiman Puncak</span>
                  </li>
                  <li className="flex items-center gap-2 text-ink-400">
                    <XCircle className="w-4 h-4 text-ink-400 shrink-0" />
                    <span>Akses Langsung Kontak Nelayan Mitra</span>
                  </li>
                </ul>
              </div>

              <Button variant="secondary" className="w-full bg-ink-100 text-ink-900 font-bold text-xs h-11" disabled>
                Paket Dasar Aktif
              </Button>
            </div>

            {/* Premium Tier Card */}
            <div className="bg-gradient-to-b from-sky-50 via-white to-white p-6 sm:p-8 rounded-2xl border-2 border-ocean-900 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
              
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-ocean-900 px-3 py-1 rounded-full shadow-xs">
                  <Sparkles className="w-3 h-3 text-sky-400" /> Direkomendasikan
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-ocean-900 text-xl flex items-center gap-2">
                    <Crown className="w-5 h-5 text-ocean-900" /> Paket Premium B2B
                  </h3>
                  <p className="text-xs text-ink-700 mt-1">
                    Untuk Restoran, Hotel Bintang, dan Industri Pengolahan.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-ocean-900 tabular-nums">Rp 299.000</span>
                  <span className="text-xs text-ink-700 font-normal">/ bulan</span>
                </div>

                <ul className="space-y-3 text-xs text-ink-900 pt-2 border-t border-ink-100">
                  <li className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                    <span>Prioritas Alokasi Tangkapan Subuh (Stok Terbatas)</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                    <span>Bebas Kuota Radius Matching Lokasi (Tanpa Batas 250+ km)</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                    <span>Histori Suhu Cold-Chain & Laporan HACCP Terintegrasi</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                    <span>Akses Direct WhatsApp Ke Mitra Nelayan Tradisional</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                    <span>Manajer Akun Khusus (Dedicated Account Representative)</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleUpgrade}
                disabled={currentTier === "premium"}
                className="w-full bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-sm h-12 shadow-sm gap-2"
              >
                <Zap className="w-4 h-4 text-sky-400" />
                {currentTier === "premium" ? "Paket Premium Aktif" : "Tingkatkan Ke Premium (Simulasi)"}
              </Button>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
