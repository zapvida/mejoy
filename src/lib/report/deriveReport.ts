import type { Report as LegacyReport, Alert as LegacyAlert, TabRoadmap, EvidenceItem, WeeklyGoal, BMIField } from "@/lib/report/types";
import type { Citation, Grocery, PreventiveExam, ReportData } from "@/types/report";

function getBmiValue(bmi: BMIField): number | undefined {
  if (typeof bmi === "number") return bmi;
  return bmi?.bmi;
}

const EXAMS_BY_PROFILE: Record<
  "20-39" | "40-59" | "60+",
  Record<"masculino" | "feminino", PreventiveExam[]>
> = {
  "20-39": {
    masculino: [
      { name: "Hemograma completo", when: "Anual", prep: "Jejum 8h", why: "Triagem geral" },
      { name: "Glicemia de jejum", when: "A cada 3 anos", prep: "Jejum 12h", why: "Diabetes" },
      { name: "Perfil lipídico", when: "A cada 5 anos", prep: "Jejum 12h", why: "Risco cardiovascular" },
      { name: "TSH", when: "A cada 5 anos", why: "Tireoide" },
      { name: "Urina tipo I", when: "Anual", prep: "Primeira urina", why: "Rim/infecção" },
    ],
    feminino: [
      { name: "Hemograma completo", when: "Anual", prep: "Jejum 8h", why: "Triagem geral" },
      { name: "Glicemia de jejum", when: "A cada 3 anos", prep: "Jejum 12h", why: "Diabetes" },
      { name: "Perfil lipídico", when: "A cada 5 anos", prep: "Jejum 12h", why: "Risco cardiovascular" },
      { name: "TSH", when: "A cada 5 anos", why: "Tireoide" },
      { name: "Urina tipo I", when: "Anual", why: "Rim/infecção" },
      { name: "Citologia oncótica (Papanicolau)", when: "A cada 3 anos", why: "HPV/colo uterino" },
    ],
  },
  "40-59": {
    masculino: [
      { name: "Perfil lipídico", when: "A cada 1–3 anos", prep: "Jejum 12h", why: "Risco cardiovascular" },
      { name: "Glicemia/HbA1c", when: "A cada 1–3 anos", why: "Diabetes" },
      { name: "PSA (individualizar)", when: "Anual", why: "Próstata (decisão compartilhada)" },
      { name: "Rastreamento colorretal", when: "≥45 anos", why: "Câncer colorretal (FIT/colonoscopia)" },
    ],
    feminino: [
      { name: "Mamografia", when: "A cada 1–2 anos", why: "Risco câncer de mama" },
      { name: "Perfil lipídico", when: "A cada 1–3 anos", prep: "Jejum 12h", why: "Risco cardiovascular" },
      { name: "Glicemia/HbA1c", when: "A cada 1–3 anos", why: "Diabetes" },
      { name: "Rastreamento colorretal", when: "≥45 anos", why: "Câncer colorretal (FIT/colonoscopia)" },
    ],
  },
  "60+": {
    masculino: [
      { name: "Densitometria óssea (se risco)", when: "Conforme risco", why: "Osteoporose" },
      { name: "Avaliação auditiva", when: "Bienal", why: "Função auditiva" },
    ],
    feminino: [
      { name: "Densitometria óssea", when: "≥65 anos ou antes se risco", why: "Osteoporose" },
      { name: "Avaliação auditiva", when: "Bienal", why: "Função auditiva" },
    ],
  },
};

const GROCERY_BASE: Grocery = {
  buy: [
    "Frutas e vegetais coloridos",
    "Leguminosas (feijão/lentilha/grão-de-bico)",
    "Grãos integrais (arroz integral, aveia, quinoa)",
    "Ovos",
    "Peixes gordos (sardinha/salmão)",
    "Oleaginosas (nozes/amêndoas)",
    "Azeite extra virgem",
    "Iogurte natural",
  ],
  avoid: [
    "Refrigerantes e bebidas açucaradas",
    "Ultraprocessados e snacks",
    "Carnes processadas (salsicha, bacon)",
    "Frituras frequentes",
    "Álcool em excesso",
  ],
  notes: [
    "Prefira rótulos com 5 ingredientes ou menos",
    "Metade do prato em vegetais na maioria das refeições",
  ],
};

function defaultCitations(): Citation[] {
  return [
    { id: "who_pa", label: "OMS • Atividade Física (2024)", url: "https://www.who.int/" },
    { id: "aha_life", label: "AHA • Lifestyle (2024)", url: "https://www.heart.org/" },
    { id: "uspstf", label: "USPSTF • Rastreamento (2024)", url: "https://www.uspreventiveservicestaskforce.org/" },
    { id: "cochrane", label: "Cochrane • Dieta & Sono (23-25)", url: "https://www.cochranelibrary.com/" },
    { id: "harvard", label: "Harvard • Nutrition Source", url: "https://www.hsph.harvard.edu/nutritionsource/" },
  ];
}

