"use client";

import React, { useState, useEffect, useRef } from "react";
import { SupplierNav } from "@/components/supplier/SupplierNav";
import { Footer } from "@/components/shared/Footer";
import { LocationSelector } from "@/components/shared/LocationSelector";
import {
  User,
  Phone,
  Anchor,
  MapPin,
  ShieldCheck,
  Upload,
  CheckCircle2,
  Award,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilSupplierPage() {
  const [fullName, setFullName] = useState("Pak Udung");
  const [supplierTypeLabel, setSupplierTypeLabel] = useState("Nelayan Perorangan");
  const [phone, setPhone] = useState("081234567890");
  const [addressLabel, setAddressLabel] = useState("Depo Seafood Purwokerto, Jawa Tengah");
  const [isTrustedBadge, setIsTrustedBadge] = useState(true);

  const [certType, setCertType] = useState("anti_overfishing");
  const [certUploaded, setCertUploaded] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically load MapLibre GL JS
    let isMounted = true;
    import("maplibre-gl").then((maplibregl) => {
      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      try {
        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: "https://demotiles.maplibre.org/style.json", // Open free tiles
          center: [109.2344, -7.4243], // Muara Angke coordinates
          zoom: 13,
        });

        new maplibregl.Marker({ color: "#135A86" })
          .setLngLat([109.2344, -7.4243])
          .setPopup(new maplibregl.Popup().setHTML("<b>Pak Udung - Depo Purwokerto</b>"))
          .addTo(map);

        mapRef.current = map;
      } catch {
        // Fallback map container display if webgl unsupported
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleUploadCert = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCertUploaded(true);
      setIsTrustedBadge(true);
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans supplier-body-text">
      <SupplierNav />

      <section className="py-8 flex-1">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 flex items-center gap-2">
              <User className="w-7 h-7 text-ocean-900" />
              Profil & Lokasi Peta Dermaga
            </h1>
            {isTrustedBadge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-success-100 text-success-600 border border-success-600/30">
                <ShieldCheck className="w-4 h-4" /> Mitra Terpercaya Verified
              </span>
            )}
          </div>

          {saveToast && (
            <div className="p-4 bg-success-100 border-2 border-success-600 rounded-2xl text-success-600 font-bold text-sm text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Profil & Titik Lokasi Peta Berhasil Diperbarui!</span>
            </div>
          )}

          {/* Form Profil & Map Selector */}
          <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-ocean-900 shadow-sm space-y-6">
            
            <div className="space-y-4">
              <h3 className="font-extrabold text-ink-900 text-lg border-b border-ink-100 pb-2">
                1. Data Diri & Usaha Nelayan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-ink-900 mb-1">
                    Nama Lengkap / Panggilan:
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 h-12 rounded-xl border border-ink-200 bg-white font-bold text-ink-900 text-base focus:border-ocean-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink-900 mb-1">
                    Nomor WhatsApp / Telepon:
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 h-12 rounded-xl border border-ink-200 bg-white font-bold text-ink-900 text-base focus:border-ocean-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink-900 mb-1">
                  Kategori Mitra:
                </label>
                <input
                  type="text"
                  value={supplierTypeLabel}
                  disabled
                  className="w-full px-4 h-12 rounded-xl border border-ink-200 bg-ink-100 font-bold text-ink-700 text-base outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Map & Geolocation Selector */}
            <div className="space-y-4 pt-2">
              <h3 className="font-extrabold text-ink-900 text-lg border-b border-ink-100 pb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-ocean-900" />
                2. Penanda Lokasi di Peta Pesisir (MapLibre GL JS)
              </h3>

              <LocationSelector
                locationLabel={addressLabel}
                onLocationChange={(label) => setAddressLabel(label)}
                isSupplierForm={true}
              />

              {/* Map Container */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-ink-900">
                  Peta Titik Dermaga Terdeteksi:
                </label>
                <div
                  ref={mapContainerRef}
                  className="w-full h-64 rounded-2xl border-2 border-ocean-900 overflow-hidden bg-sky-50 shadow-inner relative"
                >
                  <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-xs text-[11px] font-bold text-ocean-900 px-3 py-1 rounded-full border border-sky-200 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                    Titik GPS: -7.4243, 109.2344 (Purwokerto)
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-ocean-900 hover:bg-ocean-700 text-white font-black text-lg rounded-2xl shadow-sm"
            >
              Simpan Perubahan Profil & Lokasi
            </Button>
          </form>

          {/* Section Upload Sertifikasi (GAP / Anti-Overfishing) */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-ink-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-ink-100 pb-3">
              <Award className="w-6 h-6 text-ocean-900" />
              <div>
                <h3 className="font-extrabold text-ink-900 text-lg">
                  Sertifikasi & Badge &ldquo;Mitra Terpercaya&rdquo;
                </h3>
                <p className="text-xs text-ink-700">
                  Unggah sertifikat GAP (Cara Budidaya yang Baik) atau bukti pancing anti-overfishing untuk meningkatkan kepercayaan pembeli restoran.
                </p>
              </div>
            </div>

            {certUploaded ? (
              <div className="p-4 bg-success-100 border border-success-600/30 rounded-xl text-xs font-bold text-success-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Dokumen sertifikasi telah diunggah dan terverifikasi badge Mitra Terpercaya!</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink-900 mb-1">
                    Pilih Jenis Sertifikat:
                  </label>
                  <select
                    value={certType}
                    onChange={(e) => setCertType(e.target.value)}
                    className="w-full px-3.5 h-11 rounded-xl border border-ink-200 bg-white text-ink-900 text-xs font-bold outline-none"
                  >
                    <option value="anti_overfishing">Sertifikat Alat Tangkap Ramah Lingkungan</option>
                    <option value="gap">Good Aquaculture Practice (GAP / CBIB)</option>
                    <option value="lainnya">Sertifikat Kebersihan / Sanitasi KKP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-900 mb-1">
                    Unggah File Foto / PDF:
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleUploadCert}
                    className="block w-full text-xs text-ink-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-ocean-900 file:text-white hover:file:bg-ocean-700 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Logout Card */}
            <div className="bg-white p-6 rounded-2xl border border-danger-600/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-ink-900 text-base">Keluar dari Akun Supplier</h4>
                <p className="text-xs text-ink-700 mt-0.5">
                  Selesaikan sesi masuk Anda jika sedang menggunakan perangkat bersama.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  document.cookie = "fishlink_mock_role=; path=/; max-age=0";
                  document.cookie = "fishlink_mock_name=; path=/; max-age=0";
                  document.cookie = "fishlink_mock_business=; path=/; max-age=0";
                  window.location.href = "/login";
                }}
                className="w-full sm:w-auto bg-danger-600 hover:bg-danger-700 text-white font-bold text-xs h-11 px-6 rounded-xl"
              >
                Keluar Akun (Logout)
              </Button>
            </div>

          </div>
        </section>

        <Footer />
      </div>
    );
}
