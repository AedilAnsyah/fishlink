"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SupplierNav } from "@/components/supplier/SupplierNav";
import { Footer } from "@/components/shared/Footer";
import { ProductWithSupplier } from "@/lib/supabase/products";
import { SEED_PRODUCTS } from "@/lib/supabase/seed-data";
import { Package, Camera, Calendar, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

import { createClient } from "@/lib/supabase/client";

export default function StokSayaPage() {
  const [products, setProducts] = useState<ProductWithSupplier[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const cookies = document.cookie.split(";").reduce((acc, c) => {
      const [k, v] = c.trim().split("=");
      if (k && v) acc[k] = decodeURIComponent(v);
      return acc;
    }, {} as Record<string, string>);

    if (cookies.fishlink_mock_name === "Pak Udung") {
      setProducts(SEED_PRODUCTS.filter((p) => p.supplier_id === "s1111111-1111-1111-1111-111111111111"));
      setLoading(false);
    } else {
      async function loadSupplierProducts() {
        try {
          const supabase = createClient();
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            const { data: supp } = await supabase
              .from("suppliers")
              .select("id")
              .eq("profile_id", userData.user.id)
              .single();

            if (supp?.id) {
              const { data } = await supabase
                .from("products")
                .select("*, suppliers(*)")
                .eq("supplier_id", supp.id);
              if (data) setProducts(data as any);
            }
          }
        } catch {
          // Empty state
        }
        setLoading(false);
      }
      loadSupplierProducts();
    }
  }, []);

  const toggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p))
    );
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans supplier-body-text">
      <SupplierNav />

      <section className="py-8 flex-1">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 flex items-center gap-2">
                <Package className="w-7 h-7 text-ocean-900" />
                Stok Ikan Saya di Katalog
              </h1>
              <p className="text-base text-ink-700 mt-0.5">
                Kelola pasokan ikan yang bisa dilihat oleh pembeli restoran & hotel.
              </p>
            </div>

            <Link href="/supplier/stok-saya/tambah">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-ocean-900 hover:bg-ocean-700 text-white font-black text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Camera className="w-5 h-5 text-sky-400" />
                <span>Tambah Stok Baru</span>
              </button>
            </Link>
          </div>

          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-ink-200 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-sky-100 text-ocean-900 mx-auto flex items-center justify-center shadow-xs">
                  <Package className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-ink-900">Belum Ada Stok Hasil Laut</h3>
                  <p className="text-sm text-ink-700 max-w-md mx-auto">
                    Toko Anda siap berjualan! Ambil foto hasil tangkapan atau panen tambak Anda sekarang untuk ditayangkan di katalog pembeli.
                  </p>
                </div>
                <Link href="/supplier/stok-saya/tambah" className="inline-block pt-2">
                  <Button className="bg-ocean-900 hover:bg-ocean-700 text-white font-extrabold text-sm px-6 h-12 rounded-xl shadow-md gap-2">
                    <Camera className="w-4 h-4 text-sky-400" /> Pasang Stok Ikan Pertama
                  </Button>
                </Link>
              </div>
            ) : (
              products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-5 rounded-2xl border-2 border-ink-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      product.photo_url || "/fresh-fish.png"
                    }
                    alt={product.fish_name}
                    className="w-20 h-20 rounded-xl object-cover border border-ink-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-ink-900 text-lg">
                        {product.fish_name}
                      </h3>
                      {product.is_active ? (
                        <span className="text-[11px] font-bold text-success-600 bg-success-100 px-2.5 py-0.5 rounded-full border border-success-600/20">
                          Tampil di Katalog
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-ink-400 bg-ink-100 px-2.5 py-0.5 rounded-full">
                          Disembunyikan
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-bold text-ocean-900 tabular-nums">
                      Rp {Number(product.price_per_kg).toLocaleString("id-ID")}{" "}
                      <span className="text-xs font-normal text-ink-700">/ kg</span>
                      <span className="mx-2">•</span>
                      <span className="text-ink-900">Stok: {product.stock_kg} kg</span>
                    </p>

                    <p className="text-xs text-ink-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-ink-400" /> Tangkat:{" "}
                      {new Date(product.catch_or_harvest_date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-ink-100 flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => toggleActive(product.id)}
                    variant="outline"
                    className="w-full sm:w-auto border-ink-200 text-ink-900 hover:bg-sky-50 font-bold text-xs h-11 gap-1.5"
                  >
                    {product.is_active ? (
                      <>
                        <EyeOff className="w-4 h-4 text-ink-400" /> Sembunyikan
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 text-ocean-900" /> Tampilkan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
