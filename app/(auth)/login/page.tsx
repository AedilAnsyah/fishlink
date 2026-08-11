"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Phone, ShieldCheck, Fish, Building2, Anchor, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

/* ──────────────────────────────────────────────────────────────
   Test / Demo Accounts — masing-masing 1 akun per role
   ────────────────────────────────────────────────────────────── */
const TEST_ACCOUNTS = {
  buyer: {
    email: "buyer@fishlink.id",
    password: "buyer123",
    name: "Bambang Hartono",
    business: "Restoran Seafood Bahari, Senopati",
    role: "buyer" as const,
  },
  supplier: {
    email: "supplier@fishlink.id",
    password: "supplier123",
    name: "Pak Udung",
    business: "Nelayan Pancing, Purwokerto",
    role: "supplier" as const,
  },
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Determine if identifier looks like an email or phone number
  const isEmail = (str: string) => str.includes("@");
  const isPhone = (str: string) => /^[0-9+\-\s]{8,}$/.test(str.replace(/\s/g, ""));

  // Convert phone number to the auto-generated email format used by supplier registration
  const phoneToEmail = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return `${digits}@supplier.fishlink.id`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const identifier = loginIdentifier.trim();

    if (!identifier || !password) {
      setErrorMessage("Silakan isi email/nomor HP dan kata sandi Anda.");
      return;
    }

    setLoading(true);

    // Check against test accounts first (by email)
    const matchedAccount = Object.values(TEST_ACCOUNTS).find(
      (acc) => acc.email === identifier.toLowerCase() && acc.password === password
    );

    if (matchedAccount) {
      document.cookie = `fishlink_mock_role=${matchedAccount.role}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `fishlink_mock_name=${encodeURIComponent(matchedAccount.name)}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `fishlink_mock_business=${encodeURIComponent(matchedAccount.business)}; path=/; max-age=86400; SameSite=Lax`;

      await new Promise((r) => setTimeout(r, 600));
      setLoading(false);

      if (redirectPath) {
        router.push(redirectPath);
      } else if (matchedAccount.role === "supplier") {
        router.push("/supplier/beranda");
      } else {
        router.push("/dashboard");
      }
      return;
    }

    // Determine the email to use for Supabase Auth
    let authEmail = identifier;
    if (isPhone(identifier)) {
      // If user typed a phone number, convert it to the auto-generated supplier email
      authEmail = phoneToEmail(identifier);
    }

    // Try Supabase Auth
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });

      if (error) {
        // If phone-based login failed, and identifier could be a phone, show helpful message
        if (isPhone(identifier)) {
          setErrorMessage("Nomor HP atau kata sandi salah. Pastikan Anda sudah terdaftar sebagai mitra.");
        } else {
          setErrorMessage("Email atau kata sandi salah. Silakan periksa kembali atau daftar akun baru.");
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        // Fetch user profile to determine role and set proper cookies
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, phone")
          .eq("id", data.user.id)
          .single();

        const role = profile?.role || "buyer";
        const fullName = profile?.full_name || data.user.user_metadata?.full_name || "Pengguna";

        // Fetch business name based on role
        let businessName = "";
        if (role === "buyer") {
          const { data: buyerProfile } = await supabase
            .from("buyer_profiles")
            .select("business_name")
            .eq("profile_id", data.user.id)
            .single();
          businessName = buyerProfile?.business_name || "Usaha Pembeli";
        } else if (role === "supplier") {
          const { data: supplierProfile } = await supabase
            .from("suppliers")
            .select("business_name")
            .eq("profile_id", data.user.id)
            .single();
          businessName = supplierProfile?.business_name || "Mitra Supplier";
        }

        // Set cookies for the app to recognize the logged-in user
        document.cookie = `fishlink_mock_role=${role}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `fishlink_mock_name=${encodeURIComponent(fullName)}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `fishlink_mock_business=${encodeURIComponent(businessName)}; path=/; max-age=86400; SameSite=Lax`;

        setLoading(false);

        if (redirectPath) {
          router.push(redirectPath);
        } else if (role === "supplier") {
          router.push("/supplier/beranda");
        } else {
          router.push("/dashboard");
        }
        return;
      }
    } catch {
      setErrorMessage("Terjadi kesalahan saat masuk. Silakan coba lagi.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white py-8 px-6 shadow-sm border border-ink-200 rounded-2xl sm:px-10">
      {/* Login Form */}
      <form className="space-y-5" onSubmit={handleLogin}>
        {errorMessage && (
          <div className="p-3 bg-danger-100 border border-danger-600/30 text-danger-600 rounded-lg text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-ink-900 mb-1">
            Email atau Nomor HP
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              {isPhone(loginIdentifier) ? (
                <Phone className="h-5 w-5 text-ink-400" />
              ) : (
                <Mail className="h-5 w-5 text-ink-400" />
              )}
            </div>
            <input
              type="text"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              placeholder="contoh: resto@email.com atau 081234567890"
              className="block w-full pl-11 pr-4 py-2.5 h-12 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 text-sm outline-none"
            />
          </div>
          <p className="text-[11px] text-ink-400 mt-1">
            Pembeli: gunakan email yang didaftarkan. Mitra Supplier: gunakan nomor HP WhatsApp.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink-900 mb-1">
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-ink-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="block w-full pl-11 pr-12 py-2.5 h-12 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-400 hover:text-ink-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-base shadow-sm"
        >
          {loading ? "Memproses Masuk..." : "Masuk ke Akun"}
        </Button>
      </form>

      <div className="mt-8 border-t border-ink-100 pt-6 text-center space-y-3">
        <p className="text-xs text-ink-700">Belum memiliki akun?</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/daftar-buyer"
            className="flex-1 py-2.5 px-3 border border-ink-200 rounded-[10px] text-xs font-semibold text-ocean-900 hover:bg-sky-50 text-center transition-colors"
          >
            Daftar Pembeli (Restoran/Hotel)
          </Link>
          <Link
            href="/daftar-supplier"
            className="flex-1 py-2.5 px-3 border border-ink-200 rounded-[10px] text-xs font-semibold text-ocean-900 hover:bg-sky-50 text-center transition-colors"
          >
            Daftar Mitra (Nelayan/Pembudidaya)
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-off-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-2xl font-bold text-ocean-900"
        >
          <img
            src="/logo.png"
            alt="Fishlink Logo"
            className="h-10 w-auto object-contain"
          />
          <span>Fishlink</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-ink-900 tracking-tight">
          Masuk ke Akun Fishlink
        </h2>
        <p className="mt-1.5 text-sm text-ink-700">
          Marketplace Hasil Laut B2B & Cold-Chain Traceability
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="bg-white p-8 rounded-2xl border border-ink-200 text-center text-ink-400">
              Memuat formulir masuk...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
