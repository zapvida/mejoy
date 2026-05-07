export type MealRiskLevel = 'low' | 'moderate' | 'high';

export type MealEstimate = {
  caloriesEstimate: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  riskLevel: MealRiskLevel;
  flags: string[];
  bestChoice: string;
};

const HIGH_RISK_TERMS = ['frito', 'fritura', 'refrigerante', 'sobremesa', 'milkshake', 'pizza', 'hamburguer', 'combo'];
const MODERATE_RISK_TERMS = ['massa', 'pasta', 'risoto', 'lasanha', 'parmegiana', 'batata'];
const PROTEIN_TERMS = ['frango', 'peixe', 'atum', 'ovo', 'carne', 'salmão', 'tofu', 'iogurte'];
const FIBER_TERMS = ['salada', 'legumes', 'verdura', 'feijão', 'grão', 'aveia', 'fruta'];

export function estimateMealFromText(input: string): MealEstimate {
  const normalized = input.toLowerCase();
  const flags: string[] = [];

  const highRiskHits = HIGH_RISK_TERMS.filter((term) => normalized.includes(term));
  const moderateRiskHits = MODERATE_RISK_TERMS.filter((term) => normalized.includes(term));
  const proteinHits = PROTEIN_TERMS.filter((term) => normalized.includes(term));
  const fiberHits = FIBER_TERMS.filter((term) => normalized.includes(term));

  let caloriesEstimate = 420;
  let carbsGrams = 34;
  let proteinGrams = 24;
  let fatGrams = 16;
  let fiberGrams = 6;
  let riskLevel: MealRiskLevel = 'low';
  let bestChoice = 'Priorize proteína magra, vegetais e bebida sem açúcar.';

  if (moderateRiskHits.length > 0) {
    caloriesEstimate += 180;
    carbsGrams += 18;
    fatGrams += 6;
    riskLevel = 'moderate';
    flags.push('Carga glicêmica moderada para jornada GLP-1.');
  }

  if (highRiskHits.length > 0) {
    caloriesEstimate += 280;
    carbsGrams += 26;
    fatGrams += 12;
    riskLevel = 'high';
    flags.push('Combinação de densidade calórica e palatabilidade alta.');
    bestChoice = 'Se houver alternativa, troque fritura/combo por prato com proteína, legumes e água.';
  }

  if (proteinHits.length === 0) {
    proteinGrams -= 8;
    flags.push('Proteína pouco evidente no registro enviado.');
  }

  if (fiberHits.length > 0) {
    fiberGrams += 4;
  } else {
    fiberGrams = Math.max(2, fiberGrams - 2);
    flags.push('Pouca fibra aparente; risco maior de fome precoce.');
  }

  return {
    caloriesEstimate,
    proteinGrams,
    carbsGrams,
    fatGrams,
    fiberGrams,
    riskLevel,
    flags,
    bestChoice,
  };
}