export function estimateReadingTimeMin(report: ReportData): number {
  const baseWords = JSON.stringify(report).split(/\s+/).length;
  return Math.max(2, Math.min(7, Math.round(baseWords / 200)));
}

export function buildTopActions(report: ReportData): string[] {
  const actions = ["Dormir 7–8h", "+2 porções de vegetais", "Caminhar 30 min"];
  if (report.alertSignals?.length) actions[0] = "Agendar avaliação";
  return actions.slice(0, 3);
}

type RiskProfile = {
  idade: number;
  sexo: "masculino" | "feminino";
  imc?: number;
  packYears?: number;
  quitYears?: number;
  isSmoker?: boolean;
};

function normalizeRiskProfile(patient?: {
  idade?: number;
  sexo?: string;
  imc?: number;
  bmi?: number;
  packYears?: number;
  maçosAno?: number;
  tabagismo?: {
    packYears?: number;
    maçosAno?: number;
    quitYears?: number;
    cessouHaAnos?: number;
    ativo?: boolean;
    fumante?: boolean;
  };
  quitYears?: number;
  cessouHaAnos?: number;
  fumante?: boolean;
  smokes?: boolean;
  nome?: string;
}): RiskProfile | null {
  if (!patient?.idade || !patient?.sexo) return null;
  const sexo = patient.sexo === "masculino" || patient.sexo === "feminino"
    ? patient.sexo
    : (patient.sexo.toLowerCase().startsWith("f") ? "feminino" : "masculino");

  const imc = patient.imc ?? patient.bmi;
  const packYears =
    patient.packYears ??
    patient.maçosAno ??
    patient.tabagismo?.packYears ??
    patient.tabagismo?.maçosAno;
  const quitYears =
    patient.quitYears ??
    patient.cessouHaAnos ??
    patient.tabagismo?.quitYears ??
    patient.tabagismo?.cessouHaAnos;
  const isSmoker =
    patient.fumante ??
    patient.smokes ??
    patient.tabagismo?.ativo ??
    patient.tabagismo?.fumante;

  return {
    idade: patient.idade,
    sexo,
    imc,
    packYears,
    quitYears,
    isSmoker,
  };
}

function applyRiskAdjustments(
  exams: PreventiveExam[],
  profile: RiskProfile | null
): PreventiveExam[] {
  if (!profile) return exams;
  const adjusted = [...exams];

  if (profile.imc && profile.imc >= 25) {
    const lipidsIdx = adjusted.findIndex((exam) => exam.name.includes("Perfil lipídico"));
    if (lipidsIdx >= 0) {
      adjusted[lipidsIdx] = {
        ...adjusted[lipidsIdx],
        when: "A cada 1–3 anos",
        why: adjusted[lipidsIdx].why ?? "Risco cardiovascular",
      };
    }
    const hasHba1c = adjusted.some((exam) => exam.name.includes("HbA1c"));
    if (!hasHba1c) {
      adjusted.push({
        name: "Hemoglobina glicada (HbA1c)",
        when: "Anual",
        why: "Monitorar risco de diabetes (IMC ≥ 25)",
      });
    }
  }

  if (profile.imc && profile.imc >= 30) {
    adjusted.push({
      name: "ALT/TGP",
      when: "Anual",
      why: "Rastreamento de doença hepática gordurosa não alcoólica",
    });
  }

  const eligibleLdct =
    profile.idade >= 50 &&
    profile.idade <= 80 &&
    (profile.packYears ?? 0) >= 20 &&
    (profile.isSmoker || (profile.quitYears != null && profile.quitYears <= 15));

  if (eligibleLdct) {
    adjusted.push({
      name: "TC de tórax baixa dose (LDCT)",
      when: "Anual",
      why: "Rastreamento de câncer de pulmão (tabagista de alto risco)",
    });
  }

  return adjusted;
}

export function buildPreventiveExams(patient: {
  idade: number;
  sexo: "masculino" | "feminino";
  imc?: number;
  packYears?: number;
  quitYears?: number;
  isSmoker?: boolean;
}): PreventiveExam[] {
  const faixa = patient.idade >= 60 ? "60+" : patient.idade >= 40 ? "40-59" : "20-39";
  const base = (EXAMS_BY_PROFILE as Record<string, Record<string, PreventiveExam[]>>)[faixa]?.[
    patient.sexo
  ];
  const normalizedBase = Array.isArray(base) ? base : [];
  const adjusted = applyRiskAdjustments(normalizedBase, patient);

  return adjusted.map((exam) => ({
    ...exam,
    copyText: `${exam.name} — ${exam.when}${exam.prep ? ` — Preparo: ${exam.prep}` : ""}${
      exam.why ? ` — ${exam.why}` : ""
    }`,
  }));
}

