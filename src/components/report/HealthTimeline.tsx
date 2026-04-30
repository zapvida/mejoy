import clsx from "clsx";

import type { TimelineEvent } from "@/lib/report/types";

type HealthTimelineProps = {
  events: TimelineEvent[];
};

const statusStyles: Record<TimelineEvent["status"], { dot: string; bg: string; label: string }> = {
  completed: { dot: "bg-emerald-400", bg: "bg-emerald-500/10 border-emerald-400/20", label: "Concluído" },
  scheduled: { dot: "bg-sky-400", bg: "bg-sky-500/10 border-sky-400/20", label: "Agendado" },
  pending: { dot: "bg-amber-400", bg: "bg-amber-500/10 border-amber-400/20", label: "Próximo passo" },
};

export function HealthTimeline({ events }: HealthTimelineProps) {
  if (!events.length) {
    return (
      <p className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 print:border-slate-200 print:bg-white print:text-slate-600">
        Assim que definirmos acompanhamentos adicionais, eles aparecerão aqui.
      </p>
    );
  }

  return (
    <ol className="relative space-y-4 border-l border-white/10 pl-6 print:border-slate-200">
      {events.map((event, index) => {
        const styles = statusStyles[event.status] ?? statusStyles.pending;
        return (
          <li key={`${event.date}-${index}`} className="relative">
            <span
              className={clsx(
                "absolute -left-3 top-2 h-6 w-6 rounded-full border-4 border-[#05070f] print:border-white",
                styles.dot,
              )}
            />
            <div
              className={clsx(
                "rounded-2xl border px-5 py-4 shadow-[0_18px_45px_rgba(10,18,45,0.35)] backdrop-blur-xl text-white print:border-slate-200 print:bg-white print:text-slate-800",
                styles.bg,
              )}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/40 print:text-slate-500">
                  {event.icon ?? "🗓️"}
                  {event.date}
                </div>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 print:border-slate-400 print:text-slate-700">
                  {styles.label}
                </span>
              </div>
              <h4 className="mt-2 text-base font-semibold text-white print:text-slate-900">{event.label}</h4>
              {event.details && (
                <p className="mt-1 text-sm text-white/70 print:text-slate-600">{event.details}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
