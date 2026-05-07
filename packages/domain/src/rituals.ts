import type { RitualTrack } from '@mejoy/api-contracts/mobile';

export function getDefaultRitualTracks(): RitualTrack[] {
  return [
    {
      id: 'ritual-focus-reset',
      slug: 'focus-reset',
      title: 'Focus Reset',
      subtitle: 'Reorganize energia mental antes de voltar para o trabalho.',
      durationMinutes: 3,
      category: 'focus',
      accent: '#1E5EFF',
      benefit: 'Reduz dispersão e devolve clareza em minutos.',
      recommendedFor: 'Manhã intensa, reuniões em sequência ou queda de foco.',
      audioUrl: null,
      isFeatured: true,
    },
    {
      id: 'ritual-craving-control',
      slug: 'craving-control',
      title: 'Craving Control',
      subtitle: 'Interrompa o impulso e recupere decisão antes de comer.',
      durationMinutes: 5,
      category: 'craving',
      accent: '#FF8A3D',
      benefit: 'Cria espaço entre impulso e ação alimentar.',
      recommendedFor: 'Desejo intenso por doce, combo ou refeição fora do plano.',
      audioUrl: null,
      isFeatured: false,
    },
    {
      id: 'ritual-anxiety-downshift',
      slug: 'anxiety-downshift',
      title: 'Anxiety Downshift',
      subtitle: 'Desacelere tensão fisiológica antes que ela tome o dia.',
      durationMinutes: 7,
      category: 'anxiety',
      accent: '#7C4DFF',
      benefit: 'Reduz ativação e melhora autocontrole.',
      recommendedFor: 'Estresse, aperto no peito, mente acelerada e fome emocional.',
      audioUrl: null,
      isFeatured: false,
    },
    {
      id: 'ritual-sleep-landing',
      slug: 'sleep-landing',
      title: 'Sleep Landing',
      subtitle: 'Feche o dia e proteja a janela de sono com um pouso limpo.',
      durationMinutes: 10,
      category: 'pre-sleep',
      accent: '#123B73',
      benefit: 'Melhora transição para a noite e consistência do sono.',
      recommendedFor: 'Pré-sono, viagens, dia longo ou sono instável.',
      audioUrl: null,
      isFeatured: false,
    },
  ];
}

export function pickSuggestedRitual(params: {
  sleepDurationHours?: number | null;
  adherenceScore?: number | null;
  highRiskMeal?: boolean;
  stressSignal?: boolean;
}): RitualTrack {
  const tracks = getDefaultRitualTracks();

  if (params.sleepDurationHours != null && params.sleepDurationHours < 6.5) {
    return tracks.find((track) => track.category === 'pre-sleep') || tracks[0];
  }

  if (params.highRiskMeal) {
    return tracks.find((track) => track.category === 'craving') || tracks[0];
  }

  if (params.stressSignal || (params.adherenceScore != null && params.adherenceScore < 65)) {
    return tracks.find((track) => track.category === 'anxiety') || tracks[0];
  }

  return tracks.find((track) => track.category === 'focus') || tracks[0];
}
