// src/lib/pdf/lab/types.ts
export type RefRange = { low?: number; high?: number; unit?: string; note?: string };
export type Flag = "L" | "N" | "H";

export type Analyte = {
  code: string;
  name: string;
  value: string;
  numeric?: number;
  unit?: string;
  ref: RefRange;
  flag: Flag;
  method?: string;
  comment?: string;
};

export type LabPanel = {
  panel: string;
  items: Analyte[];
};

export type LabReportData = {
  patient: { firstName: string; sex: "M" | "F" | "O"; age: number; bmi?: number };
  meta: { createdAtISO: string; triageSlug: string; hasRedFlags: boolean; score: number; qrUrl: string };
  panels: LabPanel[];
  interpretations: string[];
  patientNote: string;
  instructions: { title: string; items: string[] };
  suggestedExams: { name: string; when: string; prep?: string }[];
  disclaimers: string[];
};
