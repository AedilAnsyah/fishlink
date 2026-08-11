"use client";

import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Search,
  Building2,
  Anchor,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationSelectorProps {
  locationLabel: string;
  onLocationChange: (label: string, lat?: number, lng?: number) => void;
  isSupplierForm?: boolean;
  variant?: "default" | "banner";
}

// Popular coastal & seafood hubs in Indonesia for instant 1-tap selection
const POPULAR_SEAFOOD_HUBS = [
  "Purwokerto, Jawa Tengah",
  "Cilacap, Jawa Tengah",
  "Pelabuhan Ratu, Sukabumi",
  "Muara Baru, Jakarta Utara",
  "Semarang, Jawa Tengah",
  "Pekalongan, Jawa Tengah",
  "Surabaya, Jawa Timur",
  "Makassar, Sulawesi Selatan",
];

// Helper: Reverse Geocoding using Nominatim OpenStreetMap API to resolve area names (Desa, Kecamatan, Kabupaten)
async function reverseGeocodeArea(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      { headers: { "Accept-Language": "id" } }
    );

    if (res.ok) {
      const data = await res.json();
      const addr = data.address;

      if (addr) {
        const subdistrict =
          addr.village ||
          addr.suburb ||
          addr.neighbourhood ||
          addr.quarter ||
          addr.hamlet;
        const district = addr.district || addr.city_district || addr.county;
        const regency =
          addr.city || addr.town || addr.municipality || addr.state_district;
        const state = addr.state;

        const parts = [subdistrict, district, regency, state].filter(Boolean);
        if (parts.length > 0) {
          // Join area levels, e.g. "Kec. Purwokerto Selatan, Kab. Banyumas, Jawa Tengah"
          return parts.slice(0, 3).join(", ");
        }
      }
    }
  } catch {
    // Ignore fetch error
  }
  return `Purwokerto, Jawa Tengah`;
}

