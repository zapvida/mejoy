// src/features/patient/profile.ts
// Sistema de perfil do paciente com cálculo automático de IMC, idade e sexo

export type PatientBasics = {
  sex: "M"|"F"|"Outro";
  birthDateISO: string; // YYYY-MM-DD
  weightKg: number;
  heightCm: number;
};

export type PatientProfile = {
  sex: "M"|"F"|"Outro";
  age: number;
  bmi: number;
  bmiCategory?: "baixo"|"normal"|"sobrepeso"|"obesidade"|"pediatric";
  weightKg: number;
  heightCm: number;
};

/**
 * Calcula a idade baseada na data de nascimento
 */
export function deriveAge(birthDateISO: string, now = new Date()): number {
  const birth = new Date(birthDateISO);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  
  return Math.max(0, age);
}

/**
 * Calcula o IMC baseado no peso e altura
 */
export function deriveBMI(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm || heightCm <= 0) return 0;
  
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * Classifica o IMC para adultos (≥19 anos)
 * Para menores de 19 anos, retorna "pediatric"
 */
export function bmiCategory(bmi: number, age: number): "baixo"|"normal"|"sobrepeso"|"obesidade"|"pediatric" {
  if (age < 19) return "pediatric";
  if (bmi < 18.5) return "baixo";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "sobrepeso";
  return "obesidade";
}

/**
 * Cria um perfil completo do paciente a partir dos dados básicos
 */
export function createPatientProfile(basics: PatientBasics): PatientProfile {
  const age = deriveAge(basics.birthDateISO);
  const bmi = deriveBMI(basics.weightKg, basics.heightCm);
  
  return {
    sex: basics.sex,
    age,
    bmi,
    bmiCategory: bmiCategory(bmi, age),
    weightKg: basics.weightKg,
    heightCm: basics.heightCm
  };
}

/**
 * Valida os dados básicos do paciente
 */
export function validatePatientBasics(basics: Partial<PatientBasics>): string[] {
  const errors: string[] = [];
  
  if (!basics.sex || !["M", "F", "Outro"].includes(basics.sex)) {
    errors.push("Sexo deve ser M, F ou Outro");
  }
  
  if (!basics.birthDateISO) {
    errors.push("Data de nascimento é obrigatória");
  } else {
    const birthDate = new Date(basics.birthDateISO);
    const today = new Date();
    const age = deriveAge(basics.birthDateISO);
    
    if (birthDate > today) {
      errors.push("Data de nascimento não pode ser futura");
    }
    
    if (age > 120) {
      errors.push("Idade não pode ser superior a 120 anos");
    }
  }
  
  if (!basics.weightKg || basics.weightKg < 20 || basics.weightKg > 300) {
    errors.push("Peso deve estar entre 20 e 300 kg");
  }
  
  if (!basics.heightCm || basics.heightCm < 100 || basics.heightCm > 250) {
    errors.push("Altura deve estar entre 100 e 250 cm");
  }
  
  return errors;
}

/**
 * Persiste o perfil do paciente no localStorage (SSR-safe)
 */
export function persistPatientProfile(profile: PatientProfile): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('ah.patientProfile.v1', JSON.stringify(profile));
    } catch (error) {
      console.warn('Failed to persist patient profile:', error);
    }
  }
}

/**
 * Recupera o perfil do paciente do localStorage
 */
export function getPersistedPatientProfile(): PatientProfile | null {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('ah.patientProfile.v1');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to retrieve patient profile:', error);
      return null;
    }
  }
  return null;
}

/**
 * Limpa o perfil persistido
 */
export function clearPatientProfile(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('ah.patientProfile.v1');
    } catch (error) {
      console.warn('Failed to clear patient profile:', error);
    }
  }
}

/**
 * Formata o IMC para exibição
 */
export function formatBMI(bmi: number): string {
  return `IMC: ${bmi}`;
}

/**
 * Formata a categoria do IMC para exibição
 */
export function formatBMICategory(category: string): string {
  const labels = {
    baixo: "Abaixo do peso",
    normal: "Peso normal", 
    sobrepeso: "Sobrepeso",
    obesidade: "Obesidade",
    pediatric: "Classificação pediátrica"
  };
  
  return labels[category as keyof typeof labels] || "Não classificado";
}

/**
 * Gera texto educativo sobre IMC para crianças
 */
export function getPediatricBMINote(): string {
  return "Para crianças e adolescentes, a classificação do IMC requer percentis específicos por idade e sexo. Consulte um pediatra para avaliação adequada.";
}
