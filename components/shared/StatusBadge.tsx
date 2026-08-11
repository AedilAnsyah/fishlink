import React from "react";
import { OrderStatus } from "@/types/database.types";
import { CheckCircle2, Clock, Truck, Package, XCircle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: OrderStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "menunggu_pembayaran":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-600 border border-warning-600/20">
          <Clock className="w-3.5 h-3.5" />
          Menunggu Pembayaran
        </span>
      );
    case "dibayar":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-200 text-ocean-900 border border-sky-400/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Dibayar
        </span>
      );
    case "diproses_supplier":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-ocean-700 border border-ocean-500/20">
          <Package className="w-3.5 h-3.5" />
          Diproses Supplier
        </span>
      );
    case "dikirim_ke_gudang":
    case "dalam_pengiriman":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-200 text-ocean-900 border border-sky-400/30">
          <Truck className="w-3.5 h-3.5" />
          Dalam Cold-Chain
        </span>
      );
    case "diterima":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-600 border border-success-600/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Tiba / Diterima
        </span>
      );
    case "dibatalkan":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-600 border border-danger-600/20">
          <XCircle className="w-3.5 h-3.5" />
          Dibatalkan
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-ink-100 text-ink-700">
          <AlertCircle className="w-3.5 h-3.5" />
          {status}
        </span>
      );
  }
}
