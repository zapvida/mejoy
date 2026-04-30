// src/lib/report/derive.ts (HARDENED v4 - Pipeline Único)
import { z } from "zod";

import type { DerivationContext, Report, TriagemKind, ReportDTO, TriageInput } from "./types";

import { createBaseReport, makeScore, mergeReport } from "@/features/triage/configs/_shared";
import { generateReportArtifacts } from "@/lib/ai";
import { serverEnv } from "@/lib/env";
import { normalizeBMI } from '@/lib/health/bmi';
import { coercePhoneLike } from "@/lib/phone/normalize";
import { friendlyGreeting, executiveSummary, todayPlan, shortTermPlan, longTermPlan, nonMedicalAdvice, whenToSeekMedical, scientificEvidence, toneAdvice } from "@/lib/report/personalize";
import { scoreFromAnswers, paletteFromScore, scoreInterpretation, gradientFromScore, iconFromScore } from "@/lib/report/score";
import { getPatientBasics } from "@/lib/triage/patientData";

// Enhanced input validation (resilient with null handling)
const TriageInputSchema = z.object({
  triageId: z.string().min(6), // Not requiring UUID - some IDs may be ulid/shortid
  sessionData: z.object({
    answers: z.record(z.any()),
    profile: z.object({
      name: z.string(),
      sex: z.string().optional().nullable(),
      age: z.number().optional().nullable(),
      bmi: z.union([
        z.number(),
        z.object({
          bmi: z.number(),
          classification: z.string()
        })
      ]).optional().nullable(),
      whatsapp: z.preprocess(
        value => {
          if (value == null) return value;
          return coercePhoneLike(value) ?? value;
        },
        z.string().optional().nullable()
      ),
      weightKg: z.number().optional().nullable(),
      heightCm: z.number().optional().nullable(),
    }),
    triageSlug: z.string().min(3),
  }),
  options: z.object({
    forceRegenerate: z.boolean().optional(),
    includeAudio: z.boolean().optional(),
  }).optional(),
});

// Tipos para o novo pipeline
export interface ReportViewModel {
  id: string;
  triageId: string;
  triage: TriagemKind;
  greeting: string;
  basics: {
    name: string;
    firstName: string;
    age: number;
    sex: string;
    bmi: number;
    bmiCategory: string;
    heightCm?: number;
    weightKg?: number;
  };
  score: number;
  palette: ReturnType<typeof paletteFromScore>;
  interpretation: string;
  gradient: string;
  icon: string;
  context: {
    symptom?: string | null;
    bristol?: number | null;
    redFlags: string[];
    mainGoal?: string;
  };
  content: {
    executiveSummary: string[];
    todayPlan: string[];
    shortTermPlan: string[];
    longTermPlan: string[];
    nonMedicalAdvice: string[];
    whenToSeekMedical: string[];
    scientificEvidence: string[];
    toneAdvice: string;
  };
  aiGenerated: boolean;
  aiMarkdown?: string;
  aiAudioScript?: string;
  icd10Candidates: string[];
  createdAt: string;
}

type Engine = {
  derive(payload: TriageInput): Promise<ReportDTO>;
};

// defaultEngine de fallback para dev/test
const defaultEngine: Engine = {
  async derive(_payload) {
    return { sections: [] } as ReportDTO;
  }
};

// Dynamic engine loading with fallback
async function loadEngine(triage: TriagemKind): Promise<Engine> {
  try {
    // Try to load specific engine
    const engineModule = await import(`@/features/triage/configs/${triage}`);
    return engineModule as Engine;
  } catch (error) {
    console.warn(`[report] Engine for ${triage} not found, using default:`, error);
    return defaultEngine;
  }
}

