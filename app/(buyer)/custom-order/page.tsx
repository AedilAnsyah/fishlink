"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { createClient } from "@/lib/supabase/client";
import {
  Fish,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Anchor,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchedSupplierResult {
  supplierId: string;
  businessName: string;
  supplierTypeLabel: string;
  addressLabel: string;
  distanceKm: number;
  rating: number;
  estimatedHours: number;
}

export default function CustomOrderPage() {
  const [fishName, setFishName] = useState("");
  const [sizeSpec, setSizeSpec] = useState("");
  const [quantityKg, setQuantityKg] = useState<number>(100);
  const [targetPrice, setTargetPrice] = useState<number>(90000);

  const [searchingStatus, setSearchingStatus] = useState<
    "idle" | "searching" | "expanding_radius" | "matched"
  >("idle");

  const [matchedSuppliers, setMatchedSuppliers] = useState<MatchedSupplierResult[]>([]);
  const [agreedSupplierId, setAgreedSupplierId] = useState<string | null>(null);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fishName || !quantityKg) return;

    setSearchingStatus("searching");

    // Try saving request to Supabase custom_order_requests
    try {
      const supabase = createClient();
      await supabase.from("custom_order_requests").insert({
        fish_name: fishName,
        size_spec: sizeSpec,
        quantity_kg: quantityKg,
        target_price: targetPrice,
        status: "mencari_mitra",
      });
    } catch {
      // Ignore fallback if offline
    }

    // Step 1: Searching initial radius (50km)
    setTimeout(() => {
      setSearchingStatus("expanding_radius");

      // Step 2: Expanding radius to 150km and returning matched suppliers
      setTimeout(() => {
        setMatchedSuppliers([
          {
            supplierId: "s1111111-1111-1111-1111-111111111111",
            businessName: "Tangkapan Pak Udung",
            supplierTypeLabel: "Nelayan Perorangan (Muara Angke)",
            addressLabel: "Dermaga & Depo Purwokerto, Jawa Tengah",
            distanceKm: 12,
            rating: 4.9,
            estimatedHours: 4,
          },
          {
            supplierId: "s2222222-2222-2222-2222-222222222222",
            businessName: "PT Laut Nusantara Jaya",
            supplierTypeLabel: "Nelayan Besar / Kapal Samudra",
            addressLabel: "Pelabuhan Ratu, Sukabumi",
            distanceKm: 42,
            rating: 4.8,
            estimatedHours: 8,
          },
          {
            supplierId: "s3333333-3333-3333-3333-333333333333",
            businessName: "Koperasi Tambak Segar Mandiri",
            supplierTypeLabel: "Pembudidaya Tambak",
            addressLabel: "Cilamaya, Karawang",
            distanceKm: 68,
            rating: 4.7,
            estimatedHours: 12,
          },
        ]);
        setSearchingStatus("matched");
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-sky-50 to-off-white py-10 border-b border-ink-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-200 text-ocean-900 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-ocean-900" />
            <span>Pencocokan Lokasi Otomatis & Terdekat</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900">
            Request Custom Order Hasil Laut
          </h1>
          <p className="text-sm text-ink-700 max-w-xl mx-auto">
            Butuh spesifikasi ikan khusus, ukuran tertentu, atau volume besar untuk catering/hotel? Ajukan spesifikasi Anda dan sistem akan mencarikannya dari mitra nelayan terdekat.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Custom Order Request Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ink-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-ink-100">
              <div className="w-10 h-10 rounded-xl bg-ocean-900 text-white flex items-center justify-center font-bold shrink-0">
                <Fish className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h2 className="font-bold text-ink-900 text-lg">
                  Formulir Spesifikasi Pesanan Khusus
                </h2>
                <p className="text-xs text-ink-700">
                  Isi spesifikasi hasil laut yang Anda butuhkan
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink-900 mb-1">
                    Jenis Ikan / Hasil Laut <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={fishName}
                    onChange={(e) => setFishName(e.target.value)}
                    placeholder="contoh: Kakap Merah / Tuna Sirip Kuning"
                    className="w-full px-3.5 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm focus:border-ocean-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink-900 mb-1">
                    Spesifikasi Ukuran / Potongan
                  </label>
                  <input
                    type="text"
                    value={sizeSpec}
                    onChange={(e) => setSizeSpec(e.target.value)}
                    placeholder="contoh: 2 - 3 kg/ekor utuh atau Fillet Skin-on"
                    className="w-full px-3.5 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm focus:border-ocean-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink-900 mb-1">
                    Jumlah Volume Diperlukan (kg) <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                    placeholder="100"
                    className="w-full px-3.5 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm focus:border-ocean-900 outline-none tabular-nums"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink-900 mb-1">
                    Target Harga per Kg (Rp)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    placeholder="90000"
                    className="w-full px-3.5 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm focus:border-ocean-900 outline-none tabular-nums"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={searchingStatus === "searching" || searchingStatus === "expanding_radius"}
                className="w-full h-12 bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-base shadow-sm gap-2"
              >
                {searchingStatus === "searching" || searchingStatus === "expanding_radius" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mencari Mitra Nelayan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Cari Mitra Nelayan Sekarang
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Searching Radar Animation Display */}
          {(searchingStatus === "searching" || searchingStatus === "expanding_radius") && (
            <div className="bg-sky-50 p-8 rounded-2xl border-2 border-sky-200 text-center space-y-4 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-ocean-900 text-white flex items-center justify-center mx-auto shadow-md">
                <Search className="w-8 h-8 text-sky-400 animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-ink-900 text-lg">
                  {searchingStatus === "searching"
                    ? "Mencari Mitra Nelayan Terdekat (Radius 50 km)..."
                    : "Memperluas Radius Pencarian Ke 150 km..."}
                </h3>
                <p className="text-xs text-ink-700 mt-1">
                  Sistem sedang mencocokkan stok & armada nelayan yang dapat memenuhi {quantityKg} kg {fishName}...
                </p>
              </div>
            </div>
          )}

          {/* Matched Suppliers Results */}
          {searchingStatus === "matched" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-ink-900 text-xl flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-success-600" />
                  Ditemukan {matchedSuppliers.length} Mitra Nelayan Sesuai
                </h3>
                <span className="text-xs text-ocean-900 font-semibold bg-sky-200 px-3 py-1 rounded-full">
                  Diprioritaskan Dari Radius Terdekat
                </span>
              </div>

              <div className="space-y-3">
                {matchedSuppliers.map((supplier) => {
                  const isAgreed = agreedSupplierId === supplier.supplierId;
                  return (
                    <div
                      key={supplier.supplierId}
                      className={`p-5 rounded-2xl border-2 transition-all bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isAgreed
                          ? "border-success-600 bg-success-100/40"
                          : "border-ink-200 hover:border-ocean-900"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-ink-900 text-base">
                            {supplier.businessName}
                          </span>
                          <span className="text-xs bg-ink-100 text-ink-900 font-semibold px-2.5 py-0.5 rounded-full">
                            {supplier.supplierTypeLabel}
                          </span>
                        </div>

                        <p className="text-xs text-ink-700 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-ocean-900 shrink-0" />
                          {supplier.addressLabel} (<strong>±{supplier.distanceKm} km</strong>)
                        </p>

                        <div className="flex items-center gap-3 text-xs text-ink-700">
                          <span className="flex items-center gap-1 text-warning-600 font-bold">
                            ★ {supplier.rating} / 5.0
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-ocean-900 font-medium">
                            <Clock className="w-3.5 h-3.5" /> Est. Siap: {supplier.estimatedHours} jam
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 w-full sm:w-auto">
                        {isAgreed ? (
                          <div className="px-4 py-2 bg-success-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Pesanan Disepakati!
                          </div>
                        ) : (
                          <Button
                            onClick={() => setAgreedSupplierId(supplier.supplierId)}
                            className="w-full sm:w-auto bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-xs px-5 h-11"
                          >
                            Sepakati Pesanan Custom
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {agreedSupplierId && (
                <div className="p-4 bg-success-100 border border-success-600/30 rounded-xl text-center space-y-2">
                  <p className="text-xs font-bold text-success-600">
                    🎉 Request custom order disepakati! Notifikasi telah dikirimkan ke dashboard mitra & WhatsApp Anda.
                  </p>
                  <Link href="/dashboard">
                    <Button size="sm" className="bg-ocean-900 text-white font-bold text-xs mt-1">
                      Lihat di Dashboard Pembeli
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
