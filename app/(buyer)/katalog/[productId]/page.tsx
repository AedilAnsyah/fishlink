"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { fetchProductById, ProductWithSupplier } from "@/lib/supabase/products";
import { calculateFreshnessScore } from "@/lib/matching/freshness";
import { FreshnessScoreBadge } from "@/components/shared/FreshnessScore";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Star,
  Anchor,
  Snowflake,
  MessageCircle,
  Truck,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DetailProdukPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId as string;

  const [product, setProduct] = useState<ProductWithSupplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantityKg, setQuantityKg] = useState<number>(10);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      setLoading(true);
      const data = await fetchProductById(productId);
      setProduct(data);
      setLoading(false);
    }
    loadProduct();
  }, [productId]);

  const getCartItem = () => {
    const suppId = product?.supplier_id || product?.suppliers?.id || "s1111111-1111-1111-1111-111111111111";
    return {
      productId: product?.id || productId,
      fishName: product?.fish_name || "Hasil Laut",
      pricePerKg: Number(product?.price_per_kg || 0),
      quantityKg,
      supplierId: suppId,
      supplierName: product?.suppliers?.business_name || "Mitra Supplier",
      photoUrl: product?.photo_url || "/fresh-fish.png",
    };
  };

  const handleAddToCartOnly = async () => {
    const { addToCart } = await import("@/lib/cart");
    addToCart(getCartItem());
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleDirectCheckout = async () => {
    const { addToCart } = await import("@/lib/cart");
    addToCart(getCartItem());
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <p className="text-ink-700 font-semibold">Memuat detail produk hasil laut...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-ink-200 text-center space-y-4">
          <h2 className="text-xl font-bold text-ink-900">Produk Tidak Ditemukan</h2>
          <p className="text-xs text-ink-700">Produk yang Anda cari tidak tersedia atau sudah habis.</p>
          <Link href="/katalog">
            <Button className="bg-ocean-900 text-white font-bold text-xs">Kembali ke Katalog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const freshnessInfo = calculateFreshnessScore(
    product.catch_or_harvest_date,
    product.distance_km || 12
  );

  const supplierTypeLabels: Record<string, string> = {
    nelayan_perorangan: "Nelayan Perorangan (Tangkapan Harian)",
    nelayan_besar: "Nelayan Besar / Kapal Samudra",
    pembudidaya: "Pembudidaya Tambak",
  };

  const totalPrice = Number(product.price_per_kg) * quantityKg;

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-ink-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ocean-900 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Katalog
          </Link>
        </div>
      </div>

      {/* Main Product Detail Section */}
      <section className="py-8 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-ink-100 border border-ink-200 shadow-sm">
                <img
                  src={
                    product.photo_url ||
                    "/fresh-fish.png"
                  }
                  alt={product.fish_name}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-3 left-3">
                  <FreshnessScoreBadge
                    catchDate={product.catch_or_harvest_date}
                    distanceKm={product.distance_km || 12}
                  />
                </div>

                <div className="absolute bottom-3 left-3 bg-ink-900/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>±{product.distance_km || 12} km dari Lokasi Anda</span>
                </div>
              </div>

              {/* Freshness Detailed Breakdown Box */}
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 text-xs text-ink-900 space-y-2">
                <div className="flex items-center justify-between font-bold text-ocean-900">
                  <span className="flex items-center gap-1.5">
                    <Snowflake className="w-4 h-4 text-sky-400" /> Indikator Kesegaran Terintegrasi
                  </span>
                  <span className="tabular-nums">Skor: {freshnessInfo.score} / 100</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-sky-200/60 text-ink-700">
                  <div>
                    <span className="block text-[10px] text-ink-400">Waktu Sejak Ditangkap:</span>
                    <strong className="text-ink-900">{freshnessInfo.hoursSinceCatch} Jam Lalu</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-ink-400">Rantai Dingin Cold-Chain:</span>
                    <strong className="text-success-600">Suhu Es -2.0°C Terjaga</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Product Info & Order Panel */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                {/* Season Tag */}
                {product.season_tag && (
                  <span className="inline-block text-xs font-bold text-ocean-900 bg-sky-200 px-3 py-1 rounded-full border border-sky-400/30">
                    🏷️ {product.season_tag}
                  </span>
                )}

                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
                  {product.fish_name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-black text-ocean-900 tabular-nums">
                    Rp {Number(product.price_per_kg).toLocaleString("id-ID")}
                  </span>
                  <span className="text-sm font-medium text-ink-700">/ kg</span>
                </div>

                <p className="text-xs sm:text-sm text-ink-700 leading-relaxed pt-2 border-t border-ink-100">
                  {product.description ||
                    "Daging tebal dan segar. Cocok untuk kebutuhan restoran seafood, hotel bintang, atau usaha olahan ikan."}
                </p>
              </div>

              {/* Catch Date & Stock Details */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-white rounded-xl border border-ink-200 text-xs">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-ocean-900 shrink-0" />
                  <div>
                    <span className="text-ink-400 block text-[10px]">Tanggal Tangkap/Panen:</span>
                    <strong className="text-ink-900">
                      {new Date(product.catch_or_harvest_date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 border-l border-ink-100 pl-3">
                  <Truck className="w-5 h-5 text-ocean-900 shrink-0" />
                  <div>
                    <span className="text-ink-400 block text-[10px]">Stok Siap Kirim:</span>
                    <strong className="text-ink-900 tabular-nums">{product.stock_kg} kg</strong>
                  </div>
                </div>
              </div>

              {/* Supplier Info Box */}
              <div className="p-4 bg-white rounded-2xl border border-ink-200 space-y-3 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-ocean-900 text-white flex items-center justify-center font-bold shrink-0">
                      <Anchor className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink-900 text-sm">
                        {product.suppliers?.business_name || "Mitra Supplier Fishlink"}
                      </h4>
                      <p className="text-xs text-ink-700">
                        {supplierTypeLabels[product.suppliers?.supplier_type || "nelayan_perorangan"]}
                      </p>
                    </div>
                  </div>
                  {product.suppliers?.is_trusted_badge && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success-600 bg-success-100 px-2.5 py-1 rounded-full border border-success-600/20">
                      <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
                    </span>
                  )}
                </div>

                <p className="text-xs text-ink-700 italic">
                  &ldquo;{product.suppliers?.bio || "Nelayan mitra tangkapan segar bersertifikat."}&rdquo;
                </p>

                <div className="flex items-center justify-between text-xs text-ink-700 pt-2 border-t border-ink-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-ocean-900" />
                    {product.suppliers?.address_label || "Muara Angke, Jakarta"}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-warning-600">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {product.suppliers?.average_rating || "4.9"} / 5.0
                  </span>
                </div>
              </div>

              {/* Order Quantity & Main CTAs */}
              <div className="p-5 bg-white rounded-2xl border-2 border-ocean-900 space-y-4 shadow-sm">
                <div>
                  <label className="block text-xs font-bold text-ink-900 mb-2">
                    Jumlah Pesanan (kg):
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-ink-200 rounded-xl overflow-hidden bg-off-white">
                      <button
                        type="button"
                        onClick={() => setQuantityKg(Math.max(5, quantityKg - 5))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-ink-100 font-bold text-ink-900"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="5"
                        max={product.stock_kg}
                        value={quantityKg}
                        onChange={(e) => setQuantityKg(Math.max(1, Number(e.target.value)))}
                        className="w-16 h-10 text-center font-bold text-ink-900 bg-white text-sm outline-none tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantityKg(quantityKg + 5)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-ink-100 font-bold text-ink-900"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-ink-700">Min. pemesanan 5 kg</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-ink-100">
                  <span className="text-xs font-bold text-ink-900">Total Harga Pesanan:</span>
                  <span className="text-2xl font-black text-ocean-900 tabular-nums">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>

                {/* Toast Notification Banner when added to cart */}
                {showToast && (
                  <div className="p-3 bg-success-100 border-2 border-success-600 rounded-xl text-success-600 text-xs font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                      <span>{quantityKg} kg {product.fish_name} masuk keranjang!</span>
                    </div>
                    <Link href="/keranjang">
                      <Button size="sm" className="bg-success-600 text-white font-extrabold text-[11px] h-7 px-3">
                        Lihat Keranjang
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Button
                    type="button"
                    onClick={handleAddToCartOnly}
                    variant="outline"
                    className="w-full h-12 border-ocean-900 text-ocean-900 hover:bg-sky-50 font-extrabold text-sm gap-2 rounded-xl"
                  >
                    <Plus className="w-4 h-4" /> + Masukkan ke Keranjang
                  </Button>

                  <Button
                    type="button"
                    onClick={handleDirectCheckout}
                    className="w-full h-12 bg-ocean-900 hover:bg-ocean-700 text-white font-extrabold text-sm shadow-sm gap-2 rounded-xl"
                  >
                    <ShoppingBag className="w-4 h-4 text-sky-400" /> Pesan Sekarang (Checkout)
                  </Button>
                </div>

                <div className="pt-1 flex gap-2">
                  <Link href="/custom-order" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full h-10 border-ink-200 text-ink-900 hover:bg-sky-50 text-xs font-semibold rounded-xl"
                    >
                      Request Spesifikasi Khusus
                    </Button>
                  </Link>
                  <a
                    href={`https://wa.me/6281234567890?text=Halo%20Fishlink,%20saya%20tertarik%20dengan%20${encodeURIComponent(
                      product.fish_name
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full h-10 border-success-600 text-success-600 hover:bg-success-100 text-xs font-semibold gap-1.5 rounded-xl"
                    >
                      <MessageCircle className="w-4 h-4" /> Tanya via WA
                    </Button>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
