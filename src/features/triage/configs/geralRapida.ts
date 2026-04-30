import type { DerivationContext, Report } from "@/lib/report/types";
import { createBaseReport, mergeReport, determineRiskLevel } from "./_shared";

const stringOrEmpty = (value: unknown): string => (typeof value === "string" ? value : "");

const makeScore = (current: number, future?: number) => ({
  current: Math.round(current),
  potential: future ? Math.round(future) : undefined,
  level: determineRiskLevel(current),
});

const buildRoadmap = (sections: Record<string, unknown>) => {
  const quickWins = Array.isArray((sections as any).quickWins)
    ? (sections as any).quickWins.map((item: any) => ({
        label: stringOrEmpty(item.label ?? item.title ?? ""),
        how: stringOrEmpty(item.how ?? item.description ?? ""),
        evidence: stringOrEmpty(item.evidence ?? ""),
      }))
    : [];

  return [
    {
      id: "sono" as const,
      title: "Qualidade do Sono",
      icon: "🌙",
      quickWins: quickWins.filter((item: any) => 
        item.label.toLowerCase().includes("sono") || 
        item.label.toLowerCase().includes("dormir")
      ).length > 0 ? quickWins.filter((item: any) => 
        item.label.toLowerCase().includes("sono") || 
        item.label.toLowerCase().includes("dormir")
      ) : [
        {
          label: "Rotina de sono consistente",
          how: "Deitar e levantar sempre no mesmo horário, mesmo nos fins de semana",
          evidence: "Melhora qualidade do sono em 2-3 semanas",
        },
        {
          label: "Evitar telas 1h antes de dormir",
          how: "Usar modo noturno ou ler um livro físico",
          evidence: "Reduz tempo para adormecer em 15-20 minutos",
        },
      ],
      goal: {
        label: "Sono de 7-8 horas por noite",
        target: "Latência < 20 minutos",
        measure: "Diário de sono por 1 semana",
      },
      cta: {
        label: "Baixar app de sono",
        href: "/recursos/sono",
        type: "secondary" as const,
      },
    },
    {
      id: "nutricao" as const,
      title: "Nutrição e Hidratação",
      icon: "🥗",
      quickWins: quickWins.filter((item: any) => 
        item.label.toLowerCase().includes("água") || 
        item.label.toLowerCase().includes("comida") ||
        item.label.toLowerCase().includes("nutri")
      ).length > 0 ? quickWins.filter((item: any) => 
        item.label.toLowerCase().includes("água") || 
        item.label.toLowerCase().includes("comida") ||
        item.label.toLowerCase().includes("nutri")
      ) : [
        {
          label: "Hidratação adequada",
          how: "2-3 litros de água por dia, começando com 1 copo ao acordar",
          evidence: "Melhora energia e concentração em 3-5 dias",
        },
        {
          label: "Mais vegetais no prato",
          how: "Metade do prato com vegetais coloridos em cada refeição",
          evidence: "Aumenta vitaminas e antioxidantes naturalmente",
        },
      ],
      goal: {
        label: "5 porções de frutas/vegetais por dia",
        target: "2L água + 3 porções vegetais",
        measure: "Checklist diário por 2 semanas",
      },
      cta: {
        label: "Cardápio semanal gratuito",
        href: "/recursos/nutricao",
        type: "secondary" as const,
      },
    },
    {
      id: "movimento" as const,
      title: "Atividade Física",
      icon: "🏃‍♂️",
      quickWins: quickWins.filter((item: any) => 
        item.label.toLowerCase().includes("exercício") || 
        item.label.toLowerCase().includes("caminhada") ||
        item.label.toLowerCase().includes("movimento")
      ).length > 0 ? quickWins.filter((item: any) => 
        item.label.toLowerCase().includes("exercício") || 
        item.label.toLowerCase().includes("caminhada") ||
        item.label.toLowerCase().includes("movimento")
      ) : [
        {
          label: "Caminhada diária",
          how: "30 minutos por dia, pode ser dividido em 3x 10 minutos",
          evidence: "Reduz risco cardiovascular em 30%",
        },
        {
          label: "Subir escadas",
          how: "Usar escadas em vez do elevador sempre que possível",
          evidence: "Queima 2x mais calorias que caminhada",
        },
      ],
      goal: {
        label: "150 minutos de atividade moderada por semana",
        target: "30 min/dia x 5 dias",
        measure: "App de fitness ou pedômetro",
      },
      cta: {
        label: "Plano de exercícios gratuito",
        href: "/recursos/exercicios",
        type: "secondary" as const,
      },
    },
    {
      id: "estresse" as const,
      title: "Gestão de Estresse",
      icon: "🧠",
      quickWins: quickWins.filter((item: any) => 
        item.label.toLowerCase().includes("estresse") || 
        item.label.toLowerCase().includes("respiração") ||
        item.label.toLowerCase().includes("meditação")
      ).length > 0 ? quickWins.filter((item: any) => 
        item.label.toLowerCase().includes("estresse") || 
        item.label.toLowerCase().includes("respiração") ||
        item.label.toLowerCase().includes("meditação")
      ) : [
        {
          label: "Respiração 4-7-8",
          how: "Inspirar 4s, segurar 7s, expirar 8s. Repetir 3x",
          evidence: "Reduz cortisol em 5 minutos",
        },
        {
          label: "Micro-pausas",
          how: "A cada 2 horas, parar 2 minutos para respirar fundo",
          evidence: "Melhora foco e reduz tensão muscular",
        },
      ],
      goal: {
        label: "Técnicas de relaxamento diárias",
        target: "10 minutos/dia de prática",
        measure: "App de meditação ou timer",
      },
      cta: {
        label: "Guia de meditação gratuito",
        href: "/recursos/meditacao",
        type: "secondary" as const,
      },
    },
    {
      id: "testes" as const,
      title: "Exames Preventivos",
      icon: "🧪",
      quickWins: [
        {
          label: "Agendar check-up anual",
          how: "Marcar consulta médica para avaliação geral",
          evidence: "Detecção precoce aumenta chances de cura",
        },
        {
          label: "Exames básicos",
          how: "Hemograma, glicemia, colesterol e pressão arterial",
          evidence: "Identifica riscos silenciosos",
        },
      ],
      goal: {
        label: "Check-up completo anual",
        target: "100% dos exames recomendados",
        measure: "Lista de exames por idade",
      },
      cta: {
        label: "Agendar consulta",
        href: "/atendimento",
        type: "primary" as const,
      },
    },
  ];
};

