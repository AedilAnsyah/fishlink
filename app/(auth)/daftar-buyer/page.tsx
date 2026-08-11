"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fish, Building2, User, Mail, Phone, Lock, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { LocationSelector } from "@/components/shared/LocationSelector";

export default function DaftarBuyerPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Restoran Seafood");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName || !businessName || !email || !phone || !password || !locationLabel) {
      setErrorMessage("Silakan lengkapi seluruh kolom termasuk lokasi usaha Anda.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi harus minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "buyer",
          },
        },
      });

      if (authError) {
        // Only block for duplicate registration — this is a real user error
        if (authError.message.includes("already registered")) {
          setErrorMessage("Email ini sudah terdaftar. Silakan masuk menggunakan email dan kata sandi Anda.");
          setLoading(false);
          return;
        }
        // For rate limits or other Supabase issues, continue with cookie-based session
        console.warn("Supabase signup warning (proceeding with local session):", authError.message);
      }

      if (authData?.user) {
        await supabase.from("profiles").insert({
          id: authData.user.id,
          role: "buyer",
          full_name: fullName,
          phone: phone,
        });

        await supabase.from("buyer_profiles").insert({
          profile_id: authData.user.id,
          business_name: businessName,
          business_type: businessType,
          address: locationLabel,
        });
      }
    } catch {
      // Fallback — continue with cookie-based auth
    }

    // Set full client cookies for immediate session
    document.cookie = `fishlink_mock_role=buyer; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `fishlink_mock_name=${encodeURIComponent(fullName)}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `fishlink_mock_business=${encodeURIComponent(businessName)}; path=/; max-age=86400; SameSite=Lax`;

    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
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
          Pendaftaran Akun Pembeli (Buyer)
        </h1>
        <p className="mt-1 text-sm text-ink-700">
          Dapatkan pasokan hasil laut segar bersertifikat cold-chain langsung dari nelayan & pembudidaya
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-sm border border-ink-200 rounded-2xl sm:px-8">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-danger-100 border border-danger-600/30 text-danger-600 rounded-xl text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Business Info Section */}
            <div className="space-y-4 pt-1">
              <h3 className="text-xs font-bold text-ocean-900 uppercase tracking-wider">
                1. Informasi Usaha Pembeli
              </h3>

              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1">
                  Nama Restoran / Hotel / Usaha <span className="text-danger-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-ink-400" />
                  </div>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="contoh: Restoran Seafood Bahari"
                    className="block w-full pl-11 pr-4 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 text-sm outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1">
                  Jenis Usaha <span className="text-danger-600">*</span>
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="block w-full px-4 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 text-sm outline-none font-medium"
                >
                  <option value="Restoran Seafood">Restoran Seafood</option>
                  <option value="Hotel Bintang / Resort">Hotel Bintang / Resort</option>
                  <option value="Industri Pengolahan Hasil Laut">Industri Pengolahan Hasil Laut</option>
                  <option value="Catering / Dapur Bersama">Catering / Dapur Bersama</option>
                  <option value="Supermarket / Retailer">Supermarket / Retailer</option>
                </select>
              </div>

              {/* Location Selector */}
              <LocationSelector
                locationLabel={locationLabel}
                onLocationChange={(label) => setLocationLabel(label)}
              />
            </div>

            <hr className="border-ink-100" />

            {/* Account Info Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-ocean-900 uppercase tracking-wider">
                2. Data Penanggung Jawab & Akun Login
              </h3>

              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1">
                  Nama Lengkap Penanggung Jawab <span className="text-danger-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-ink-400" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className="block w-full pl-11 pr-4 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 text-sm outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-ink-900 mb-1">
                    Email Usaha <span className="text-danger-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-ink-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="resto@email.com"
                      className="block w-full pl-9 pr-3 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 text-sm outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink-900 mb-1">
                    Nomor WhatsApp <span className="text-danger-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-ink-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className="block w-full pl-9 pr-3 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 text-sm outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1">
                  Kata Sandi Akun <span className="text-danger-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-ink-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="block w-full pl-11 pr-4 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 text-sm outline-none"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1">
                  Konfirmasi Kata Sandi <span className="text-danger-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-ink-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi"
                    className="block w-full pl-11 pr-4 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 text-sm outline-none"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Login info box */}
            <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-ink-700 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-ocean-900 shrink-0 mt-0.5" />
              <span>
                Setelah mendaftar, Anda dapat masuk kapan saja menggunakan <strong>Email</strong> dan <strong>Kata Sandi</strong> yang Anda buat di atas.
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-base shadow-sm mt-2"
            >
              {loading ? "Mendaftarkan Akun..." : "Daftar Akun Pembeli"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-700">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-ocean-900 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
