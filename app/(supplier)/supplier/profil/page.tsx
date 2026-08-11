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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const SUPPLIER_TYPE_LABELS: Record<string, string> = {
  nelayan_perorangan: "Nelayan Perorangan (Pancing / Jaring Skala Kecil)",
  nelayan_besar: "Nelayan Besar / Kapal Tangkap Samudra",
  pembudidaya: "Pembudidaya Tambak (Udang / Ikan Air Payau)",
};

export default function ProfilSupplierPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [supplierTypeKey, setSupplierTypeKey] = useState("nelayan_perorangan");
  const [addressLabel, setAddressLabel] = useState("");
  const [isTrustedBadge, setIsTrustedBadge] = useState(true);

  const [certType, setCertType] = useState("anti_overfishing");
  const [certUploaded, setCertUploaded] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [saving, setSaving] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Initialize data from cookies & Supabase
  useEffect(() => {
    const cookies = document.cookie.split(";").reduce((acc, c) => {
      const [k, v] = c.trim().split("=");
      if (k && v) acc[k] = decodeURIComponent(v);
      return acc;
    }, {} as Record<string, string>);

    if (cookies.fishlink_mock_name) setFullName(cookies.fishlink_mock_name);
    if (cookies.fishlink_mock_phone) setPhone(cookies.fishlink_mock_phone);
    if (cookies.fishlink_mock_location) setAddressLabel(cookies.fishlink_mock_location);
    if (cookies.fishlink_mock_supplier_type) setSupplierTypeKey(cookies.fishlink_mock_supplier_type);

    // Also fetch from Supabase if authenticated
    async function loadSupabaseProfile() {
      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", userData.user.id)
            .single();

          if (profile) {
            if (profile.full_name) setFullName(profile.full_name);
            if (profile.phone) setPhone(profile.phone);
          }

          const { data: supp } = await supabase
            .from("suppliers")
            .select("address_label, supplier_type")
            .eq("profile_id", userData.user.id)
            .single();

          if (supp) {
            if (supp.address_label) setAddressLabel(supp.address_label);
            if (supp.supplier_type) setSupplierTypeKey(supp.supplier_type);
          }
        }
      } catch {
        // Fallback to cookie values
      }
    }

    loadSupabaseProfile();
  }, []);

  // Initialize MapLibre GL Map
  useEffect(() => {
    let isMounted = true;
    import("maplibre-gl").then((maplibregl) => {
      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      try {
        const initialCenter: [number, number] = [109.2344, -7.4243]; // Default Jawa Tengah / Pesisir

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: "https://demotiles.maplibre.org/style.json",
          center: initialCenter,
          zoom: 12,
        });

        const marker = new maplibregl.Marker({ color: "#135A86" })
          .setLngLat(initialCenter)
          .setPopup(
            new maplibregl.Popup().setHTML(
              `<b>${fullName || "Mitra Supplier"}</b><br/>${addressLabel || "Dermaga Terdaftar"}`
            )
          )
          .addTo(map);

        mapRef.current = map;
        markerRef.current = marker;
      } catch {
        // Fallback if WebGL unavailable
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

  // Update map popup and center when address or name changes
  const handleLocationChange = (newLabel: string) => {
    setAddressLabel(newLabel);
    if (markerRef.current) {
      markerRef.current.setPopup(
        new (window as any).maplibregl.Popup().setHTML(
          `<b>${fullName || "Mitra Supplier"}</b><br/>${newLabel}`
        )
      );
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Save to cookies
    document.cookie = `fishlink_mock_name=${encodeURIComponent(fullName)}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `fishlink_mock_phone=${encodeURIComponent(phone)}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `fishlink_mock_location=${encodeURIComponent(addressLabel)}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `fishlink_mock_supplier_type=${encodeURIComponent(supplierTypeKey)}; path=/; max-age=86400; SameSite=Lax`;

    // Also persist to Supabase if authenticated
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            phone: phone,
          })
          .eq("id", userData.user.id);

        await supabase
          .from("suppliers")
          .update({
            address_label: addressLabel,
            supplier_type: supplierTypeKey,
          })
          .eq("profile_id", userData.user.id);
      }
    } catch {
      // Ignore
    }

    setSaving(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
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
            <div className="p-4 bg-success-100 border-2 border-success-600 rounded-2xl text-success-600 font-bold text-sm text-center flex items-center justify-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>Profil & Titik Lokasi Peta Berhasil Diperbarui!</span>
            </div>
          )}

          {/* Form Profil & Map Selector */}
          <form
            onSubmit={handleSaveProfile}
            className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-ocean-900 shadow-sm space-y-6"
          >
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
                    placeholder="Nama Anda"
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
                    placeholder="081234567890"
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
                  value={SUPPLIER_TYPE_LABELS[supplierTypeKey] || "Nelayan Perorangan"}
                  disabled
                  className="w-full px-4 h-12 rounded-xl border border-ink-200 bg-ink-100 font-bold text-ink-700 text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Map & Geolocation Selector */}
            <div className="space-y-4 pt-2">
              <h3 className="font-extrabold text-ink-900 text-lg border-b border-ink-100 pb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-ocean-900" />
                2. Lokasi Dermaga / Tambak / Pangkalan Nelayan
              </h3>

              <LocationSelector
                locationLabel={addressLabel}
                onLocationChange={handleLocationChange}
                isSupplierForm={true}
              />

              {/* Map Container */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-ink-900">
                  Peta Titik Dermaga Terdaftar:
                </label>
                <div
                  ref={mapContainerRef}
                  className="w-full h-64 rounded-2xl border-2 border-ocean-900 overflow-hidden bg-sky-50 shadow-inner relative"
                >
                  <div className="absolute top-2 left-2 z-10 bg-white/95 backdrop-blur-xs text-[11px] font-bold text-ocean-900 px-3 py-1.5 rounded-full border border-sky-200 flex items-center gap-1.5 shadow-sm">
                    <Navigation className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                    <span>Lokasi: {addressLabel || "Dermaga / Tambak Terpilih"}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full h-14 bg-ocean-900 hover:bg-ocean-700 text-white font-black text-lg rounded-2xl shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan Perubahan...
                </>
              ) : (
                "Simpan Perubahan Profil & Lokasi"
              )}
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
                <span>
                  Dokumen sertifikasi telah diunggah dan terverifikasi badge Mitra Terpercaya!
                </span>
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
                    <option value="anti_overfishing">
                      Sertifikat Alat Tangkap Ramah Lingkungan
                    </option>
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
                document.cookie = "fishlink_mock_location=; path=/; max-age=0";
                document.cookie = "fishlink_mock_phone=; path=/; max-age=0";
                document.cookie = "fishlink_mock_supplier_type=; path=/; max-age=0";
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
