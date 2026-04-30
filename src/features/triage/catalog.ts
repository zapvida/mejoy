// src/features/triage/catalog.ts
// Catálogo completo de triagens com metadados

export type TriageMeta = {
  slug: string;
  title: string;
  subtitle: string;
  icon?: string; // legado
  emoji?: string; // sugestão primária
  category: string;
  persona: "adulto"|"mulher"|"homem"|"idoso"|"crianca"|"trabalhador";
  motivator: "dor"|"risco"|"estetica"|"bem-estar"|"performance";
  premium: boolean;
  priority: "P0"|"P1"|"P2";
  description: string;
  duration: string;
  questions: number;
};

export const TRIAGE_CATALOG: TriageMeta[] = [
  // P0 – Alta demanda/urgência (converter agora)
  {
    slug: "cardiovascular",
    title: "Saúde Cardiovascular",
    subtitle: "Pressão, palpitações, risco cardíaco",
    emoji: "❤️",
    category: "Cardiologia",
    persona: "adulto",
    motivator: "risco",
    premium: true,
    priority: "P0",
    description: "Avaliação completa da saúde cardiovascular com foco em prevenção e detecção precoce de riscos.",
    duration: "4-5 min",
    questions: 18
  },
  {
    slug: "diabetes-metabolismo",
    title: "Diabetes e Metabolismo",
    subtitle: "Glicemia, resistência insulínica",
    emoji: "🍯",
    category: "Endocrinologia",
    persona: "adulto",
    motivator: "risco",
    premium: true,
    priority: "P0",
    description: "Triagem para diabetes tipo 2, pré-diabetes e distúrbios metabólicos.",
    duration: "4-5 min",
    questions: 16
  },
  {
    slug: "dor-cronica",
    title: "Dor Crônica & Fibromialgia",
    subtitle: "Mapa de dor e gatilhos",
    emoji: "🩹",
    category: "Reumatologia",
    persona: "adulto",
    motivator: "dor",
    premium: true,
    priority: "P0",
    description: "Avaliação de dor crônica, fibromialgia e condições reumatológicas.",
    duration: "5-6 min",
    questions: 20
  },
  {
    slug: "coluna",
    title: "Dor na Coluna",
    subtitle: "Lombalgia, hérnia, sinais neurológicos",
    emoji: "🦴",
    category: "Ortopedia",
    persona: "adulto",
    motivator: "dor",
    premium: true,
    priority: "P0",
    description: "Triagem para problemas de coluna vertebral e dores musculoesqueléticas.",
    duration: "4-5 min",
    questions: 17
  },
  {
    slug: "respiratoria",
    title: "Saúde Respiratória",
    subtitle: "Asma, DPOC, apneia do sono",
    emoji: "🫁",
    category: "Pneumologia",
    persona: "adulto",
    motivator: "risco",
    premium: true,
    priority: "P0",
    description: "Avaliação de condições respiratórias e qualidade do sono.",
    duration: "4-5 min",
    questions: 16
  },
  {
    slug: "renal",
    title: "Saúde Renal",
    subtitle: "Pedras, função renal",
    emoji: "🫘",
    category: "Nefrologia",
    persona: "adulto",
    motivator: "risco",
    premium: true,
    priority: "P0",
    description: "Triagem para problemas renais e cálculo renal.",
    duration: "3-4 min",
    questions: 14
  },
  {
    slug: "hepatica",
    title: "Saúde do Fígado",
    subtitle: "Esteatose, hepatites",
    emoji: "🫀",
    category: "Gastroenterologia",
    persona: "adulto",
    motivator: "risco",
    premium: true,
    priority: "P0",
    description: "Avaliação da saúde hepática e função do fígado.",
    duration: "3-4 min",
    questions: 13
  },
  {
    slug: "mulher",
    title: "Saúde da Mulher",
    subtitle: "SOP, endometriose, menopausa",
    emoji: "👩",
    category: "Ginecologia",
    persona: "mulher",
    motivator: "bem-estar",
    premium: true,
    priority: "P0",
    description: "Triagem especializada em saúde feminina e condições ginecológicas.",
    duration: "5-6 min",
    questions: 19
  },
  {
    slug: "prostata",
    title: "Saúde da Próstata",
    subtitle: "LUTS, PSA, hiperplasia",
    emoji: "🎯",
    category: "Urologia",
    persona: "homem",
    motivator: "risco",
    premium: true,
    priority: "P0",
    description: "Avaliação da saúde prostática e sintomas urinários.",
    duration: "4-5 min",
    questions: 16
  },
  {
    slug: "tireoide",
    title: "Saúde da Tireoide",
    subtitle: "Hipo/hiper, nódulos",
    emoji: "🦋",
    category: "Endocrinologia",
    persona: "adulto",
    motivator: "bem-estar",
    premium: true,
    priority: "P0",
    description: "Triagem para distúrbios da tireoide e função hormonal.",
    duration: "4-5 min",
    questions: 15
  },

  // P1 – Conversão média-alta (vida real/bem-estar)
  {
    slug: "mama",
    title: "Saúde da Mama",
    subtitle: "Dor, nódulos, rastreio",
    emoji: "🌸",
    category: "Mastologia",
    persona: "mulher",
    motivator: "risco",
    premium: true,
    priority: "P1",
    description: "Avaliação da saúde mamária e prevenção do câncer de mama.",
    duration: "3-4 min",
    questions: 12
  },
  {
    slug: "ocular",
    title: "Saúde Ocular",
    subtitle: "Visão, glaucoma, catarata",
    emoji: "👁️",
    category: "Oftalmologia",
    persona: "adulto",
    motivator: "bem-estar",
    premium: true,
    priority: "P1",
    description: "Triagem para problemas de visão e saúde ocular.",
    duration: "3-4 min",
    questions: 13
  },
  {
    slug: "auditiva",
    title: "Saúde Auditiva",
    subtitle: "Perda, zumbido, acufenos",
    emoji: "👂",
    category: "Otorrinolaringologia",
    persona: "adulto",
    motivator: "bem-estar",
    premium: true,
    priority: "P1",
    description: "Avaliação da audição e problemas auditivos.",
    duration: "3-4 min",
    questions: 12
  },
  {
    slug: "pele",
    title: "Saúde da Pele",
    subtitle: "Acne, eczema, psoríase",
    emoji: "🧴",
    category: "Dermatologia",
    persona: "adulto",
    motivator: "estetica",
    premium: true,
    priority: "P1",
    description: "Triagem para condições dermatológicas e cuidados da pele.",
    duration: "4-5 min",
    questions: 15
  },
  {
    slug: "alergias",
    title: "Alergias & Intolerâncias",
    subtitle: "Rinite, alimentos, medicamentos",
    emoji: "🤧",
    category: "Alergologia",
    persona: "adulto",
    motivator: "bem-estar",
    premium: true,
    priority: "P1",
    description: "Avaliação de alergias e intolerâncias alimentares.",
    duration: "4-5 min",
    questions: 16
  },
  {
    slug: "sexual",
    title: "Saúde Sexual",
    subtitle: "DE, libido, ISTs (educativo)",
    emoji: "💕",
    category: "Sexologia",
    persona: "adulto",
    motivator: "bem-estar",
    premium: true,
    priority: "P1",
    description: "Triagem educativa sobre saúde sexual e reprodutiva.",
    duration: "4-5 min",
    questions: 14
  },
  {
    slug: "idoso",
    title: "Saúde do Idoso",
    subtitle: "Quedas, fragilidade, memória",
    emoji: "👴",
    category: "Geriatria",
    persona: "idoso",
    motivator: "risco",
    premium: true,
    priority: "P1",
    description: "Avaliação especializada para pessoas acima de 60 anos.",
    duration: "5-6 min",
    questions: 18
  },
  {
    slug: "bucal",
    title: "Saúde Bucal",
    subtitle: "Gengiva, bruxismo, cáries",
    emoji: "🦷",
    category: "Odontologia",
    persona: "adulto",
    motivator: "bem-estar",
    premium: true,
    priority: "P1",
    description: "Triagem para saúde bucal e problemas dentários.",
    duration: "3-4 min",
    questions: 12
  },
  {
    slug: "crianca",
    title: "Saúde da Criança",
    subtitle: "Sono, alimentação, marcos",
    emoji: "👶",
    category: "Pediatria",
    persona: "crianca",
    motivator: "bem-estar",
    premium: true,
    priority: "P1",
    description: "Avaliação pediátrica para crianças de 0 a 18 anos.",
    duration: "5-6 min",
    questions: 19
  },
  {
    slug: "trabalhador",
    title: "Saúde do Trabalhador",
    subtitle: "LER, ergonomia, burnout",
    emoji: "💼",
    category: "Medicina do Trabalho",
    persona: "trabalhador",
    motivator: "dor",
    premium: true,
    priority: "P1",
    description: "Triagem para saúde ocupacional e prevenção de acidentes.",
    duration: "4-5 min",
    questions: 16
  },

  // P2 – Tendências (premium/educativo)
  {
    slug: "longevidade",
    title: "Longevidade & Anti-Aging",
    subtitle: "Hábitos que retardam o declínio",
    emoji: "⏰",
    category: "Medicina Preventiva",
    persona: "adulto",
    motivator: "performance",
    premium: true,
    priority: "P2",
    description: "Triagem para envelhecimento saudável e longevidade.",
    duration: "5-6 min",
    questions: 18
  },
  {
    slug: "vitalidade",
    title: "Vitalidade & Energia",
    subtitle: "Fadiga, mitocôndria, energia",
    emoji: "⚡",
    category: "Medicina Funcional",
    persona: "adulto",
    motivator: "performance",
    premium: true,
    priority: "P2",
    description: "Avaliação de energia, vitalidade e fadiga crônica.",
    duration: "4-5 min",
    questions: 16
  },
  {
    slug: "microbioma",
    title: "Intestinal & Microbioma",
    subtitle: "SIBO, permeabilidade, flora",
    emoji: "🦠",
    category: "Gastroenterologia",
    persona: "adulto",
    motivator: "bem-estar",
    premium: true,
    priority: "P2",
    description: "Triagem para saúde intestinal e microbioma.",
    duration: "4-5 min",
    questions: 15
  },
  {
    slug: "micronutrientes",
    title: "Deficiências de Micronutrientes",
    subtitle: "Vitamina D, B12, Ferro",
    emoji: "🧪",
    category: "Nutrição",
    persona: "adulto",
    motivator: "bem-estar",
    premium: true,
    priority: "P2",
    description: "Avaliação de deficiências nutricionais e micronutrientes.",
    duration: "4-5 min",
    questions: 14
  },
  {
    slug: "biohacking",
    title: "Biohacking & Performance",
    subtitle: "Rotinas de alta performance",
    emoji: "🧬",
    category: "Medicina Funcional",
    persona: "adulto",
    motivator: "performance",
    premium: true,
    priority: "P2",
    description: "Triagem para otimização de performance e biohacking.",
    duration: "5-6 min",
    questions: 17
  }
];

