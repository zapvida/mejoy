import type { DerivationContext, Report, TabRoadmap } from "@/lib/report/types";
import { createBaseReport, makeScore, mergeReport } from "./_shared";

const stringOrEmpty = (value: unknown): string => (typeof value === "string" ? value : "");

const parseList = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(item => String(item)).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/\r?\n|•|-/)
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [];
};

const buildRoadmap = (sections: Record<string, unknown>): TabRoadmap[] => {
  const plan = (sections.plan as Record<string, unknown>) ?? {};
  const quick = (key: string, defaults: string[]): string[] => {
    const list = parseList((plan as any)[key]);
    return (list.length ? list : defaults).slice(0, 5);
  };

  return [
    {
      id: "nutricao",
      title: "Nutrição Metabólica",
      icon: "🥗",
      quickWins: quick("nutricao", [
        "Prato 50/25/25 (vegetais, proteínas, carboidratos integrais)",
        "Fibras ≥ 25 g/dia",
        "Trocar açúcar por frutas inteiras",
      ]).map(label => ({ label, how: label })),
      goal: {
        label: "Glicemia estável",
        target: "Glicemia de jejum < 100 mg/dL",
        measure: "Registros capilares ou exames",
      },
    },
    {
      id: "movimento",
      title: "Movimento & Força",
      icon: "🏋️",
      quickWins: quick("movimento", [
        "Treino resistido 3x/semana (30 min)",
        "Caminhada pós-principal refeição (10 min)",
      ]).map(label => ({ label, how: label })),
      goal: {
        label: "150-210 min/semana atividade combinada",
        target: "≥ 600 MET-min/sem",
        measure: "Minutos/semana",
      },
    },
    {
      id: "sono",
      title: "Sono & Recuperação",
      icon: "🌙",
      quickWins: quick("sono", [
        "Dormir 7-8h para melhorar sensibilidade insulínica",
        "Cortar cafeína após 14h",
      ]).map(label => ({ label, how: label })),
      goal: {
        label: "Sono consistente",
        target: "Latência < 20 min, despertares ≤ 1",
        measure: "Diário do sono",
      },
    },
    {
      id: "estresse",
      title: "Estresse & Hormônios",
      icon: "🧠",
      quickWins: quick("estresse", [
        "Respiração caixa 5 min ao acordar",
        "Agenda com intervalos de pausa a cada 90 min",
      ]).map(label => ({ label, how: label })),
      goal: {
        label: "Cortisol matinal equilibrado",
        target: "Escala de estresse ≤ 4/10",
        measure: "Autoavaliação diária",
      },
    },
    {
      id: "testes",
      title: "Check-ups Dirigidos",
      icon: "🧪",
      quickWins: quick("testes", ["Agendar exames prioritários", "Compartilhar resultados com médico"]).map(label => ({
        label,
        how: label,
      })),
      goal: {
        label: "Checklist concluído",
        target: "100%",
        measure: "Checklist",
      },
    },
  ];
};

export const derive = (context: DerivationContext): Report => {
  const sections = (context.sections as Record<string, unknown>) ?? {};
  const answers = context.answers ?? {};

  const currentScore =
    Number((sections as any).score ?? answers.metabolicScore ?? answers.score ?? 55) || 55;
  const futureScore =
    Number((sections as any).scoreFuture ?? answers.metabolicPotential ?? answers.scoreFuture ?? 78) ||
    undefined;

  const score = makeScore(currentScore, futureScore);

  const base = createBaseReport(
    context,
    {
      headline: `Metabolismo sob nova direção`,
      heroSummary:
        stringOrEmpty(sections.heroSummary) ||
        "Equilibrar glicemia, lipídios e inflamação requer rotina previsível. Vamos construir isso passo a passo.",
      healthStatement:
        stringOrEmpty(sections.healthStatement) ||
        "As próximas 12 semanas são decisivas para reduzir circunferência abdominal, estabilizar marcadores e elevar energia.",
      tone: score.level === "high" ? "urgent" : "motivational",
    },
    score,
    buildRoadmap(sections),
    Array.isArray((sections as any).redFlags)
      ? (sections as any).redFlags.map((flag: any, idx: number) => ({
          id: flag.id ?? `flag-${idx}`,
          level: flag.severity === "high" ? "danger" : flag.severity === "medium" ? "warn" : "info",
          title: flag.description ?? "Alerta identificado",
          why: flag.reason ?? flag.description ?? "",
          action: flag.action
            ? {
                label: flag.action,
                href: "/atendimento?utm_source=report",
              }
            : undefined,
        }))
      : [],
    undefined,
    Array.isArray((sections as any).evidence)
      ? (sections as any).evidence.map((item: any) => ({
          cite: stringOrEmpty(item.cite ?? item.title ?? ""),
          url: stringOrEmpty(item.url ?? item.href ?? ""),
        }))
      : [
          { cite: "American Diabetes Association. Standards of Care 2024." },
          { cite: "Esposito K. et al. (2022) Mediterranean diet and metabolic markers." },
        ],
  );

  const exams = Array.isArray((sections as any).exams)
    ? (sections as any).exams.map((exam: any) => ({
        name: stringOrEmpty(exam.name ?? ""),
        why: stringOrEmpty(exam.why ?? ""),
        when: stringOrEmpty(exam.when ?? ""),
        prep: stringOrEmpty(exam.prep ?? ""),
      }))
    : [
        {
          name: "Hemoglobina glicada (HbA1c)",
          why: "Monitorar controle glicêmico médio",
          when: "a cada 3 meses",
        },
        {
          name: "Perfil lipídico completo",
          why: "Avaliar risco cardiovascular",
          when: "a cada 6 meses",
          prep: "Jejum 12 horas",
        },
        {
          name: "Insulina + HOMA-IR",
          why: "Medir resistência insulínica",
          when: "agora",
        },
      ];

  const supplements = Array.isArray((sections as any).supplements)
    ? (sections as any).supplements.map((supp: any) => ({
        name: stringOrEmpty(supp.name ?? ""),
        dose: stringOrEmpty(supp.dose ?? ""),
        note: stringOrEmpty(supp.note ?? ""),
      }))
    : [
        {
          name: "Ômega-3 (EPA/DHA)",
          dose: "2 g/dia",
          note: "Reduz inflamação e triglicérides",
        },
        {
          name: "Magnésio citrato",
          dose: "300-400 mg/dia",
          note: "Apoia sensibilidade insulínica",
        },
      ];

  return mergeReport(base, { exams, supplements });
};
