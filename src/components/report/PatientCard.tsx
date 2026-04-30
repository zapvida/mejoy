import clsx from "clsx";

import type { PatientProfile, ReportScore } from "@/lib/report/types";

type PatientCardProps = {
  patient: PatientProfile;
  scores: ReportScore;
  headline: string;
  heroSummary?: string;
  healthStatement?: string;
};

const formatSex = (sex?: string) => {
  if (!sex) return "Sexo não informado";
  const normalized = sex.toLowerCase();
  if (["male", "masculino", "m"].includes(normalized)) return "Masculino";
  if (["female", "feminino", "f"].includes(normalized)) return "Feminino";
  return sex;
};

const levelCopy: Record<NonNullable<ReportScore["level"]>, { label: string; color: string }> = {
  low: { label: "Risco baixo", color: "bg-emerald-500/15 text-emerald-200" },
  medium: { label: "Atenção moderada", color: "bg-amber-500/15 text-amber-200" },
  high: { label: "Atenção imediata", color: "bg-red-500/15 text-red-200" },
};

export function PatientCard({ patient, scores, headline, heroSummary, healthStatement }: PatientCardProps) {
  const level = scores.level ? levelCopy[scores.level] : null;
  // TODO(backcompat-2025-10-23) - Guard para BMI flexível
  const bmiValue = typeof patient.bmi === 'object' ? patient.bmi?.bmi : patient.bmi;
  const bmiClassification = typeof patient.bmi === 'object' ? patient.bmi?.classification : '';
  
  const chips = [
    patient.age != null ? `${patient.age} anos` : null,
    formatSex(patient.sex),
    patient.bmi ? `IMC ${bmiValue} — ${bmiClassification}` : null,
  ].filter(Boolean);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-[0_25px_60px_rgba(10,14,27,0.35)] backdrop-blur-2xl print:bg-white print:border-slate-200 print:shadow-none">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-semibold text-white print:text-slate-900">{headline}</h2>
            {level && (
              <span className={clsx("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]", level.color)}>
                ● {level.label}
              </span>
            )}
          </div>
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-white/70 print:text-slate-600">
              {chips.map(chip => (
                <span
                  key={chip as string}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 print:border-slate-200 print:bg-white"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
          {heroSummary && (
            <p className="text-base text-white/75 print:text-slate-700">{heroSummary}</p>
          )}
          {healthStatement && (
            <p className="text-sm text-white/60 print:text-slate-600">{healthStatement}</p>
          )}
          {scores.summary && <p className="text-sm text-white/60 print:text-slate-600">{scores.summary}</p>}
        </div>

        <div className="grid w-full max-w-xs gap-3 sm:grid-cols-2 lg:max-w-none lg:grid-cols-2">
          <ScoreCard label="Saúde agora" value={scores.current} tone={scores.level ?? "medium"} />
          {typeof scores.potential === "number" && (
            <ScoreCard label="Potencial com plano" value={scores.potential} tone="low" />
          )}
        </div>
      </div>
    </section>
  );
}

type ScoreCardProps = {
  label: string;
  value: number;
  tone: NonNullable<ReportScore["level"]>;
};

const gaugeTone: Record<ScoreCardProps["tone"], { ring: string; label: string }> = {
  low: { ring: "stroke-emerald-400", label: "text-emerald-200" },
  medium: { ring: "stroke-amber-400", label: "text-amber-200" },
  high: { ring: "stroke-red-400", label: "text-red-200" },
};

function ScoreCard({ label, value, tone }: ScoreCardProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  const offset = circumference - (clamped / 100) * circumference;
  const toneClasses = gaugeTone[tone];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 text-white print:border-slate-200 print:bg-white print:text-slate-900">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50 print:text-slate-500">{label}</p>
      <div className="relative mx-auto mt-3 flex h-32 w-32 items-center justify-center">
        <svg viewBox="0 0 140 140" className="h-32 w-32">
          <circle cx="70" cy="70" r={radius} className="stroke-white/10" strokeWidth="10" fill="none" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            className={clsx("origin-center -rotate-90 transform transition-all duration-700 ease-out", toneClasses.ring)}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            fill="none"
          />
        </svg>
        <div className="absolute text-3xl font-semibold">{clamped}%</div>
      </div>
      <p className={clsx("mt-2 text-sm font-medium", toneClasses.label)}>{tone === "high" ? "Prioridade" : "Meta"}</p>
    </div>
  );
}
