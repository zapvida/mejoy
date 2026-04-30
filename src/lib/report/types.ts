export type TriagemKind =
  | "gastro"
  | "sono"
  | "metabolico"
  | "geralRapida"
  | "geral"
  | "cardio"
  | "mental"
  | "rapida";

export type PatientProfile = {
  id?: string;
  name: string;
  sex?: "male" | "female" | "undisclosed" | string;
  age?: number | null;
  birthDate?: string | null;
  bmi?: number | { bmi: number; classification: string } | null; // TODO(backcompat-2025-10-23)
  bmiCategory?: string | null;
  whatsapp?: string | null;
  weightKg?: number | null;
  heightCm?: number | null;
};

export type RiskLevel = "low" | "medium" | "high";

export type ReportScore = {
  current: number;
  potential?: number | null;
  level?: RiskLevel;
  summary?: string;
};

export type AlertAction = {
  label: string;
  href: string;
  type?: "primary" | "secondary";
};

export type Alert = {
  id: string;
  level: "info" | "warn" | "danger";
  title: string;
  why: string;
  action?: AlertAction;
};

export type QuickWin = {
  label: string;
  how: string;
  evidence?: string;
};

export type WeeklyGoal = {
  label: string;
  target: string;
  measure: string;
  reminder?: string;
};

export type RoadmapTabId = "sono" | "nutricao" | "movimento" | "estresse" | "testes" | "habitos";

export type TabRoadmap = {
  id: RoadmapTabId;
  title: string;
  icon: string;
  quickWins: QuickWin[];
  goal: WeeklyGoal;
  cta?: AlertAction;
};

export type ExamItem = {
  name: string;
  why: string;
  when: string;
  prep?: string;
  cta?: AlertAction;
};

export type Supplement = {
  name: string;
  dose: string;
  note?: string;
  evidence?: string;
};

export type EvidenceItem = {
  cite: string;
  url?: string;
};

export type TimelineStatus = "completed" | "scheduled" | "pending";

export type TimelineEvent = {
  date: string;
  label: string;
  status: TimelineStatus;
  details?: string;
  icon?: string;
};

export type ReportNarrative = {
  headline: string;
  heroSummary: string;
  healthStatement?: string;
  tone?: "reassuring" | "motivational" | "urgent";
};

export type ReportMedia = {
  audioUrl?: string;
  audioScript?: string;
};

export type ReportFeatureFlags = {
  enableAudio?: boolean;
  enableShare?: boolean;
  enablePremiumUpsell?: boolean;
  enableScientificFacts?: boolean;
  enableShoppingList?: boolean;
  enablePersonalizedExams?: boolean;
  enableCalculators?: boolean;
  enableMicroHabits?: boolean;
};

export type Report = {
  id: string;
  triage: TriagemKind;
  createdAt: string;
  narrative: ReportNarrative;
  scores: ReportScore;
  patient: PatientProfile;
  alerts: Alert[];
  roadmap: TabRoadmap[];
  exams: ExamItem[];
  supplements?: Supplement[];
  evidence?: EvidenceItem[];
  timeline: TimelineEvent[];
  summary?: string;
  media?: ReportMedia;
  features?: ReportFeatureFlags;
};

export type DerivationContext = {
  triage: TriagemKind;
  patient: PatientProfile;
  answers: Record<string, unknown>;
  sections?: Record<string, unknown>;
  summary?: string | null;
  persist?: boolean;
};

export interface TriageInput {
  triageId: string;
  sessionData: {
    answers: Record<string, any>;
    profile: PatientProfile;
    triageSlug: string;
  };
  options?: {
    forceRegenerate?: boolean;
    includeAudio?: boolean;
  };
}

export type BMIField = number | { bmi: number; classification?: string } | null;

export type RedFlag = { code: string; label: string };

export interface ReportDTO {
  id: string;
  triageId?: string;
  createdAt: string;
  triage: TriagemKind;
  patient: PatientProfile;
  currentScore?: number;
  potentialScore?: number;
  summary?: string;
  keyPoints?: string[];
  redFlags?: RedFlag[];
  findings?: any[];
  roadmap?: TabRoadmap[];
  nextSteps?: string[];
  narrative?: ReportNarrative;
  scores?: ReportScore;
  alerts?: Alert[];
  exams?: ExamItem[];
  supplements?: Supplement[];
  evidence?: EvidenceItem[];
  timeline?: TimelineEvent[];
  features?: ReportFeatureFlags;
  // TODO(backcompat-2025-10-23) - Campos de compatibilidade
  sections?: any;
  toneAdvice?: string;
  // AI-specific fields
  aiGenerated?: boolean;
  aiMarkdown?: string;
  aiAudioScript?: string;
  icd10Candidates?: string[];
  risks?: Alert[];
  recommendations?: {
    quickWins: QuickWin[];
    weeklyGoals: WeeklyGoal[];
  };
  // Campos de apresentação para PDF
  presentation?: {
    keypoints: Array<{ text: string; priority: 'high' | 'medium' | 'low' }>;
    roadmap: {
      immediate: Array<{ text: string; timeframe: string; priority: string; category: string }>;
      shortTerm: Array<{ text: string; timeframe: string; priority: string; category: string }>;
      mediumTerm: Array<{ text: string; timeframe: string; priority: string; category: string }>;
      longTerm: Array<{ text: string; timeframe: string; priority: string; category: string }>;
    };
    classification: {
      level: 'leve' | 'moderado' | 'grave';
      label: string;
      description: string;
    };
    redFlags: Array<{ text: string; severity: 'high' | 'medium' | 'low'; action?: string }>;
  };
  metadata?: {
    generatedAt: string;
    version: string;
    features: ReportFeatureFlags;
  };
}

// TODO(backcompat-2025-10-23) - Alias para compatibilidade
export type ReportData = ReportDTO;
