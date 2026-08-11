"use client";

import React, { useState } from "react";
import { SupplierNav } from "@/components/supplier/SupplierNav";
import { Footer } from "@/components/shared/Footer";
import { RevenueCalculator } from "@/components/supplier/RevenueCalculator";
import {
  TrendingUp,
  BarChart3,
  Sparkles,
  Calendar,
  DollarSign,
  Fish,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const DEMAND_HISTORICAL_DATA = [
  { month: "Jan", kakap: 120, tuna: 180, udang: 250, cumi: 100 },
  { month: "Feb", kakap: 140, tuna: 210, udang: 280, cumi: 130 },
  { month: "Mar", kakap: 190, tuna: 260, udang: 310, cumi: 170 },
  { month: "Apr", kakap: 220, tuna: 340, udang: 390, cumi: 210 },
  { month: "Mei", kakap: 280, tuna: 450, udang: 460, cumi: 290 },
  { month: "Jun", kakap: 310, tuna: 520, udang: 510, cumi: 340 },
];

export default function PerkiraanPendapatanPage() {
  const [selectedSpecies, setSelectedSpecies] = useState<"tuna" | "kakap" | "udang" | "cumi">("tuna");

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans supplier-body-text">
      <SupplierNav />

      <section className="py-8 flex-1">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-200 text-ocean-900 text-xs font-bold">
              <TrendingUp className="w-4 h-4 text-ocean-900" />
              <span>Analitik Tren Permintaan & Proyeksi Penjualan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
              Perkiraan Pendapatan & Grafik Demand Musiman
            </h1>
            <p className="text-base text-ink-700">
              Gunakan grafik analitik historis untuk merencanakan waktu tangkap & estimasi keuntungan.
            </p>
          </div>

          {/* Revenue Calculator Widget */}
          <RevenueCalculator />

          {/* Demand Trend Forecast Chart (Recharts) */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-ocean-900 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-100 pb-4">
              <div>
                <h3 className="font-extrabold text-ink-900 text-lg flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-ocean-900" />
                  Grafik Tren Permintaan Restoran (Recharts B2B)
                </h3>
                <p className="text-xs text-ink-700 mt-0.5">
                  Diolah dari agregasi order historis restoran & hotel mitra Fishlink
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-ink-900">Komoditas:</span>
                <select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value as any)}
                  className="px-3 h-10 rounded-xl border border-ink-200 bg-sky-50 font-bold text-ocean-900 outline-none"
                >
                  <option value="tuna">Tuna Sirip Kuning</option>
                  <option value="kakap">Kakap Merah</option>
                  <option value="udang">Udang Vaname</option>
                  <option value="cumi">Cumi-Cumi</option>
                </select>
              </div>
            </div>

            {/* Recharts Area Chart Container */}
            <div className="w-full h-72 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DEMAND_HISTORICAL_DATA}>
                  <defs>
                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#135A86" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF3F5" />
                  <XAxis dataKey="month" stroke="#375363" fontSize={12} />
                  <YAxis stroke="#375363" fontSize={12} unit=" kg" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0E2530",
                      borderColor: "#135A86",
                      borderRadius: "12px",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedSpecies}
                    stroke="#135A86"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorDemand)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Demand Insight Alert */}
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-xs text-ocean-900 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="block font-bold">Rekomendasi Waktu Tangkap (AI Demand Forecast):</strong>
                <p className="text-ink-700">
                  Permintaan komoditas <strong>{selectedSpecies.toUpperCase()}</strong> diproyeksikan melonjak 45% pada bulan Mei - Juni seiring musim puncak liburan hotel. Disarankan menyiapkan tambahan es & cold-storage.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
