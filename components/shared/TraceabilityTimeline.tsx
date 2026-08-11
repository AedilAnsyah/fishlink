import React from "react";
import { TrackingEvent } from "@/types/database.types";
import { Thermometer, MapPin, CheckCircle2, Clock, Snowflake } from "lucide-react";

interface TraceabilityTimelineProps {
  events: TrackingEvent[];
}

export function TraceabilityTimeline({ events }: TraceabilityTimelineProps) {
  const standardSteps = [
    "Tangkap & Pengepakan Es Awal",
    "Tiba di Gudang Cold Storage Hub",
    "Dalam Pengiriman Armada Mobil Pendingin",
    "Tiba & Diterima Pembeli",
  ];

  return (
    <div className="py-2 relative space-y-6">
      {events.map((event, idx) => {
        const isLatest = idx === events.length - 1;
        const isCompleted = idx < events.length;

        // Temperature status styling
        let tempColorClass = "text-cold-cool bg-sky-50 border-sky-200";
        if (event.temperature_c !== null && event.temperature_c !== undefined) {
          if (event.temperature_c > 5) {
            tempColorClass = "text-warning-600 bg-warning-100 border-warning-600/30";
          } else {
            tempColorClass = "text-ocean-900 bg-sky-200/70 border-sky-400/40";
          }
        }

        return (
          <div key={event.id || idx} className="relative flex gap-4 items-start">
            {/* Left Vertical Line & Node Bullet */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-all ${
                  isLatest
                    ? "bg-sky-400 text-ink-900 ring-4 ring-sky-200 animate-pulse"
                    : isCompleted
                    ? "bg-ocean-900 text-white"
                    : "bg-white border-2 border-ink-200 text-ink-400"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              {idx < events.length - 1 && (
                <div className="w-0.5 h-16 bg-ocean-900/60 my-1" />
              )}
            </div>

            {/* Right Card Content */}
            <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-bold text-ink-900 text-sm sm:text-base">
                  {event.event_label}
                </h4>
                {isLatest && (
                  <span className="text-[10px] font-bold text-ocean-900 bg-sky-200 px-2 py-0.5 rounded-full border border-sky-400/30">
                    Status Aktif Saat Ini
                  </span>
                )}
              </div>

              {event.location_label && (
                <p className="text-xs text-ink-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-ocean-900 shrink-0" />
                  <span>{event.location_label}</span>
                </p>
              )}

              {event.temperature_c !== null && event.temperature_c !== undefined && (
                <div className="pt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${tempColorClass}`}
                  >
                    <Thermometer className="w-3.5 h-3.5 shrink-0" />
                    <span>Suhu Es / Pendingin: {event.temperature_c}°C</span>
                  </span>
                </div>
              )}

              <p className="text-[11px] text-ink-400 pt-1 border-t border-ink-100 flex items-center gap-1">
                <Clock className="w-3 h-3 text-ink-400" />
                <span>
                  {new Date(event.occurred_at).toLocaleString("id-ID", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
