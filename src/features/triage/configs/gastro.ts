import type { DerivationContext, Report, TabRoadmap } from "@/lib/report/types";
import { createBaseReport, makeScore, mergeReport } from "./_shared";
import { GI_ENHANCED } from "@/lib/flags";
import { deriveGI } from "@/types/triage-gastro";
import { humanizeDuration } from "@/lib/format/duration";
import { buildCTAsGI } from "@/features/triage/ctas";

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

  const toRoadmapTab = (
    id: TabRoadmap["id"],
    title: string,
    icon: string,
    content: unknown,
    fallback: string[],
  ): TabRoadmap => {
    const items = parseList(content);
    return {
      id,
      title,
      icon,
      quickWins: (items.length ? items : fallback).slice(0, 5).map(label => ({
        label,
        how: label,
      })),
      goal: {
        label:
          id === "nutricao"
            ? "Organizar refeições sem gatilhos"
            : id === "sono"
              ? "Sono restaurador 7-8h"
              : id === "movimento"
                ? "Movimento diário"
                : id === "estresse"
                  ? "Reduzir tensão abdominal"
                  : "Checklist concluído",
        target:
          id === "nutricao"
            ? "Plano alimentar semanal definido"
            : id === "sono"
              ? "Latência < 20 min e despertares < 2"
              : id === "movimento"
                ? "150 min/semana"
                : id === "estresse"
                  ? "Escala de estresse ≤ 3/10"
                  : "100%",
        measure:
          id === "nutricao"
            ? "Diário alimentar"
            : id === "sono"
              ? "Diário do sono"
              : id === "movimento"
                ? "Minutos por semana"
                : id === "estresse"
                  ? "Autoavaliação diária"
                  : "Checklist",
      },
    };
  };

  return [
    toRoadmapTab("nutricao", "Nutrição", "🥗", plan.nutricao, [
      "Criar diário alimentar de 7 dias",
      "Reduzir lactose por 14 dias",
      "Adicionar fibras solúveis (aveia, chia)",
    ]),
    toRoadmapTab("sono", "Sono", "🌙", plan.sono, [
      "Sono antes das 23h, sem telas 60 min antes",
      "Luz natural ao acordar por 10 minutos",
      "Evitar refeições volumosas à noite",
    ]),
    toRoadmapTab("movimento", "Movimento", "🏃‍♀️", plan.movimento ?? plan.atividadeFisica, [
      "Caminhar 25 min, 5x/semana",
      "Incluir alongamentos leves pós-refeição",
    ]),
    toRoadmapTab("estresse", "Stress & Emoções", "🧘‍♀️", plan.estresse ?? plan.saudeMental, [
      "Respiração 4-7-8 por 5 minutos, 3x/dia",
      "Prática curta de mindfulness após o almoço",
    ]),
    toRoadmapTab("testes", "Testes & Checkups", "🧪", plan.testes ?? plan.examesCheckup, [
      "Agendar exames listados abaixo",
      "Registrar sintomas com escala 0-10",
    ]),
  ];
};

