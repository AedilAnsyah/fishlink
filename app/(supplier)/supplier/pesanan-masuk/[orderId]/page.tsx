"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SupplierNav } from "@/components/supplier/SupplierNav";
import { Footer } from "@/components/shared/Footer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  Package,
  MapPin,
  Clock,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PesananMasukDetailPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || "o1111111-1111-1111-1111-111111111111";

  const [currentStatus, setCurrentStatus] = useState<string>("diproses_supplier");
  const [updating, setUpdating] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleUpdateStatus = async (newStatus: string, trackingLabel: string) => {
    setUpdating(true);

    try {
      const supabase = createClient();
      await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
      await supabase.from("tracking_events").insert({
        order_id: orderId,
        event_label: trackingLabel,
        location_label: "Depo Purwokerto (Pengiriman Supplier)",
        temperature_c: -1.5,
      });
    } catch {
      // Ignore if offline
    }

    setTimeout(() => {
      setUpdating(false);
      setCurrentStatus(newStatus);
      setToastMsg(`Status berhasil diperbarui ke: ${trackingLabel}!`);
      setTimeout(() => setToastMsg(null), 3000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans supplier-body-text">
      <SupplierNav />

      <div className="bg-white border-b border-ink-100 py-3">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/supplier/pesanan-masuk"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-ocean-900 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Pesanan Masuk
          </Link>
          <span className="text-xs font-semibold text-ink-700">Detail Pesanan Supplier</span>
        </div>
      </div>

      <section className="py-8 flex-1">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          
          {toastMsg && (
            <div className="p-4 bg-success-100 border-2 border-success-600 rounded-2xl text-success-600 font-bold text-sm text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{toastMsg}</span>
            </div>
          )}

          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-ocean-900 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink-100 pb-4">
              <div>
                <span className="text-xs text-ink-400 font-mono block">Order ID: #{orderId}</span>
                <h1 className="text-2xl font-extrabold text-ink-900">
                  Kakap Merah Segar Tangkapan Subuh (50 kg)
                </h1>
                <p className="text-base text-ink-700 mt-1">
                  Pembeli: <strong>Restoran Seafood Bahari (Senopati)</strong>
                </p>
              </div>
              <div>
                <StatusBadge status={currentStatus} />
              </div>
            </div>

            {/* ONE-TAP STATUS UPDATE BUTTONS */}
            <div className="bg-sky-50 p-6 rounded-2xl border-2 border-sky-300 space-y-4">
              <h3 className="font-extrabold text-ocean-900 text-lg flex items-center gap-2">
                <Truck className="w-6 h-6 text-sky-400" />
                Satu-Ketuk Update Status Pengiriman Ikan
              </h3>
              <p className="text-xs text-ink-700">
                Setiap kali Anda menekan tombol di bawah, pembeli akan melihat progres terbaru pada pelacakan real-time mereka.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      "diproses_supplier",
                      "Ikan Siap & Dikemas Es oleh Supplier"
                    )
                  }
                  disabled={updating}
                  className="h-14 bg-ocean-900 hover:bg-ocean-700 text-white font-extrabold text-base rounded-xl shadow-xs gap-2"
                >
                  <Package className="w-5 h-5 text-sky-400" />
                  1. Tandai: Ikan Siap & Dikemas Es
                </Button>

                <Button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      "dikirim_ke_gudang",
                      "Ikan Tiba di Cold Storage Hub Purwokerto"
                    )
                  }
                  disabled={updating}
                  className="h-14 bg-success-600 hover:bg-success-600/90 text-white font-extrabold text-base rounded-xl shadow-xs gap-2"
                >
                  <Truck className="w-5 h-5" />
                  2. Tandai: Dikirim ke Gudang Hub
                </Button>
              </div>
            </div>

            {/* Order Details & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-ink-700 pt-2">
              <div className="p-4 bg-off-white rounded-xl border border-ink-200 space-y-1">
                <span className="text-xs text-ink-400 block font-semibold">Alamat Tujuan Pengiriman:</span>
                <p className="font-bold text-ink-900">Restoran Seafood Bahari</p>
                <p className="text-xs">Jl. Senopati No. 45, Jakarta Selatan (±12 km)</p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-ink-200 space-y-1">
                <span className="text-xs text-ink-400 block font-semibold">Total Uang Penjualan:</span>
                <p className="text-xl font-black text-ocean-900 tabular-nums">
                  Rp 4.250.000
                </p>
                <p className="text-xs text-success-600 font-bold">Uang ditransfer setelah diterima buyer.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
