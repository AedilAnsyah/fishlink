"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { getCartItems, saveCartItems, CartItem, clearCart } from "@/lib/cart";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Anchor,
  Truck,
  ArrowLeft,
  Fish,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KeranjangPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(getCartItems());
    setLoaded(true);
  }, []);

  const updateQuantity = (productId: string, delta: number) => {
    const newItems = items
      .map((item) => {
        if (item.productId === productId) {
          const newQty = Math.max(1, item.quantityKg + delta);
          return { ...item, quantityKg: newQty };
        }
        return item;
      })
      .filter((item) => item.quantityKg > 0);

    setItems(newItems);
    saveCartItems(newItems);
  };

  const removeItem = (productId: string) => {
    const newItems = items.filter((item) => item.productId !== productId);
    setItems(newItems);
    saveCartItems(newItems);
  };

  // Group items by supplierId
  const itemsBySupplier = items.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.supplierId]) {
      acc[item.supplierId] = [];
    }
    acc[item.supplierId].push(item);
    return acc;
  }, {});

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.pricePerKg) * Number(item.quantityKg),
    0
  );
  const deliveryFee = items.length > 0 ? 50000 : 0;
  const grandTotal = subtotal + deliveryFee;

  if (!loaded) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <p className="text-ink-700 font-semibold">Memuat keranjang belanja...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-ink-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ocean-900 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Lanjut Belanja di Katalog
          </Link>
          <span className="text-xs text-ink-700 font-medium">
            Keranjang Belanja Pembeli
          </span>
        </div>
      </div>

      <section className="py-8 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 flex items-center gap-2.5">
              <ShoppingBag className="w-7 h-7 text-ocean-900" />
              Keranjang Belanja Hasil Laut
            </h1>
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setItems([]);
                }}
                className="text-xs text-danger-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Kosongkan Keranjang
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-ink-200 text-center space-y-4 max-w-md mx-auto my-8">
              <Fish className="w-12 h-12 text-ink-400 mx-auto" />
              <h2 className="font-bold text-ink-900 text-lg">Keranjang Belanja Anda Kosong</h2>
              <p className="text-xs text-ink-700">
                Pilih hasil laut segar dari katalog nelayan mitra untuk dimasukkan ke keranjang.
              </p>
              <div className="pt-2">
                <Link href="/katalog">
                  <Button className="bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-xs">
                    Lihat Katalog Hasil Laut
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left: Items grouped per supplier */}
              <div className="lg:col-span-8 space-y-6">
                {Object.entries(itemsBySupplier).map(([supplierId, supplierItems]) => {
                  const supplierName = supplierItems[0]?.supplierName || "Mitra Supplier";
                  const supplierSubtotal = supplierItems.reduce(
                    (sum, item) => sum + Number(item.pricePerKg) * Number(item.quantityKg),
                    0
                  );

                  return (
                    <div
                      key={supplierId}
                      className="bg-white rounded-2xl border border-ink-200 overflow-hidden shadow-xs"
                    >
                      {/* Supplier Group Header */}
                      <div className="bg-sky-50 px-5 py-3.5 border-b border-sky-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-ocean-900 font-bold text-sm">
                          <Anchor className="w-4 h-4 text-sky-400" />
                          <span>Supplier: {supplierName}</span>
                        </div>
                        <span className="text-xs text-ink-700 font-medium">
                          {supplierItems.length} Produk
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="divide-y divide-ink-100">
                        {supplierItems.map((item) => {
                          const itemTotal = Number(item.pricePerKg) * Number(item.quantityKg);
                          return (
                            <div
                              key={item.productId}
                              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                            >
                              {/* Product Thumbnail & Name */}
                              <div className="flex items-center gap-3.5 flex-1">
                                <img
                                  src={
                                    item.photoUrl ||
                                    "/fresh-fish.png"
                                  }
                                  alt={item.fishName}
                                  className="w-16 h-16 rounded-xl object-cover border border-ink-200 shrink-0"
                                />
                                <div>
                                  <h3 className="font-bold text-ink-900 text-sm">
                                    {item.fishName}
                                  </h3>
                                  <p className="text-xs text-ocean-900 font-semibold mt-0.5 tabular-nums">
                                    Rp {Number(item.pricePerKg).toLocaleString("id-ID")}{" "}
                                    <span className="text-ink-400 font-normal">/kg</span>
                                  </p>
                                </div>
                              </div>

                              {/* Quantity Adjuster & Total Price */}
                              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-ink-100">
                                <div className="flex items-center border border-ink-200 rounded-lg overflow-hidden bg-off-white">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.productId, -5)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-ink-100 text-ink-900 font-bold"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="w-12 text-center text-xs font-bold text-ink-900 tabular-nums">
                                    {item.quantityKg} kg
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.productId, 5)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-ink-100 text-ink-900 font-bold"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="text-right">
                                  <span className="text-[10px] text-ink-400 block font-semibold">
                                    Total Item
                                  </span>
                                  <p className="text-sm font-black text-ink-900 tabular-nums">
                                    Rp {itemTotal.toLocaleString("id-ID")}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeItem(item.productId)}
                                  className="text-ink-400 hover:text-danger-600 p-1"
                                  title="Hapus produk ini"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Supplier Group Subtotal Footer */}
                      <div className="bg-off-white px-5 py-2.5 border-t border-ink-100 flex justify-between items-center text-xs">
                        <span className="text-ink-700">
                          Subtotal Supplier {supplierName}:
                        </span>
                        <strong className="font-bold text-ocean-900 tabular-nums">
                          Rp {supplierSubtotal.toLocaleString("id-ID")}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Order Summary Sidebar */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white p-6 rounded-2xl border-2 border-ocean-900 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-ink-900 text-lg border-b border-ink-100 pb-3">
                    Ringkasan Belanja
                  </h3>

                  <div className="space-y-2.5 text-xs text-ink-700">
                    <div className="flex justify-between">
                      <span>Total Hasil Laut ({items.length} item):</span>
                      <span className="font-bold text-ink-900 tabular-nums">
                        Rp {subtotal.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-sky-400" /> Estimasi Distribusi Cold-Chain:
                      </span>
                      <span className="font-bold text-ink-900 tabular-nums">
                        Rp {deliveryFee.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-ink-200 flex justify-between items-baseline">
                      <span className="font-bold text-ink-900 text-sm">Total Pembayaran:</span>
                      <span className="text-2xl font-black text-ocean-900 tabular-nums">
                        Rp {grandTotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-[11px] text-ocean-900 flex items-center gap-2 font-medium">
                    <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Jaminan suhu es cold-chain & garansi pergantian jika tidak segar.</span>
                  </div>

                  <Link href="/checkout" className="block pt-2">
                    <Button className="w-full h-12 bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-base shadow-sm gap-2">
                      Lanjut ke Checkout <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
