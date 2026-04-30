// src/lib/triage/patientData.ts
// Sistema de perfil único do paciente com verificação e cálculos automáticos

export interface PatientBasics {
  name: string;
  sex: "M" | "F" | "Outro";
  birthDateISO: string; // YYYY-MM-DD
  weightKg: number;
  heightCm: number;
  whatsapp?: string;
  email?: string;
}

export interface PatientProfile extends PatientBasics {
  age: number;
  bmi: number;
  bmiCategory: string;
}

/**
 * Verifica se os dados básicos do paciente já foram coletados
 */
export function hasPatientBasics(sessionData: any): boolean {
  const profile = sessionData?.profile;
  return !!(
    profile?.name &&
    profile?.sex &&
    profile?.age &&
    profile?.weightKg &&
    profile?.heightCm
  );
}

/**
 * Extrai dados básicos do paciente da sessão
 */
export function getPatientBasics(sessionData: any): PatientProfile | null {
  if (!hasPatientBasics(sessionData)) {
    return null;
  }

  const profile = sessionData.profile;
  const age = deriveAge(profile.birthDateISO || calculateBirthDateFromAge(profile.age));
  const bmi = deriveBMI(profile.weightKg, profile.heightCm);

  return {
    name: profile.name,
    sex: profile.sex,
    birthDateISO: profile.birthDateISO || calculateBirthDateFromAge(profile.age),
    weightKg: profile.weightKg,
    heightCm: profile.heightCm,
    whatsapp: profile.whatsapp,
    email: profile.email,
    age,
    bmi,
    bmiCategory: getBMICategory(bmi, age)
  };
}

/**
 * Calcula idade a partir da data de nascimento
 */
export function deriveAge(birthDateISO: string): number {
  if (!birthDateISO) return 0;
  
  const birthDate = new Date(birthDateISO);
  const today = new Date();
  const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  
  return Math.max(0, age);
}

/**
 * Calcula IMC a partir de peso e altura
 */
export function deriveBMI(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm || heightCm <= 0) return 0;
  
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  
  return Math.round(bmi * 10) / 10; // Arredondar para 1 casa decimal
}

/**
 * Calcula data de nascimento a partir da idade (fallback)
 */
function calculateBirthDateFromAge(age: number): string {
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  return `${birthYear}-01-01`; // Aproximação
}

/**
 * Categoriza IMC baseado na idade
 */
function getBMICategory(bmi: number, age: number): string {
  if (age < 18) {
    // Para menores de 18, usar percentis (simplificado)
    if (bmi < 18.5) return "Abaixo do peso";
    if (bmi < 25) return "Peso normal";
    if (bmi < 30) return "Sobrepeso";
    return "Obesidade";
  }

  // Para adultos (≥18 anos)
  if (bmi < 18.5) return "Abaixo do peso";
  if (bmi < 25) return "Peso normal";
  if (bmi < 30) return "Sobrepeso";
  if (bmi < 35) return "Obesidade grau I";
  if (bmi < 40) return "Obesidade grau II";
  return "Obesidade grau III";
}

/**
 * Valida dados básicos do paciente
 */
export function validatePatientBasics(basics: Partial<PatientBasics>): string[] {
  const errors: string[] = [];
  
  if (!basics.name || basics.name.trim().length < 3) {
    errors.push("Nome deve ter pelo menos 3 caracteres");
  }
  
  if (!basics.sex || !["M", "F", "Outro"].includes(basics.sex)) {
    errors.push("Sexo deve ser M, F ou Outro");
  }
  
  if (!basics.birthDateISO) {
    errors.push("Data de nascimento é obrigatória");
  } else {
    const age = deriveAge(basics.birthDateISO);
    if (age < 0 || age > 120) {
      errors.push("Idade deve estar entre 0 e 120 anos");
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
 * Cria perfil completo do paciente
 */
export function createPatientProfile(basics: PatientBasics): PatientProfile {
  const age = deriveAge(basics.birthDateISO);
  const bmi = deriveBMI(basics.weightKg, basics.heightCm);
  
  return {
    ...basics,
    age,
    bmi,
    bmiCategory: getBMICategory(bmi, age)
  };
}
