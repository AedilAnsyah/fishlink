"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Order, OrderStatus } from "@/types/database.types";
import { createClient } from "@/lib/supabase/client";
import { SEED_ORDERS } from "@/lib/supabase/seed-data";
import {
  Building2,
  ShoppingBag,
  QrCode,
  ArrowRight,
  Bell,
  Crown,
  Sparkles,
  RefreshCw,
  Plus,
  ChevronRight,
  Clock,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BuyerDashboardPage() {
  const [orders, setOrders] = useState<(Order & { itemSummary: string; supplierName: string })[]>([]);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [userName, setUserName] = useState("Pembeli Baru");
  const [userBusiness, setUserBusiness] = useState("Restoran / Usaha Pembeli");
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const cookies = document.cookie.split(";").reduce((acc, c) => {
      const [k, v] = c.trim().split("=");
      if (k && v) acc[k] = decodeURIComponent(v);
      return acc;
    }, {} as Record<string, string>);

    if (cookies.fishlink_mock_name) setUserName(cookies.fishlink_mock_name);
    if (cookies.fishlink_mock_business) setUserBusiness(cookies.fishlink_mock_business);

    // If demo test account, load SEED_ORDERS
    if (cookies.fishlink_mock_name === "Bambang Hartono" || !cookies.fishlink_mock_name) {
      setOrders(SEED_ORDERS);
      setUserName("Bambang Hartono");
      setUserBusiness("Restoran Seafood Bahari");
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "fishlink_mock_role=; path=/; max-age=0";
    document.cookie = "fishlink_mock_name=; path=/; max-age=0";
    document.cookie = "fishlink_mock_business=; path=/; max-age=0";
    window.location.href = "/login";
  };

  useEffect(() => {
    const supabase = createClient();

    // Fetch initial orders
    async function loadOrders() {
      setLoadingOrders(true);
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("buyer_id", userData.user.id)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          const mapped = data.map((o, idx) => ({
            ...o,
            itemSummary: "Pesanan Hasil Laut Segar",
            supplierName: "Mitra Supplier Fishlink",
          }));
          setOrders(mapped);
        }
      }
      setLoadingOrders(false);
    }
    loadOrders();

    // Supabase Realtime Subscription to orders table
    const channel = supabase
      .channel("buyer_orders_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          setIsRealtimeActive(true);
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as Order;
            setOrders((prev) =>
              prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o))
            );
          } else if (payload.eventType === "INSERT") {
            const newOrder = payload.new as Order;
            setOrders((prev) => [
              {
                ...newOrder,
                itemSummary: "Pesanan Baru Hasil Laut",
                supplierName: "Mitra Supplier Fishlink",
              },
              ...prev,
            ]);
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsRealtimeActive(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      {/* Profile & Subscription Banner */}
      <section className="bg-ocean-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-400 text-ink-900 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">{userBusiness}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ocean-900 bg-sky-200 px-2.5 py-0.5 rounded-full">
                  <Crown className="w-3.5 h-3.5 text-ocean-900" /> Premium Buyer
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                {userName} • Purwokerto, Jawa Tengah • Bebas Kuota Matching Lokasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isRealtimeActive && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-success-600 text-white animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> Supabase Realtime Aktif
              </span>
            )}
            <Link href="/katalog">
              <Button size="sm" className="bg-sky-400 hover:bg-sky-200 text-ink-900 font-bold text-xs gap-1.5">
                <Plus className="w-4 h-4" /> Pesan Ikan Baru
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-white/40 text-white hover:bg-ocean-800 font-bold text-xs gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </Button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Body */}
      <section className="py-8 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Orders List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-ink-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-ocean-900" />
                  Daftar Pesanan Saya
                </h2>
                <span className="text-xs text-ink-700 font-medium">
                  {orders.length} Total Pesanan
                </span>
              </div>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-ink-200 text-center space-y-4 shadow-xs">
                    <div className="w-16 h-16 rounded-2xl bg-sky-100 text-ocean-900 mx-auto flex items-center justify-center shadow-xs">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-extrabold text-ink-900">Belum Ada Pesanan Aktif</h3>
                      <p className="text-sm text-ink-700 max-w-md mx-auto">
                        Selamat datang di Fishlink! Anda belum memiliki transaksi pesanan. Mulai jelajahi hasil laut segar bersertifikat cold-chain langsung dari nelayan.
                      </p>
                    </div>
                    <Link href="/katalog" className="inline-block pt-2">
                      <Button className="bg-ocean-900 hover:bg-ocean-700 text-white font-extrabold text-sm px-6 h-12 rounded-xl shadow-md gap-2">
                        <Plus className="w-4 h-4" /> Jelajahi Katalog Hasil Laut
                      </Button>
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-5 rounded-2xl border border-ink-200 shadow-xs space-y-3 hover:border-ocean-900/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink-100 pb-3">
                      <div>
                        <span className="text-[11px] text-ink-400 block font-mono">
                          Order ID: #{order.id}
                        </span>
                        <h3 className="font-bold text-ink-900 text-base">
                          {order.itemSummary}
                        </h3>
                        <p className="text-xs text-ink-700">Mitra: {order.supplierName}</p>
                      </div>

                      <div>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-ink-700 gap-3">
                      <div>
                        <span>Jadwal Kirim: </span>
                        <strong className="text-ink-900 font-semibold">
                          {new Date(order.delivery_schedule || Date.now()).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </strong>
                        <span className="mx-2">•</span>
                        <span>Total: </span>
                        <strong className="text-ocean-900 font-bold tabular-nums">
                          Rp {Number(order.subtotal).toLocaleString("id-ID")}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/pesanan/${order.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-ink-200 text-ink-900 hover:bg-sky-50 font-bold text-xs h-9"
                          >
                            Detail Pesanan
                          </Button>
                        </Link>

                        <Link href={`/lacak/${order.id}`}>
                          <Button
                            size="sm"
                            className="bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-xs gap-1.5 h-9"
                          >
                            <QrCode className="w-3.5 h-3.5 text-sky-400" /> Lacak (QR)
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )))}
              </div>
            </div>

            {/* Right Column: Quick Notification & Subscription Card */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Premium Tier Card */}
              <div className="bg-gradient-to-br from-ocean-900 to-ocean-700 text-white p-6 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 bg-ocean-900/80 px-3 py-1 rounded-full border border-sky-400/30">
                    Paket Pembeli Active
                  </span>
                  <Crown className="w-6 h-6 text-sky-400" />
                </div>
                <h3 className="font-bold text-lg">Keanggotaan Premium B2B</h3>
                <p className="text-xs text-sky-200 leading-relaxed">
                  Nikmati prioritas alokasi tangkapan subuh, histori cold-chain hingga 1 tahun, dan tanpa batas radius matching lokasi.
                </p>
                <Link href="/langganan" className="block pt-2">
                  <Button size="sm" className="w-full bg-sky-400 hover:bg-sky-200 text-ink-900 font-bold text-xs gap-1">
                    Kelola Paket Langganan <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Notifications Widget */}
              <div className="bg-white p-5 rounded-2xl border border-ink-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-ink-100 pb-2">
                  <h3 className="font-bold text-ink-900 text-sm flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-ocean-900" /> Notifikasi Terbaru
                  </h3>
                  <Link href="/notifikasi" className="text-xs text-ocean-900 font-semibold hover:underline">
                    Lihat Semua
                  </Link>
                </div>

                <div className="space-y-2.5 text-xs text-ink-700">
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                    <p className="font-bold text-ink-900">🚚 Pesanan #o1111111 Dalam Pengiriman</p>
                    <p className="text-[11px] text-ink-700">Armada pendingin sedang menuju lokasi Senopati (Suhu -1.8°C).</p>
                    <span className="text-[10px] text-ink-400 block">1 jam lalu</span>
                  </div>

                  <div className="p-3 rounded-xl bg-off-white border border-ink-200 space-y-1">
                    <p className="font-bold text-ink-900">✅ Pesanan #o2222222 Diterima</p>
                    <p className="text-[11px] text-ink-700">Silakan beri ulasan rating kesegaran supplier Pak Udung.</p>
                    <span className="text-[10px] text-ink-400 block">Kemarin</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
