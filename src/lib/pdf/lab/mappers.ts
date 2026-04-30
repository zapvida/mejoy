// src/lib/pdf/lab/mappers.ts
import type { LabPanel, LabReportData, Flag } from "./types";
import { GI_REF } from "./referenceRanges";
import type { ReportViewModel } from "@/lib/report/derive";

type Answers = Record<string, unknown> | null | undefined;

const DEFAULT_BASE_URL = "https://www.zapfarm.com.br";

const stressLabels = ["Baixo", "Moderado", "Alto", "Muito alto"] as const;
const sleepFromQuality = [5.5, 6.5, 7.5, 8.5];

function asNumber(value: unknown): number | undefined {
  if (value == null) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function asString(value: unknown): string | undefined {
  if (value == null) return undefined;
  return String(value);
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((item) => String(item));
    } catch {
      return [value];
    }
  }
  return [];
}

function normalizeSex(sex: string | undefined): "M" | "F" | "O" {
  if (!sex) return "O";
  const normalized = sex.toLowerCase();
  if (normalized.startsWith("m")) return "M";
  if (normalized.startsWith("f")) return "F";
  return "O";
}

function flagFromNumeric(num: number | undefined, low?: number, high?: number): Flag {
  if (num == null) return "N";
  if (low != null && num < low) return "L";
  if (high != null && num > high) return "H";
  return "N";
}

function flagFromBoolean(active: boolean | undefined): Flag {
  if (active == null) return "N";
  return active ? "H" : "N";
}

function extractBristol(vm: ReportViewModel, answers: Answers): number | undefined {
  if (typeof vm.context?.bristol === "number") return vm.context.bristol;
  const raw = answers?.bristol ?? answers?.bristol_tipo;
  const numeric = asNumber(raw);
  if (numeric) return numeric;
  if (typeof raw === "string" && raw.trim()) {
    const match = raw.match(/\d+/);
    if (match) return Number(match[0]);
  }
  return undefined;
}

function extractBowelPerDay(answers: Answers): number | undefined {
  const raw = answers?.frequencia_evacuacao;
  if (typeof raw !== "string") return undefined;
  switch (raw) {
    case "<3_semana":
      return 0.4;
    case "3-7_semana":
      return 0.9;
    case "diaria":
      return 1;
    case ">1_dia":
      return 2;
    default:
      return undefined;
  }
}

function extractWaterLiters(answers: Answers): number | undefined {
  const raw = answers?.ingestao_agua ?? answers?.agua_litros;
  const numeric = asNumber(raw);
  if (numeric != null) return numeric;
  const habits = asStringArray(answers?.habitos_negativos);
  if (habits.includes("agua_baixa")) return 1;
  if (habits.length > 0) return 2.2;
  return undefined;
}

function extractFiberGrams(answers: Answers): number | undefined {
  const raw = answers?.fibras_gramas ?? answers?.ingestao_fibras;
  const numeric = asNumber(raw);
  if (numeric != null) return numeric;
  const habits = asStringArray(answers?.habitos_negativos);
  if (habits.includes("fibras_baixas")) return 18;
  if (habits.length > 0) return 28;
  return undefined;
}

function extractStressLevel(answers: Answers): { value: number | undefined; label: string } {
  const numeric = asNumber(answers?.estresse_nivel);
  if (numeric == null) return { value: undefined, label: "—" };
  const index = Math.max(0, Math.min(3, Math.round(numeric)));
  return { value: index, label: stressLabels[index] ?? stressLabels[1] };
}

function extractSleepHours(answers: Answers): number | undefined {
  const direct = asNumber(answers?.sono_horas);
  if (direct != null) return direct;
  const quality = asNumber(answers?.sono_qualidade);
  if (quality != null) {
    const clamped = Math.max(0, Math.min(3, Math.round(quality)));
    return sleepFromQuality[clamped];
  }
  return undefined;
}

function hasMedication(answers: Answers, code: string): boolean {
  const meds = asStringArray(answers?.medicamentos_recentes);
  if (meds.includes("nenhum")) return false;
  return meds.includes(code);
}

