import type { ReportData } from '@/lib/report/types';
import { deriveAge, deriveBMI, bmiCategory } from '@/features/patient/profile';



export function toReportData(answers: any, patientBasics?: any): ReportData {
  const age = patientBasics ? deriveAge(patientBasics.birthDateISO) : undefined;
  const bmi = patientBasics ? deriveBMI(patientBasics.weightKg, patientBasics.heightCm) : undefined;
  
  // Detectar red flags
  const hasRedFlag = detectRedFlags(answers);
  
  // TODO(backcompat-2025-10-23) - createCTAContext/getContextualCTA não implementados
  // const _ctaContext = (globalThis as any).createCTAContext?.(
  //   'alergias',
  //   'bem-estar',
  //   hasRedFlag,
  //   { age, sex: patientBasics?.sex }
  // );
  
  // const _cta = (globalThis as any).getContextualCTA?.(_ctaContext);
  
  return {
    id: "alergias-report",
    createdAt: new Date().toISOString(),
    triage: "gastro" as const,
    narrative: {
      // TODO(backcompat-2025-10-23) - headline opcional
      headline: generateHeroSummary(answers, hasRedFlag),
      heroSummary: generateHeroSummary(answers, hasRedFlag),
      healthStatement: "Siga cada seção como um roteiro diário. Pequenas vitórias em sequência criam grandes mudanças."
    },
    // quickWins: generateQuickWins(answers),
    // weeklyGoal: generateWeeklyGoal(),
    patient: {
      // TODO(backcompat-2025-10-23) - name opcional
      name: patientBasics?.name || "Paciente",
      ...(patientBasics?.sex ? { sex: patientBasics.sex } : {}),
      ...(age !== undefined ? { age } : {}),
      ...(bmi !== undefined ? { bmi } : {}),
      ...(age && age >= 19 && bmi ? { bmiCategory: bmiCategory(bmi, age) } : {})
    },
    // TODO(backcompat-2025-10-23) - alerts com level correto
    alerts: generateAlerts(answers, hasRedFlag).map(alert => ({
      ...alert,
      level: alert.level as "info" | "warn" | "danger"
    })),
    // preventiveExams: generatePreventiveExams(age, patientBasics?.sex),
    // grocery: generateGrocery(),
    // citations: generateCitations()
  };
}

function detectRedFlags(answers: any): boolean {
  // Implementar lógica específica para detectar red flags
  // TODO(backcompat-2025-10-23) - RED_FLAG_FIELDS não implementado
  const redFlagFields = (globalThis as any).RED_FLAG_FIELDS || [];
  
  for (const field of redFlagFields) {
    if (answers[field] === 'Sim' || answers[field] === 'Muito intensa') {
      return true;
    }
  }
  
  return false;
}

function generateHeroSummary(_answers: any, hasRedFlag: boolean): string {
  if (hasRedFlag) {
    return "Identificamos sinais que requerem atenção médica. Procure avaliação profissional o quanto antes.";
  }
  
  return "Seu retrato de saúde — simples, claro e acionável. Focamos em prevenção e bem-estar.";
}

// function generatePillars() {
//   return [
//     {
//       title: "Rotina Alergologia",
//       description: "Hábitos diários para manter sua saúde em dia",
//       quickWins: [
//         { title: "Ação rápida 1", description: "Implemente esta mudança hoje" },
//         { title: "Ação rápida 2", description: "Pequeno ajuste, grande impacto" }
//       ],
//       goal: {
//         title: "Meta semanal",
//         description: "Objetivo específico para esta semana"
//       }
//     },
//     {
//       title: "Nutrição Inteligente",
//       description: "Alimentação como medicina preventiva",
//       quickWins: [
//         { title: "Hidratação", description: "Beba mais água ao longo do dia" },
//         { title: "Vegetais", description: "Aumente o consumo de vegetais" }
//       ],
//       goal: {
//         title: "Meta nutricional",
//         description: "Foque em uma mudança alimentar específica"
//       }
//     },
//     {
//       title: "Sono & Recuperação",
//       description: "Qualidade do sono como base da saúde",
//       quickWins: [
//         { title: "Rotina", description: "Estabeleça horários regulares" },
//         { title: "Ambiente", description: "Otimize seu ambiente de sono" }
//       ],
//       goal: {
//         title: "Meta de sono",
//         description: "Melhore a qualidade do seu descanso"
//       }
//     }
//   ];
// }

// function generateQuickWins(_answers: any) {
//   return [
//     { title: "Ação imediata", description: "Comece hoje mesmo" },
//     { title: "Hábito simples", description: "Fácil de implementar" },
//     { title: "Impacto alto", description: "Grande benefício" }
//   ];
// }

// function generateWeeklyGoal() {
//   return {
//     title: "Meta desta semana",
//     description: "Foque em uma mudança específica"
//   };
// }

function generateAlerts(_answers: any, hasRedFlag: boolean) {
  const alerts = [];
  
  if (hasRedFlag) {
    alerts.push({
      id: 'red-flag',
      level: 'danger',
      title: 'Atenção Médica Necessária',
      why: 'Identificamos sinais que requerem avaliação profissional imediata',
      action: {
        label: 'Falar com um médico agora',
        href: '/atendimento?utm_source=triage&utm_medium=report_alergias&utm_campaign=2025Q4'
      }
    });
  }
  
  return alerts;
}

// function generatePreventiveExams(age?: number, sex?: string) {
//   const exams = [];
//   
//   if (age && age >= 18) {
//     exams.push({
//       name: "Exame básico",
//       when: "Anualmente",
//       why: "Prevenção e detecção precoce",
//       prep: "Jejum de 8 horas"
//     });
//   }
//   
//   return exams;
// }

// function generateGrocery() {
//   return [
//     { category: "Vegetais", items: ["Brócolis", "Espinafre", "Cenoura"] },
//     { category: "Frutas", items: ["Maçã", "Banana", "Laranja"] },
//     { category: "Proteínas", items: ["Frango", "Peixe", "Ovos"] }
//   ];
// }

// function generateCitations() {
//   return [
//     "Baseado em diretrizes médicas atualizadas",
//     "Evidências científicas recentes",
//     "Recomendações de especialistas"
//   ];
// }