const coerceTriage = (slug?: string): TriagemKind => {
  if (!slug) return "geral";
  
  const mapping: Record<string, TriagemKind> = {
    "gastro": "gastro",
    "sono": "sono", 
    "metabolico": "metabolico",
    "geral-rapida": "geralRapida",
    "geral": "geral",
    "cardio": "cardio",
    "mental": "mental",
    "rapida": "rapida",
    "emagrecimento": "metabolico", // Emagrecimento usa engine metabólico
    "calvicie": "geral", // Calvície usa engine geral (ou criar específico depois)
    "ansiedade": "mental", // Ansiedade usa engine mental
    "intestino": "gastro", // Intestino usa engine gastro
    "figado": "geral", // Fígado usa engine geral
    "libido-masculina": "geral", // Libido usa engine geral
    "menopausa": "geral", // Menopausa usa engine geral
    "articulacoes": "geral", // Articulações usa engine geral
    "imunidade": "geral", // Imunidade usa engine geral
  };
  
  return mapping[slug] || "geral";
};

export async function deriveReport(
  input: TriageInput, 
  ctx: { persist?: boolean }
): Promise<ReportViewModel> {
  // 1. Sanitize input to handle null values
  const sanitizedInput = {
    ...input,
    sessionData: {
      ...input.sessionData,
      profile: {
        ...input.sessionData.profile,
        // Convert null to undefined for optional fields
        sex: input.sessionData.profile.sex ?? undefined,
        age: input.sessionData.profile.age ?? undefined,
        bmi: input.sessionData.profile.bmi ?? undefined,
        whatsapp: coercePhoneLike(input.sessionData.profile.whatsapp) ?? undefined,
        weightKg: input.sessionData.profile.weightKg ?? undefined,
        heightCm: input.sessionData.profile.heightCm ?? undefined,
        // Mapear birthDate para birthDateISO se necessário
        birthDateISO: (input.sessionData.profile as any).birthDateISO || 
                      (input.sessionData.profile.birthDate || undefined),
      }
    }
  };

  // 2. Validate input (resilient)
  const validatedInput = TriageInputSchema.parse({
    ...sanitizedInput,
    sessionData: {
      ...sanitizedInput.sessionData,
      answers: sanitizedInput.sessionData.answers || {},
      profile: {
        ...sanitizedInput.sessionData.profile,
        name: sanitizedInput.sessionData.profile.name || "Usuário"
      }
    }
  });
  
  // 3. Extract triage type
  const triage = coerceTriage(validatedInput.sessionData.triageSlug) as TriagemKind;
  
  // 4. Get patient basics with calculated values
  let patientBasics = getPatientBasics(validatedInput.sessionData);
  
  // Se não encontrou dados básicos, criar um perfil padrão válido
  if (!patientBasics) {
    const profile = validatedInput.sessionData.profile;
    const defaultAge = profile.age ?? 35;
    const defaultWeight = profile.weightKg ?? 75;
    const defaultHeight = profile.heightCm ?? 170;
    const defaultSex = (profile.sex === 'M' || profile.sex === 'F' || profile.sex === 'Outro') 
      ? profile.sex 
      : 'M' as const;
    
    // Calcular data de nascimento a partir da idade
    const today = new Date();
    const birthYear = today.getFullYear() - defaultAge;
    const birthDateISO = `${birthYear}-01-01`;
    
    // Calcular IMC
    const heightM = defaultHeight / 100;
    const bmi = Math.round((defaultWeight / (heightM * heightM)) * 10) / 10;
    
    patientBasics = {
      name: profile.name || "Usuário",
      sex: defaultSex,
      birthDateISO,
      weightKg: defaultWeight,
      heightCm: defaultHeight,
      whatsapp: profile.whatsapp || "",
      age: defaultAge,
      bmi,
      bmiCategory: bmi < 18.5 ? "Abaixo do peso" : 
                   bmi < 25 ? "Peso normal" : 
                   bmi < 30 ? "Sobrepeso" : 
                   bmi < 35 ? "Obesidade grau I" : 
                   bmi < 40 ? "Obesidade grau II" : "Obesidade grau III"
    } as any;
  }

  // 5. Extract context from answers
  const answers = validatedInput.sessionData.answers ?? {};
  const context = {
    symptom: extractMainSymptom(answers) ?? null,
    bristol: answers.bristol ? Number(answers.bristol) : null,
    redFlags: extractRedFlags(answers),
    mainGoal: answers.objetivo_principal || answers.objetivo || 'melhorar_saude',
  };

  // 6. Try AI generation if enabled
  let aiReport = null;
  const aiEnabled = process.env.AI_REPORT_ENABLED === '1' && serverEnv.OPENAI_API_KEY;
  
  if (aiEnabled) {
    try {
      // Para produtos ZapFarm, usar o triageSlug diretamente para que a IA receba o prompt correto
      const zapfarmProducts = [
        'emagrecimento',
        'calvicie',
        'sono',
        'ansiedade',
        'intestino',
        'figado',
        'libido-masculina',
        'menopausa',
        'articulacoes',
        'imunidade'
      ];
      
      const aiKind = zapfarmProducts.includes(validatedInput.sessionData.triageSlug)
        ? validatedInput.sessionData.triageSlug
        : triage;
      
      aiReport = await generateReportArtifacts(aiKind, {
        sessionData: {
          answers: validatedInput.sessionData.answers,
          profile: {
            ...validatedInput.sessionData.profile,
            name: validatedInput.sessionData.profile.name || "Usuário"
          },
          triageSlug: validatedInput.sessionData.triageSlug
        }
      });
    } catch (error) {
      console.warn('[report] AI generation failed, using fallback:', error);
    }
  }

  // 7. Calculate dynamic score and palette
  const nbmi = normalizeBMI(patientBasics.bmi, patientBasics.age);
  const bmiValue = nbmi?.bmi ?? null;
  const bmiClass = nbmi?.classification ?? null;
  
  // 7.5. Para emagrecimento, calcular classificação GLP-1 e risco cardiometabólico
  let classification: 'contraindicado' | 'candidato_glp1' | 'nao_indicado' | undefined;
  let riscoCardiometabolico: 'baixo' | 'moderado' | 'alto' | undefined;
  let alertasMedico: string[] = [];
  
  if (validatedInput.sessionData.triageSlug === 'emagrecimento') {
    const answers = validatedInput.sessionData.answers;
    const altura = parseFloat(answers.altura) || validatedInput.sessionData.profile.heightCm;
    const peso = parseFloat(answers.peso) || validatedInput.sessionData.profile.weightKg;
    
    let imc: number | null = null;
    if (altura && peso && altura > 0) {
      const alturaM = altura / 100;
      imc = Math.round((peso / (alturaM * alturaM)) * 10) / 10;
    } else if (patientBasics?.bmi) {
      imc = patientBasics.bmi;
    }
    
    let comorbidades = Array.isArray(answers.comorbidades)
      ? answers.comorbidades.filter((c: string) => c !== 'nenhuma')
      : answers.comorbidades && answers.comorbidades !== 'nenhuma'
        ? [answers.comorbidades]
        : [];

    const paBand = answers.pressao_arterial_faixa as string | undefined;
    if (
      paBand &&
      ['elevada', 'estagio1', 'estagio2'].includes(paBand) &&
      !comorbidades.includes('hipertensao')
    ) {
      comorbidades = [...comorbidades, 'hipertensao'];
    }
    
    const contraindicacoes = Array.isArray(answers.contraindicacoes_glp1)
      ? answers.contraindicacoes_glp1.filter((c: string) => c !== 'nenhuma')
      : answers.contraindicacoes_glp1 && answers.contraindicacoes_glp1 !== 'nenhuma'
      ? [answers.contraindicacoes_glp1]
      : [];
    
    // Verificar gestação (apenas se existir - só aparece para sexo feminino)
    const gestacao = answers.gestacao ? (answers.gestacao === 'sim' || answers.gestacao === 'planejando') : false;
    const temContraindicacao = contraindicacoes.length > 0 || gestacao;
    
    // Calcular risco cardiometabólico
    if (imc) {
      const comorbidadesAltoRisco = ['diabetes_tipo_2', 'hipertensao', 'apneia_sono'];
      const temComorbidadeAltoRisco = comorbidades.some((c: string) => comorbidadesAltoRisco.includes(c));
      const temMultiplasComorbidades = comorbidades.length >= 2;
      
      if (imc >= 40 || (imc >= 35 && temMultiplasComorbidades) || (imc >= 30 && temComorbidadeAltoRisco && temMultiplasComorbidades)) {
        riscoCardiometabolico = 'alto';
      } else if (imc >= 35 || (imc >= 30 && temComorbidadeAltoRisco) || (imc >= 27 && temMultiplasComorbidades)) {
        riscoCardiometabolico = 'moderado';
      } else if (imc >= 30 || (imc >= 27 && comorbidades.length > 0)) {
        riscoCardiometabolico = 'moderado';
      } else {
        riscoCardiometabolico = 'baixo';
      }
    }
    
    const historicoMedicamentos = (() => {
      const u = answers.uso_medicacao_emagrecimento_recente as string | undefined;
      if (u === 'glp1') return ['injetaveis_semanais'];
      if (u === 'outro') return ['orais_emagrecimento'];
      if (u === 'nao') return ['nunca_usei'];
      if (Array.isArray(answers.historico_medicamentos)) return answers.historico_medicamentos;
      if (answers.historico_medicamentos) return [answers.historico_medicamentos];
      return [];
    })();

    const teveEfeitosColaterais = answers.efeitos_colaterais_previos === 'sim_parou';
    const usouInjetaveis = historicoMedicamentos.includes('injetaveis_semanais');

    if (usouInjetaveis && teveEfeitosColaterais) {
      alertasMedico.push('Relata uso prévio de medicação injetável semanal com efeitos colaterais importantes que levaram à suspensão do tratamento. Avaliar cuidadosamente reintrodução de GLP-1.');
    } else if (usouInjetaveis) {
      alertasMedico.push('Relata uso prévio de medicação injetável semanal. Considerar tolerância prévia na escolha do esquema de tratamento.');
    }

    if (answers.uso_opioides_3meses === 'sim') {
      alertasMedico.push(
        'Relata uso de opioides nos últimos 3 meses — avaliação médica criteriosa necessária antes de medicamentos para emagrecimento.'
      );
    }
    if (answers.cirurgia_bariatrica_previa === 'sim') {
      alertasMedico.push(
        'Histórico de cirurgia bariátrica ou cirurgia para emagrecimento — individualizar conduta com o médico.'
      );
    }
    if (answers.frequencia_cardiaca_repouso === 'mais_100') {
      alertasMedico.push(
        'Frequência cardíaca em repouso elevada referida — avaliar causas e segurança de medicamentos no programa.'
      );
    }
    
    if (temContraindicacao) {
      classification = 'contraindicado';
    } else if (imc && (imc >= 30 || (imc >= 27 && comorbidades.length > 0))) {
      classification = 'candidato_glp1';
    } else {
      classification = 'nao_indicado';
    }
  }
  
  const score = scoreFromAnswers({
    triage,
    answers,
    redFlags: context.redFlags,
    age: patientBasics.age,
    sex: patientBasics.sex,
    bmi: bmiValue,
  });
  
  const palette = paletteFromScore(score);
  const interpretation = scoreInterpretation(score);
  const gradient = gradientFromScore(score);
  const icon = iconFromScore(score);

  // 8. Generate personalized content
  const greeting = friendlyGreeting(patientBasics.name, triage);
  const executiveSummaryContent = executiveSummary(triage, context);
  const todayPlanContent = todayPlan(triage, context);
  const shortTermPlanContent = shortTermPlan(triage, context);
  const longTermPlanContent = longTermPlan(triage, context);
  const nonMedicalAdviceContent = nonMedicalAdvice(triage, context);
  const whenToSeekMedicalContent = whenToSeekMedical(triage, context);
  const scientificEvidenceContent = scientificEvidence(triage);
  const toneAdviceContent = toneAdvice(triage, context);

  // 9. Build ReportViewModel
  const viewModel: ReportViewModel = {
    id: validatedInput.triageId,
    triageId: validatedInput.triageId,
    triage,
    greeting,
    basics: {
      name: patientBasics.name,
      firstName: patientBasics.name.split(' ')[0] || 'você',
      age: patientBasics.age,
      sex: patientBasics.sex,
      bmi: bmiValue ?? 0,
      bmiCategory: bmiClass ?? 'Não calculado',
      heightCm: patientBasics.heightCm,
      weightKg: patientBasics.weightKg,
    },
    score,
    palette,
    interpretation,
    gradient,
    icon,
    context,
    content: {
      executiveSummary: executiveSummaryContent,
      todayPlan: todayPlanContent,
      shortTermPlan: shortTermPlanContent,
      longTermPlan: longTermPlanContent,
      nonMedicalAdvice: nonMedicalAdviceContent,
      whenToSeekMedical: whenToSeekMedicalContent,
      scientificEvidence: scientificEvidenceContent,
      toneAdvice: toneAdviceContent,
    },
    aiGenerated: !!aiReport,
    aiMarkdown: aiReport?.markdown ?? null,
    aiAudioScript: aiReport?.audioScript ?? null,
    icd10Candidates: aiReport?.icd10Candidates || [],
    createdAt: new Date().toISOString(),
  };

  // Adicionar classificação e answers ao VM para emagrecimento
  if (classification) {
    (viewModel as any).classification = classification;
    (viewModel as any).answers = validatedInput.sessionData.answers;
    (viewModel as any).riscoCardiometabolico = riscoCardiometabolico;
    (viewModel as any).alertasMedico = alertasMedico;
  }

  // 10. Persist if requested
  if (ctx.persist) {
    try {
      console.log(`[report] Report ${viewModel.id} generated successfully`);
    } catch (error) {
      console.error("[report] Persistence failed:", error);
    }
  }

  return viewModel;
}

