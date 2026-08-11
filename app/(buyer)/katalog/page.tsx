"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ProductCard } from "@/components/buyer/ProductCard";
import { fetchProducts, ProductWithSupplier } from "@/lib/supabase/products";
import { calculateFreshnessScore } from "@/lib/matching/freshness";
import {
  Fish,
  Filter,
  SlidersHorizontal,
  MapPin,
  Search,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KatalogPage() {
  const [products, setProducts] = useState<ProductWithSupplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [supplierTypeFilter, setSupplierTypeFilter] = useState("all");
  const [seasonTagFilter, setSeasonTagFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<"terdekat_tersegar" | "termurah" | "termahal" | "stok">(
    "terdekat_tersegar"
  );

  const [locationLabel, setLocationLabel] = useState("Senopati, Jakarta Selatan (Restoran Seafood Bahari)");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((product) => {
      // Search
      const matchSearch =
        product.fish_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.suppliers?.business_name.toLowerCase().includes(searchQuery.toLowerCase());

      // Supplier Type
      const matchType =
        supplierTypeFilter === "all" ||
        product.suppliers?.supplier_type === supplierTypeFilter;

      // Season Tag
      const matchSeason =
        seasonTagFilter === "all" || product.season_tag === seasonTagFilter;

      // Price
      const matchPrice = Number(product.price_per_kg) <= maxPrice;

      return matchSearch && matchType && matchSeason && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "terdekat_tersegar") {
        // Compute combined rank: distance (lower better) + freshness (higher better)
        const scoreA = calculateFreshnessScore(a.catch_or_harvest_date, a.distance_km || 10).score;
        const scoreB = calculateFreshnessScore(b.catch_or_harvest_date, b.distance_km || 10).score;
        const rankA = scoreA - (a.distance_km || 10) * 0.5;
        const rankB = scoreB - (b.distance_km || 10) * 0.5;
        return rankB - rankA;
      }
      if (sortBy === "termurah") {
        return Number(a.price_per_kg) - Number(b.price_per_kg);
      }
      if (sortBy === "termahal") {
        return Number(b.price_per_kg) - Number(a.price_per_kg);
      }
      if (sortBy === "stok") {
        return Number(b.stock_kg) - Number(a.stock_kg);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      {/* Top Banner / Location Bar */}
      <section className="bg-ocean-900 text-white py-4 border-b border-ocean-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-400 text-ink-900 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sky-200 block text-[10px]">Lokasi Acuan Buyer Saat Ini:</span>
              <strong className="text-sm font-semibold">{locationLabel}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sky-200">Tidak menemukan jenis ikan yang dicari?</span>
            <Link href="/custom-order">
              <Button size="sm" className="bg-sky-400 hover:bg-sky-200 text-ink-900 font-bold text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Request Custom Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="py-8 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header Title & Quick Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">
                Katalog Hasil Laut Segar
              </h1>
              <p className="text-xs sm:text-sm text-ink-700 mt-0.5">
                Langsung dari nelayan pancing, armada kapal, dan petambak bersertifikat
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative min-w-[280px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-ink-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari jenis ikan (Tuna, Kakap, Udang...)"
                className="w-full pl-10 pr-4 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm focus:border-ocean-900 outline-none"
              />
            </div>
          </div>

          {/* Filter & Sort Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              
              {/* Supplier Type Filter */}
              <div>
                <label className="block font-semibold text-ink-900 mb-1">
                  Kategori Sumber:
                </label>
                <select
                  value={supplierTypeFilter}
                  onChange={(e) => setSupplierTypeFilter(e.target.value)}
                  className="w-full px-3 h-10 rounded-lg border border-ink-200 bg-white text-ink-900 font-medium focus:border-ocean-900 outline-none"
                >
                  <option value="all">Semua Kategori (Nelayan & Tambak)</option>
                  <option value="nelayan_perorangan">Nelayan Perorangan</option>
                  <option value="nelayan_besar">Nelayan Besar / Kapal</option>
                  <option value="pembudidaya">Pembudidaya Tambak</option>
                </select>
              </div>

              {/* Season Tag Filter */}
              <div>
                <label className="block font-semibold text-ink-900 mb-1">
                  Tag Musim / Status:
                </label>
                <select
                  value={seasonTagFilter}
                  onChange={(e) => setSeasonTagFilter(e.target.value)}
                  className="w-full px-3 h-10 rounded-lg border border-ink-200 bg-white text-ink-900 font-medium focus:border-ocean-900 outline-none"
                >
                  <option value="all">Semua Tag</option>
                  <option value="Segar Harian">Segar Harian</option>
                  <option value="Musim Puncak Tuna">Musim Puncak Tuna</option>
                  <option value="Panen Raya Tambak">Panen Raya Tambak</option>
                  <option value="Tangkapan Khusus">Tangkapan Khusus</option>
                </select>
              </div>

              {/* Max Price Filter */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-ink-900">Batas Harga Maksimal:</label>
                  <span className="font-bold text-ocean-900 tabular-nums">
                    Rp {maxPrice.toLocaleString("id-ID")}/kg
                  </span>
                </div>
                <input
                  type="range"
                  min="30000"
                  max="200000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-ink-100 rounded-lg appearance-none cursor-pointer accent-ocean-900"
                />
              </div>

              {/* Sorting Filter */}
              <div>
                <label className="block font-semibold text-ink-900 mb-1">
                  Urutkan Berdasarkan:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 h-10 rounded-lg border-2 border-ocean-900 bg-sky-50 text-ocean-900 font-bold focus:border-ocean-900 outline-none"
                >
                  <option value="terdekat_tersegar">Terdekat & Tersegar (PostGIS Default)</option>
                  <option value="termurah">Harga: Termurah</option>
                  <option value="termahal">Harga: Tertinggi</option>
                  <option value="stok">Stok Terbanyak</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results Grid Header */}
          <div className="flex items-center justify-between text-xs text-ink-700 pt-1">
            <span>
              Menampilkan <strong>{filteredProducts.length}</strong> produk hasil laut
            </span>
            {sortBy === "terdekat_tersegar" && (
              <span className="inline-flex items-center gap-1 font-semibold text-ocean-900 bg-sky-200/60 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                <Sparkles className="w-3.5 h-3.5 text-ocean-900" />
                Diurutkan dengan PostGIS matching lokasi & skor kesegaran
              </span>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12 text-center text-ink-400">
              <div className="col-span-full py-12 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-ocean-900 animate-spin" />
                <p className="text-sm font-semibold text-ink-700">Memuat katalog hasil laut...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-ink-200 text-center space-y-4 max-w-md mx-auto my-8">
              <Fish className="w-12 h-12 text-ink-400 mx-auto" />
              <h3 className="font-bold text-ink-900 text-lg">Tidak Ada Produk Sesuai Filter</h3>
              <p className="text-xs text-ink-700">
                Coba sesuaikan batas harga atau kata kunci pencarian Anda, atau ajukan permintaan khusus.
              </p>
              <div className="pt-2">
                <Link href="/custom-order">
                  <Button className="bg-ocean-900 text-white font-bold text-xs">
                    Buat Request Custom Order
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
