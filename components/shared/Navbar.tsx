"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Anchor,
  ChevronRight,
  LogOut,
  Building2,
  User,
  ShoppingBag,
  LayoutDashboard,
  Fish,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState<"buyer" | "supplier" | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userBusiness, setUserBusiness] = useState<string>("");

  useEffect(() => {
    // Read mock role cookies or Supabase auth session
    function checkAuth() {
      const cookies = document.cookie.split(";").reduce((acc, c) => {
        const [k, v] = c.trim().split("=");
        if (k && v) acc[k] = decodeURIComponent(v);
        return acc;
      }, {} as Record<string, string>);

      if (cookies.fishlink_mock_role === "buyer" || cookies.fishlink_mock_role === "supplier") {
        setRole(cookies.fishlink_mock_role as "buyer" | "supplier");
        setUserName(cookies.fishlink_mock_name || (cookies.fishlink_mock_role === "supplier" ? "Pak Udung" : "Bambang Hartono"));
        setUserBusiness(cookies.fishlink_mock_business || (cookies.fishlink_mock_role === "supplier" ? "Tangkapan Pak Udung" : "Restoran Seafood Bahari"));
        return;
      }

      // Supabase auth fallback check
      try {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            setRole("buyer");
            setUserName(user.user_metadata?.full_name || user.email || "Pengguna");
          }
        });
      } catch {
        // Not logged in
      }
    }

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    // Clear cookies
    document.cookie = "fishlink_mock_role=; path=/; max-age=0";
    document.cookie = "fishlink_mock_name=; path=/; max-age=0";
    document.cookie = "fishlink_mock_business=; path=/; max-age=0";

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }

    setRole(null);
    setUserName("");
    setUserBusiness("");
    router.push("/login");
  };

  const publicNavLinks = [
    { href: "/", label: "Beranda" },
    { href: "/tentang", label: "Tentang Kami" },
    { href: "/mitra-supplier", label: "Untuk Mitra Supplier" },
    { href: "/kontak", label: "Kontak" },
  ];

  const buyerNavLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/katalog", label: "Katalog Ikan" },
    { href: "/custom-order", label: "Custom Order" },
    { href: "/keranjang", label: "Keranjang" },
    { href: "/langganan", label: "Paket Langganan" },
  ];

  const navLinks = role === "buyer" ? buyerNavLinks : publicNavLinks;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-ink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={role === "supplier" ? "/supplier/beranda" : role === "buyer" ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="Fishlink Logo"
              className="h-9 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-ocean-900 leading-none">
                Fishlink
              </span>
              <span className="text-[10px] text-ink-700 font-medium tracking-wide mt-0.5">
                Marketplace Hasil Laut B2B
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-ocean-900 font-bold border-b-2 border-ocean-900 py-5"
                      : "text-ink-700 hover:text-ocean-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Logged-In Status OR Guest Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {role ? (
              <div className="flex items-center gap-3 pl-2 border-l border-ink-200">
                {/* User Info Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200">
                  <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center text-xs font-bold ${role === "supplier" ? "bg-success-600" : "bg-ocean-900"}`}>
                    {role === "supplier" ? <Anchor className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-ink-900 leading-tight">
                      {userName}
                    </p>
                    <p className="text-[10px] text-ink-600 font-medium">
                      {role === "supplier" ? "Mitra Supplier" : userBusiness || "Pembeli B2B"}
                    </p>
                  </div>
                </div>

                {role === "supplier" && (
                  <Link href="/supplier/beranda">
                    <Button size="sm" variant="outline" className="border-success-600 text-success-600 hover:bg-success-50 font-bold text-xs gap-1 h-9">
                      <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard Supplier
                    </Button>
                  </Link>
                )}

                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-danger-600/30 text-danger-600 hover:bg-danger-100 font-bold text-xs gap-1.5 h-9"
                  title="Keluar dari Akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-ocean-900">
                    Masuk
                  </Button>
                </Link>

                <Link href="/daftar-supplier">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-ocean-900 text-ocean-900 hover:bg-sky-50 font-bold text-xs gap-1.5"
                  >
                    <Anchor className="w-3.5 h-3.5 text-ocean-900" />
                    Mitra Nelayan
                  </Button>
                </Link>

                <Link href="/daftar-buyer">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-xs shadow-sm"
                  >
                    Daftar Pembeli
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-ink-900 hover:bg-ink-100 focus:outline-none"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-ink-200 px-4 pt-2 pb-6 space-y-3">
          {role && (
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg text-white flex items-center justify-center text-xs font-bold ${role === "supplier" ? "bg-success-600" : "bg-ocean-900"}`}>
                  {role === "supplier" ? <Anchor className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-ink-900">{userName}</p>
                  <p className="text-[10px] text-ink-600">{userBusiness || (role === "supplier" ? "Mitra Supplier" : "Pembeli B2B")}</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-ocean-900 text-white uppercase">
                {role}
              </span>
            </div>
          )}

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-medium flex items-center justify-between ${
                  pathname === link.href
                    ? "bg-sky-50 text-ocean-900 font-bold"
                    : "text-ink-900 hover:bg-ink-100"
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-ink-400" />
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-ink-100 flex flex-col gap-2.5">
            {role ? (
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                variant="outline"
                className="w-full h-11 border-danger-600/30 text-danger-600 font-bold gap-2"
              >
                <LogOut className="w-4 h-4" />
                Keluar dari Akun ({userName})
              </Button>
            ) : (
              <>
                <Link href="/daftar-buyer" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full h-11 bg-ocean-900 hover:bg-ocean-700 text-white font-bold">
                    Daftar Sebagai Pembeli (Restoran/Hotel)
                  </Button>
                </Link>
                <Link href="/daftar-supplier" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-11 border-ocean-900 text-ocean-900 font-bold gap-2">
                    <Anchor className="w-4 h-4" />
                    Daftar Sebagai Mitra Nelayan
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full h-11 text-ink-900 font-semibold">
                    Masuk ke Akun
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
