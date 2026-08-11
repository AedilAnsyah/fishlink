"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fish, Anchor, Ship, Waves, User, Phone, Lock, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationSelector } from "@/components/shared/LocationSelector";
import { SupplierType } from "@/types/database.types";

export default function DaftarSupplierPage() {
  const router = useRouter();

  const [supplierType, setSupplierType] = useState<SupplierType>("nelayan_perorangan");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName || !phone || !password || !locationLabel) {
      setErrorMessage("Mohon lengkapi nama, nomor WhatsApp, kata sandi, dan lokasi dermaga/tambak Anda.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Set role supplier mock cookie
      document.cookie = "fishlink_mock_role=supplier; path=/; max-age=86400";
      router.push("/supplier/beranda");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-ocean-900">
          <img
            src="/logo.png"
            alt="Fishlink Logo"
            className="h-10 w-auto object-contain"
          />
          <span>Fishlink</span>
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-ink-900">
          Daftar Sebagai Mitra Hasil Laut
        </h1>
        <p className="mt-1 text-base text-ink-700 supplier-body-text">
          Jual langsung tangkapan atau hasil tambak Anda ke restoran & hotel dengan harga adil
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-sm border border-ink-200 rounded-2xl sm:px-8">

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 bg-danger-100 border border-danger-600/30 text-danger-600 rounded-xl text-sm font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Step 1: Partner Type Selection Card */}
            <div className="space-y-3">
              <label className="block text-base font-bold text-ink-900">
                1. Pilih Jenis Usaha / Mitra Anda <span className="text-danger-600">*</span>
              </label>
              
              <div className="grid grid-cols-1 gap-3">
                {/* Nelayan Perorangan Card */}
                <button
                  type="button"
                  onClick={() => {
                    setSupplierType("nelayan_perorangan");
                    if (!businessName) setBusinessName(`Tangkapan ${fullName || "Nelayan"}`);
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 min-h-[58px] ${
                    supplierType === "nelayan_perorangan"
                      ? "border-ocean-900 bg-sky-50 shadow-sm"
                      : "border-ink-200 bg-white hover:border-ink-400"
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    supplierType === "nelayan_perorangan" ? "bg-ocean-900 text-white" : "bg-ink-100 text-ink-700"
                  }`}>
                    <Anchor className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-ink-900 text-base">Nelayan Perorangan</p>
                      {supplierType === "nelayan_perorangan" && (
                        <CheckCircle2 className="w-5 h-5 text-ocean-900" />
                      )}
                    </div>
                    <p className="text-xs text-ink-700 mt-0.5">
                      Nelayan pancing/jaring skala kecil dengan tangkapan harian.
                    </p>
                  </div>
                </button>

                {/* Nelayan Besar Card */}
                <button
                  type="button"
                  onClick={() => setSupplierType("nelayan_besar")}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 min-h-[58px] ${
                    supplierType === "nelayan_besar"
                      ? "border-ocean-900 bg-sky-50 shadow-sm"
                      : "border-ink-200 bg-white hover:border-ink-400"
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    supplierType === "nelayan_besar" ? "bg-ocean-900 text-white" : "bg-ink-100 text-ink-700"
                  }`}>
                    <Ship className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-ink-900 text-base">Nelayan Besar / Kapal</p>
                      {supplierType === "nelayan_besar" && (
                        <CheckCircle2 className="w-5 h-5 text-ocean-900" />
                      )}
                    </div>
                    <p className="text-xs text-ink-700 mt-0.5">
                      Pemilik armada kapal penangkap tangkal samudra / PT perikanan.
                    </p>
                  </div>
                </button>

                {/* Pembudidaya Card */}
                <button
                  type="button"
                  onClick={() => setSupplierType("pembudidaya")}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 min-h-[58px] ${
                    supplierType === "pembudidaya"
                      ? "border-ocean-900 bg-sky-50 shadow-sm"
                      : "border-ink-200 bg-white hover:border-ink-400"
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    supplierType === "pembudidaya" ? "bg-ocean-900 text-white" : "bg-ink-100 text-ink-700"
                  }`}>
                    <Waves className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-ink-900 text-base">Pembudidaya Tambak</p>
                      {supplierType === "pembudidaya" && (
                        <CheckCircle2 className="w-5 h-5 text-ocean-900" />
                      )}
                    </div>
                    <p className="text-xs text-ink-700 mt-0.5">
                      Petambak udang vaname, bandeng, atau budidaya ikan air asin/payau.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Location Selection */}
            <div className="space-y-3 pt-2">
              <label className="block text-base font-bold text-ink-900">
                2. Lokasi Dermaga / Pangkalan / Tambak
              </label>
              <LocationSelector
                locationLabel={locationLabel}
                onLocationChange={(label) => setLocationLabel(label)}
                isSupplierForm={true}
              />
            </div>

            {/* Step 3: Identity & WhatsApp Info */}
            <div className="space-y-4 pt-2">
              <label className="block text-base font-bold text-ink-900">
                3. Data Diri & Kontak WhatsApp
              </label>

              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1">
                  Nama Lengkap <span className="text-danger-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-ink-400" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="contoh: Pak Udung"
                    className="block w-full pl-11 pr-4 h-12 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 text-base outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1">
                  Nama Kapal / Nama Kelompok Tambak (Opsional)
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="contoh: KM Subur Jaya atau Tangkapan Pak Udung"
                  className="block w-full px-4 h-12 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 text-base outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1">
                  Nomor HP / WhatsApp <span className="text-danger-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-ink-400" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="contoh: 081234567890"
                    className="block w-full pl-11 pr-4 h-12 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 text-base outline-none"
                    required
                  />
                </div>
                <p className="text-xs text-ink-700 mt-1">
                  Kami akan mengirimkan notifikasi pesanan masuk dari pembeli langsung ke WhatsApp ini.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1">
                  Buat Kata Sandi Akun <span className="text-danger-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-ink-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan angka atau kata sandi mudah diingat"
                    className="block w-full pl-11 pr-4 h-12 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 text-base outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Single Large Main Action Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-lg rounded-xl shadow-md mt-4"
            >
              {loading ? "Mendaftarkan Akun Mitra..." : "⚓ Daftar Mitra Sekarang"}
            </Button>
          </form>

          <div className="mt-8 border-t border-ink-100 pt-6 text-center">
            <p className="text-sm text-ink-700">
              Sudah pernah mendaftar?{" "}
              <Link href="/login" className="font-bold text-ocean-900 hover:underline">
                Masuk ke Akun Mitra
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
