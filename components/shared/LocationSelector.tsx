"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Search,
  Map as MapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationSelectorProps {
  locationLabel: string;
  onLocationChange: (label: string, lat?: number, lng?: number) => void;
  isSupplierForm?: boolean;
  variant?: "default" | "banner";
}

// Popular Indonesian seafood & coastal hubs dictionary for instant 1-tap selection & fallback
const INDONESIAN_REGIONS_GEO_LOOKUP = [
  { name: "Purwokerto, Kabupaten Banyumas, Jawa Tengah", lat: -7.4243, lng: 109.2344 },
  { name: "Cilacap, Jawa Tengah", lat: -7.7176, lng: 109.0069 },
  { name: "Pelabuhan Ratu, Sukabumi, Jawa Barat", lat: -6.9859, lng: 106.5414 },
  { name: "Muara Baru, Jakarta Utara", lat: -6.1070, lng: 106.7735 },
  { name: "Semarang, Jawa Tengah", lat: -6.9667, lng: 110.4167 },
  { name: "Pekalongan, Jawa Tengah", lat: -6.8886, lng: 109.6753 },
  { name: "Surabaya, Jawa Timur", lat: -7.2575, lng: 112.7521 },
  { name: "Makassar, Sulawesi Selatan", lat: -5.1477, lng: 119.4327 },
  { name: "Denpasar, Bali", lat: -8.6705, lng: 115.2126 },
  { name: "Medan, Sumatera Utara", lat: 3.5952, lng: 98.6722 },
  { name: "Bandung, Jawa Barat", lat: -6.9175, lng: 107.6191 },
  { name: "Yogyakarta, D.I. Yogyakarta", lat: -7.7956, lng: 110.3695 },
];

// Helper: Reverse Geocoding using Nominatim OpenStreetMap API with offline Haversine distance fallback
async function reverseGeocodeArea(lat: number, lng: number): Promise<string> {
  // 1. Attempt Nominatim OpenStreetMap API Reverse Geocoding
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
          return parts.slice(0, 3).join(", ");
        }
      }
    }
  } catch {
    // Ignore network error
  }

  // 2. Haversine distance fallback to nearest Indonesian city/district
  let minDistance = Infinity;
  let nearestRegion = "Purwokerto, Jawa Tengah";

  for (const region of INDONESIAN_REGIONS_GEO_LOOKUP) {
    const dLat = (region.lat - lat) * (Math.PI / 180);
    const dLng = (region.lng - lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) *
        Math.cos(region.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distKm = 6371 * c;

    if (distKm < minDistance) {
      minDistance = distKm;
      nearestRegion = region.name;
    }
  }

  return nearestRegion;
}

