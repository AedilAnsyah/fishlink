export type FreshnessLabel = 'Sangat Segar' | 'Segar' | 'Standar';

export interface FreshnessScoreResult {
  score: number; // 0 - 100
  label: FreshnessLabel;
  hoursSinceCatch: number;
  badgeColorClass: string;
}

/**
 * Calculates freshness score based on time elapsed since catch/harvest
 * and optional transport distance in km.
 */
export function calculateFreshnessScore(
  catchDate: string | Date,
  distanceKm: number = 10
): FreshnessScoreResult {
  const catchTime = new Date(catchDate).getTime();
  const now = new Date().getTime();
  const hoursSinceCatch = Math.max(0, Math.floor((now - catchTime) / (1000 * 60 * 60)));

  // Base freshness points (100 max)
  let score = 100 - hoursSinceCatch * 2.5 - distanceKm * 0.15;
  score = Math.max(10, Math.min(100, Math.round(score)));

  let label: FreshnessLabel = 'Standar';
  let badgeColorClass = 'bg-warning-100 text-warning-600 border-warning-600/20';

  if (score >= 80) {
    label = 'Sangat Segar';
    badgeColorClass = 'bg-success-100 text-success-600 border-success-600/20';
  } else if (score >= 60) {
    label = 'Segar';
    badgeColorClass = 'bg-sky-200 text-ocean-900 border-sky-400/20';
  }

  return {
    score,
    label,
    hoursSinceCatch,
    badgeColorClass,
  };
}
