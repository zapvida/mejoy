/**
 * BMI normalization helper
 * Handles both numeric and object BMI representations
 */

type BMIObject = { bmi: number; classification?: string };

/**
 * Classifica o IMC para adultos (≥18 anos)
 */
export function classifyBMI(bmi: number, age?: number): string {
  // Para menores de 18 anos, usar classificação simplificada
  if (age && age < 18) {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
  }

  // Para adultos (≥18 anos)
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  if (bmi < 35) return 'Obesidade grau I';
  if (bmi < 40) return 'Obesidade grau II';
  return 'Obesidade grau III';
}

/**
 * Calcula o IMC a partir de peso e altura
 */
export function calculateBMI(weightKg: number, heightCm: number): number | null {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function normalizeBMI(input: number | BMIObject | null | undefined, age?: number): BMIObject | null {
  if (input == null) return null;
  
  if (typeof input === 'number') {
    return { 
      bmi: input, 
      classification: classifyBMI(input, age) 
    };
  }
  
  if (typeof input === 'object' && typeof (input as any).bmi === 'number') {
    const bmiObj = input as BMIObject;
    // Se não tem classificação, calcular
    if (!bmiObj.classification && bmiObj.bmi) {
      return {
        ...bmiObj,
        classification: classifyBMI(bmiObj.bmi, age)
      };
    }
    return bmiObj;
  }
  
  return null;
}