export function buildGrocery(): Grocery {
  return GROCERY_BASE;
}

// BEGIN flag-guard: funções auxiliares para apresentação enriquecida
function buildKeypoints(data: ReportData): string[] {
  const keypoints: string[] = [];
  
  if (data.topActions && data.topActions.length > 0) {
    keypoints.push(...data.topActions.slice(0, 3));
  }
  
  if (data.preventiveExams && data.preventiveExams.length > 0) {
    keypoints.push(`Exames preventivos recomendados: ${data.preventiveExams.length} itens`);
  }
  
  if ((data as any).redFlags && (data as any).redFlags.length > 0) {
    keypoints.push(`Sinais de alerta identificados: ${(data as any).redFlags.length} pontos`);
  }
  
  return keypoints.slice(0, 5);
}

function buildTodayActions(data: ReportData): string[] {
  const actions: string[] = [];
  
  if (data.topActions && data.topActions.length > 0) {
    actions.push(...data.topActions.slice(0, 2));
  }
  
  if (actions.length === 0) {
    actions.push("Consulte um profissional de saúde para orientação específica");
  }
  
  return actions;
}

function buildWeekActions(data: ReportData): string[] {
  const actions: string[] = [];
  
  if (data.preventiveExams && data.preventiveExams.length > 0) {
    actions.push("Agendar exames preventivos recomendados");
  }
  
  if (data.grocery && data.grocery.buy && data.grocery.buy.length > 0) {
    actions.push("Implementar mudanças na alimentação");
  }
  
  if (actions.length === 0) {
    actions.push("Manter hábitos saudáveis e monitorar sintomas");
  }
  
  return actions;
}

function buildCareEscalation(data: ReportData): string[] {
  const escalations: string[] = [];
  
  if ((data as any).redFlags && (data as any).redFlags.length > 0) {
    escalations.push("Procurar atendimento médico imediato");
  }
  
  if (data.preventiveExams && data.preventiveExams.length > 0) {
    escalations.push("Consultar médico para avaliação completa");
  }
  
  if (escalations.length === 0) {
    escalations.push("Consultar médico se sintomas persistirem");
  }
  
  return escalations;
}
// END flag-guard

export function deriveReport(
  input: ReportData & {
    patient?: {
      idade?: number;
      sexo?: string;
      imc?: number;
      bmi?: number;
      packYears?: number;
      maçosAno?: number;
      tabagismo?: {
        packYears?: number;
        maçosAno?: number;
        quitYears?: number;
        cessouHaAnos?: number;
        ativo?: boolean;
        fumante?: boolean;
      };
      quitYears?: number;
      cessouHaAnos?: number;
      fumante?: boolean;
      smokes?: boolean;
      nome?: string;
    };
  }
): ReportData {
  const output: ReportData = { ...input };

  output.topActions = output.topActions ?? buildTopActions(output);
  output.readingTimeMin = output.readingTimeMin ?? estimateReadingTimeMin(output);

  if (!output.preventiveExams || output.preventiveExams.length === 0) {
    const profile = normalizeRiskProfile(input.patient);
    if (profile) {
      output.preventiveExams = buildPreventiveExams(profile);
    } else {
      output.preventiveExams = [];
    }
  } else {
    const profile = normalizeRiskProfile(input.patient);
    if (profile) {
      output.preventiveExams = applyRiskAdjustments(output.preventiveExams, profile).map((exam) => ({
        ...exam,
        copyText:
          exam.copyText ??
          `${exam.name} — ${exam.when}${exam.prep ? ` — Preparo: ${exam.prep}` : ""}${
            exam.why ? ` — ${exam.why}` : ""
          }`,
      }));
    } else {
      output.preventiveExams = output.preventiveExams.map((exam) => ({
        ...exam,
        copyText:
          exam.copyText ??
          `${exam.name} — ${exam.when}${exam.prep ? ` — Preparo: ${exam.prep}` : ""}${
            exam.why ? ` — ${exam.why}` : ""
          }`,
      }));
    }
  }

  output.grocery = output.grocery ?? buildGrocery();
  output.citations = output.citations ?? defaultCitations();

  // BEGIN flag-guard: apresentação enriquecida
  const REPORT_ENHANCED = process.env.NEXT_PUBLIC_REPORT_ENHANCED === "1";
  if (REPORT_ENHANCED) {
    const keypoints = buildKeypoints(output);
    const roadmap = [
      { title: "Hoje", items: buildTodayActions(output) },
      { title: "7–14 dias", items: buildWeekActions(output) },
      { title: "Quando consultar", items: buildCareEscalation(output) }
    ];

    // Adicionar campos opcionais sem quebrar estrutura existente
    (output as any).presentation = { keypoints, roadmap };
  }
  // END flag-guard

  return output;
}

