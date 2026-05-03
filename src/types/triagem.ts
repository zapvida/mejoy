export type Conditional = {
  field: string;
  value: string | string[];
};

export type Option = {
  value: string;
  label: string;
  image?: string;
};

export type Step = {
  name: string;
  label?: string;
  type:
    | 'text'
    | 'select'
    | 'date'
    | 'intro'
    | 'setor'
    | 'multiselect'
    | 'input'
    | 'textarea'
    | 'geral'
    | 'geralRapida'
    | 'mental'
    | 'cancer'
    | 'sono'
    | 'enxaqueca'
    | 'obesidade'
    | 'gestante'
    | 'tabagismo'
    | 'quimica'
    | 'saudeMasculina'
    | 'estiloVida'
  | 'estresseBurnout'
  | 'depressao'
  | 'tdah'
  | 'teste'
  | 'info'
  | 'select_cards';
  placeholder?: string;
  required?: boolean;
  options?: (string | Option)[];
  justification?: string;
  example?: string;
  description?: string;
  conditional?: Conditional;
  setor?: string;
  prioridade?: 'alta' | 'media' | 'baixa';
  categoriaIA?: string;
  isMulti?: boolean;
  image?: string;
  // Novos campos para microcopy e evidência
  helperText?: string; // Texto curto abaixo do label
  evidenceNote?: string; // Micro-evidência científica
  // Para info cards
  highlightTag?: string; // ex.: "Evidência científica"
  icon?: string; // ex.: "💡"
  bullets?: string[]; // Para info cards
  // Para select_cards
  cardOptions?: {
    value: string;
    title: string;
    subtitle?: string;
    priceHint?: string;
    badge?: string;
  }[];
  // Links legais para steps de consentimento
  legalLinks?: {
    label: string;
    href: string;
  }[];
  group?: string;
  autoAdvance?: boolean;
  compact?: boolean;
};

export type FormData = {
  [key: string]: string;
};

export type TriagemKey =
  | 'gastro'
  | 'testeSaude'
  | 'geral'
  | 'geralRapida'
  | 'mental'
  | 'cancer'
  | 'sono'
  | 'enxaqueca'
  | 'obesidade'
  | 'gestante'
  | 'tabagismo'
  | 'quimica'
  | 'saudeMasculina'
  | 'estiloVida'
  | 'estresseBurnout'
  | 'depressao'
  | 'tdah'
  | 'teste'
  // Novas triagens
  | 'cardiovascular'
  | 'diabetes-metabolismo'
  | 'dor-cronica'
  | 'coluna'
  | 'respiratoria'
  | 'renal'
  | 'hepatica'
  | 'mulher'
  | 'prostata'
  | 'tireoide'
  | 'mama'
  | 'ocular'
  | 'auditiva'
  | 'pele'
  | 'alergias'
  | 'sexual'
  | 'idoso'
  | 'bucal'
  | 'crianca'
  | 'trabalhador'
  | 'longevidade'
  | 'vitalidade'
  | 'microbioma'
  | 'micronutrientes'
  | 'biohacking';
