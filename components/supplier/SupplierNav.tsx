"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Anchor, Package, ShoppingBag, User, TrendingUp, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SupplierNav() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/supplier/beranda", label: "Beranda", icon: Anchor },
    { href: "/supplier/stok-saya", label: "Stok Saya", icon: Package },
    { href: "/supplier/pesanan-masuk", label: "Pesanan Masuk", icon: ShoppingBag },
    { href: "/supplier/profil", label: "Profil & Lokasi", icon: User },
    { href: "/supplier/perkiraan-pendapatan", label: "Pendapatan", icon: TrendingUp },
  ];

  const handleLogout = async () => {
    document.cookie = "fishlink_mock_role=; path=/; max-age=0";
    document.cookie = "fishlink_mock_name=; path=/; max-age=0";
    document.cookie = "fishlink_mock_business=; path=/; max-age=0";
    document.cookie = "fishlink_mock_location=; path=/; max-age=0";
    document.cookie = "fishlink_mock_phone=; path=/; max-age=0";
    document.cookie = "fishlink_mock_supplier_type=; path=/; max-age=0";

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }

    router.push("/login");
  };

  return (
    <header className="bg-ocean-900 text-white sticky top-0 z-50 shadow-md">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/supplier/beranda" className="flex items-center gap-2 font-bold text-lg text-white">
          <img
            src="/logo.png"
            alt="Fishlink Logo"
            className="h-8 w-auto object-contain brightness-0 invert"
          />
          <span>Fishlink <span className="text-xs text-sky-200 font-normal">Mitra Supplier</span></span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Big Touch CTA to Add Stock */}
          <Link href="/supplier/stok-saya/tambah">
            <button
              type="button"
              className="bg-sky-400 hover:bg-sky-200 text-ink-900 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all min-h-[44px]"
            >
              <span>Tambah Stok Baru</span>
            </button>
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="bg-danger-600/90 hover:bg-danger-600 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all min-h-[44px]"
            title="Keluar dari Akun Supplier"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>

      {/* Navigation Links Bar */}
      <div className="bg-ocean-950/80 border-t border-ocean-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex justify-around sm:justify-start gap-1 sm:gap-6 overflow-x-auto py-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/supplier/beranda" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[44px] ${
                  isActive
                    ? "bg-sky-400 text-ink-900 font-extrabold"
                    : "text-sky-100 hover:bg-ocean-700 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
