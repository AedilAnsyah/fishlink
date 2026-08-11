"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductWithSupplier } from "@/lib/supabase/products";
import { FreshnessScoreBadge } from "@/components/shared/FreshnessScore";
import { MapPin, ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: ProductWithSupplier;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const supplierTypeLabels: Record<string, string> = {
    nelayan_perorangan: "Nelayan Perorangan",
    nelayan_besar: "Nelayan Besar / Kapal",
    pembudidaya: "Pembudidaya Tambak",
  };

  const supplierTypeLabel =
    supplierTypeLabels[product.suppliers?.supplier_type] || "Mitra Supplier";

  return (
    <div className="bg-white rounded-2xl border border-ink-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-ocean-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div>
        {/* Product Image 4:3 Ratio */}
        <div className="relative aspect-[4/3] bg-ink-100 overflow-hidden">
          <img
            src={
              product.photo_url ||
              "/fresh-fish.png"
            }
            alt={product.fish_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Left: Source Category Badge */}
          <div className="absolute top-2.5 left-2.5 bg-ink-100/95 backdrop-blur-xs text-ink-900 border border-ink-200 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
            {supplierTypeLabel}
          </div>

          {/* Top Right: Freshness Score Badge & Favorite Toggle */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsFavorited(!isFavorited);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isFavorited
                  ? "bg-danger-600 text-white shadow-md scale-110"
                  : "bg-white/90 text-ink-700 hover:text-danger-600 hover:bg-white shadow-xs"
              }`}
              title={isFavorited ? "Hapus dari Favorit" : "Tambah ke Favorit"}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
            </button>
            <FreshnessScoreBadge
              catchDate={product.catch_or_harvest_date}
              distanceKm={product.distance_km || 10}
            />
          </div>

          {/* Bottom Left: Distance Badge */}
          <div className="absolute bottom-2.5 left-2.5 bg-ink-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
            <span>±{product.distance_km || 12} km dari Anda</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2">
          {/* Supplier Business Name */}
          <p className="text-xs text-ink-700 font-medium truncate">
            {product.suppliers?.business_name || "Mitra Supplier Fishlink"}
          </p>

          {/* Fish Name */}
          <h3 className="font-bold text-ink-900 text-base leading-snug line-clamp-2 group-hover:text-ocean-900 transition-colors">
            {product.fish_name}
          </h3>

          {/* Season Tag if present */}
          {product.season_tag && (
            <span className="inline-block text-[11px] font-semibold text-ocean-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              {product.season_tag}
            </span>
          )}

          {/* Price & Available Stock */}
          <div className="pt-2 border-t border-ink-100 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-ink-400 uppercase tracking-wider block font-semibold">
                Harga Per Kg
              </span>
              <p className="text-lg font-black text-ocean-900 tabular-nums">
                Rp {Number(product.price_per_kg).toLocaleString("id-ID")}{" "}
                <span className="text-xs font-normal text-ink-700">/kg</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-ink-400 uppercase tracking-wider block font-semibold">
                Stok Tersedia
              </span>
              <p className="text-xs font-bold text-ink-900 tabular-nums">
                {product.stock_kg} kg
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        <Link href={`/katalog/${product.id}`} className="block">
          <Button
            variant="outline"
            className="w-full border-ocean-900 text-ocean-900 hover:bg-ocean-900 hover:text-white font-bold text-xs gap-1.5 h-10 transition-all duration-200"
          >
            <span>Lihat Detail & Pesan</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