function tookRecentAntibiotic(answers: Answers): boolean | undefined {
  const meds = asStringArray(answers?.medicamentos_recentes);
  if (meds.includes("antibiotico")) return true;
  const explicit = asString(answers?.antibiotico_recente);
  if (!explicit) return undefined;
  if (explicit === "sim") return true;
  if (explicit === "nao") return false;
  return undefined;
}

function buildPanels(data: {
  bristol?: number;
  bowelPerDay?: number;
  waterLiters?: number;
  fiberGrams?: number;
  sleepHours?: number;
  stressLabel: string;
  stressValue?: number;
  recentAntibiotic?: boolean;
  usesNsaids?: boolean;
  usesIbp?: boolean;
}): LabPanel[] {
  const panels: LabPanel[] = [];

  panels.push({
    panel: "Função Intestinal",
    items: [
      {
        code: 'GI_BRISTOL',
        name: 'Índice de Bristol',
        value: data.bristol != null ? `Tipo ${data.bristol}` : '—',
        numeric: data.bristol,
        ref: { note: "Ideal: Tipo 4" },
        flag:
          data.bristol == null
            ? "N"
            : data.bristol === GI_REF.bristolIdeal
            ? "N"
            : data.bristol < GI_REF.bristolIdeal
            ? "L"
            : "H",
        method: "Autorrelato",
        comment: "Classificação de consistência baseada na escala de Bristol.",
      },
      {
        code: 'GI_BOWEL_FREQ',
        name: 'Evacuações por dia',
        value: data.bowelPerDay != null ? `${data.bowelPerDay}` : '—',
        numeric: data.bowelPerDay,
        unit: "vezes/dia",
        ref: GI_REF.bowelPerDay,
        flag: flagFromNumeric(data.bowelPerDay, GI_REF.bowelPerDay.low, GI_REF.bowelPerDay.high),
        method: "Autorrelato semanal",
      },
    ],
  });

  panels.push({
    panel: "Hidratação & Fibras",
    items: [
      {
        code: 'GI_WATER',
        name: 'Ingestão hídrica',
        value: data.waterLiters != null ? `${data.waterLiters.toFixed(1)}` : '—',
        numeric: data.waterLiters,
        unit: "L/dia",
        ref: GI_REF.waterIntake,
        flag: flagFromNumeric(data.waterLiters, GI_REF.waterIntake.low),
        method: "Estimativa de hábitos",
      },
      {
        code: 'GI_FIBER',
        name: 'Fibras na dieta',
        value: data.fiberGrams != null ? `${Math.round(data.fiberGrams)}` : '—',
        numeric: data.fiberGrams,
        unit: "g/dia",
        ref: GI_REF.fiberIntake,
        flag: flagFromNumeric(data.fiberGrams, GI_REF.fiberIntake.low),
        method: "Autorrelato",
      },
    ],
  });

  panels.push({
    panel: "Fármacos",
    items: [
      {
        code: "GI_ANTIBIOTIC_3M",
        name: "Antibiótico (últ. 3m)",
        value: data.recentAntibiotic == null ? "Não informado" : data.recentAntibiotic ? "Sim" : "Não",
        ref: { note: "Ideal: evitar uso desnecessário." },
        flag: flagFromBoolean(data.recentAntibiotic),
        method: "Histórico recente",
      },
      {
        code: "GI_NSAID",
        name: "AINEs (uso atual)",
        value: data.usesNsaids ? "Sim" : "Não",
        ref: { note: "Uso contínuo pode irritar a mucosa GI." },
        flag: flagFromBoolean(data.usesNsaids),
      },
      {
        code: "GI_IBP",
        name: "IBP / Antiácidos",
        value: data.usesIbp ? "Sim" : "Não",
        ref: { note: "Reavaliar se uso prolongado." },
        flag: flagFromBoolean(data.usesIbp),
      },
    ],
  });

  panels.push({
    panel: "Sono & Estresse",
    items: [
      {
        code: 'GI_SLEEP',
        name: 'Sono',
        value: data.sleepHours != null ? `${data.sleepHours}` : '—',
        numeric: data.sleepHours,
        unit: GI_REF.sleepHours.unit,
        ref: GI_REF.sleepHours,
        flag: flagFromNumeric(data.sleepHours, GI_REF.sleepHours.low, GI_REF.sleepHours.high),
      },
      {
        code: "GI_STRESS",
        name: "Estresse",
        value: data.stressLabel,
        ref: { note: "Objetivo: manter em baixo/moderado." },
        flag: data.stressValue != null && data.stressValue >= 2 ? "H" : "N",
      },
    ],
  });

  return panels;
}

