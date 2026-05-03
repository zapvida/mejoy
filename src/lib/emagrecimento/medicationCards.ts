import type { EmagrecimentoTrilha } from '@/lib/emagrecimento/checkoutUrls';
import { TREATMENT_TRACKS } from '@/lib/emagrecimento/treatmentTracks';

export interface MedicationTrackCard {
  id: EmagrecimentoTrilha;
  title: string;
  shortTitle: string;
  subtitle: string;
  principle?: string;
  potencyLabel: string;
  certaintyLabel: string;
  efficacyRangePercent?: [number, number];
  efficacyText: string;
  safetyText: string;
  plainLanguageFit: string;
}

const EFFICACY_RANGE_BY_TRACK: Partial<Record<EmagrecimentoTrilha, [number, number]>> = {
  tirzepatida: [15, 21],
  semaglutida: [10, 15],
  contrave: [5, 8],
  alternativas_clinicas: [5, 10],
};

export const medicationTrackCards: MedicationTrackCard[] = TREATMENT_TRACKS.map(track => ({
  id: track.id,
  title: track.title,
  shortTitle: track.shortTitle,
  subtitle: track.subtitle,
  principle: track.principle,
  potencyLabel: track.potency,
  certaintyLabel: track.certainty,
  efficacyRangePercent: EFFICACY_RANGE_BY_TRACK[track.id],
  efficacyText: track.efficacy,
  safetyText: track.safety,
  plainLanguageFit: track.bestFor,
}));

export function getMedicationTrackCard(trilha: EmagrecimentoTrilha) {
  return medicationTrackCards.find(card => card.id === trilha) || medicationTrackCards[3];
}

export function estimateWeightLossRangeKg(weightKg: number | undefined, rangePercent?: [number, number]) {
  if (!weightKg || !rangePercent) return null;

  const [minPercent, maxPercent] = rangePercent;
  const minKg = Math.round(weightKg * (minPercent / 100) * 10) / 10;
  const maxKg = Math.round(weightKg * (maxPercent / 100) * 10) / 10;

  return {
    minKg,
    maxKg,
    label:
      minKg === maxKg
        ? `algo perto de ${formatKg(minKg)}`
        : `algo perto de ${formatKg(minKg)} a ${formatKg(maxKg)}`,
  };
}

function formatKg(value: number) {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  })} kg`;
}
