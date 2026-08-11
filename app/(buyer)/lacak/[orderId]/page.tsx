"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { TraceabilityTimeline } from "@/components/shared/TraceabilityTimeline";
import { OrderQRCode } from "@/components/shared/OrderQRCode";
import { TrackingEvent } from "@/types/database.types";
import { createClient } from "@/lib/supabase/client";
import { SEED_TRACKING_EVENTS } from "@/lib/supabase/seed-data";
import {
  ArrowLeft,
  QrCode,
  Snowflake,
  ShieldCheck,
  Thermometer,
  Anchor,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";



export default function LacakTraceabilityPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || "o1111111-1111-1111-1111-111111111111";

  const [events, setEvents] = useState<TrackingEvent[]>(SEED_TRACKING_EVENTS);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("tracking_events")
          .select("*")
          .eq("order_id", orderId)
          .order("occurred_at", { ascending: true });

        if (data && data.length > 0) {
          setEvents(data);
        }
      } catch {
        // Fallback to dummy
      }
    }
    loadEvents();
  }, [orderId]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      {/* Header Bar */}
      <div className="bg-white border-b border-ink-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ocean-900 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Dashboard
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-900 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            <QrCode className="w-3.5 h-3.5 text-sky-400" /> Traceability Cold-Chain Publik
          </span>
        </div>
      </div>

      <section className="py-8 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Hero Traceability Header Card */}
          <div className="bg-gradient-to-r from-ocean-900 to-ocean-700 text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 bg-ocean-900/80 px-3 py-1 rounded-full border border-sky-400/30 mb-2">
                  <Snowflake className="w-4 h-4" /> Sensor Suhu Terverifikasi Real-Time
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Pelacakan Cold-Chain Traceability
                </h1>
                <p className="text-xs sm:text-sm text-sky-200 mt-1">
                  Nomor Pesanan: <strong className="font-mono text-white">#{orderId}</strong>
                </p>
              </div>

              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="border-white text-white hover:bg-ocean-700 font-bold text-xs gap-1.5 h-10 shrink-0"
              >
                <Share2 className="w-4 h-4" />
                {copied ? "Link Tersalin!" : "Bagikan Link Traceability"}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-sky-200/30 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Sertifikasi Tangkapan Bebas Overfishing</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Rata-Rata Suhu Transit: -2.0°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Dermaga Asal: Hub Purwokerto, Jawa Tengah</span>
              </div>
            </div>
          </div>

          {/* Main Grid: Stepper Timeline & QR Code */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Vertical Stepper Timeline */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-ink-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-ink-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-ink-900 text-lg">
                    Rangkaian Timeline Cold-Chain
                  </h3>
                  <p className="text-xs text-ink-700">
                    Titik histori penanganan ikan dari kapal hingga titik penerimaan
                  </p>
                </div>
                <span className="text-xs font-bold text-success-600 bg-success-100 px-3 py-1 rounded-full border border-success-600/20">
                  {events.length} Titik Terdeteksi
                </span>
              </div>

              {/* Vertical Stepper Component */}
              <TraceabilityTimeline events={events} />
            </div>

            {/* Right Column: QR Code & Verification info */}
            <div className="lg:col-span-4 space-y-6">
              <OrderQRCode orderId={orderId} size={180} />

              <div className="bg-white p-5 rounded-2xl border border-ink-200 shadow-xs space-y-3 text-xs">
                <h4 className="font-bold text-ink-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success-600" />
                  Jaminan Transparansi HACCP
                </h4>
                <p className="text-ink-700 leading-relaxed">
                  Semua data histori suhu di atas terhubung langsung dengan sistem sensor IoT pada armada pendingin gudang transit Fishlink.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