function buildInterpretations(params: {
  bristol?: number;
  bowelPerDay?: number;
  waterLiters?: number;
  fiberGrams?: number;
  sleepHours?: number;
  stressValue?: number;
  recentAntibiotic?: boolean;
  usesIbp?: boolean;
  usesNsaids?: boolean;
  hasRedFlags: boolean;
}): string[] {
  const notes: string[] = [];

  if (params.bristol != null) {
    if (params.bristol >= 5) notes.push("Bristol ≥5 sugere trânsito acelerado ou diarreia funcional.");
    else if (params.bristol <= 2) notes.push("Bristol ≤2 sugere constipação funcional ou trânsito lento.");
    else notes.push("Bristol em faixa ideal (Tipo 4).");
  }

  if (params.bowelPerDay != null && (params.bowelPerDay < 0.7 || params.bowelPerDay > 2)) {
    notes.push("Frequência evacuativa fora da faixa habitual (1–2/dia) — correlacionar com sintomas.");
  }

  if (params.waterLiters != null && params.waterLiters < (GI_REF.waterIntake.low ?? 2)) {
    notes.push("Ingestão hídrica estimada abaixo de 2 L/dia — orientar incremento gradual.");
  }

  if (params.fiberGrams != null && params.fiberGrams < (GI_REF.fiberIntake.low ?? 25)) {
    notes.push("Fibras alimentares abaixo da meta diária — sugerir reforço com vegetais e integrais.");
  }

  if (params.sleepHours != null && params.sleepHours < (GI_REF.sleepHours.low ?? 7)) {
    notes.push("Sono <7h associado a piora de sintomas GI funcionais — revisar higiene do sono.");
  }

  if (params.stressValue != null && params.stressValue >= 2) {
    notes.push("Estresse relatado como alto — considerar técnicas de regulação e apoio multiprofissional.");
  }

  if (params.usesIbp) {
    notes.push("Uso atual de IBP prolongado: reavaliar necessidade e risco de hipocloridria.");
  }

  if (params.usesNsaids) {
    notes.push("AINEs em uso — monitorar irritação gástrica e orientar gastroproteção quando indicado.");
  }

  if (params.recentAntibiotic) {
    notes.push("Antibiótico nos últimos 3 meses pode alterar microbiota; monitorar sintomas persistentes.");
  }

  if (!notes.length) {
    notes.push("Sem alterações relevantes nos parâmetros autodeclarados; manter acompanhamento clínico.");
  }

  if (params.hasRedFlags) {
    notes.unshift("Relato com sinais de alerta — priorizar avaliação médica presencial.");
  }

  return notes.slice(0, 8);
}

function buildPatientNote(firstName: string, params: {
  bristol?: number;
  waterLiters?: number;
  fiberGrams?: number;
  mainGoal?: string;
  hasRedFlags: boolean;
}): string {
  const patientNote = [
    `Oi, ${firstName}! Vamos alinhar o intestino juntos.`,
    params.bristol === 4 ? 'Seu padrão de fezes está no alvo (Tipo 4). Ótimo!'
                  : `Seu padrão atual é Tipo ${params.bristol}. Nossa meta é aproximar do Tipo 4.`,
    params.waterLiters != null
      ? `Tente manter ~${Math.max(2, +params.waterLiters.toFixed(1))} L/dia de água.`
      : 'Aumentar água para ~2 L/dia costuma ajudar.',
    params.fiberGrams != null
      ? `Busque ~${Math.max(25, Math.round(params.fiberGrams))} g/dia de fibras com vegetais, frutas e grãos.`
      : 'Tente ~25 g/dia de fibras (vegetais, frutas, grãos).',
    params.hasRedFlags ? 'Se notar sinais de alerta, fale com um médico pelo ZapVida.' : 'Qualquer mudança, estou por aqui para ajudar!',
  ].join(' ');
  
  return patientNote;
}

