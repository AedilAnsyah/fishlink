"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ShieldCheck, Fish, Building2, Anchor, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

/* ──────────────────────────────────────────────────────────────
   Test Accounts (mock) — masing-masing 1 akun per role
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Login with test account or Supabase auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Silakan isi email dan kata sandi Anda.");
      return;
    }

    setLoading(true);

    // Check against test accounts first
    const matchedAccount = Object.values(TEST_ACCOUNTS).find(
      (acc) => acc.email === email.toLowerCase() && acc.password === password
    );

    if (matchedAccount) {
      // Set mock role cookie for middleware
      document.cookie = `fishlink_mock_role=${matchedAccount.role}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `fishlink_mock_name=${encodeURIComponent(matchedAccount.name)}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `fishlink_mock_business=${encodeURIComponent(matchedAccount.business)}; path=/; max-age=86400; SameSite=Lax`;

      // Small delay for UX
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

    // Try Supabase Auth if not a test account
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage("Email atau kata sandi salah. Gunakan akun test di bawah untuk demo.");
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        const role = profile?.role || "buyer";
        if (redirectPath) {
          router.push(redirectPath);
        } else if (role === "supplier") {
          router.push("/supplier/beranda");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setErrorMessage("Email atau kata sandi salah. Gunakan akun test di bawah untuk demo.");
    }

    setLoading(false);
  };

  // Quick fill test account credentials
  const fillTestAccount = (role: "buyer" | "supplier") => {
    const account = TEST_ACCOUNTS[role];
    setEmail(account.email);
    setPassword(account.password);
    setErrorMessage("");
  };

  // Quick demo login (skip form)
  const handleQuickDemoLogin = (role: "buyer" | "supplier") => {
    const account = TEST_ACCOUNTS[role];
    document.cookie = `fishlink_mock_role=${account.role}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `fishlink_mock_name=${encodeURIComponent(account.name)}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `fishlink_mock_business=${encodeURIComponent(account.business)}; path=/; max-age=86400; SameSite=Lax`;

    if (account.role === "supplier") {
      router.push("/supplier/beranda");
    } else {
      router.push("/dashboard");
    }
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
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-ink-400" />
            </div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh: buyer@fishlink.id"
              className="block w-full pl-11 pr-4 py-2.5 h-12 rounded-[10px] border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-ocean-900 focus:ring-2 focus:ring-ocean-900/20 text-sm outline-none"
            />
          </div>
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
