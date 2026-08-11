"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SupplierNav } from "@/components/supplier/SupplierNav";
import { Footer } from "@/components/shared/Footer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ShoppingBag, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SupplierOrder {
  id: string;
  buyerName: string;
  fishName: string;
  quantityKg: number;
  subtotal: number;
  status: string;
  dateLabel: string;
}

export default function PesananMasukPage() {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/supplier/orders");
      const data = await res.json();
      let apiOrders: SupplierOrder[] = [];
      if (data.success && Array.isArray(data.orders)) {
        apiOrders = data.orders;
      }

      // Merge with localStorage orders
      const { getLocalOrders } = await import("@/lib/local-orders");
      const localOrders = getLocalOrders();
      const mergedMap = new Map<string, SupplierOrder>();

      // Add local orders first (most recent)
      for (const lo of localOrders) {
        mergedMap.set(lo.id, {
          id: lo.id,
          buyerName: lo.buyerName || "Restoran Seafood Bahari",
          fishName: lo.fishName || "Hasil Laut Segar",
          quantityKg: Number(lo.quantityKg),
          subtotal: Number(lo.subtotal),
          status: lo.status || "diproses_supplier",
          dateLabel: lo.dateLabel || "Baru saja",
        });
      }

      // Add API orders
      for (const ao of apiOrders) {
        if (!mergedMap.has(ao.id)) {
          mergedMap.set(ao.id, ao);
        }
      }

      setOrders(Array.from(mergedMap.values()));
    } catch (err) {
      console.error("Failed to load supplier orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans supplier-body-text">
      <SupplierNav />

      <section className="py-8 flex-1">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 flex items-center gap-2">
                <ShoppingBag className="w-7 h-7 text-ocean-900" />
                Daftar Pesanan Masuk
              </h1>
              <p className="text-sm text-ink-700 mt-0.5">
                Kelola pesanan ikan segar dari restoran mitra & jadwal kirim.
              </p>
            </div>

            <button
              type="button"
              onClick={loadOrders}
              className="p-2.5 bg-white hover:bg-sky-50 border border-ink-200 rounded-xl text-ink-700 transition-colors"
              title="Perbarui data order"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-ocean-900" : ""}`} />
            </button>
          </div>

          <div className="space-y-4">
            {loading && orders.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-ink-100 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-ocean-900 animate-spin mx-auto" />
                <p className="text-sm font-bold text-ink-700">Memuat pesanan masuk...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-ink-200 text-center space-y-3 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-sky-100 text-ocean-900 mx-auto flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-ink-900">Belum Ada Pesanan Masuk</h3>
                <p className="text-sm text-ink-700 max-w-md mx-auto">
                  Belum ada pesanan masuk dari pembeli. Pastikan Anda sudah mengunggah stok ikan terbaru di katalog agar bisa dilihat oleh restoran & hotel.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-2xl border border-ink-200 shadow-xs space-y-4 hover:border-ocean-900 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink-100 pb-3">
                    <div>
                      <span className="text-xs text-ink-400 font-mono block">Order ID: #{order.id}</span>
                      <h3 className="font-extrabold text-ink-900 text-lg">{order.fishName}</h3>
                      <p className="text-sm text-ink-700">Pembeli: <strong>{order.buyerName}</strong></p>
                    </div>
                    <div>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-ink-700 gap-3">
                    <div>
                      <span>Volume: <strong>{order.quantityKg} kg</strong></span>
                      <span className="mx-2">•</span>
                      <span>Total Uang: </span>
                      <strong className="text-ocean-900 font-bold tabular-nums">
                        Rp {Number(order.subtotal).toLocaleString("id-ID")}
                      </strong>
                    </div>

                    <Link href={`/supplier/pesanan-masuk/${order.id}`}>
                      <Button className="w-full sm:w-auto bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-sm h-11 px-5 gap-1">
                        <span>Buka & Update Status</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
