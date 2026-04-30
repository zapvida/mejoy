'use client';

type ReportSummaryProps = {
  topActions: string[];
  alert?: string;
  readingTimeMin?: number;
  updatedAt?: string;
  version?: string;
};

export function ReportSummary({
  topActions,
  alert,
  readingTimeMin,
  updatedAt,
  version,
}: ReportSummaryProps) {
  const safeActions = topActions.length ? topActions : ["Dormir 7–8h", "+2 porções de vegetais", "Caminhar 30 min"];
  const summaryText = `Hoje, foque em: ${safeActions
    .map((action, index) => `${index + 1}) ${action}`)
    .join("; ")}.`;
  const alertText = alert || "Alerta: reduzir ultraprocessados nesta semana.";
  const reading = typeof readingTimeMin === "number" ? `${readingTimeMin} min` : "~3 min";
  const formattedDate = formatRelativeDate(updatedAt);
  const versionText = version ? `v${version}` : "v2.0";

  return (
    <section
      aria-label="Sumário executivo"
      className="space-y-3 rounded-2xl bg-black/30 p-4 text-sm text-white ring-1 ring-white/10 backdrop-blur-lg"
    >
      <p className="text-base font-medium leading-relaxed">{summaryText}</p>

      <div className="rounded-xl border border-amber-300/40 bg-amber-500/10 px-3 py-2 text-amber-200">
        {alertText}
      </div>

      <footer className="flex flex-wrap items-center gap-2 text-xs text-white/70">
        <span>~{reading}</span>
        <span aria-hidden="true">•</span>
        <span>{formattedDate}</span>
        <span aria-hidden="true">•</span>
        <span>{versionText}</span>
      </footer>
    </section>
  );
}

function formatRelativeDate(date?: string): string {
  if (!date) return "Atualizado hoje";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Atualizado hoje";

  const formatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  const now = new Date();
  const diffTime = parsed.getTime() - now.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Atualizado hoje";
  if (Math.abs(diffDays) < 7) return `Atualizado ${formatter.format(diffDays, "day")}`;

  return `Atualizado em ${parsed.toLocaleDateString("pt-BR")}`;
}
