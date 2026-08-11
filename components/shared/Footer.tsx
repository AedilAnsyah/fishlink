import React from "react";
import Link from "next/link";
import { Fish, Anchor, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink-900 text-off-white pt-12 pb-8 border-t border-ink-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-ink-700/60">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Fishlink Logo"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <span className="font-bold text-xl text-white">Fishlink</span>
            </Link>
            <p className="text-xs text-ink-400 leading-relaxed">
              Marketplace hasil laut B2B pertama di Indonesia dengan integrasi cold-chain traceability dan matching lokasi terdekat untuk restoran, hotel, dan mitra nelayan.
            </p>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Praktik Penangkapan Ramah Lingkungan</span>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Navigasi Platform</h4>
            <ul className="space-y-2 text-xs text-ink-400">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-sky-400 transition-colors">Tentang Kami & Sertifikasi</Link>
              </li>
              <li>
                <Link href="/mitra-supplier" className="hover:text-sky-400 transition-colors">Program Mitra Supplier</Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-sky-400 transition-colors">Kontak & Pusat Bantuan</Link>
              </li>
            </ul>
          </div>

          {/* Untuk Pengguna */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Untuk Pengguna</h4>
            <ul className="space-y-2 text-xs text-ink-400">
              <li>
                <Link href="/daftar-buyer" className="hover:text-sky-400 transition-colors">Pendaftaran Restoran & Hotel</Link>
              </li>
              <li>
                <Link href="/daftar-supplier" className="hover:text-sky-400 transition-colors">Pendaftaran Nelayan / Petambak</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-sky-400 transition-colors">Masuk Akun</Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white text-sm mb-3">Hubungi Kami</h4>
            <p className="text-xs text-ink-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              Cold Storage Hub Purwokerto, Jawa Tengah
            </p>
            <p className="text-xs text-ink-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              +62 812-3456-7890 (WhatsApp CS)
            </p>
            <p className="text-xs text-ink-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              dukungan@fishlink.id
            </p>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-400 gap-3">
          <p>© {new Date().getFullYear()} Fishlink Indonesia. Hak Cipta Dilindungi.</p>
          <p className="text-ink-400">Menghubungkan Laut Indonesia dengan Industri Kuliner.</p>
        </div>
      </div>
    </footer>
  );
}
