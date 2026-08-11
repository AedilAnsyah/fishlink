"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OrderQRCode } from "@/components/shared/OrderQRCode";
import { RatingForm } from "@/components/buyer/RatingForm";
import { Order, OrderItem, OrderStatus } from "@/types/database.types";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Calendar,
  Warehouse as WarehouseIcon,
  QrCode,
  Sparkles,
  ShoppingBag,
  CreditCard,
  MessageCircle,
  Truck,
  Anchor,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DetailPesananBuyerPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || "o1111111-1111-1111-1111-111111111111";

  const [orderStatus, setOrderStatus] = useState<OrderStatus>("dalam_pengiriman");
  const [deliveryDate, setDeliveryDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [subtotal, setSubtotal] = useState<number>(4250000);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Fetch order details
    async function loadOrder() {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (data) {
        setOrderStatus(data.status);
        if (data.delivery_schedule) setDeliveryDate(data.delivery_schedule);
        if (data.subtotal) setSubtotal(data.subtotal);
      }
    }
    loadOrder();

    // Realtime listener for order status change
    const channel = supabase
      .channel(`order_${orderId}_realtime`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setIsRealtimeActive(true);
          const updated = payload.new as Order;
          if (updated.status) setOrderStatus(updated.status);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setIsRealtimeActive(true);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-ink-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ocean-900 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Dashboard Pembeli
          </Link>
          {isRealtimeActive && (
            <span className="text-[11px] font-bold text-success-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Live Realtime Status Connected
            </span>
          )}
        </div>
      </div>

      <section className="py-8 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Order Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-ink-200 shadow-xs">
            <div>
              <span className="text-xs text-ink-400 font-mono block">Order ID: #{orderId}</span>
              <h1 className="text-2xl font-extrabold text-ink-900">
                Detail Pesanan Hasil Laut
              </h1>
              <p className="text-xs text-ink-700 mt-0.5">
                Dikirim dari Cold Storage Hub Purwokerto (-2.5°C)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={orderStatus} />

              {/* Demo Status Switcher for testing rating form & realtime */}
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                className="text-xs border border-ink-200 rounded-lg p-1.5 font-bold bg-sky-50 text-ocean-900 outline-none"
                title="Simulasi Ubah Status untuk Evaluasi UI"
              >
                <option value="menunggu_pembayaran">Simulasi: Menunggu Pembayaran</option>
                <option value="dibayar">Simulasi: Dibayar</option>
                <option value="dalam_pengiriman">Simulasi: Dalam Pengiriman</option>
                <option value="diterima">Simulasi: Diterima (Tampil Form Rating)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Order Items & Review Form */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Order Items Summary */}
              <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-xs space-y-4">
                <h3 className="font-bold text-ink-900 text-base border-b border-ink-100 pb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-ocean-900" />
                  Daftar Produk yang Dipesan
                </h3>

                <div className="space-y-3 divide-y divide-ink-100">
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src="/fresh-fish.png"
                        alt="Kakap Merah"
                        className="w-12 h-12 rounded-xl object-cover border border-ink-200"
                      />
                      <div>
                        <h4 className="font-bold text-ink-900">Kakap Merah Segar Tangkapan Subuh</h4>
                        <p className="text-[11px] text-ink-700">Mitra: Tangkapan Pak Udung (Muara Angke)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-ink-900 block">50 kg</span>
                      <span className="text-ocean-900 font-bold tabular-nums">
                        Rp 4.250.000
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-ink-100 flex justify-between items-center text-xs font-bold">
                  <span className="text-ink-900">Total Pembayaran Pesanan:</span>
                  <span className="text-xl text-ocean-900 tabular-nums">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* RATING FORM: Displayed after status becomes 'diterima' */}
              {orderStatus === "diterima" && (
                <RatingForm
                  orderId={orderId}
                  supplierId="s1111111-1111-1111-1111-111111111111"
                />
              )}

              {/* Traceability Link Card */}
              <div className="bg-sky-50 p-6 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-ocean-900 text-base flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-sky-400" /> Pantau Histori Cold-Chain Traceability
                  </h4>
                  <p className="text-xs text-ink-700">
                    Lihat grafik suhu es, lokasi transit, dan histori kapal pencatat.
                  </p>
                </div>

                <Link href={`/lacak/${orderId}`}>
                  <Button className="bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-xs gap-1.5 h-11 shrink-0">
                    Lacak Traceability Sekarang <QrCode className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

            </div>

            {/* Right Column: QR Code & WhatsApp Notification */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* QR Code Component */}
              <OrderQRCode orderId={orderId} />

              {/* WhatsApp Notification Link */}
              <div className="bg-white p-5 rounded-2xl border border-ink-200 shadow-xs space-y-3">
                <h4 className="font-bold text-ink-900 text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-success-600" />
                  Notifikasi Update WhatsApp
                </h4>
                <p className="text-xs text-ink-700">
                  Dapatkan pesan WA langsung saat status armada pendingin mendekati lokasi Anda.
                </p>
                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Fishlink,%20mohon%20kirimkan%20update%20pesanan%20ID:%20${orderId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    className="w-full border-success-600 text-success-600 hover:bg-success-100 font-bold text-xs gap-1.5 h-10"
                  >
                    <MessageCircle className="w-4 h-4" /> Buka Chat WhatsApp CS
                  </Button>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
