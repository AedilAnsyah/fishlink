"use client";

import React, { useState } from "react";
import { Snowflake, MapPin, Clock, Thermometer, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";
import { calculateFreshnessScore } from "@/lib/matching/freshness";

export function FreshnessSimulator() {
  const [hoursCatch, setHoursCatch] = useState<number>(4);
  const [distanceKm, setDistanceKm] = useState<number>(12);
  const [tempC, setTempC] = useState<number>(-2.5);

  // Freshness score calculation
  const rawCatchDate = new Date(Date.now() - hoursCatch * 3600 * 1000).toISOString();
  const { score, label, badgeColorClass } = calculateFreshnessScore(rawCatchDate, distanceKm);

  // Temperature penalty if temp > 4°C
  const tempWarning = tempC > 4;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-ocean-900 shadow-md space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-ink-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-200 text-ocean-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Widget Interaktif Real-Time
          </div>
          <h3 className="font-extrabold text-ink-900 text-lg sm:text-xl">
            Simulasi Algoritma Skor Kesegaran & Cold-Chain
          </h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-ocean-900 text-white flex items-center justify-center font-bold">
          <Snowflake className="w-5 h-5 text-sky-400" />
        </div>
      </div>

      {/* Sliders Inputs */}
      <div className="space-y-5">
        
        {/* Slider 1: Jam Sejak Ditangkap */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-ink-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-ocean-900" /> Waktu Sejak Ikan Ditangkap:
            </span>
            <span className="text-ocean-900 bg-sky-100 px-2.5 py-0.5 rounded-md tabular-nums">
              {hoursCatch} Jam Lalu
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="48"
            value={hoursCatch}
            onChange={(e) => setHoursCatch(Number(e.target.value))}
            className="w-full h-2.5 bg-ink-100 rounded-lg appearance-none cursor-pointer accent-ocean-900"
          />
          <div className="flex justify-between text-[10px] text-ink-400">
            <span>1 Jam (Tangkapan Subuh)</span>
            <span>24 Jam</span>
            <span>48 Jam</span>
          </div>
        </div>

        {/* Slider 2: Jarak Resto ke Dermaga */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-ink-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-ocean-900" /> Jarak Lokasi Resto ke Dermaga:
            </span>
            <span className="text-ocean-900 bg-sky-100 px-2.5 py-0.5 rounded-md tabular-nums">
              {distanceKm} km
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="150"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-2.5 bg-ink-100 rounded-lg appearance-none cursor-pointer accent-ocean-900"
          />
          <div className="flex justify-between text-[10px] text-ink-400">
            <span>1 km (Dekat Dermaga)</span>
            <span>75 km</span>
            <span>150 km (Luar Kota)</span>
          </div>
        </div>

        {/* Slider 3: Suhu Cold Storage / Es */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-ink-900 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-ocean-900" /> Suhu Es / Armada Pendingin:
            </span>
            <span className={`px-2.5 py-0.5 rounded-md tabular-nums ${
              tempWarning ? "bg-danger-100 text-danger-600" : "bg-sky-200 text-ocean-900"
            }`}>
              {tempC}°C
            </span>
          </div>
          <input
            type="range"
            min="-5"
            max="12"
            step="0.5"
            value={tempC}
            onChange={(e) => setTempC(Number(e.target.value))}
            className="w-full h-2.5 bg-ink-100 rounded-lg appearance-none cursor-pointer accent-ocean-900"
          />
          <div className="flex justify-between text-[10px] text-ink-400">
            <span>-5°C (Beku Optimal)</span>
            <span>0°C (Suhu Es)</span>
            <span>12°C (Panas Tropis)</span>
          </div>
        </div>

      </div>

      {/* Live Calculated Gauge & Result Banner */}
      <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-ink-400 font-bold uppercase tracking-wider block">
              Hasil Kalkulasi Kesegaran Real-Time
            </span>
            <h4 className="font-extrabold text-ink-900 text-lg">
              Kualitas Ikan: <span className="font-bold text-ocean-900">{label}</span>
            </h4>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-ocean-900 tabular-nums">
              {score}
            </span>
            <span className="text-xs font-bold text-ink-400"> / 100</span>
          </div>
        </div>

        {/* Gauge Progress Bar */}
        <div className="w-full bg-ink-200 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              score >= 80
                ? "bg-success-600"
                : score >= 60
                ? "bg-warning-600"
                : "bg-danger-600"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Temperature Alert Banner */}
        {tempWarning ? (
          <div className="p-3 bg-danger-100 border border-danger-600/30 rounded-xl text-danger-600 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Peringatan Suhu: Suhu {tempC}°C melebihi batas aman cold-chain (+4°C).</span>
          </div>
        ) : (
          <div className="p-3 bg-white border border-sky-200 rounded-xl text-ocean-900 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Rantai Dingin Aman: Garansi penggantian 100% jika diterima tidak segar.</span>
          </div>
        )}
      </div>

    </div>
  );
}
