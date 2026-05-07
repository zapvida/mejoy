import type { DashboardInsightBlock, JourneyInsight } from '@mejoy/api-contracts/mobile';
import type { WeightTrend } from './glp1';

export function buildRiskStatus(params: {
  highSeveritySideEffects: number;
  sleepDurationHours?: number | null;
  adherenceScore?: number | null;
}) {
  if (params.highSeveritySideEffects > 0) {
    return {
      level: 'high' as const,
      label: 'Atenção clínica',
      summary: 'Há sinais que merecem revisão humana antes do próximo ajuste.',
    };
  }

  if (
    (params.sleepDurationHours != null && params.sleepDurationHours < 6) ||
    (params.adherenceScore != null && params.adherenceScore < 60)
  ) {
    return {
      level: 'attention' as const,
      label: 'Ajuste fino',
      summary: 'A jornada segue ativa, mas sono ou adesão estão puxando risco para cima.',
    };
  }

  return {
    level: 'low' as const,
    label: 'Base estável',
    summary: 'O cenário atual é compatível com continuidade e refinamento de rotina.',
  };
}

export function buildDashboardInsights(params: {
  adherenceScore?: number | null;
  sleepScore?: number | null;
  weightTrend: WeightTrend;
  latestWeightKg?: number | null;
}) {
  const insights: DashboardInsightBlock[] = [];

  if (params.latestWeightKg != null) {
    insights.push({
      id: 'weight-signal',
      title: 'Seu painel já tem um ponto de referência real',
      body: 'A consistência de pesagem melhora muito a precisão do acompanhamento longitudinal.',
      tone: 'clinical',
      metricLabel: 'Peso atual',
      metricValue: `${params.latestWeightKg} kg`,
      supportingCopy: 'Mantenha a cadência de registro para o app diferenciar flutuação de tendência.',
      cta: null,
    });
  }

  if (params.weightTrend === 'down') {
    insights.push({
      id: 'trend-down',
      title: 'A trajetória está favorecendo evolução',
      body: 'Seu histórico recente sugere resposta consistente à jornada atual.',
      tone: 'celebration',
      metricLabel: 'Tendência',
      metricValue: 'Descendo',
      supportingCopy: 'Agora o foco é sustentar rotina, sono e adesão.',
      cta: null,
    });
  } else if (params.weightTrend === 'up') {
    insights.push({
      id: 'trend-up',
      title: 'O corpo está pedindo recalibração',
      body: 'Vale revisar gatilhos de alimentação, sono e regularidade da dose.',
      tone: 'warning',
      metricLabel: 'Tendência',
      metricValue: 'Subindo',
      supportingCopy: 'Pequenos ajustes feitos cedo evitam perda de tração.',
      cta: null,
    });
  }

  if (params.sleepScore != null) {
    insights.push({
      id: 'sleep-score',
      title: 'Sono é a sua alavanca silenciosa',
      body: 'Consistência de sono melhora fome, energia e execução do plano.',
      tone: params.sleepScore >= 75 ? 'performance' : 'warning',
      metricLabel: 'Sleep score',
      metricValue: `${params.sleepScore}/100`,
      supportingCopy:
        params.sleepScore >= 75
          ? 'Boa base. Preserve o horário de desligamento.'
          : 'Seu sistema ainda está operando com débito de recuperação.',
      cta: null,
    });
  }

  if (params.adherenceScore != null) {
    insights.push({
      id: 'adherence-score',
      title: 'Adesão é o indicador que mais prediz consistência',
      body: 'O score combina dose, pesagem e ritmo geral da jornada.',
      tone: params.adherenceScore >= 75 ? 'performance' : 'clinical',
      metricLabel: 'Adesão',
      metricValue: `${params.adherenceScore}%`,
      supportingCopy:
        params.adherenceScore >= 75
          ? 'Você está operando com disciplina acima da média.'
          : 'Há margem para simplificar sua rotina e reduzir atrito.',
      cta: null,
    });
  }

  return insights.slice(0, 4);
}

export function buildJourneyInsights(params: {
  adherenceScore?: number | null;
  sleepScore?: number | null;
  weightTrend: WeightTrend;
  sideEffectCount: number;
  ritualSessionsCompleted: number;
}) {
  const insights: JourneyInsight[] = [];

  if (params.weightTrend === 'down') {
    insights.push({
      id: 'journey-weight-down',
      source: 'weight',
      title: 'Peso em trajetória favorável',
      body: 'A leitura longitudinal mostra direção coerente com continuidade do plano.',
      tone: 'good',
    });
  }

  if ((params.adherenceScore ?? 0) < 65) {
    insights.push({
      id: 'journey-adherence-focus',
      source: 'dose',
      title: 'A adesão merece proteção extra esta semana',
      body: 'Ajuste lembretes, janela de aplicação e gatilhos ambientais.',
      tone: 'focus',
    });
  }

  if ((params.sleepScore ?? 100) < 70) {
    insights.push({
      id: 'journey-sleep-warning',
      source: 'sleep',
      title: 'Sono abaixo da zona ideal',
      body: 'Recuperação baixa costuma aumentar fome, impulsividade e cansaço.',
      tone: 'warning',
    });
  }

  if (params.ritualSessionsCompleted > 0) {
    insights.push({
      id: 'journey-ritual-good',
      source: 'ritual',
      title: 'Você já começou a construir regulação',
      body: 'Rituais curtos ganham força quando ficam ligados aos gatilhos certos do dia.',
      tone: 'good',
    });
  }

  if (params.sideEffectCount > 0) {
    insights.push({
      id: 'journey-side-effect-focus',
      source: 'dose',
      title: 'Sintomas registrados',
      body: 'Monitore intensidade e persistência para diferenciar adaptação de alerta clínico.',
      tone: 'focus',
    });
  }

  return insights.slice(0, 5);
}