// Sub-component: Interactive Maplibre Map Pin Picker
function MapPinPicker({
  initialLat = -7.4243,
  initialLng = 109.2344,
  onPinSelect,
}: {
  initialLat?: number;
  initialLng?: number;
  onPinSelect: (areaName: string, lat: number, lng: number) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });
  const [selectedArea, setSelectedArea] = useState<string>("Memuat titik lokasi...");
  const [loadingArea, setLoadingArea] = useState(false);

  // Initialize MapLibre
  useEffect(() => {
    let isMounted = true;

    import("maplibre-gl").then((maplibregl) => {
      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      try {
        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: "https://demotiles.maplibre.org/style.json",
          center: [initialLng, initialLat],
          zoom: 12,
        });

        // Add navigation controls (+ / - zoom)
        map.addControl(new maplibregl.NavigationControl(), "top-right");

        // Draggable Marker
        const marker = new maplibregl.Marker({
          color: "#C0392B", // Red pin
          draggable: true,
        })
          .setLngLat([initialLng, initialLat])
          .addTo(map);

        markerRef.current = marker;

        const updatePinPosition = async (lng: number, lat: number) => {
          setCurrentCoords({ lat, lng });
          setLoadingArea(true);
          const name = await reverseGeocodeArea(lat, lng);
          if (isMounted) {
            setSelectedArea(name);
            setLoadingArea(false);
          }
        };

        // Initial Geocode
        updatePinPosition(initialLng, initialLat);

        // On Marker Drag End
        marker.on("dragend", () => {
          const lngLat = marker.getLngLat();
          updatePinPosition(lngLat.lng, lngLat.lat);
        });

        // On Map Click (move marker to clicked point)
        map.on("click", (e: any) => {
          const { lng, lat } = e.lngLat;
          marker.setLngLat([lng, lat]);
          updatePinPosition(lng, lat);
        });

        mapRef.current = map;
      } catch {
        // Fallback
      }
    });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="relative w-full h-[280px] rounded-xl overflow-hidden border-2 border-ocean-900 shadow-sm">
        <div ref={mapContainerRef} className="w-full h-full" />
        <div className="absolute top-2 left-2 bg-ocean-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-lg backdrop-blur-xs shadow-md">
          🖱️ Geser Pin atau Klik di Peta untuk Memilih Titik
        </div>
      </div>

      <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1 text-xs">
        <span className="text-ink-400 font-semibold block text-[10px]">
          Nama Daerah dari Titik Terpilih:
        </span>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-ocean-900 shrink-0" />
          <strong className="text-ocean-900 font-extrabold text-sm">
            {loadingArea ? "Mencari Nama Daerah..." : selectedArea}
          </strong>
        </div>
      </div>

      <Button
        type="button"
        disabled={loadingArea}
        onClick={() => onPinSelect(selectedArea, currentCoords.lat, currentCoords.lng)}
        className="w-full h-12 bg-ocean-900 hover:bg-ocean-700 text-white font-extrabold text-sm rounded-xl shadow-md gap-2"
      >
        <CheckCircle2 className="w-4 h-4 text-sky-400" />
        <span>Gunakan Titik Lokasi Ini</span>
      </Button>
    </div>
  );
}