// Funções auxiliares para extrair contexto das respostas
function extractMainSymptom(answers: Record<string, any>): string | undefined {
  // Tentar encontrar o sintoma principal baseado nas respostas
  const symptomKeys = ['sintoma_principal', 'main_symptom', 'queixa_principal', 'sintomas_principais'];
  
  for (const key of symptomKeys) {
    if (answers[key]) {
      if (Array.isArray(answers[key])) {
        return answers[key][0]; // Primeiro sintoma da lista
      }
      return String(answers[key]);
    }
  }
  
  // Fallback: procurar por padrões comuns
  if (answers.dor_abdominal) return 'dor abdominal';
  if (answers.azia) return 'azia';
  if (answers.distensao) return 'distensão abdominal';
  if (answers.nausea) return 'náusea';
  if (answers.vomito) return 'vômito';
  
  return undefined;
}

function extractRedFlags(answers: Record<string, any>): string[] {
  const redFlags: string[] = [];
  
  // Verificar flags específicas
  const flagKeys = ['red_flags', 'sinais_alerta', 'alertas'];
  
  for (const key of flagKeys) {
    if (answers[key]) {
      if (Array.isArray(answers[key])) {
        redFlags.push(...answers[key].filter(flag => flag && flag !== 'nenhuma'));
      } else if (answers[key] !== 'nenhuma') {
        redFlags.push(String(answers[key]));
      }
    }
  }
  
  // Verificar condições específicas que são red flags
  if (answers.sangramento_feces) redFlags.push('Sangramento nas fezes');
  if (answers.perda_peso_involuntaria) redFlags.push('Perda de peso involuntária');
  if (answers.disfagia) redFlags.push('Dificuldade para engolir');
  if (answers.dor_intensa) redFlags.push('Dor abdominal intensa');
  if (answers.febre_persistente) redFlags.push('Febre persistente');
  
  return redFlags;
}

