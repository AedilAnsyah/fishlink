"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Anchor,
  Package,
  ShoppingBag,
  User,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Camera,
  MapPin,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { clearSessionCookies } from "@/lib/auth";

export function SupplierNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Mitra Supplier");
  const [userBusiness, setUserBusiness] = useState("Usaha Hasil Laut");
  const [userLocation, setUserLocation] = useState("Pangkalan Nelayan");

  const links = [
    { href: "/supplier/beranda", label: "Beranda Utama", desc: "Ringkasan toko & order harian", icon: Anchor },
    { href: "/supplier/stok-saya", label: "Stok Saya", desc: "Kelola pasokan hasil laut di katalog", icon: Package },
    { href: "/supplier/pesanan-masuk", label: "Pesanan Masuk", desc: "Daftar order restoran & pengiriman", icon: ShoppingBag },
    { href: "/supplier/profil", label: "Profil & Lokasi Peta", desc: "Informasi diri & titik GPS dermaga", icon: User },
    { href: "/supplier/perkiraan-pendapatan", label: "Analitik Pendapatan", desc: "Proyeksi keuntungan & tren musiman", icon: TrendingUp },
  ];

  useEffect(() => {
    const cookies = document.cookie.split(";").reduce((acc, c) => {
      const [k, v] = c.trim().split("=");
      if (k && v) acc[k] = decodeURIComponent(v);
      return acc;
    }, {} as Record<string, string>);

    if (cookies.fishlink_mock_name) setUserName(cookies.fishlink_mock_name);
    if (cookies.fishlink_mock_business) setUserBusiness(cookies.fishlink_mock_business);
    if (cookies.fishlink_mock_location) setUserLocation(cookies.fishlink_mock_location);
  }, [pathname]);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    clearSessionCookies();
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    router.push("/login");
  };

  return (
    <>
      <header className="bg-ocean-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Left: Hamburger Button + Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-ocean-800/80 hover:bg-ocean-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400"
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            >
              {isOpen ? <X className="w-6 h-6 text-sky-400" /> : <Menu className="w-6 h-6 text-sky-400" />}
            </button>

            <Link href="/supplier/beranda" className="flex items-center gap-2.5 font-bold text-lg text-white">
              <img
                src="/logo.png"
                alt="Fishlink Logo"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <div className="flex flex-col">
                <span className="leading-none text-base font-extrabold tracking-tight">Fishlink</span>
                <span className="text-[10px] text-sky-300 font-medium tracking-wide uppercase">Mitra Supplier</span>
              </div>
            </Link>
          </div>

          {/* Center (Desktop only): Quick active page indicator */}
          <div className="hidden md:flex items-center gap-1.5 bg-ocean-950/60 px-3.5 py-1.5 rounded-full border border-ocean-700/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-sky-100 font-medium">Menu Aktif:</span>
            <span className="font-bold text-sky-300">
              {links.find((l) => pathname === l.href || (l.href !== "/supplier/beranda" && pathname.startsWith(l.href)))?.label || "Supplier"}
            </span>
          </div>

          {/* Right Actions: Quick Add Stock + Logout */}
          <div className="flex items-center gap-2.5">
            <Link href="/supplier/stok-saya/tambah">
              <button
                type="button"
                className="bg-sky-400 hover:bg-sky-300 text-ink-900 font-extrabold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4 text-ocean-900" />
                <span className="hidden xs:inline sm:inline">Pasang Stok</span>
                <span className="xs:hidden sm:hidden">Stok</span>
              </button>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-sky-200 hover:text-white hover:bg-danger-600/80 transition-colors"
              title="Keluar dari Akun"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-ocean-900 text-white h-full shadow-2xl flex flex-col z-10 border-r border-ocean-700 animate-slide-right">
            
            {/* Drawer Header with Profile Card */}
            <div className="p-5 bg-ocean-950 border-b border-ocean-700 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="Fishlink Logo"
                    className="h-7 w-auto object-contain brightness-0 invert"
                  />
                  <span className="font-extrabold text-base tracking-tight">Menu Mitra Supplier</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-ocean-800 text-sky-200 hover:text-white hover:bg-ocean-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Mini Badge */}
              <div className="p-3 bg-ocean-900/90 rounded-xl border border-ocean-700/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm truncate">{userName}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success-400 bg-success-950/80 px-2 py-0.5 rounded-full border border-success-600/30">
                    <ShieldCheck className="w-3 h-3" /> Aktif
                  </span>
                </div>
                <p className="text-xs text-sky-200 truncate">{userBusiness}</p>
                <p className="text-[11px] text-ink-300 flex items-center gap-1 truncate pt-0.5">
                  <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                  <span className="truncate">{userLocation}</span>
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-300 px-3 pb-1">
                Navigasi Menu
              </div>

              {links.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/supplier/beranda" && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-sky-400 text-ink-900 font-extrabold shadow-md"
                        : "text-sky-100 hover:bg-ocean-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isActive ? "bg-ocean-900 text-sky-400" : "bg-ocean-800 text-sky-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm leading-tight">{link.label}</div>
                        <div
                          className={`text-[11px] leading-normal ${
                            isActive ? "text-ink-800 font-medium" : "text-sky-300/70"
                          }`}
                        >
                          {link.desc}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 ${isActive ? "text-ink-900" : "text-sky-400/60"}`}
                    />
                  </Link>
                );
              })}

              {/* Dominant Quick CTA inside menu */}
              <div className="pt-3">
                <Link
                  href="/supplier/stok-saya/tambah"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full p-3.5 bg-gradient-to-r from-sky-400 to-sky-300 text-ink-900 font-extrabold text-sm rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all"
                >
                  <Camera className="w-5 h-5 text-ocean-900" />
                  <span>Pasang Stok Ikan Baru</span>
                </Link>
              </div>
            </nav>

            {/* Drawer Footer: Logout */}
            <div className="p-4 border-t border-ocean-700 bg-ocean-950">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 bg-danger-600/20 hover:bg-danger-600 text-danger-300 hover:text-white rounded-xl font-bold text-xs border border-danger-600/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun Supplier</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
