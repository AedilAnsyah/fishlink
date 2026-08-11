"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { getCartItems, CartItem, clearCart } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Warehouse as WarehouseIcon,
  CreditCard,
  QrCode,
  MessageCircle,
  Truck,
  ArrowRight,
  Anchor,
  Loader2,
  MapPin,
  Fish,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Form selections
  const [deliveryDate, setDeliveryDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [warehouseId, setWarehouseId] = useState<string>(
    "w1111111-1111-1111-1111-111111111111"
  );
  const [paymentMethod, setPaymentMethod] = useState<string>("mock_transfer");

  // State after successful payment
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>("");

  useEffect(() => {
    setItems(getCartItems());
    setLoaded(true);
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.pricePerKg) * Number(item.quantityKg),
    0
  );
  const deliveryFee = items.length > 0 ? 50000 : 0;
  const grandTotal = subtotal + deliveryFee;

  // Group items per supplier
  const itemsBySupplier = items.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.supplierId]) {
      acc[item.supplierId] = [];
    }
    acc[item.supplierId].push(item);
    return acc;
  }, {});

  const handleMockPayment = async () => {
    setIsProcessing(true);

    const generatedOrderId = `o${Date.now().toString(36)}`;
    setCreatedOrderId(generatedOrderId);

    // Save order records in Supabase DB if available
    try {
      const supabase = createClient();
      
      // Insert order
      await supabase.from("orders").insert({
        id: generatedOrderId,
        status: "dibayar",
        delivery_schedule: deliveryDate,
        warehouse_id: warehouseId,
        subtotal: grandTotal,
      });

      // Insert order items
      for (const item of items) {
        await supabase.from("order_items").insert({
          order_id: generatedOrderId,
          product_id: item.productId,
          supplier_id: item.supplierId,
          quantity_kg: item.quantityKg,
          price_per_kg_at_order: item.pricePerKg,
        });
      }

      // Insert mock payment
      await supabase.from("payments").insert({
        order_id: generatedOrderId,
        amount: grandTotal,
        method: paymentMethod,
        status: "paid",
        paid_at: new Date().toISOString(),
      });

      // Insert first cold-chain tracking event
      await supabase.from("tracking_events").insert({
        order_id: generatedOrderId,
        event_label: "Pesanan Dikonfirmasi & Masuk Cold-Chain",
        location_label: "Cold Storage Hub Purwokerto, Jawa Tengah",
        temperature_c: -2.5,
      });
    } catch {
      // Ignore if offline
    }

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentCompleted(true);
      clearCart();
    }, 1200);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <p className="text-ink-700 font-semibold">Memuat halaman checkout...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // SUCCESS SCREEN AFTER PAYMENT
  if (paymentCompleted) {
    const waText = encodeURIComponent(
      `Halo Fishlink! Pesanan saya ID: #${createdOrderId} (Total: Rp ${grandTotal.toLocaleString(
        "id-ID"
      )}) telah berhasil dibayar. Mohon update rantai pengiriman cold-chain ke WhatsApp ini.`
    );
    const waUrl = `https://wa.me/6281234567890?text=${waText}`;

    return (
      <div className="min-h-screen bg-off-white flex flex-col font-sans">
        <Navbar />

        <section className="py-12 flex-1 flex items-center justify-center">
          <div className="max-w-xl mx-auto px-4 w-full">
            <div className="bg-white p-8 rounded-2xl border-2 border-success-600 shadow-md text-center space-y-6">
              
              <div className="w-16 h-16 rounded-full bg-success-100 text-success-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="inline-block text-xs font-bold text-success-600 bg-success-100 px-3 py-1 rounded-full border border-success-600/30">
                  Pembayaran Berhasil (Status: DIBAYAR)
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
                  Pesanan Hasil Laut Terkonfirmasi!
                </h1>
                <p className="text-xs text-ink-700">
                  Nomor Pesanan: <strong className="font-mono text-ocean-900">#{createdOrderId}</strong>
                </p>
              </div>

              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-xs text-ink-900 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-ink-700">Jadwal Pengiriman:</span>
                  <strong className="font-bold text-ocean-900">
                    {new Date(deliveryDate).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </strong>
                </div>
                <div className="flex justify-between border-t border-sky-200 pt-1.5">
                  <span className="text-ink-700">Total Dibayar:</span>
                  <strong className="font-bold text-ocean-900 tabular-nums">
                    Rp {grandTotal.toLocaleString("id-ID")}
                  </strong>
                </div>
                <div className="flex justify-between border-t border-sky-200 pt-1.5">
                  <span className="text-ink-700">Gudang Transit Cold-Chain:</span>
                  <strong className="font-bold text-ocean-900">Hub Purwokerto (-2.5°C)</strong>
                </div>
              </div>

              {/* Action 1: WhatsApp Notification Option */}
              <div className="pt-2">
                <a href={waUrl} target="_blank" rel="noreferrer" className="block">
                  <Button className="w-full h-12 bg-success-600 hover:bg-success-600/90 text-white font-bold text-sm gap-2 shadow-xs">
                    <MessageCircle className="w-5 h-5" /> Kirim Update Status ke WhatsApp Saya
                  </Button>
                </a>
              </div>

              {/* Action 2 & 3: Traceability & Dashboard Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <Link href={`/lacak/${createdOrderId}`}>
                  <Button variant="outline" className="w-full border-ocean-900 text-ocean-900 hover:bg-sky-50 font-bold text-xs gap-1.5 h-11">
                    <QrCode className="w-4 h-4 text-ocean-900" /> Lacak Cold-Chain (QR)
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <Button variant="secondary" className="w-full bg-ink-100 hover:bg-ink-200 text-ink-900 font-bold text-xs h-11">
                    Lihat Dashboard Pembeli
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      <section className="py-8 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
            Checkout Pesanan & Simulasi Pembayaran
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Delivery Details & Items Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Delivery Schedule & Warehouse Selection */}
              <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-sm space-y-4">
                <h3 className="font-bold text-ink-900 text-base flex items-center gap-2 border-b border-ink-100 pb-3">
                  <Calendar className="w-5 h-5 text-ocean-900" />
                  1. Jadwal Pengiriman & Gudang Transit Cold-Chain
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-ink-900 mb-1.5">
                      Pilih Tanggal Pengiriman Ditargetkan:
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-4 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm font-semibold focus:border-ocean-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-900 mb-1.5">
                      Pilih Cold-Storage Hub Penampungan:
                    </label>
                    <select
                      value={warehouseId}
                      onChange={(e) => setWarehouseId(e.target.value)}
                      className="w-full px-4 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm font-semibold focus:border-ocean-900 outline-none"
                    >
                      <option value="w1111111-1111-1111-1111-111111111111">
                        Cold Storage Hub Purwokerto, Jawa Tengah (Suhu Es -2°C)
                      </option>
                      <option value="w2222222-2222-2222-2222-222222222222">
                        Cold Hub Pelabuhan Ratu, Sukabumi (Suhu Es -3°C)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Items Breakdown Grouped Per Supplier */}
              <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-sm space-y-4">
                <h3 className="font-bold text-ink-900 text-base flex items-center gap-2 border-b border-ink-100 pb-3">
                  <Fish className="w-5 h-5 text-ocean-900" />
                  2. Ringkasan Pesanan Per Supplier
                </h3>

                <div className="space-y-4">
                  {Object.entries(itemsBySupplier).map(([supplierId, supplierItems]) => {
                    const supplierName = supplierItems[0]?.supplierName || "Mitra Supplier";
                    return (
                      <div
                        key={supplierId}
                        className="border border-ink-200 rounded-xl overflow-hidden text-xs"
                      >
                        <div className="bg-sky-50 px-4 py-2.5 font-bold text-ocean-900 border-b border-sky-200 flex items-center gap-2">
                          <Anchor className="w-3.5 h-3.5 text-sky-400" />
                          <span>Supplier: {supplierName}</span>
                        </div>
                        <div className="divide-y divide-ink-100 p-3 space-y-2">
                          {supplierItems.map((item) => (
                            <div key={item.productId} className="flex justify-between items-center pt-1">
                              <div>
                                <span className="font-bold text-ink-900 text-xs block">{item.fishName}</span>
                                <span className="text-[11px] text-ink-700">
                                  {item.quantityKg} kg x Rp {Number(item.pricePerKg).toLocaleString("id-ID")}
                                </span>
                              </div>
                              <span className="font-bold text-ink-900 tabular-nums">
                                Rp {(Number(item.pricePerKg) * Number(item.quantityKg)).toLocaleString("id-ID")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Payment Module */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border-2 border-ocean-900 shadow-sm space-y-5">
                <h3 className="font-extrabold text-ink-900 text-lg border-b border-ink-100 pb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-ocean-900" />
                  Simulasi Pembayaran (Mock Payment)
                </h3>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-ink-900">
                    Pilih Metode Pembayaran Simulasi:
                  </label>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("mock_transfer")}
                      className={`w-full p-3 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between ${
                        paymentMethod === "mock_transfer"
                          ? "border-ocean-900 bg-sky-50 text-ocean-900"
                          : "border-ink-200 text-ink-700 hover:border-ink-400"
                      }`}
                    >
                      <span>🏦 Bank Transfer (Simulasi Otomatis)</span>
                      {paymentMethod === "mock_transfer" && <CheckCircle2 className="w-4 h-4 text-ocean-900" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("mock_qris")}
                      className={`w-full p-3 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between ${
                        paymentMethod === "mock_qris"
                          ? "border-ocean-900 bg-sky-50 text-ocean-900"
                          : "border-ink-200 text-ink-700 hover:border-ink-400"
                      }`}
                    >
                      <span>📱 QRIS Instan (Simulasi)</span>
                      {paymentMethod === "mock_qris" && <CheckCircle2 className="w-4 h-4 text-ocean-900" />}
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-ink-100 space-y-2 text-xs text-ink-700">
                  <div className="flex justify-between">
                    <span>Subtotal Produk:</span>
                    <span className="font-bold text-ink-900 tabular-nums">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Cold-Chain Hub:</span>
                    <span className="font-bold text-ink-900 tabular-nums">
                      Rp {deliveryFee.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-ink-200 items-baseline">
                    <span className="font-extrabold text-ink-900 text-sm">Total Pembayaran:</span>
                    <span className="text-2xl font-black text-ocean-900 tabular-nums">
                      Rp {grandTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleMockPayment}
                  disabled={isProcessing}
                  className="w-full h-13 bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-base shadow-sm gap-2 mt-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memproses Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <span>💳 Bayar Sekarang (Simulasi)</span>
                    </>
                  )}
                </Button>
              </div>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