// Funções auxiliares para gerar dados de apresentação para PDF
function generateKeyPoints(report: Report): Array<{ text: string; priority: 'high' | 'medium' | 'low' }> {
  const keyPoints = [];
  
  // Extrair pontos-chave do resumo
  if (report.narrative.heroSummary) {
    keyPoints.push({
      text: report.narrative.heroSummary,
      priority: 'high' as const,
    });
  }
  
  // Extrair pontos dos alertas
  report.alerts.forEach(alert => {
    if (alert.level === 'danger') {
      keyPoints.push({
        text: alert.title,
        priority: 'high' as const,
      });
    }
  });
  
  // Extrair pontos do roadmap
  report.roadmap.forEach(tab => {
    tab.quickWins.forEach(win => {
      keyPoints.push({
        text: win.label,
        priority: 'medium' as const,
      });
    });
  });
  
  // Limitar a 5 pontos-chave
  return keyPoints.slice(0, 5);
}

function generateRoadmap(report: Report): {
  immediate: Array<{ text: string; timeframe: string; priority: string; category: string }>;
  shortTerm: Array<{ text: string; timeframe: string; priority: string; category: string }>;
  mediumTerm: Array<{ text: string; timeframe: string; priority: string; category: string }>;
  longTerm: Array<{ text: string; timeframe: string; priority: string; category: string }>;
} {
  const roadmap = {
    immediate: [] as Array<{ text: string; timeframe: string; priority: string; category: string }>,
    shortTerm: [] as Array<{ text: string; timeframe: string; priority: string; category: string }>,
    mediumTerm: [] as Array<{ text: string; timeframe: string; priority: string; category: string }>,
    longTerm: [] as Array<{ text: string; timeframe: string; priority: string; category: string }>,
  };
  
  report.roadmap.forEach(tab => {
    tab.quickWins.forEach(win => {
      roadmap.immediate.push({
        text: win.label,
        timeframe: 'immediate',
        priority: 'high',
        category: tab.title,
      });
    });
    
    if (tab.goal) {
      roadmap.shortTerm.push({
        text: tab.goal.label,
        timeframe: 'short',
        priority: 'medium',
        category: tab.title,
      });
    }
  });
  
  return roadmap;
}

