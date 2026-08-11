"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SupplierNav } from "@/components/supplier/SupplierNav";
import { Footer } from "@/components/shared/Footer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Anchor,
  Package,
  ShoppingBag,
  Wallet,
  Camera,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SupplierOrderSummary {
  id: string;
  buyerName: string;
  fishName: string;
  quantityKg: number;
  subtotal: number;
  status: string;
}

export default function SupplierBerandaPage() {
  const [userName, setUserName] = useState("Mitra Supplier");
  const [userLocation, setUserLocation] = useState("Dermaga / Pangkalan Nelayan");
  const [activeStockKg, setActiveStockKg] = useState(0);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [recentOrders, setRecentOrders] = useState<SupplierOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);

    const cookies = document.cookie.split(";").reduce((acc, c) => {
      const [k, v] = c.trim().split("=");
      if (k && v) acc[k] = decodeURIComponent(v);
      return acc;
    }, {} as Record<string, string>);

    if (cookies.fishlink_mock_name) setUserName(cookies.fishlink_mock_name);
    if (cookies.fishlink_mock_location) setUserLocation(cookies.fishlink_mock_location);

    try {
      // 1. Fetch Products
      const prodRes = await fetch("/api/supplier/products");
      const prodData = await prodRes.json();
      if (prodData.success && Array.isArray(prodData.products)) {
        const totalKg = prodData.products
          .filter((p: any) => p.is_active)
          .reduce((sum: number, p: any) => sum + Number(p.stock_kg || 0), 0);
        setActiveStockKg(totalKg);
      }

      // 2. Fetch Orders & Merge with Local Storage
      const orderRes = await fetch("/api/supplier/orders");
      const orderData = await orderRes.json();
      let apiOrders: any[] = [];
      if (orderData.success && Array.isArray(orderData.orders)) {
        apiOrders = orderData.orders;
      }

      const { getLocalOrders } = await import("@/lib/local-orders");
      const localOrders = getLocalOrders();
      const mergedMap = new Map<string, any>();

      for (const lo of localOrders) {
        mergedMap.set(lo.id, {
          id: lo.id,
          buyerName: lo.buyerName || "Restoran Seafood Bahari",
          fishName: lo.fishName || "Hasil Laut Segar",
          quantityKg: Number(lo.quantityKg),
          subtotal: Number(lo.subtotal),
          status: lo.status || "diproses_supplier",
        });
      }

      for (const ao of apiOrders) {
        if (!mergedMap.has(ao.id)) {
          mergedMap.set(ao.id, ao);
        }
      }

      const allOrders = Array.from(mergedMap.values());
      const pending = allOrders.filter(
        (o: any) => o.status === "diproses_supplier" || o.status === "menunggu_kurir"
      );
      setNewOrdersCount(pending.length);
      setRecentOrders(pending);

      const earnings = allOrders
        .filter((o: any) => o.status === "diterima")
        .reduce((sum: number, o: any) => sum + Number(o.subtotal || 0), 0);
      setMonthlyEarnings(earnings > 0 ? earnings : 0);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans supplier-body-text">
      <SupplierNav />

      <section className="py-8 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Welcome Header */}
          <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-success-600 animate-ping" />
                <span className="text-xs font-bold text-success-600">Status Toko: Aktif & Buka</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
                Halo, {userName}!
              </h1>
              <p className="text-sm text-ink-700 flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-4 h-4 text-ocean-900 shrink-0" />
                <span>
                  Lokasi Dermaga / Pangkalan: <strong>{userLocation}</strong>
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={loadData}
                className="p-3 bg-white hover:bg-sky-50 border border-ink-200 rounded-2xl text-ink-700 transition-colors"
                title="Muat ulang data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-ocean-900" : ""}`} />
              </button>

              <Link href="/supplier/stok-saya/tambah" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-3.5 bg-ocean-900 hover:bg-ocean-700 text-white font-black text-base rounded-2xl shadow-md flex items-center justify-center gap-2.5 active:scale-95 transition-all min-h-[50px]"
                >
                  <Camera className="w-5 h-5 text-sky-400" />
                  <span>Tambah Stok Baru</span>
                </button>
              </Link>
            </div>
          </div>

          {/* 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Card 1: Pesanan Baru */}
            <div className="bg-sky-50 p-6 rounded-2xl border-2 border-sky-300 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-ocean-900 uppercase tracking-wide">
                  Pesanan Masuk Baru
                </span>
                <ShoppingBag className="w-6 h-6 text-ocean-900" />
              </div>
              <p className="text-4xl font-black text-ocean-900 tabular-nums">
                {newOrdersCount} <span className="text-base font-normal">Pesanan</span>
              </p>
              <p className="text-xs text-ink-700 pt-1">
                {newOrdersCount > 0
                  ? "Perlu segera disiapkan untuk dikirim ke gudang/pembeli."
                  : "Belum ada pesanan baru yang menunggu persiapan."}
              </p>
            </div>

            {/* Card 2: Jumlah Stok Aktif */}
            <div className="bg-white p-6 rounded-2xl border-2 border-ink-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-ink-900 uppercase tracking-wide">
                  Stok Ikan Aktif
                </span>
                <Package className="w-6 h-6 text-ink-900" />
              </div>
              <p className="text-4xl font-black text-ink-900 tabular-nums">
                {activeStockKg} <span className="text-base font-normal">kg</span>
              </p>
              <p className="text-xs text-ink-700 pt-1">
                {activeStockKg > 0
                  ? "Tersedia & siap dibeli oleh restoran di katalog."
                  : "Pasang foto & harga ikan untuk mulai berjualan."}
              </p>
            </div>

            {/* Card 3: Uang Masuk Bulan Ini */}
            <div className="bg-white p-6 rounded-2xl border-2 border-ink-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-ink-900 uppercase tracking-wide">
                  Uang Masuk Bulan Ini
                </span>
                <Wallet className="w-6 h-6 text-success-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-success-600 tabular-nums">
                Rp {monthlyEarnings.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-ink-700 pt-1">
                Hasil penjualan dari ikan yang sudah diterima pembeli.
              </p>
            </div>
          </div>

          {/* Quick Orders Needing Action */}
          <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <h2 className="font-extrabold text-ink-900 text-xl flex items-center gap-2">
                <Clock className="w-6 h-6 text-ocean-900" />
                Pesanan Baru yang Perlu Siap Dikirim
              </h2>
              <Link
                href="/supplier/pesanan-masuk"
                className="text-sm font-bold text-ocean-900 hover:underline flex items-center gap-1"
              >
                Lihat Semua Pesanan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <div className="p-8 rounded-2xl border-2 border-dashed border-ink-200 text-center space-y-3 bg-white">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-ocean-900 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-ink-900 text-base">
                    Belum Ada Pesanan yang Perlu Dikirim
                  </h3>
                  <p className="text-xs text-ink-700 max-w-md mx-auto">
                    Saat ada restoran atau hotel yang memesan pasokan ikan Anda, pesanan akan langsung muncul di sini dan notifikasi dikirimkan ke WhatsApp Anda.
                  </p>
                  <Link href="/supplier/stok-saya/tambah" className="inline-block pt-1">
                    <Button className="bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-xs h-11 px-5 rounded-xl gap-2">
                      <Camera className="w-4 h-4 text-sky-400" /> Pasang Stok Ikan Sekarang
                    </Button>
                  </Link>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl border-2 border-ocean-900 bg-sky-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-ink-400 block">
                        Order ID: #{order.id}
                      </span>
                      <h3 className="font-bold text-ink-900 text-lg">
                        {order.quantityKg} kg {order.fishName}
                      </h3>
                      <p className="text-sm text-ink-700">
                        Pembeli: <strong>{order.buyerName}</strong>
                      </p>
                      <p className="text-xs text-ocean-900 font-semibold pt-0.5">
                        Status: Diproses Supplier — Perlu Tandai Siap Kirim
                      </p>
                    </div>

                    <Link href={`/supplier/pesanan-masuk/${order.id}`}>
                      <Button className="w-full sm:w-auto h-12 bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-sm px-6">
                        Buka & Update Status Kirim
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