function buildSuggestedExams(params: { hasRedFlags: boolean; bristol?: number; recentAntibiotic?: boolean }) {
  const exams = [
    { name: "Hemograma + Ferritina", when: "Cansaço, palidez ou perda de peso", prep: "Jejum conforme laboratório" },
    { name: "Calprotectina fecal", when: "Diarreia persistente ou sangramento", prep: "Coleta em frasco limpo" },
    { name: "Teste H. pylori (sopro ou fezes)", when: "Azia/refluxo crônicos", prep: "Evitar IBP 2 semanas antes" },
  ];

  if (params.recentAntibiotic) {
    exams.push({
      name: "Reposição de microbiota (probióticos)",
      when: "Após antibiótico recente com sintomas GI",
      prep: "Preferir probióticos orientados pelo médico",
    });
  }

  if (params.hasRedFlags) {
    exams.unshift({
      name: "Avaliação médica presencial",
      when: "Sinais de alerta relatados",
      prep: "Agendar consulta preferencial nas próximas 24-48h",
    });
  }

  if (params.bristol != null && params.bristol >= 5) {
    exams.push({
      name: "Pesquisa de parasitas / coproparasitológico",
      when: "Diarreia prolongada",
      prep: "Coleta conforme instrução do laboratório",
    });
  }

  return exams.slice(0, 6);
}

export function vmToLabReportData(vm: ReportViewModel, options?: { answers?: Answers }): LabReportData {
  const answers = options?.answers;
  const firstName = (vm.basics.firstName || vm.basics.name || "Paciente").split(" ")[0] || "Paciente";
  const sex = normalizeSex(vm.basics.sex);
  const age = Number.isFinite(vm.basics.age) ? vm.basics.age : 0;
  const bmi = Number.isFinite(vm.basics.bmi) ? vm.basics.bmi : undefined;
  const bristol = extractBristol(vm, answers);
  const bowelPerDay = extractBowelPerDay(answers);
  const waterLiters = extractWaterLiters(answers);
  const fiberGrams = extractFiberGrams(answers);
  const sleepHours = extractSleepHours(answers);
  const stress = extractStressLevel(answers);
  const recentAntibiotic = tookRecentAntibiotic(answers);
  const usesNsaids = hasMedication(answers, "aines");
  const usesIbp = hasMedication(answers, "antiacidos_ibp");
  const hasRedFlags = vm.context.redFlags?.length > 0;

  const reportId = vm.id || (vm as any)?.meta?.id || 'demo';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const qrUrl = `${baseUrl}/relatorio/${reportId}`;

  const panels = buildPanels({
    bristol,
    bowelPerDay,
    waterLiters,
    fiberGrams,
    sleepHours,
    stressLabel: stress.label,
    stressValue: stress.value,
    recentAntibiotic,
    usesNsaids,
    usesIbp,
  });

  const interpretations = buildInterpretations({
    bristol,
    bowelPerDay,
    waterLiters,
    fiberGrams,
    sleepHours,
    stressValue: stress.value,
    recentAntibiotic,
    usesIbp,
    usesNsaids,
    hasRedFlags,
  });

  const patientNote = buildPatientNote(firstName, {
    bristol,
    waterLiters,
    fiberGrams,
    mainGoal: vm.context.mainGoal,
    hasRedFlags,
  });

  const instructions = {
    title: "Como se preparar e quando repetir",
    items: [
      "Para calprotectina fecal: coletar amostra fresca em frasco limpo e manter refrigerada até 12h.",
      "Para teste respiratório de H. pylori: suspender IBP/antibiótico por 14 dias quando possível.",
      "Repetir este painel em 6-8 semanas após ajustes de água, fibras e sono, ou antes se sintomas piorarem.",
    ],
  };

  const suggestedExams = buildSuggestedExams({ hasRedFlags, bristol, recentAntibiotic });

  const disclaimers = [
    "Este laudo é informativo e não substitui avaliação médica presencial.",
    "Valores de referência podem variar entre laboratórios e faixas etárias.",
    "Considere os achados dentro do contexto clínico individual do paciente.",
  ];

  return {
    patient: { firstName, sex, age, bmi },
    meta: {
      createdAtISO: vm.createdAt || new Date().toISOString(),
      triageSlug: vm.triage,
      hasRedFlags,
      score: vm.score,
      qrUrl,
    },
    panels,
    interpretations,
    patientNote,
    instructions,
    suggestedExams,
    disclaimers,
  };
}
