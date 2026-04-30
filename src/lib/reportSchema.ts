// src/lib/reportSchema.ts
// Schema Zod para validação rigorosa dos relatórios da IA (anti-alucinação)

import { z } from 'zod';

// Schema principal do relatório médico
export const reportSchema = z.object({
  version: z.string().default("1.0"),
  demographics: z.object({
    sex: z.enum(["M", "F", "O"]),
    age: z.number().min(0).max(120),
    imc: z.number().min(10).max(100)
  }),
  red_flags: z.array(z.string()).max(10), // Máximo 10 red flags
  hypotheses: z.array(z.object({
    title: z.string().min(5).max(100),
    rationale: z.string().min(10).max(500),
    priority: z.union([z.literal(1), z.literal(2), z.literal(3)])
  })).max(5), // Máximo 5 hipóteses
  pathophysiology: z.array(z.string().min(10).max(200)).max(8), // Bullets curtas
  action_plan: z.object({
    sleep: z.array(z.string().min(5).max(150)).max(5),
    nutrition: z.array(z.string().min(5).max(150)).max(5),
    activity: z.array(z.string().min(5).max(150)).max(5),
    mental: z.array(z.string().min(5).max(150)).max(5),
    supplements: z.array(z.string().min(5).max(150)).max(5).optional(),
    exams: z.array(z.string().min(5).max(150)).max(5).optional()
  }),
  scales: z.array(z.object({
    name: z.string().min(3).max(50),
    score: z.number().min(0).max(100),
    briefInterpretation: z.string().min(10).max(200)
  })).max(3).optional(),
  references: z.array(z.object({
    title: z.string().min(5).max(100),
    source: z.string().min(5).max(100)
  })).max(5)
});

export type ReportData = z.infer<typeof reportSchema>;

// Schema de fallback seguro quando a IA falha
export const fallbackReportSchema = z.object({
  version: z.string().default("1.0"),
  demographics: z.object({
    sex: z.enum(["M", "F", "O"]),
    age: z.number().min(0).max(120),
    imc: z.number().min(10).max(100)
  }),
  red_flags: z.array(z.string()).default([]),
  hypotheses: z.array(z.object({
    title: z.string(),
    rationale: z.string(),
    priority: z.union([z.literal(1), z.literal(2), z.literal(3)])
  })).default([]),
  pathophysiology: z.array(z.string()).default([]),
  action_plan: z.object({
    sleep: z.array(z.string()).default([]),
    nutrition: z.array(z.string()).default([]),
    activity: z.array(z.string()).default([]),
    mental: z.array(z.string()).default([]),
    supplements: z.array(z.string()).optional(),
    exams: z.array(z.string()).optional()
  }).default({
    sleep: [],
    nutrition: [],
    activity: [],
    mental: []
  }),
  scales: z.array(z.object({
    name: z.string(),
    score: z.number(),
    briefInterpretation: z.string()
  })).optional(),
  references: z.array(z.object({
    title: z.string(),
    source: z.string()
  })).default([])
});

export type FallbackReportData = z.infer<typeof fallbackReportSchema>;

// Função para validar e sanitizar resposta da IA
export function validateReportResponse(aiResponse: string, demographics: { sex: string; age: number; imc: number }): ReportData {
  try {
    // Tentar fazer parse do JSON
    const parsed = JSON.parse(aiResponse);
    
    // Validar com schema principal
    const validated = reportSchema.parse({
      ...parsed,
      demographics: {
        sex: demographics.sex as "M" | "F" | "O",
        age: demographics.age,
        imc: demographics.imc
      }
    });
    
    return validated;
  } catch (error) {
    console.warn('❌ Falha na validação do relatório da IA:', error);
    
    // Fallback seguro
    return fallbackReportSchema.parse({
      demographics: {
        sex: demographics.sex as "M" | "F" | "O",
        age: demographics.age,
        imc: demographics.imc
      },
      red_flags: ["Dados insuficientes para análise completa"],
      hypotheses: [{
        title: "Avaliação médica recomendada",
        rationale: "Com base nos dados fornecidos, recomenda-se avaliação médica presencial para análise completa.",
        priority: 1 as const
      }],
      pathophysiology: ["Consulte um profissional de saúde para análise detalhada"],
      action_plan: {
        sleep: ["Mantenha horários regulares de sono"],
        nutrition: ["Alimentação equilibrada e hidratação adequada"],
        activity: ["Atividade física regular conforme orientação médica"],
        mental: ["Bem-estar mental e redução de estresse"]
      },
      references: [{
        title: "Consulte sempre um profissional de saúde",
        source: "Recomendação médica padrão"
      }]
    });
  }
}

// Função para detectar possíveis alucinações
export function detectHallucination(text: string): boolean {
  const suspiciousPatterns = [
    /cura definitiva/i,
    /100% eficaz/i,
    /garantia de/i,
    /diagnóstico definitivo/i,
    /medicamento específico/i,
    /dosagem exata/i,
    /protocolo único/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(text));
}

// Função para sanitizar texto removendo alucinações
export function sanitizeText(text: string): string {
  if (detectHallucination(text)) {
    return "Consulte um profissional de saúde para orientação específica.";
  }
  
  // Substituir termos muito assertivos por linguagem mais conservadora
  return text
    .replace(/cura/gi, "pode ajudar")
    .replace(/garantia/gi, "evidências sugerem")
    .replace(/definitivo/gi, "possível")
    .replace(/100%/gi, "pode contribuir")
    .replace(/sempre/gi, "geralmente")
    .replace(/nunca/gi, "raramente");
}
