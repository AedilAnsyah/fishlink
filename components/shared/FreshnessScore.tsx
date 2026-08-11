import React from "react";
import { calculateFreshnessScore } from "@/lib/matching/freshness";
import { Snowflake, ShieldCheck } from "lucide-react";

interface FreshnessScoreProps {
  catchDate: string | Date;
  distanceKm?: number;
}

export function FreshnessScoreBadge({ catchDate, distanceKm = 10 }: FreshnessScoreProps) {
  const { score, label, badgeColorClass } = calculateFreshnessScore(catchDate, distanceKm);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColorClass}`}
      title={`Skor Kesegaran: ${score}/100`}
    >
      <Snowflake className="w-3.5 h-3.5" />
      <span>{label}</span>
      <span className="opacity-75 tabular-nums">({score})</span>
    </span>
  );
}
