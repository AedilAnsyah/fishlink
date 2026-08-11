"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, Anchor, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FishTypePrice {
  name: string;
  pricePerKg: number;
  category: string;
}

const FISH_OPTIONS: FishTypePrice[] = [
  { name: "Tuna Sirip Kuning (Yellowfin)", pricePerKg: 115000, category: "Tangkapan Samudra" },
  { name: "Kakap Merah Segar", pricePerKg: 85000, category: "Tangkapan Pesisir" },
  { name: "Udang Vaname Premium", pricePerKg: 95000, category: "Budidaya Tambak" },
  { name: "Cumi-Cumi Malam", pricePerKg: 78000, category: "Tangkapan Pesisir" },
  { name: "Kerapu Bintang", pricePerKg: 145000, category: "Tangkapan Karang" },
  { name: "Ikan Tenggiri Utuh", pricePerKg: 105000, category: "Tangkapan Pesisir" },
  { name: "Bandeng Tambak", pricePerKg: 48000, category: "Budidaya Tambak" },
];

export function RevenueCalculator() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [volumeKg, setVolumeKg] = useState<number>(300); // default 300kg/month

  const selectedFish = FISH_OPTIONS[selectedIndex];
  const grossRevenue = selectedFish.pricePerKg * volumeKg;
  const platformFee = Math.round(grossRevenue * 0.03); // 3% platform fee
  const netRevenue = grossRevenue - platformFee;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-ocean-900 shadow-md space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-ink-100">
        <div className="w-10 h-10 rounded-xl bg-ocean-900 text-white flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <h3 className="font-bold text-ink-900 text-lg sm:text-xl">
            Kalkulator Simulasi Pendapatan Mitra
          </h3>
          <p className="text-xs text-ink-700">Hitung estimasi hasil penjualan tanpa perantara tengkulak</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Controls */}
        <div className="space-y-5">
          {/* Fish Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-ink-900 mb-1.5">
              Pilih Komoditas Hasil Laut Utamanya:
            </label>
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="w-full px-4 h-12 rounded-[10px] border-2 border-ink-200 bg-white text-ink-900 font-semibold text-sm focus:border-ocean-900 outline-none"
            >
              {FISH_OPTIONS.map((fish, idx) => (
                <option key={fish.name} value={idx}>
                  {fish.name} — Rp {fish.pricePerKg.toLocaleString("id-ID")}/kg
                </option>
              ))}
            </select>
          </div>

          {/* Volume Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-ink-900">
                Estimasi Volume Per Bulan:
              </label>
              <span className="text-base font-extrabold text-ocean-900 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 tabular-nums">
                {volumeKg.toLocaleString("id-ID")} kg / bulan
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={volumeKg}
              onChange={(e) => setVolumeKg(Number(e.target.value))}
              className="w-full h-2.5 bg-ink-100 rounded-lg appearance-none cursor-pointer accent-ocean-900"
            />
            <div className="flex justify-between text-[11px] text-ink-400 mt-1">
              <span>50 kg</span>
              <span>1.000 kg</span>
              <span>2.000 kg</span>
            </div>
          </div>

          {/* Price Reference Info */}
          <div className="p-3.5 rounded-xl bg-off-white border border-ink-200 text-xs text-ink-700 space-y-1">
            <p className="font-semibold text-ink-900">Patokan Harga Pasar Fishlink:</p>
            <p>
              Rata-rata harga terdaftar:{" "}
              <strong className="text-ocean-900">
                Rp {selectedFish.pricePerKg.toLocaleString("id-ID")} / kg
              </strong>{" "}
              ({selectedFish.category})
            </p>
          </div>
        </div>

        {/* Calculation Result Panel */}
        <div className="bg-sky-50 p-6 rounded-xl border border-sky-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold text-ocean-900 uppercase tracking-wider block">
              Hasil Estimasi Pendapatan
            </span>

            <div className="space-y-1">
              <span className="text-xs text-ink-700">Total Penjualan Kotor:</span>
              <p className="text-xl font-bold text-ink-900 tabular-nums">
                Rp {grossRevenue.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="space-y-1 border-t border-sky-200 pt-2 text-xs">
              <div className="flex justify-between text-ink-700">
                <span>Biaya Layanan Platform (3%):</span>
                <span className="tabular-nums">- Rp {platformFee.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="border-t-2 border-ocean-900 pt-3">
              <span className="text-xs font-bold text-ocean-900 block">
                Estimasi Pendapatan Bersih Mitra:
              </span>
              <p className="text-2xl sm:text-3xl font-black text-ocean-900 tabular-nums">
                Rp {netRevenue.toLocaleString("id-ID")}
              </p>
              <span className="text-[11px] text-ink-700 italic block mt-0.5">
                *Penjualan dikirimkan langsung ke rekening mitra setelah pesanan diterima pembeli.
              </span>
            </div>
          </div>

          <Link href="/daftar-supplier" className="pt-2">
            <Button className="w-full h-12 bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-base gap-2 shadow-sm">
              <Anchor className="w-4 h-4" /> Gabung Mitra & Dapatkan Penjualan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
