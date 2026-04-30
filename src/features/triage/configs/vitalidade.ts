import type { ReportData } from '@/lib/report/types';
import { deriveAge, deriveBMI, bmiCategory } from '@/features/patient/profile';



export function toReportData(answers: any, patientBasics?: any): ReportData {
  const age = patientBasics ? deriveAge(patientBasics.birthDateISO) : undefined;
  const bmi = patientBasics ? deriveBMI(patientBasics.weightKg, patientBasics.heightCm) : undefined;
  
  // Detectar red flags
  const hasRedFlag = detectRedFlags(answers);
  
  // Criar contexto para CTA
  const ctaContext = createCTAContext(
    'vitalidade',
    'performance',
    hasRedFlag,
    { age, sex: patientBasics?.sex }
  );
  
  // const cta = getContextualCTA(ctaContext);
  
  return {
    narrative: {
      heroSummary: generateHeroSummary(answers, hasRedFlag),
      healthStatement: "Siga cada seção como um roteiro diário. Pequenas vitórias em sequência criam grandes mudanças."
    },
    pillars: generatePillars(),
    quickWins: generateQuickWins(answers),
    weeklyGoal: generateWeeklyGoal(),
    patient: {
      sex: patientBasics?.sex,
      age,
      bmi,
      bmiCategory: age && age >= 19 && bmi ? bmiCategory(bmi, age) : undefined
    },
    alerts: generateAlerts(answers, hasRedFlag),
    preventiveExams: generatePreventiveExams(age, patientBasics?.sex),
    grocery: generateGrocery(),
    citations: generateCitations()
  };
}

function detectRedFlags(answers: any): boolean {
  // Implementar lógica específica para detectar red flags
  const redFlagFields = {RED_FLAG_FIELDS};
  
  for (const field of redFlagFields) {
    if (answers[field] === 'Sim' || answers[field] === 'Muito intensa') {
      return true;
    }
  }
  
  return false;
}

function generateHeroSummary(answers: any, hasRedFlag: boolean): string {
  if (hasRedFlag) {
    return "Identificamos sinais que requerem atenção médica. Procure avaliação profissional o quanto antes.";
  }
  
  return "Seu retrato de saúde — simples, claro e acionável. Focamos em prevenção e bem-estar.";
}

function generatePillars() {
  return [
    {
      title: "Rotina Medicina Funcional",
      description: "Hábitos diários para manter sua saúde em dia",
      quickWins: [
        { title: "Ação rápida 1", description: "Implemente esta mudança hoje" },
        { title: "Ação rápida 2", description: "Pequeno ajuste, grande impacto" }
      ],
      goal: {
        title: "Meta semanal",
        description: "Objetivo específico para esta semana"
      }
    },
    {
      title: "Nutrição Inteligente",
      description: "Alimentação como medicina preventiva",
      quickWins: [
        { title: "Hidratação", description: "Beba mais água ao longo do dia" },
        { title: "Vegetais", description: "Aumente o consumo de vegetais" }
      ],
      goal: {
        title: "Meta nutricional",
        description: "Foque em uma mudança alimentar específica"
      }
    },
    {
      title: "Sono & Recuperação",
      description: "Qualidade do sono como base da saúde",
      quickWins: [
        { title: "Rotina", description: "Estabeleça horários regulares" },
        { title: "Ambiente", description: "Otimize seu ambiente de sono" }
      ],
      goal: {
        title: "Meta de sono",
        description: "Melhore a qualidade do seu descanso"
      }
    }
  ];
}

function generateQuickWins(_answers: any) {
  return [
    { title: "Ação imediata", description: "Comece hoje mesmo" },
    { title: "Hábito simples", description: "Fácil de implementar" },
    { title: "Impacto alto", description: "Grande benefício" }
  ];
}

function generateWeeklyGoal() {
  return {
    title: "Meta desta semana",
    description: "Foque em uma mudança específica"
  };
}

function generateAlerts(answers: any, hasRedFlag: boolean) {
  const alerts = [];
  
  if (hasRedFlag) {
    alerts.push({
      id: 'red-flag',
      level: 'danger',
      title: 'Atenção Médica Necessária',
      why: 'Identificamos sinais que requerem avaliação profissional imediata',
      action: {
        label: 'Falar com um médico agora',
        href: '/atendimento?utm_source=triage&utm_medium=report_vitalidade&utm_campaign=2025Q4'
      }
    });
  }
  
  return alerts;
}

function generatePreventiveExams(age?: number, _sex?: string) {
  const exams = [];
  
  if (age && age >= 18) {
    exams.push({
      name: "Exame básico",
      when: "Anualmente",
      why: "Prevenção e detecção precoce",
      prep: "Jejum de 8 horas"
    });
  }
  
  return exams;
}

function generateGrocery() {
  return [
    { category: "Vegetais", items: ["Brócolis", "Espinafre", "Cenoura"] },
    { category: "Frutas", items: ["Maçã", "Banana", "Laranja"] },
    { category: "Proteínas", items: ["Frango", "Peixe", "Ovos"] }
  ];
}

function generateCitations() {
  return [
    "Baseado em diretrizes médicas atualizadas",
    "Evidências científicas recentes",
    "Recomendações de especialistas"
  ];
}