export function LocationSelector({
  locationLabel,
  onLocationChange,
  isSupplierForm = false,
  variant = "default",
}: LocationSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"gps" | "map" | "search">("gps");
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
        let errText = "Gagal mengambil posisi GPS. Silakan pilih titik di peta atau ketik nama daerah Anda.";
        if (error.code === error.PERMISSION_DENIED) {
          errText = "Izin lokasi ditolak. Silakan gunakan titik di peta atau ketik nama daerah Anda.";
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
          <div className="fixed inset-0 z-50 bg-ink-900/70 backdrop-blur-xs flex items-center justify-center p-4">
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
                      Gunakan nama daerah (Desa, Kecamatan, Kabupaten, atau Titik Peta)
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

              {/* Mode Tabs: GPS / Interactive Map / Search */}
              <div className="flex border-b border-ink-200 bg-sky-50 px-4 pt-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("gps")}
                  className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === "gps"
                      ? "border-ocean-900 text-ocean-900"
                      : "border-transparent text-ink-600 hover:text-ink-900"
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
                  <span>1. GPS Otomatis</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("map")}
                  className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === "map"
                      ? "border-ocean-900 text-ocean-900"
                      : "border-transparent text-ink-600 hover:text-ink-900"
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5 text-danger-600" />
                  <span>2. Titik di Peta (Map)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("search")}
                  className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === "search"
                      ? "border-ocean-900 text-ocean-900"
                      : "border-transparent text-ink-600 hover:text-ink-900"
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-ocean-900" />
                  <span>3. Ketik Nama Daerah</span>
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 space-y-5">
                
                {/* TAB 1: GPS Auto Detect */}
                {activeTab === "gps" && (
                  <div className="space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDetectGPS}
                      disabled={loading}
                      className="w-full h-13 bg-sky-50 hover:bg-sky-100 border-2 border-ocean-900 text-ocean-900 font-extrabold text-sm gap-2 rounded-xl"
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

                    {statusMsg && (
                      <div
                        className={`flex items-start gap-2 p-3.5 rounded-xl text-xs font-bold ${
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
                  </div>
                )}

                {/* TAB 2: Interactive Map Point Picker */}
                {activeTab === "map" && (
                  <MapPinPicker
                    initialLat={-7.4243}
                    initialLng={109.2344}
                    onPinSelect={(areaName, lat, lng) => {
                      onLocationChange(areaName, lat, lng);
                      setTempLocationInput(areaName);
                      setIsModalOpen(false);
                    }}
                  />
                )}

                {/* TAB 3: Search Input Manual */}
                {activeTab === "search" && (
                  <div className="space-y-4">
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

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-ink-700 block">
                        Pilih Cepat Daerah Pesisir Utama:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {INDONESIAN_REGIONS_GEO_LOOKUP.map((hub) => (
                          <button
                            key={hub.name}
                            type="button"
                            onClick={() => {
                              setTempLocationInput(hub.name);
                              onLocationChange(hub.name, hub.lat, hub.lng);
                              setIsModalOpen(false);
                            }}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                              tempLocationInput === hub.name
                                ? "bg-ocean-900 text-white border-ocean-900"
                                : "bg-ink-100 hover:bg-sky-100 text-ink-900 border-ink-200"
                            }`}
                          >
                            {hub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

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
    <div className="space-y-4 bg-white p-5 rounded-2xl border-2 border-ink-200 shadow-xs">
      <label className="block text-sm font-extrabold text-ink-900">
        {isSupplierForm ? "Lokasi Dermaga / Pelabuhan / Tambak" : "Lokasi Usaha / Restoran / Hotel"}{" "}
        <span className="text-danger-600">*</span>
      </label>

      {/* Mode Tabs */}
      <div className="flex border-b border-ink-200 pb-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("gps")}
          className={`pb-1 px-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "gps"
              ? "border-ocean-900 text-ocean-900"
              : "border-transparent text-ink-600 hover:text-ink-900"
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
          <span>GPS Otomatis</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("map")}
          className={`pb-1 px-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "map"
              ? "border-ocean-900 text-ocean-900"
              : "border-transparent text-ink-600 hover:text-ink-900"
          }`}
        >
          <MapIcon className="w-3.5 h-3.5 text-danger-600" />
          <span>Titik di Peta (Maps)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("search")}
          className={`pb-1 px-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "search"
              ? "border-ocean-900 text-ocean-900"
              : "border-transparent text-ink-600 hover:text-ink-900"
          }`}
        >
          <Search className="w-3.5 h-3.5 text-ocean-900" />
          <span>Ketik Manual</span>
        </button>
      </div>

      {activeTab === "gps" && (
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleDetectGPS}
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 border-2 border-ocean-900 text-ocean-900 hover:bg-sky-50 font-extrabold text-sm rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-ocean-900" />
                <span>Mendeteksi Nama Daerah...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 text-sky-500 fill-sky-500" />
                <span>📍 Deteksi Nama Daerah Saya via GPS</span>
              </>
            )}
          </Button>

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
        </div>
      )}

      {activeTab === "map" && (
        <MapPinPicker
          initialLat={-7.4243}
          initialLng={109.2344}
          onPinSelect={(areaName, lat, lng) => {
            onLocationChange(areaName, lat, lng);
            setStatusMsg({
              type: "success",
              text: `Titik peta terpilih: ${areaName}`,
            });
          }}
        />
      )}

      {activeTab === "search" && (
        <div className="space-y-3">
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
                  ? "contoh: Purwokerto, Jawa Tengah"
                  : "contoh: Kecamatan Purwokerto Selatan, Banyumas"
              }
              className="block w-full pl-11 pr-4 rounded-xl border-2 border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 outline-none text-sm h-12 font-semibold"
              required
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {INDONESIAN_REGIONS_GEO_LOOKUP.map((hub) => (
              <button
                key={hub.name}
                type="button"
                onClick={() => onLocationChange(hub.name, hub.lat, hub.lng)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                  locationLabel === hub.name
                    ? "bg-ocean-900 text-white border-ocean-900"
                    : "bg-ink-100 hover:bg-sky-100 text-ink-900 border-ink-200"
                }`}
              >
                {hub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-ink-700 pt-1">
        Nama daerah digunakan untuk mencocokkan kesegaran hasil laut dan memperhitungkan jarak pengiriman terdekat.
      </p>
    </div>
  );
}
