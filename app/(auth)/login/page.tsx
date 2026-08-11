"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Phone, ShieldCheck, Fish, Building2, Anchor, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginAccount } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check if identifier looks like an email or phone number
  const isPhone = (str: string) => /^[0-9+\-\s]{8,}$/.test(str.replace(/\s/g, ""));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const identifier = loginIdentifier.trim();

    if (!identifier || !password) {
      setErrorMessage("Silakan isi email/nomor HP dan kata sandi Anda.");
      return;
    }

    setLoading(true);

    try {
      const result = await loginAccount(identifier, password);

      if (!result.success || !result.user) {
        setErrorMessage(
          result.error || "Email/Nomor HP atau kata sandi salah. Silakan periksa kembali."
        );
        setLoading(false);
        return;
      }

      // Small delay for smooth UX transition
      await new Promise((r) => setTimeout(r, 400));
      setLoading(false);

      if (redirectPath) {
        router.push(redirectPath);
      } else if (result.user.role === "supplier") {
        router.push("/supplier/beranda");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan saat masuk. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow-sm border border-ink-200 rounded-2xl sm:px-10">
      {/* Login Form */}
      <form className="space-y-5" onSubmit={handleLogin}>
        {errorMessage && (
          <div className="p-3.5 bg-danger-100 border border-danger-600/30 text-danger-600 rounded-xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-ink-900 mb-1">
            Email atau Nomor HP <span className="text-danger-600">*</span>
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
              required
            />
          </div>
          <p className="text-[11px] text-ink-400 mt-1">
            Masukkan email atau nomor HP yang Anda gunakan saat mendaftar.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink-900 mb-1">
            Kata Sandi <span className="text-danger-600">*</span>
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
              required
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
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Memproses Masuk...
            </span>
          ) : (
            "Masuk ke Akun"
          )}
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
            Daftar Mitra (Nelayan/Tambak)
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
