"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { LiveChatSim } from "@/components/shared/LiveChatSim";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function KontakPage() {
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [role, setRole] = useState("Buyer (Restoran/Hotel)");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactInfo || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-sky-50 to-off-white py-12 border-b border-ink-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-200 text-ocean-900 text-xs font-bold">
            <MessageSquare className="w-4 h-4" />
            <span>Pusat Bantuan & Layanan Pelanggan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-900">
            Hubungi Tim Fishlink Indonesia
          </h1>
          <p className="text-base text-ink-700 max-w-xl mx-auto">
            Pertanyaan seputar pasokan ikan B2B, kendala pengiriman cold-chain, atau pendaftaran kemitraan nelayan? Kami siap membantu.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Contact Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-ink-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-ink-900">
                Kirim Pesan Formulir
              </h2>

              {submitted ? (
                <div className="p-6 bg-success-100 border border-success-600/30 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-success-600 mx-auto" />
                  <h3 className="font-bold text-ink-900 text-lg">Pesan Berhasil Terkirim!</h3>
                  <p className="text-xs text-ink-700">
                    Terima kasih, <strong>{name}</strong>. Tim Customer Success Fishlink akan menghubungi Anda melalui kontak yang dicantumkan dalam 1x24 jam.
                  </p>
                  <Button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    variant="outline"
                    className="border-ocean-900 text-ocean-900 mt-2 text-xs font-bold"
                  >
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-ink-900 mb-1">
                        Nama Lengkap <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama Anda"
                        className="w-full px-3.5 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm focus:border-ocean-900 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink-900 mb-1">
                        Email atau No WhatsApp <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="resto@email.com / 0812..."
                        className="w-full px-3.5 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm focus:border-ocean-900 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-ink-900 mb-1">
                        Peran Pengguna
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3.5 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm focus:border-ocean-900 outline-none font-medium"
                      >
                        <option value="Buyer (Restoran/Hotel)">Buyer (Restoran/Hotel)</option>
                        <option value="Mitra Supplier (Nelayan)">Mitra Supplier (Nelayan/Petambak)</option>
                        <option value="Media / Pertanyaan Umum">Media / Pertanyaan Umum</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink-900 mb-1">
                        Subjek Pesan
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="contoh: Permintaan Penawaran Rutin"
                        className="w-full px-3.5 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm focus:border-ocean-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ink-900 mb-1">
                      Pesan atau Pertanyaan <span className="text-danger-600">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tuliskan rincian kebutuhan pasokan hasil laut atau pertanyaan Anda..."
                      className="w-full p-3.5 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm focus:border-ocean-900 outline-none resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto h-12 px-8 bg-ocean-900 hover:bg-ocean-700 text-white font-bold text-base gap-2"
                  >
                    <Send className="w-4 h-4" /> Kirim Pesan Sekarang
                  </Button>
                </form>
              )}
            </div>

            {/* Right: Live Chat Simulation */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-xl font-bold text-ink-900">
                Simulasi Live Chat CS
              </h2>
              <LiveChatSim />
            </div>

          </div>

          {/* Location & Office Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-ink-200">
            <div className="bg-white p-5 rounded-2xl border border-ink-200 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 text-ocean-900 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-ink-900 text-sm">Hub Cold Storage Jakarta</h4>
                <p className="text-xs text-ink-700 mt-0.5">Depo & Cold Storage Hub Purwokerto, Jawa Tengah</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-ink-200 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 text-ocean-900 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-ink-900 text-sm">Layanan WhatsApp CS</h4>
                <p className="text-xs text-ink-700 mt-0.5">+62 812-3456-7890 (Senin - Minggu 05.00 - 20.00 WIB)</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-ink-200 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 text-ocean-900 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-ink-900 text-sm">Email Resmi</h4>
                <p className="text-xs text-ink-700 mt-0.5">dukungan@fishlink.id / mitra@fishlink.id</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
