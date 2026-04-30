import clsx from "clsx";

import type { Alert } from "@/lib/report/types";

type AlertStackProps = {
  alerts: Alert[];
};

const toneStyles: Record<Alert["level"], string> = {
  info: "border-sky-500/30 bg-sky-500/10 text-sky-100",
  warn: "border-amber-500/40 bg-amber-500/15 text-amber-100",
  danger: "border-red-500/40 bg-red-500/15 text-red-100",
};

const emoji: Record<Alert["level"], string> = {
  info: "ℹ️",
  warn: "⚠️",
  danger: "🚨",
};

export function AlertStack({ alerts }: AlertStackProps) {
  if (!alerts.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 print:border-slate-200 print:bg-white print:text-slate-600">
        Nenhum sinal crítico identificado. Continue monitorando seus sintomas e siga o plano de ação.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map(alert => (
        <article
          key={alert.id}
          className={clsx(
            "rounded-2xl border p-6 shadow-[0_18px_45px_rgba(12,18,36,0.35)] backdrop-blur-xl transition hover:translate-y-[-2px]",
            toneStyles[alert.level],
            "print:border-slate-300 print:bg-white print:text-slate-800",
          )}
        >
          <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{emoji[alert.level]}</span>
              <h3 className="text-lg font-semibold">{alert.title}</h3>
            </div>
            {alert.action && (
              <a
                href={alert.action.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/80 hover:text-white print:border-slate-400 print:text-slate-700"
              >
                {alert.action.label}
              </a>
            )}
          </header>
          <p className="mt-3 text-sm leading-relaxed text-white/85 print:text-slate-700">{alert.why}</p>
        </article>
      ))}
    </div>
  );
}