export const derive = (context: DerivationContext): Report => {
  const sections = (context.sections as Record<string, unknown>) ?? {};
  const answers = context.answers ?? {};

  const currentScore =
    Number((sections as any).score ?? (sections as any).scoreAtual ?? answers.score ?? 75) || 75;
  const futureScore =
    Number((sections as any).scoreFuture ?? (sections as any).scorePotencial ?? answers.scoreFuture ?? 90) ||
    undefined;

  const score = makeScore(currentScore, futureScore);

  const base = createBaseReport(
    context,
    {
      headline: `Plano de saúde personalizado para ${context.patient.name}`,
      heroSummary:
        stringOrEmpty(sections.heroSummary) ||
        "Sua saúde geral está em boa forma! Vamos otimizar hábitos para manter e melhorar ainda mais seu bem-estar.",
      healthStatement:
        stringOrEmpty(sections.healthStatement) ||
        "Com pequenos ajustes na rotina, você pode potencializar sua energia, imunidade e longevidade.",
      tone: score.level === "high" ? "urgent" : score.level === "medium" ? "motivational" : "reassuring",
    },
    score,
    buildRoadmap(sections),
    Array.isArray((sections as any).redFlags)
      ? (sections as any).redFlags.map((flag: any, idx: number) => ({
          id: flag.id ?? `flag-${idx}`,
          level: flag.severity === "high" ? "danger" : flag.severity === "medium" ? "warn" : "info",
          title: flag.description ?? "Atenção necessária",
          why: flag.reason ?? flag.description ?? "",
          action: flag.action
            ? {
                label: flag.action,
                href: "/atendimento?utm_source=report",
                type: "primary" as const,
              }
            : undefined,
        }))
      : [],
    Array.isArray((sections as any).timeline)
      ? (sections as any).timeline
          .map((event: any) => ({
            date: stringOrEmpty(event.date ?? event.data ?? ""),
            label: stringOrEmpty(event.label ?? event.descricao ?? ""),
            status: (event.status ?? "pending") as "completed" | "scheduled" | "pending",
            details: stringOrEmpty(event.details ?? ""),
            icon: event.icon ?? "🗓️",
          }))
          .filter((timelineEvent: { label?: string }) => Boolean(timelineEvent.label))
      : undefined,
    Array.isArray((sections as any).evidence)
      ? (sections as any).evidence.map((item: any) => ({
          cite: stringOrEmpty(item.cite ?? item.title ?? ""),
          url: stringOrEmpty(item.url ?? item.href ?? ""),
        }))
      : [
          { cite: "World Health Organization. Physical Activity Guidelines 2020." },
          { cite: "Harvard T.H. Chan School of Public Health. Nutrition Source." },
        ],
  );

  const exams = Array.isArray((sections as any).exams)
    ? (sections as any).exams.map((exam: any) => ({
        name: stringOrEmpty(exam.name ?? exam.exame ?? ""),
        why: stringOrEmpty(exam.why ?? exam.motivo ?? ""),
        when: stringOrEmpty(exam.when ?? exam.quando ?? "agora"),
        prep: stringOrEmpty(exam.prep ?? exam.preparo ?? ""),
      }))
    : [
        {
          name: "Hemograma completo",
          why: "Avaliar saúde geral e detectar anemia",
          when: "anualmente",
          prep: "Jejum 8 horas",
        },
        {
          name: "Glicemia de jejum",
          why: "Monitorar risco de diabetes",
          when: "anualmente",
          prep: "Jejum 12 horas",
        },
        {
          name: "Perfil lipídico",
          why: "Avaliar risco cardiovascular",
          when: "anualmente",
          prep: "Jejum 12 horas",
        },
        {
          name: "Pressão arterial",
          why: "Detectar hipertensão precoce",
          when: "a cada 6 meses",
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
          name: "Vitamina D3",
          dose: "1000-2000 UI/dia",
          note: "Especialmente importante no inverno",
        },
        {
          name: "Ômega-3",
          dose: "1-2g/dia",
          note: "Para saúde cardiovascular e cerebral",
        },
      ];

  return mergeReport(base, { exams, supplements });
};
