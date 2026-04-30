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
  const quick = (key: string, fallback: string[]): string[] => {
    const list = parseList((plan as any)[key]);
    return (list.length ? list : fallback).slice(0, 5);
  };

  return [
    {
      id: "sono",
      title: "Sono Restaurador",
      icon: "😴",
      quickWins: quick("sono", [
        "Dormir e acordar no mesmo horário (±30min)",
        "Evitar telas brilhantes 60 min antes de deitar",
        "Criar ritual relaxante de 3 etapas",
      ]).map(item => ({ label: item, how: item })),
      goal: {
        label: "Sono de 7-8h com despertares ≤ 1",
        target: "Latência < 20 min e eficiência ≥ 85%",
        measure: "Diário do sono",
        reminder: "Atualize diariamente, de preferência pela manhã.",
      },
    },
    {
      id: "estresse",
      title: "Estresse & Ritmos",
      icon: "🧘",
      quickWins: quick("estresse", [
        "Respiração 4-7-8 por 3 ciclos antes de dormir",
        "Banho morno ou alongamento leve à noite",
      ]).map(item => ({ label: item, how: item })),
      goal: {
        label: "Escala de estresse ≤ 4/10",
        target: "3 práticas calmantes/dia",
        measure: "Escala subjetiva",
      },
    },
    {
      id: "nutricao",
      title: "Nutrição & Energia",
      icon: "🍵",
      quickWins: quick("nutricao", [
        "Ceia leve com triptofano (banana + aveia)",
        "Reduzir cafeína após 14h",
      ]).map(item => ({ label: item, how: item })),
      goal: {
        label: "Estabilidade glicêmica noturna",
        target: "Sem hipoglicemias percebidas",
        measure: "Diário alimentar",
      },
    },
    {
      id: "movimento",
      title: "Movimento Inteligente",
      icon: "🏃",
      quickWins: quick("movimento", [
        "Luz solar e caminhada suave ao acordar",
        "Treino moderado até 18h",
      ]).map(item => ({ label: item, how: item })),
      goal: {
        label: "150 min/semana de atividade aeróbica",
        target: "RPE 5-6",
        measure: "Minutos/semana",
      },
    },
    {
      id: "testes",
      title: "Monitoramento",
      icon: "📈",
      quickWins: quick("testes", ["Atualizar checklist abaixo", "Compartilhar diário com o especialista"]).map(item => ({
        label: item,
        how: item,
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
    Number((sections as any).score ?? (sections as any).sleepScore ?? answers.sleepScore ?? 58) || 58;
  const futureScore =
    Number((sections as any).scoreFuture ?? (sections as any).sleepPotential ?? answers.sleepPotential ?? 82) ||
    undefined;

  const score = makeScore(currentScore, futureScore);

  const base = createBaseReport(
    context,
    {
      headline: `Sono sob controle para ${context.patient.name.split(" ")[0] ?? context.patient.name}`,
      heroSummary:
        stringOrEmpty(sections.heroSummary) ||
        "Seu relógio biológico está pedindo regularidade: vamos alinhar comportamento, ambiente e exames.",
      healthStatement:
        stringOrEmpty(sections.healthStatement) ||
        "Em 2 a 4 semanas, a combinação de rotina consistente, exposição à luz e higiene do sono tende a reduzir despertares e fadiga.",
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
          { cite: "Hirshkowitz M. et al. (2015) National Sleep Foundation guidelines." },
          { cite: "Irish LA et al. (2015) Behavior-based recommendations for sleep." },
        ],
  );

  const exams = Array.isArray((sections as any).exams)
    ? (sections as any).exams.map((exam: any) => ({
        name: stringOrEmpty(exam.name ?? exam.exame ?? ""),
        why: stringOrEmpty(exam.why ?? ""),
        when: stringOrEmpty(exam.when ?? ""),
        prep: stringOrEmpty(exam.prep ?? ""),
      }))
    : [
        {
          name: "Polissonografia domiciliar ou laboratório",
          why: "Investigação de apneia, PLM ou parassonias",
          when: "a critério médico",
        },
        {
          name: "Perfil férrico (ferritina, ferro sérico)",
          why: "Descartar deficiência associada à síndrome das pernas inquietas",
          when: "agora",
        },
        {
          name: "TSH, T3, T4",
          why: "Avaliar disfunção tireoidiana impactando sono e energia",
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
          name: "Magnésio glicina/treonato",
          dose: "200-350 mg à noite",
          note: "Avaliar tolerância gastrointestinal",
        },
        {
          name: "Melatonina de liberação controlada",
          dose: "0,5-1 mg, 60-90 min antes de dormir",
          note: "Usar por até 12 semanas com acompanhamento médico",
        },
      ];

  return mergeReport(base, { exams, supplements });
};
