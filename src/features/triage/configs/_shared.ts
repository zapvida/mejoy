import type {
  Alert,
  DerivationContext,
  EvidenceItem,
  Report,
  ReportNarrative,
  ReportScore,
  RiskLevel,
  TabRoadmap,
  TimelineEvent,
} from "@/lib/report/types";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const determineRiskLevel = (score: number): RiskLevel => {
  if (score >= 80) return "low";
  if (score >= 60) return "medium";
  return "high";
};

export const makeScore = (current?: number | null, potential?: number | null): ReportScore => {
  const safeCurrent = clamp(Number.isFinite(current ?? NaN) ? Number(current) : 62, 0, 100);
  const safePotential = potential != null && Number.isFinite(potential)
    ? clamp(Number(potential), safeCurrent, 100)
    : undefined;

  return {
    current: safeCurrent,
    level: determineRiskLevel(safeCurrent),
    ...(safePotential !== undefined ? { potential: safePotential } : {})
  };
};

const defaultTimeline = (): TimelineEvent[] => [
  { date: "Hoje", label: "Relatório gerado", status: "completed", icon: "📝" },
  { date: "+7 dias", label: "Primeiro check-in", status: "scheduled", icon: "📅" },
  { date: "+30 dias", label: "Revisão com especialista", status: "pending", icon: "🩺" },
];

export const createBaseReport = (
  context: DerivationContext,
  narrative: Partial<ReportNarrative>,
  score: ReportScore,
  roadmap: TabRoadmap[],
  alerts: Alert[] = [],
  timeline: TimelineEvent[] = defaultTimeline(),
  evidence: EvidenceItem[] = [],
): Report => {
  const { patient, triage, summary, sections } = context;

  const report: any = {
    id: sections?.id?.toString?.() ?? context.answers?.sessionId?.toString?.() ?? "report",
    triage,
    createdAt: new Date().toISOString(),
    narrative: {
      headline: narrative.headline ?? `Plano personalizado para ${patient.name}`,
      heroSummary:
        narrative.heroSummary ??
        (summary || "Seu relatório traduz sinais importantes em passos claros para cuidar da sua saúde."),
      healthStatement:
        narrative.healthStatement ??
        "Vamos avançar com calma: você recebe um plano feito sob medida para virar o jogo nas próximas semanas.",
      tone: narrative.tone ?? "motivational",
    },
    scores: {
      ...score,
      summary:
        score.level === "high"
          ? "Precisamos agir agora mesmo para reduzir riscos nas próximas semanas."
          : score.level === "medium"
            ? "Bom progresso, mas ainda temos ajustes-chave para proteger sua saúde."
            : "Excelente base! Vamos seguir com hábitos consistentes para manter esse resultado.",
    },
    patient,
    alerts,
    roadmap,
    exams: [],
    supplements: [],
    evidence,
    timeline,
    summary: summary ?? "",
    media: undefined,
    features: {
      enableAudio: true,
      enablePremiumUpsell: true,
      enableShare: true,
      enableScientificFacts: true,
      enableShoppingList: true,
      enablePersonalizedExams: true,
      enableCalculators: true,
      enableMicroHabits: true,
    },
  };
  
  return report as Report;
};

export const mergeReport = (base: Report, partial: Partial<Report>): Report => {
  const merged: any = {
    ...base,
    ...partial,
    narrative: { ...base.narrative, ...partial.narrative },
    scores: { ...base.scores, ...partial.scores },
    patient: { ...base.patient, ...partial.patient },
    alerts: partial.alerts ?? base.alerts,
    roadmap: partial.roadmap ?? base.roadmap,
    exams: partial.exams ?? base.exams,
    supplements: partial.supplements ?? base.supplements,
    evidence: partial.evidence ?? base.evidence,
    timeline: partial.timeline ?? base.timeline,
    media: partial.media ?? base.media,
    features: { ...base.features, ...partial.features },
  };
  return merged as Report;
};