export function buildExamTexts(
  patient: { nome: string; idade: number; sexo: "masculino" | "feminino" },
  exams: Array<{ name: string; when?: string; prep?: string; why?: string }>
): { pedido: string; whatsapp: string } {
  const header =
    `PEDIDO DE EXAMES — PREVENTIVO\n` +
    `Paciente: ${patient.nome} • Idade: ${patient.idade} • Sexo: ${
      patient.sexo === "masculino" ? "Masculino" : "Feminino"
    } • Data: ${new Date().toLocaleDateString("pt-BR")}\n` +
    `CID: Z00.0 (exame de rotina)\n\nExames:\n`;

  const linhas = exams.map((exam) => {
    const whenText = exam.when ? ` — ${exam.when}` : "";
    const prepText = exam.prep ? ` — Preparo: ${exam.prep}` : "";
    const whyText = exam.why ? ` — ${exam.why}` : "";
    return `• ${exam.name}${whenText}${prepText}${whyText}`;
  });

  const orientacoes =
    "\n\nOrientações gerais: água liberada no jejum; evitar álcool 48h e exercício vigoroso 24h; informar uso de biotina.\nAssinatura/Carimbo:";

  const pedido = `${header}${linhas.join("\n")}${orientacoes}`;

  const whatsItems = exams.slice(0, 6).map((exam) => {
    const whenText = exam.when ? ` (${exam.when})` : "";
    const prepText = exam.prep ? ` — ${exam.prep}` : "";
    return `• ${exam.name}${whenText}${prepText}`;
  });

  const whatsapp =
    `${patient.nome}, seu preventivo:\n` +
    `${whatsItems.join("\n")}\n` +
    "Dúvidas e preparo: posso orientar por aqui. ✅";

  return { pedido, whatsapp };
}

function formatAlert(alert: LegacyAlert): string {
  return alert.title || alert.why || "Alerta identificado";
}

function formatWeeklyGoal(goal?: WeeklyGoal): string | undefined {
  if (!goal) return undefined;
  const parts = [goal.label, goal.target, goal.measure].filter(Boolean);
  const base = parts.join(" — ");
  return goal.reminder ? `${base} • ${goal.reminder}` : base;
}

function formatQuickWins(wins: TabRoadmap["quickWins"]): string[] {
  return wins.map((win) => win.label || win.how || "").filter(Boolean);
}

function mapEvidenceToCitations(evidence?: EvidenceItem[]): Citation[] | undefined {
  if (!evidence?.length) return undefined;
  return evidence.map((item, index) => ({
    id: `legacy_${index}`,
    label: item.cite || `Referência ${index + 1}`,
    url: item.url || undefined,
  }));
}

function normalizeLegacySex(value?: string): "masculino" | "feminino" | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  if (normalized.startsWith("f")) return "feminino";
  if (normalized.startsWith("m")) return "masculino";
  return undefined;
}

export function toReportDataFromLegacy(report: LegacyReport): ReportData {
  const topAlerts = report.alerts?.slice(0, 2) ?? [];
  const pillars = (report.roadmap ?? []).map((pillar) => ({
    id: pillar.id,
    title: pillar.title,
    quickWins: formatQuickWins(pillar.quickWins),
    weeklyGoal: formatWeeklyGoal(pillar.goal),
    citations: mapEvidenceToCitations(report.evidence),
  }));

  const normalizedSex = normalizeLegacySex(report.patient.sex);
  const patientProfile =
    typeof report.patient.age === "number" && normalizedSex
      ? {
          idade: report.patient.age,
          sexo: normalizedSex,
          imc: getBmiValue(report.patient.bmi) ?? undefined,
        }
      : undefined;

  return deriveReport({
    scoreNow: report.scores.current ?? 60,
    scorePotential: report.scores.potential ?? report.scores.current ?? 70,
    topActions: (report.roadmap ?? [])
      .flatMap((tab) => tab.quickWins?.map((win) => win.label).filter(Boolean) ?? [])
      .slice(0, 3),
    alertSignals: topAlerts.map(formatAlert),
    readingTimeMin: undefined,
    updatedAt: report.createdAt,
    version: report.features?.enablePremiumUpsell ? "2.0" : "1.0",
    pillars,
    preventiveExams: report.exams?.map((exam) => ({
      name: exam.name,
      when: exam.when,
      prep: exam.prep,
      why: exam.why,
    })),
    grocery: undefined,
    citations: mapEvidenceToCitations(report.evidence),
    patient: patientProfile,
  });
}
