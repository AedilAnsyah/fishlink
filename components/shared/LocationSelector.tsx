"use client";

import React, { useState } from "react";
import { MapPin, Navigation, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationSelectorProps {
  locationLabel: string;
  onLocationChange: (label: string, lat?: number, lng?: number) => void;
  isSupplierForm?: boolean;
}

export function LocationSelector({
  locationLabel,
  onLocationChange,
  isSupplierForm = false,
}: LocationSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setStatusMsg({
        type: "error",
        text: "Fitur GPS tidak didukung peramban ini. Silakan tulis alamat manual.",
      });
      return;
    }

    setLoading(true);
    setStatusMsg({ type: "info", text: "Mencari titik lokasi GPS Anda..." });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const detectedLabel = `Lokasi GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        onLocationChange(detectedLabel, latitude, longitude);
        setLoading(false);
        setStatusMsg({
          type: "success",
          text: `Lokasi berhasil dideteksi! (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        });
      },
      (error) => {
        setLoading(false);
        let errText = "Gagal mengambil posisi GPS. Silakan ketik alamat lokasi Anda.";
        if (error.code === error.PERMISSION_DENIED) {
          errText = "Izin lokasi ditolak. Silakan ketik nama daerah/dermaga Anda di bawah.";
        }
        setStatusMsg({ type: "error", text: errText });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-ink-900">
        Lokasi Usaha / Dermaga / Pelabuhan <span className="text-danger-600">*</span>
      </label>

      {/* Primary Action: One-tap GPS Detection */}
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
            <span>Sedang Mendeteksi Lokasi...</span>
          </>
        ) : (
          <>
            <Navigation className="w-5 h-5 text-sky-400 fill-sky-400" />
            <span>📍 Gunakan Lokasi GPS Saya Saat Ini</span>
          </>
        )}
      </Button>

      {statusMsg && (
        <div
          className={`flex items-start gap-2 p-3 rounded-lg text-xs font-medium ${
            statusMsg.type === "success"
              ? "bg-success-100 text-success-600 border border-success-600/20"
              : statusMsg.type === "error"
              ? "bg-danger-100 text-danger-600 border border-danger-600/20"
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
              ? "atau ketik nama dermaga (contoh: Purwokerto, Jawa Tengah)"
              : "atau ketik alamat lengkap restoran/hotel Anda"
          }
          className={`block w-full pl-11 pr-4 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 outline-none text-sm transition-all ${
            isSupplierForm ? "h-12 text-base" : "h-11 text-sm"
          }`}
          required
        />
      </div>
      <p className="text-[11px] text-ink-700">
        Lokasi digunakan untuk mencocokkan kesegaran ikan dan menghitung jarak pengiriman terdekat.
      </p>
    </div>
  );
}
