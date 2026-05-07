export type WeightPoint = {
  occurredAt: string;
  weightKg: number;
};

export type WeightTrend = 'down' | 'stable' | 'up' | 'unknown';

export function calculateBmi(weightKg: number | null | undefined, heightCm: number | null | undefined): number | null {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightInMeters = heightCm / 100;
  return Number((weightKg / (heightInMeters * heightInMeters)).toFixed(1));
}

export function classifyWeightTrend(points: WeightPoint[]): WeightTrend {
  if (points.length < 2) return 'unknown';

  const ordered = [...points]
    .filter((point) => Number.isFinite(point.weightKg))
    .sort((left, right) => new Date(left.occurredAt).getTime() - new Date(right.occurredAt).getTime());

  if (ordered.length < 2) return 'unknown';

  const delta = ordered[ordered.length - 1].weightKg - ordered[0].weightKg;
  if (delta <= -0.7) return 'down';
  if (delta >= 0.7) return 'up';
  return 'stable';
}

export function buildAdherenceScore(params: {
  dosesTaken: number;
  dosesExpected: number;
  weighInsLast14Days: number;
}): number | null {
  if (params.dosesExpected <= 0 && params.weighInsLast14Days <= 0) return null;

  const doseComponent =
    params.dosesExpected > 0
      ? Math.min(1, Math.max(0, params.dosesTaken / params.dosesExpected))
      : 0.5;
  const weighInComponent = Math.min(1, params.weighInsLast14Days / 3);

  return Math.round((doseComponent * 0.7 + weighInComponent * 0.3 + Number.EPSILON) * 100);
}
