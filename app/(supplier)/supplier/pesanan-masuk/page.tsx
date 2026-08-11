"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SupplierNav } from "@/components/supplier/SupplierNav";
import { Footer } from "@/components/shared/Footer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ShoppingBag, ArrowRight, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUPPLIER_ORDERS = [
  {
    id: "o1111111-1111-1111-1111-111111111111",
    buyerName: "Restoran Seafood Bahari (Senopati)",
    fishName: "Kakap Merah Segar Tangkapan Subuh",
    quantityKg: 50,
    subtotal: 4250000,
    status: "diproses_supplier",
    dateLabel: "Hari ini",
  },
  {
    id: "o2222222-2222-2222-2222-222222222222",
    buyerName: "Restoran Seafood Bahari",
    fishName: "Cumi-Cumi Segar Seret Malam",
    quantityKg: 30,
    subtotal: 2550000,
    status: "diterima",
    dateLabel: "2 hari lalu",
  },
];

export default function PesananMasukPage() {
  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans supplier-body-text">
      <SupplierNav />

      <section className="py-8 flex-1">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 text-ocean-900" />
              Daftar Pesanan Masuk
            </h1>
            <span className="text-sm font-semibold text-ink-700">
              {SUPPLIER_ORDERS.length} Total Pesanan
            </span>
          </div>

          <div className="space-y-4">
            {SUPPLIER_ORDERS.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-2xl border-2 border-ink-200 shadow-xs space-y-4 hover:border-ocean-900 transition-all"
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
                      Rp {order.subtotal.toLocaleString("id-ID")}
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
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