export const derive = (context: DerivationContext): Report => {
  const sections = (context.sections as Record<string, unknown>) ?? {};
  const answers = context.answers ?? {};

  const currentScore =
    Number((sections as any).score ?? (sections as any).scoreAtual ?? answers.score ?? 62) || 62;
  const futureScore =
    Number((sections as any).scoreFuture ?? (sections as any).scorePotencial ?? answers.scoreFuture ?? 84) ||
    undefined;

  const score = makeScore(currentScore, futureScore);

  const base = createBaseReport(
    context,
    {
      headline: `Plano personalizado para ${context.patient.name}`,
      heroSummary:
        stringOrEmpty(sections.heroSummary) ||
        "Seu intestino reage aos hábitos diários. Vamos organizar alimentação, sono e exames para aliviar sintomas.",
      healthStatement:
        stringOrEmpty(sections.healthStatement) ||
        "Com rotinas consistentes, sinais como distensão, azia ou alterações do hábito intestinal tendem a reduzir em poucas semanas.",
      tone: score.level === "high" ? "urgent" : score.level === "medium" ? "motivational" : "reassuring",
    },
    score,
    buildRoadmap(sections),
    Array.isArray((sections as any).redFlags)
      ? (sections as any).redFlags.map((flag: any, idx: number) => ({
          id: flag.id ?? `flag-${idx}`,
          level: flag.severity === "high" ? "danger" : flag.severity === "medium" ? "warn" : "info",
          title: flag.description ?? "Sinal observado",
          why: flag.reason ?? flag.description ?? "",
          action: flag.action
            ? {
                label: flag.action,
                href: "/atendimento?utm_source=report",
                type: "primary",
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
          { cite: "Zhang X. et al. (2022) Gut microbiota & GI diseases." },
          { cite: "Ludvigsson J.F. et al. (2021) Coeliac disease guidelines." },
        ],
  );

  const examsFromSections = Array.isArray((sections as any).exams)
    ? (sections as any).exams.map((exam: any) => ({
        name: stringOrEmpty(exam.name ?? exam.exame ?? ""),
        why: stringOrEmpty(exam.why ?? exam.motivo ?? ""),
        when: stringOrEmpty(exam.when ?? exam.quando ?? "agora"),
        prep: stringOrEmpty(exam.prep ?? exam.preparo ?? ""),
      }))
    : [
        {
          name: "Hemograma completo",
          why: "Investigar anemia e inflamação sistêmica",
          when: "agora",
          prep: "Jejum 8 horas",
        },
        {
          name: "Sorologia celíaca (anti-tTG)",
          why: "Descartar doença celíaca",
          when: "agora",
        },
        {
          name: "Calprotectina fecal",
          why: "Avaliar inflamação intestinal",
          when: "agora",
        },
      ];

  const supplementsFromSections = Array.isArray((sections as any).supplements)
    ? (sections as any).supplements.map((supp: any) => ({
        name: stringOrEmpty(supp.name ?? supp.suplemento ?? ""),
        dose: stringOrEmpty(supp.dose ?? ""),
        note: stringOrEmpty(supp.note ?? ""),
      }))
    : [
        {
          name: "Probióticos multi-cepas",
          dose: "≥10^9 CFU/dia por 6-8 semanas",
          note: "Escolher cepas com Lactobacillus e Bifidobacterium",
        },
      ];

  return mergeReport(base, {
    exams: examsFromSections,
    supplements: supplementsFromSections,
  });
};

// ===== FUNÇÃO GI ENHANCED (NOVA) =====
// Adicionada para melhorar relatório GI com flag

export function toReportData(answers: any, patientBasics?: any): any {
  if (!GI_ENHANCED || answers.slug !== "gastrointestinal") {
    // Fallback para comportamento atual
    return derive({ 
      sections: {}, 
      answers, 
      patient: { name: patientBasics?.name || "Paciente" } 
    });
  }

  const giData = deriveGI(answers);
  const { meses, usoZapFarm, usaOutro, nuncaSup, fezEDA, edaMuitas, consultaAntiga, usaIBP, ibpDiario, brandAffinity } = giData;

  // Detectar alertas clínicos
  const alerts = [];
  if (ibpDiario && meses >= 6) {
    alerts.push({
      id: "ibp_diario_prolongado",
      level: "warn",
      title: "Reavalie estratégia com médico",
      why: "Uso diário de IBP há mais de 6 meses pode precisar de reavaliação médica",
      action: {
        label: "Falar com gastroenterologista",
        href: "/zapvida/atendimento?utm_source=report&utm_medium=alert_ibp",
        type: "primary"
      }
    });
  }

  if (edaMuitas && meses >= 12) {
    alerts.push({
      id: "eda_multiplas_cronico",
      level: "warn", 
      title: "Considere revisão integrativa do plano",
      why: "Múltiplas endoscopias com sintomas persistentes sugerem necessidade de abordagem integrativa",
      action: {
        label: "Avaliação integrativa",
        href: "/zapfarm/protocolos/digestivo?utm_source=report&utm_medium=alert_eda",
        type: "secondary"
      }
    });
  }

  if (consultaAntiga && meses >= 12) {
    alerts.push({
      id: "consulta_antiga",
      level: "info",
      title: "Agende avaliação",
      why: "Sintomas persistentes há mais de 1 ano sem acompanhamento recente",
      action: {
        label: "Agendar consulta",
        href: "/zapvida/atendimento?utm_source=report&utm_medium=alert_consulta",
        type: "primary"
      }
    });
  }

  // Gerar CTAs contextuais
  const hasRedFlag = alerts.some(a => a.level === "danger");
  const ctas = buildCTAsGI({
    slug: "gastrointestinal",
    redFlag: hasRedFlag,
    brandAffinity,
    utm: {
      source: "triage",
      medium: "report_gastrointestinal", 
      campaign: "2025Q4"
    }
  });

  // Seção Suplementação & Acompanhamento
  const suplementacaoSection = {
    id: "suplementacao_acompanhamento",
    title: "Suplementação & Acompanhamento",
    content: generateSuplementacaoContent(usoZapFarm, usaOutro, nuncaSup, brandAffinity),
    ctas: ctas.ordered.slice(0, 2) // Primeiros 2 CTAs
  };

  // Quick Wins específicos
  const quickWins = [
    "Mastigar cada garfada 20-30 vezes",
    "Evitar deitar nas 2 horas após refeições",
    ...(usaIBP ? ["Planejar desmame gradual de IBP com médico"] : []),
    ...(fezEDA ? ["Organizar resultados de exames anteriores"] : ["Considerar indicação de endoscopia"])
  ];

  return {
    narrative: {
      heroSummary: `Avaliação digestiva personalizada baseada em ${humanizeDuration(meses)} de sintomas`,
      healthStatement: "Foco em soluções práticas e baseadas em evidência para melhorar sua digestão"
    },
    alerts,
    sections: [suplementacaoSection],
    quickWins,
    ctas: ctas.ordered,
    metadata: {
      gi_enhanced: true,
      brand_affinity: brandAffinity,
      symptom_duration_months: meses
    }
  };
}

function generateSuplementacaoContent(usoZapFarm: boolean, usaOutro: boolean, nuncaSup: boolean, brandAffinity: string): string {
  if (usoZapFarm) {
    return `Você já conhece o MeJoy! Continue seguindo as orientações do produto e mantenha hábitos saudáveis. Evite sobreposições com outros suplementos digestivos sem orientação médica.`;
  }
  
  if (usaOutro) {
    return `Você usa outro suplemento digestivo. Considere revisar a composição, tempo de uso e qualidade com um profissional. O MeJoy pode ser uma alternativa integrativa.`;
  }
  
  return `Suplementação digestiva pode ser uma aliada importante no seu caso. Consulte um profissional para orientação sobre produtos adequados e dosagens seguras.`;
}