export function LocationSelector({
  locationLabel,
  onLocationChange,
  isSupplierForm = false,
  variant = "default",
}: LocationSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempLocationInput, setTempLocationInput] = useState(locationLabel);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setStatusMsg({
        type: "error",
        text: "Fitur GPS tidak didukung peramban ini. Silakan pilih atau ketik nama daerah Anda.",
      });
      return;
    }

    setLoading(true);
    setStatusMsg({
      type: "info",
      text: "Mendapatkan posisi GPS & mengonversi ke nama daerah (Desa/Kecamatan/Kabupaten)...",
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Perform reverse geocoding to retrieve human-readable area name
        const areaName = await reverseGeocodeArea(latitude, longitude);

        onLocationChange(areaName, latitude, longitude);
        setTempLocationInput(areaName);
        setLoading(false);
        setStatusMsg({
          type: "success",
          text: `Area berhasil dideteksi: ${areaName}`,
        });

        if (variant === "banner") {
          setTimeout(() => setIsModalOpen(false), 1200);
        }
      },
      (error) => {
        setLoading(false);
        let errText =
          "Gagal mengambil posisi GPS. Silakan ketik atau pilih nama daerah Anda.";
        if (error.code === error.PERMISSION_DENIED) {
          errText =
            "Izin lokasi ditolak. Silakan ketik atau pilih nama daerah/dermaga Anda di bawah.";
        }
        setStatusMsg({ type: "error", text: errText });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSaveModal = () => {
    if (tempLocationInput.trim()) {
      onLocationChange(tempLocationInput.trim());
      setIsModalOpen(false);
    }
  };

  // BANNER / COMPACT MODE (Used in Katalog Header Banner)
  if (variant === "banner") {
    return (
      <>
        {/* Compact, High-Contrast Trigger Pill */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTempLocationInput(locationLabel);
              setStatusMsg(null);
              setIsModalOpen(true);
            }}
            className="group inline-flex items-center gap-2 bg-ocean-800 hover:bg-ocean-700 text-white px-3.5 py-1.5 rounded-xl border border-sky-400/40 text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="max-w-[220px] sm:max-w-[340px] truncate text-white">
              {locationLabel || "Purwokerto, Jawa Tengah"}
            </span>
            <span className="text-[11px] font-bold text-sky-300 group-hover:text-white underline ml-1">
              Ubah Lokasi
            </span>
          </button>
        </div>

        {/* ELEGANT MODAL DIALOG FOR LOCATION SELECTION */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-ink-900 w-full max-w-lg rounded-2xl border-2 border-ocean-900 shadow-2xl overflow-hidden space-y-0 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="bg-ocean-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-400 text-ink-900 flex items-center justify-center font-bold">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      Pilih Lokasi Acuan Pembeli
                    </h3>
                    <p className="text-[11px] text-sky-200">
                      Gunakan nama daerah (Desa, Kecamatan, Kabupaten, atau Kota)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-sky-200 hover:text-white p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 space-y-5">
                
                {/* Option 1: GPS Auto Detect */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-ocean-900 block uppercase tracking-wider">
                    Opsi 1: Deteksi Otomatis via GPS
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDetectGPS}
                    disabled={loading}
                    className="w-full h-12 bg-sky-50 hover:bg-sky-100 border-2 border-ocean-900 text-ocean-900 font-extrabold text-sm gap-2 rounded-xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-ocean-900" />
                        <span>Mendeteksi Nama Daerah...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 text-sky-500 fill-sky-500" />
                        <span>📍 Gunakan GPS & Dapatkan Nama Daerah</span>
                      </>
                    )}
                  </Button>
                </div>

                {statusMsg && (
                  <div
                    className={`flex items-start gap-2 p-3 rounded-xl text-xs font-bold ${
                      statusMsg.type === "success"
                        ? "bg-success-100 text-success-600 border border-success-600/30"
                        : statusMsg.type === "error"
                        ? "bg-danger-100 text-danger-600 border border-danger-600/30"
                        : "bg-sky-50 text-ocean-900 border border-sky-200"
                    }`}
                  >
                    {statusMsg.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <span>{statusMsg.text}</span>
                  </div>
                )}

                {/* Option 2: Search Input Manual (Nama Daerah) */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-ocean-900 block uppercase tracking-wider">
                    Opsi 2: Ketik Nama Daerah / Usaha
                  </span>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-ink-400" />
                    </div>
                    <input
                      type="text"
                      value={tempLocationInput}
                      onChange={(e) => setTempLocationInput(e.target.value)}
                      placeholder="contoh: Kecamatan Purwokerto Timur, Banyumas"
                      className="block w-full pl-10 pr-4 h-12 rounded-xl border-2 border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 text-sm font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Option 3: Preset Popular Coastal Hubs */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-ink-700 block">
                    Pilih Cepat Daerah Pesisir Utama:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SEAFOOD_HUBS.map((hub) => (
                      <button
                        key={hub}
                        type="button"
                        onClick={() => {
                          setTempLocationInput(hub);
                          onLocationChange(hub);
                          setIsModalOpen(false);
                        }}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                          tempLocationInput === hub
                            ? "bg-ocean-900 text-white border-ocean-900"
                            : "bg-ink-100 hover:bg-sky-100 text-ink-900 border-ink-200"
                        }`}
                      >
                        {hub}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="bg-ink-100 px-6 py-4 flex items-center justify-end gap-3 border-t border-ink-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 text-ink-900 border-ink-300 font-bold text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveModal}
                  className="h-10 px-6 bg-ocean-900 hover:bg-ocean-700 text-white font-extrabold text-xs rounded-xl shadow-xs"
                >
                  Simpan Lokasi Ini
                </Button>
              </div>

            </div>
          </div>
        )}
      </>
    );
  }

  // DEFAULT FORM MODE (Used in /daftar-buyer and /daftar-supplier forms)
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-ink-900">
        {isSupplierForm ? "Lokasi Dermaga / Pelabuhan / Tambak" : "Lokasi Usaha / Restoran / Hotel"}{" "}
        <span className="text-danger-600">*</span>
      </label>

      {/* Primary Action: One-tap GPS Detection with Reverse Geocoding */}
      <Button
        type="button"
        variant="outline"
        onClick={handleDetectGPS}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 border-2 border-ocean-900 text-ocean-900 hover:bg-sky-50 font-bold ${
          isSupplierForm ? "h-13 text-base" : "h-11"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-ocean-900" />
            <span>Mendeteksi Nama Daerah...</span>
          </>
        ) : (
          <>
            <Navigation className="w-5 h-5 text-sky-500 fill-sky-500" />
            <span>📍 Deteksi Otomatis Nama Daerah (GPS)</span>
          </>
        )}
      </Button>

      {statusMsg && (
        <div
          className={`flex items-start gap-2 p-3 rounded-lg text-xs font-semibold ${
            statusMsg.type === "success"
              ? "bg-success-100 text-success-600 border border-success-600/30"
              : statusMsg.type === "error"
              ? "bg-danger-100 text-danger-600 border border-danger-600/30"
              : "bg-sky-50 text-ocean-900 border border-sky-200"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Manual Input Fallback */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-ink-400" />
        </div>
        <input
          type="text"
          value={locationLabel}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder={
            isSupplierForm
              ? "atau ketik nama daerah/dermaga (contoh: Purwokerto, Jawa Tengah)"
              : "atau ketik nama desa/kecamatan/kabupaten restoran Anda"
          }
          className={`block w-full pl-11 pr-4 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 outline-none text-sm transition-all ${
            isSupplierForm ? "h-12 text-base" : "h-11 text-sm"
          }`}
          required
        />
      </div>
      <p className="text-[11px] text-ink-700">
        Nama daerah digunakan untuk mencocokkan kesegaran hasil laut dan memperhitungkan jarak pengiriman terdekat.
      </p>
    </div>
  );
}