/**
 * Filtra triagens por prioridade
 */
export function getTriagesByPriority(priority: "P0"|"P1"|"P2"): TriageMeta[] {
  return TRIAGE_CATALOG.filter(t => t.priority === priority);
}

/**
 * Filtra triagens por persona
 */
export function getTriagesByPersona(persona: TriageMeta["persona"]): TriageMeta[] {
  return TRIAGE_CATALOG.filter(t => t.persona === persona);
}

/**
 * Filtra triagens por motivador
 */
export function getTriagesByMotivator(motivator: TriageMeta["motivator"]): TriageMeta[] {
  return TRIAGE_CATALOG.filter(t => t.motivator === motivator);
}

/**
 * Busca triagem por slug
 */
export function getTriageBySlug(slug: string): TriageMeta | undefined {
  return TRIAGE_CATALOG.find(t => t.slug === slug);
}

/**
 * Obtém triagens gratuitas
 */
export function getFreeTriages(): TriageMeta[] {
  return TRIAGE_CATALOG.filter(t => !t.premium);
}

/**
 * Obtém triagens premium
 */
export function getPremiumTriages(): TriageMeta[] {
  return TRIAGE_CATALOG.filter(t => t.premium);
}

/**
 * Estatísticas do catálogo
 */
export function getCatalogStats() {
  return {
    total: TRIAGE_CATALOG.length,
    free: getFreeTriages().length,
    premium: getPremiumTriages().length,
    byPriority: {
      P0: getTriagesByPriority("P0").length,
      P1: getTriagesByPriority("P1").length,
      P2: getTriagesByPriority("P2").length
    },
    byPersona: {
      adulto: getTriagesByPersona("adulto").length,
      mulher: getTriagesByPersona("mulher").length,
      homem: getTriagesByPersona("homem").length,
      idoso: getTriagesByPersona("idoso").length,
      crianca: getTriagesByPersona("crianca").length,
      trabalhador: getTriagesByPersona("trabalhador").length
    },
    byMotivator: {
      dor: getTriagesByMotivator("dor").length,
      risco: getTriagesByMotivator("risco").length,
      estetica: getTriagesByMotivator("estetica").length,
      "bem-estar": getTriagesByMotivator("bem-estar").length,
      performance: getTriagesByMotivator("performance").length
    }
  };
}