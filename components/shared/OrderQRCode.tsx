"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, ExternalLink } from "lucide-react";

interface OrderQRCodeProps {
  orderId: string;
  size?: number;
}

export function OrderQRCode({ orderId, size = 160 }: OrderQRCodeProps) {
  const traceUrl = typeof window !== "undefined"
    ? `${window.location.origin}/lacak/${orderId}`
    : `https://fishlink.id/lacak/${orderId}`;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-ink-200 shadow-xs space-y-3">
      <div className="p-3 bg-off-white rounded-xl border border-ink-100 flex items-center justify-center">
        <QRCodeSVG
          value={traceUrl}
          size={size}
          bgColor="#F7FAFB"
          fgColor="#0E2530"
          level="H"
          includeMargin={false}
        />
      </div>

      <div className="text-center space-y-1">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ocean-900 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
          <QrCode className="w-3.5 h-3.5 text-sky-400" /> Traceability QR Code
        </span>
        <p className="text-[11px] text-ink-700">
          Pindai QR ini untuk memverifikasi asal kapal & histori suhu cold-chain.
        </p>
      </div>
    </div>
  );
}
