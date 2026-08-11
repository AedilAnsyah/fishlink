"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SupplierNav } from "@/components/supplier/SupplierNav";
import { Footer } from "@/components/shared/Footer";
import {
  Anchor,
  Package,
  ShoppingBag,
  Wallet,
  Camera,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupplierBerandaPage() {
  const [activeStockKg] = useState(450);
  const [newOrdersCount] = useState(2);
  const [monthlyEarnings] = useState(12850000);
  const [userName, setUserName] = useState("Pak Udung");

  React.useEffect(() => {
    const cookies = document.cookie.split(";").reduce((acc, c) => {
      const [k, v] = c.trim().split("=");
      if (k && v) acc[k] = decodeURIComponent(v);
      return acc;
    }, {} as Record<string, string>);

    if (cookies.fishlink_mock_name) setUserName(cookies.fishlink_mock_name);
  }, []);

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans supplier-body-text">
      <SupplierNav />

      <section className="py-8 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Welcome Header */}
          <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-success-600 animate-ping" />
                <span className="text-xs font-bold text-success-600">Status Toko: Aktif & Buka</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
                Halo, {userName}!
              </h1>
              <p className="text-base text-ink-700">
                Lokasi Dermaga: <strong>Depo Seafood Purwokerto, Jawa Tengah</strong>
              </p>
            </div>

            {/* DOMINANT Action Button: Tambah Stok Baru */}
            <Link href="/supplier/stok-saya/tambah" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-4 bg-ocean-900 hover:bg-ocean-700 text-white font-black text-lg rounded-2xl shadow-md flex items-center justify-center gap-3 active:scale-95 transition-all min-h-[56px]"
              >
                <Camera className="w-6 h-6 text-sky-400" />
                <span>Tambah Stok Baru</span>
              </button>
            </Link>
          </div>

          {/* 3 Large Simple Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Card 1: Pesanan Baru */}
            <div className="bg-sky-50 p-6 rounded-2xl border-2 border-sky-300 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-ocean-900 uppercase tracking-wide">
                  Pesanan Masuk Baru
                </span>
                <ShoppingBag className="w-6 h-6 text-ocean-900" />
              </div>
              <p className="text-4xl font-black text-ocean-900 tabular-nums">
                {newOrdersCount} <span className="text-base font-normal">Pesanan</span>
              </p>
              <p className="text-xs text-ink-700 pt-1">
                Perlu segera disiapkan untuk dikirim ke gudang.
              </p>
            </div>

            {/* Card 2: Jumlah Stok Aktif */}
            <div className="bg-white p-6 rounded-2xl border-2 border-ink-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-ink-900 uppercase tracking-wide">
                  Stok Ikan Aktif
                </span>
                <Package className="w-6 h-6 text-ink-900" />
              </div>
              <p className="text-4xl font-black text-ink-900 tabular-nums">
                {activeStockKg} <span className="text-base font-normal">kg</span>
              </p>
              <p className="text-xs text-ink-700 pt-1">
                Siap dibeli oleh restoran di katalog.
              </p>
            </div>

            {/* Card 3: Uang Masuk Bulan Ini */}
            <div className="bg-white p-6 rounded-2xl border-2 border-ink-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-ink-900 uppercase tracking-wide">
                  Uang Masuk Bulan Ini
                </span>
                <Wallet className="w-6 h-6 text-success-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-success-600 tabular-nums">
                Rp {monthlyEarnings.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-ink-700 pt-1">
                Hasil penjualan dari ikan yang sudah diterima pembeli.
              </p>
            </div>

          </div>

          {/* Quick Orders Needing Action */}
          <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <h2 className="font-extrabold text-ink-900 text-xl flex items-center gap-2">
                <Clock className="w-6 h-6 text-ocean-900" />
                Pesanan Baru yang Perlu Siap Dikirim
              </h2>
              <Link href="/supplier/pesanan-masuk" className="text-sm font-bold text-ocean-900 hover:underline flex items-center gap-1">
                Lihat Semua Pesanan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl border-2 border-ocean-900 bg-sky-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-ink-400 block">Order ID: #o1111111</span>
                  <h3 className="font-bold text-ink-900 text-lg">
                    50 kg Kakap Merah Tangkapan Subuh
                  </h3>
                  <p className="text-sm text-ink-700">
                    Pembeli: <strong>Restoran Seafood Bahari (Senopati)</strong>
                  </p>
                  <p className="text-xs text-ocean-900 font-semibold pt-0.5">
                    Status: Diproses Supplier — Perlu Tandai Siap Kirim
                  </p>
                </div>

                <Link href="/supplier/pesanan-masuk/o1111111-1111-1111-1111-111111111111">
                  <Button className="w-full sm:w-auto h-12 bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-sm px-6">
                    Buka & Update Status Kirim
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
