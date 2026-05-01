import { z } from "zod";

export type StepType =
  | "text"
  | "textarea"
  | "number"
  | "radio"
  | "select"
  | "multiselect"
  | "checkbox"
  | "phone"
  | "date"
  | "slider"
  | "scale"
  | "matrix" // TODO(backcompat-2025-10-23)
  | "info"
  | "select_cards";

export interface StepDef {
  key: string;
  type: StepType;
  label: string;
  group?: string;
  autoAdvance?: boolean;
  compact?: boolean;
  helper?: string;
  helperText?: string; // Texto curto abaixo do label (microcopy)
  evidenceNote?: string; // Micro-evidência científica em fonte menor
  why?: string;
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string; helper?: string }[];
  // Para select_cards
  cardOptions?: {
    value: string;
    title: string;
    subtitle?: string;
    priceHint?: string;
    badge?: string;
  }[];
  // Para info cards
  highlightTag?: string; // ex.: "Evidência científica"
  icon?: string; // ex.: "💡"
  bullets?: string[]; // Para info cards
   
  parse?: (_raw: unknown) => any;
   
  validate?: (_value: any) => string | null;
  defaultValue?: any;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  multi?: boolean;
  dependsOn?: { key: string; value: any; not?: boolean }[];
  legalLinks?: { label: string; href: string }[];
}

export interface TriageFlow {
  slug: string;
  title: string;
  intro?: string;
  flowVersion?: string;
  schemaVersion?: string;
  steps: StepDef[];
}

// Removido: coleta de dados pessoais agora é opcional e feita dentro das próprias triagens quando necessário
// Isso torna o fluxo mais rápido e simples, focando apenas nas perguntas essenciais
export const firstVisitSteps: StepDef[] = [];

// Schema atualizado: dados pessoais não são mais obrigatórios
export const firstVisitSchema = z.object({});

// Atualizado: não requer mais dados pessoais obrigatórios
// Cada triagem pode coletar apenas os dados que precisa
 
export const hasProfileData = (_answers: Record<string, any> | null | undefined) => {
  // Retorna false para sempre pular firstVisitSteps (que agora está vazio)
  // Mas permite que triagens individuais coletem dados quando necessário
  return false;
};
