import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fishlink — Marketplace Hasil Laut B2B & Cold-Chain Traceability",
  description:
    "Menghubungkan nelayan dan pembudidaya Indonesia langsung dengan restoran, hotel, dan industri pengolahan hasil laut dengan jaminan cold-chain.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-off-white text-ink-900 antialiased">
        {children}
      </body>
    </html>
  );
}