function generateClassification(scores: any): {
  level: 'leve' | 'moderado' | 'grave';
  label: string;
  description: string;
} {
  const currentScore = scores.current || 65;
  
  if (currentScore >= 80) {
    return {
      level: 'leve',
      label: 'Excelente',
      description: 'Sua saúde está em excelente estado',
    };
  } else if (currentScore >= 60) {
    return {
      level: 'moderado',
      label: 'Bom',
      description: 'Sua saúde está boa, com algumas oportunidades de melhoria',
    };
  } else {
    return {
      level: 'grave',
      label: 'Atenção necessária',
      description: 'Sua saúde requer atenção e mudanças no estilo de vida',
    };
  }
}

function generateRedFlags(alerts: any[]): Array<{ text: string; severity: 'high' | 'medium' | 'low'; action?: string }> {
  return alerts
    .filter(alert => alert.level === 'danger' || alert.level === 'warn')
    .map(alert => ({
      text: alert.title,
      severity: alert.level === 'danger' ? 'high' : 'medium',
      action: alert.action?.label,
    }));
}

// Legacy compatibility wrapper
export const deriveReportLegacy = async (input: Omit<DerivationContext, "triage"> & { triageSlug?: string }): Promise<Report> => {
  const triage = coerceTriage(input.triageSlug) as TriagemKind;
  const context: DerivationContext = {
    triage,
    patient: input.patient,
    answers: input.answers ?? {},
    sections: input.sections,
    summary: input.summary,
  };

  try {
    // Convert DerivationContext to TriageInput format
    const triageInput: TriageInput = {
      triageId: `legacy-${Date.now()}`,
      sessionData: {
        answers: context.answers,
        profile: {
          name: context.patient.name,
          sex: context.patient.sex,
          age: context.patient.age,
          bmi: context.patient.bmi,
          whatsapp: context.patient.whatsapp,
          weightKg: context.patient.weightKg,
          heightCm: context.patient.heightCm,
        },
        triageSlug: triage
      }
    };
    
    // Use the new engine but return legacy format
    return await defaultEngine.derive(triageInput) as any;
  } catch (error) {
    console.error("[report] deriveReportLegacy fallback", error);
    // Fallback to a basic report structure
    return {
      id: `legacy-${Date.now()}`,
      triage,
      createdAt: new Date().toISOString(),
      narrative: {
        headline: `Relatório para ${context.patient.name}`,
        heroSummary: "Relatório gerado com informações básicas",
        healthStatement: "Consulte um profissional de saúde para orientação específica"
      },
      scores: { current: 65, potential: 75 },
      patient: context.patient,
      alerts: [],
      roadmap: [],
      exams: [],
      timeline: []
    } as Report;
  }
};