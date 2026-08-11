"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Bell, Check, CheckCheck, Truck, ShoppingBag, ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "🚚 Pesanan #o1111111 Dalam Pengiriman",
    body: "Armada pendingin sedang menuju lokasi Senopati. Suhu es terkontrol pada -1.8°C.",
    isRead: false,
    createdAt: "1 jam lalu",
    linkUrl: "/lacak/o1111111-1111-1111-1111-111111111111",
  },
  {
    id: "n2",
    title: "✅ Pesanan #o2222222 Diterima",
    body: "Pesanan Cumi-Cumi 30kg telah diserahterimakan. Silakan beri ulasan kesegaran supplier.",
    isRead: false,
    createdAt: "Kemarin",
    linkUrl: "/pesanan/o2222222-2222-2222-2222-222222222222",
  },
  {
    id: "n3",
    title: "💳 Pembayaran Pesanan #o3333333 Menunggu",
    body: "Silakan selesaikan pembayaran untuk mengonfirmasi pengiriman Tuna Sirip Kuning 50kg.",
    isRead: true,
    createdAt: "2 hari lalu",
    linkUrl: "/pesanan/o3333333-3333-3333-3333-333333333333",
  },
  {
    id: "n4",
    title: "🏷️ Musim Puncak Tuna Kuning Dimulai!",
    body: "Supplier PT Laut Nusantara Jaya mengunggah stok Tuna Sirip Kuning Grade A segar baru.",
    isRead: true,
    createdAt: "3 hari lalu",
    linkUrl: "/katalog",
  },
];

export default function BuyerNotifikasiPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filterUnread, setFilterUnread] = useState(false);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const displayedList = filterUnread
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      <div className="bg-white border-b border-ink-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ocean-900 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>

      <section className="py-8 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-extrabold text-ink-900 flex items-center gap-2.5">
              <Bell className="w-6 h-6 text-ocean-900" />
              Notifikasi Saya
            </h1>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterUnread(!filterUnread)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  filterUnread
                    ? "bg-ocean-900 text-white border-ocean-900"
                    : "bg-white text-ink-900 border-ink-200 hover:bg-sky-50"
                }`}
              >
                {filterUnread ? "Menampilkan Belum Dibaca" : "Semua Notifikasi"}
              </button>

              <Button
                type="button"
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                className="border-ink-200 text-ink-900 text-xs font-bold gap-1.5"
              >
                <CheckCheck className="w-3.5 h-3.5 text-ocean-900" /> Tandai Semua Dibaca
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {displayedList.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-ink-200 text-center space-y-2">
                <Bell className="w-10 h-10 text-ink-400 mx-auto" />
                <h3 className="font-bold text-ink-900 text-sm">Tidak Ada Notifikasi</h3>
                <p className="text-xs text-ink-700">Semua notifikasi penting telah Anda baca.</p>
              </div>
            ) : (
              displayedList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markSingleAsRead(item.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    !item.isRead
                      ? "bg-sky-50 border-sky-300 shadow-xs"
                      : "bg-white border-ink-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-ink-900 text-sm">{item.title}</h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-ocean-900 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-ink-700">{item.body}</p>
                    <span className="text-[10px] text-ink-400 block pt-1">{item.createdAt}</span>
                  </div>

                  {item.linkUrl && (
                    <Link href={item.linkUrl} onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="outline" className="border-ocean-900 text-ocean-900 hover:bg-ocean-900 hover:text-white text-xs font-bold shrink-0">
                        Buka
                      </Button>
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
