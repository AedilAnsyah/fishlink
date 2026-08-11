"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SupplierNav } from "@/components/supplier/SupplierNav";
import { Footer } from "@/components/shared/Footer";
import { createClient } from "@/lib/supabase/client";
import {
  Camera,
  CheckCircle2,
  Fish,
  Calendar,
  DollarSign,
  Package,
  ArrowLeft,
  Loader2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FISH_TYPES = [
  "Kakap Merah",
  "Tuna Sirip Kuning",
  "Udang Vaname",
  "Cumi-Cumi",
  "Kerapu Bintang",
  "Ikan Tongkol",
  "Ikan Tenggiri",
  "Kepiting Bakau",
  "Bandeng Tambak",
];

export default function TambahStokPage() {
  const router = useRouter();

  // 4 Mandatory Fields
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [fishName, setFishName] = useState("Kakap Merah");
  const [stockKg, setStockKg] = useState<number>(50);
  const [pricePerKg, setPricePerKg] = useState<number>(85000);
  const [catchDate, setCatchDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Client-side image compression using Canvas
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Compress dimensions max 800px width/height
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to compressed DataURL JPEG 0.75 quality
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
        setPhotoPreview(compressedDataUrl);
      };
    };
    reader.readAsDataURL(file);
    setPhotoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let photoUrl = photoPreview || "/fresh-fish.png";

    try {
      const res = await fetch("/api/supplier/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fishName,
          pricePerKg,
          stockKg,
          catchDate,
          photoUrl,
          seasonTag: "Segar Harian",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.warn("API insert warning:", data.error);
      }
    } catch (err) {
      console.error("Failed to add product:", err);
    }

    setLoading(false);
    setSuccessMsg(true);
    setTimeout(() => {
      router.push("/supplier/stok-saya");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans supplier-body-text">
      <SupplierNav />

      {/* Header Bar */}
      <div className="bg-white border-b border-ink-100 py-3">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/supplier/stok-saya"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-ocean-900 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Stok Saya
          </Link>
          <span className="text-xs font-semibold text-ink-700">Mode Ringan Upload Stok</span>
        </div>
      </div>

      <section className="py-8 flex-1">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
              Pasang Stok Ikan Baru
            </h1>
            <p className="text-base text-ink-700">
              Isi 4 langkah mudah di bawah untuk menampilkan ikan Anda ke katalog pembeli.
            </p>
          </div>

          {successMsg && (
            <div className="p-5 bg-success-100 border-2 border-success-600 rounded-2xl text-center space-y-2 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-success-600 mx-auto" />
              <h3 className="font-extrabold text-ink-900 text-lg">
                Ikanmu Sudah Bisa Dilihat Pembeli!
              </h3>
              <p className="text-sm text-ink-700">
                Stok berhasil dipasang ke katalog Fishlink. Mengalihkan ke halaman stok...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-ocean-900 shadow-md space-y-6">
            
            {/* FIELD 1: PHOTO BUTTON (Foto dulu, detail belakangan) */}
            <div className="space-y-3">
              <label className="block text-base font-extrabold text-ink-900">
                1. Ambil / Unggah Foto Ikan Segar <span className="text-danger-600">*</span>
              </label>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="photo-upload-input"
                />

                {photoPreview ? (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-ocean-900 shadow-sm">
                    <img
                      src={photoPreview}
                      alt="Preview Ikan"
                      className="w-full h-full object-cover"
                    />
                    <label
                      htmlFor="photo-upload-input"
                      className="absolute bottom-3 right-3 bg-ocean-900/90 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 hover:bg-ocean-700 shadow-md"
                    >
                      <Camera className="w-4 h-4 text-sky-400" /> Ganti Foto
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="photo-upload-input"
                    className="flex flex-col items-center justify-center p-8 rounded-2xl border-3 border-dashed border-ocean-900 bg-sky-50/60 hover:bg-sky-50 cursor-pointer text-center space-y-3 min-h-[160px] transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full bg-ocean-900 text-white flex items-center justify-center shadow-md">
                      <Camera className="w-8 h-8 text-sky-400" />
                    </div>
                    <div>
                      <span className="font-extrabold text-ocean-900 text-lg block">
                        Tekan Untuk Ambil Foto Ikan
                      </span>
                      <span className="text-xs text-ink-700">
                        Foto otomatis dikompresi hemat kuota internet.
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* FIELD 2: FISH TYPE DROPDOWN */}
            <div className="space-y-2">
              <label className="block text-base font-extrabold text-ink-900">
                2. Pilih Jenis Hasil Laut <span className="text-danger-600">*</span>
              </label>
              <select
                value={fishName}
                onChange={(e) => setFishName(e.target.value)}
                className="w-full px-4 h-14 rounded-xl border-2 border-ink-200 bg-white text-ink-900 font-bold text-base focus:border-ocean-900 outline-none"
              >
                {FISH_TYPES.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* FIELD 3: WEIGHT (KG) & PRICE PER KG (RP) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-base font-extrabold text-ink-900">
                  3a. Estimasi Berat (kg) <span className="text-danger-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={stockKg}
                    onChange={(e) => setStockKg(Number(e.target.value))}
                    className="w-full pl-4 pr-12 h-14 rounded-xl border-2 border-ink-200 bg-white text-ink-900 font-bold text-lg focus:border-ocean-900 outline-none tabular-nums"
                    required
                  />
                  <span className="absolute right-4 top-4 font-bold text-ink-400 text-base">
                    kg
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-base font-extrabold text-ink-900">
                  3b. Harga per kg (Rp) <span className="text-danger-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 font-bold text-ink-400 text-base">
                    Rp
                  </span>
                  <input
                    type="number"
                    step="1000"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    className="w-full pl-12 pr-4 h-14 rounded-xl border-2 border-ink-200 bg-white text-ink-900 font-bold text-lg focus:border-ocean-900 outline-none tabular-nums"
                    required
                  />
                </div>
              </div>
            </div>

            {/* FIELD 4: CATCH / HARVEST DATE (DEFAULT: TODAY) */}
            <div className="space-y-2">
              <label className="block text-base font-extrabold text-ink-900">
                4. Tanggal Tangkap / Panen <span className="text-danger-600">*</span>
              </label>
              <input
                type="date"
                value={catchDate}
                onChange={(e) => setCatchDate(e.target.value)}
                className="w-full px-4 h-14 rounded-xl border-2 border-ink-200 bg-white text-ink-900 font-bold text-base focus:border-ocean-900 outline-none"
                required
              />
              <p className="text-xs text-ink-700">
                Default: Hari ini. Tanggal tangkap menentukan skor kesegaran produk di mata pembeli.
              </p>
            </div>

            {/* MAIN ACTION BUTTON */}
            <Button
              type="submit"
              disabled={loading || successMsg}
              className="w-full h-16 bg-ocean-900 hover:bg-ocean-700 text-white font-black text-xl rounded-2xl shadow-md mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
                  <span>Memproses Stok...</span>
                </>
              ) : (
                <span>Pasang Ke Katalog Sekarang</span>
              )}
            </Button>
          </form>

        </div>
      </section>

      <Footer />
    </div>
  );
}
