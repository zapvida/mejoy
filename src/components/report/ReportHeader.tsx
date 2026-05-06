import clsx from "clsx";

import LogoWithName from "@/components/ui/LogoWithName";
import type { Report } from "@/lib/report/types";

const riskTone: Record<NonNullable<Report["scores"]["level"]>, { label: string; className: string }> = {
  low: { label: "Saúde sob controle", className: "bg-emerald-500/10 text-emerald-200" },
  medium: { label: "Atenção moderada", className: "bg-amber-500/10 text-amber-200" },
  high: { label: "Prioridade máxima", className: "bg-red-500/10 text-red-200" },
};

type ReportHeaderProps = {
  report: Report;
  onPrint?: () => void;
};

export function ReportHeader({ report, onPrint }: ReportHeaderProps) {
  const createdAt = new Date(report.createdAt ?? Date.now());
  const risk = report.scores.level ? riskTone[report.scores.level] : null;

  return (
    <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#05070f] via-[#0f1835] to-[#05070f] text-white print:bg-white print:text-slate-900">
      <div className="absolute inset-0 opacity-40 mix-blend-screen md:opacity-30">
        <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-[#2563eb]/30 blur-[180px]" />
        <div className="absolute bottom-0 left-10 h-[380px] w-[380px] rounded-full bg-[#8b5cf6]/20 blur-[160px]" />
        <div className="absolute right-0 top-10 h-[280px] w-[280px] rounded-full bg-[#10b981]/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 sm:pt-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-white/60 print:text-slate-500">
            <div className="rounded-full bg-white/95 px-3 py-2 shadow-sm ring-1 ring-black/5 print:bg-transparent print:px-0 print:py-0 print:shadow-none print:ring-0">
              <LogoWithName size="small" />
            </div>
            <div className="h-5 w-px bg-white/20" />
            <div>
              <p className="uppercase tracking-[0.35em] text-xs text-white/40 print:text-slate-500">
                {report.triage.toUpperCase()}
              </p>
              <p>{createdAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            {risk && (
              <span
                className={clsx(
                  "inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-medium uppercase tracking-[0.2em]",
                  risk.className,
                )}
              >
                <span className="text-base leading-none">●</span>
                {risk.label}
              </span>
            )}
            {onPrint && (
              <button
                type="button"
                onClick={onPrint}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 print:hidden"
              >
                <span>Imprimir / Salvar em PDF</span>
              </button>
            )}
          </div>
        </div>

        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-white/40 print:text-slate-500">
            Seu retrato de saúde agora
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white print:text-slate-900 sm:text-5xl">
            {report.narrative.headline}
          </h1>
          <p className="text-lg text-white/70 print:text-slate-600">{report.narrative.heroSummary}</p>
        </div>
      </div>
    </header>
  );
}
