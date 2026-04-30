export type Citation = { id: string; label: string; url?: string };

export type Pillar = {
  id: string;
  title: string;
  quickWins: string[];
  weeklyGoal?: string;
  citations?: Citation[];
};

export type PreventiveExam = {
  name: string;
  when: string;
  prep?: string;
  why?: string;
  code?: string;
  copyText?: string;
};

export type Grocery = { buy: string[]; avoid: string[]; notes?: string[] };

export type ReportData = {
  scoreNow: number;
  scorePotential: number;
  topActions?: string[]; // max 3
  alertSignals?: string[]; // 0-2
  readingTimeMin?: number; // minutes
  updatedAt?: string; // ISO
  version?: string;
  pillars: Pillar[];
  preventiveExams?: PreventiveExam[];
  grocery?: Grocery;
  citations?: Citation[];
};
