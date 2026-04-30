import clsx from "clsx";
import { useMemo, useState } from "react";

import type { AlertAction, TabRoadmap } from "@/lib/report/types";

type ActionRoadmapProps = {
  roadmap: TabRoadmap[];
};

export function ActionRoadmap({ roadmap }: ActionRoadmapProps) {
  const safeRoadmap = useMemo(() => roadmap.filter(Boolean), [roadmap]);
  const [active, setActive] = useState<TabRoadmap["id"]>(safeRoadmap[0]?.id ?? "nutricao");

  const activeTab = safeRoadmap.find(tab => tab.id === active) ?? safeRoadmap[0];

  if (!activeTab) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 print:border-slate-200 print:bg-white print:text-slate-600">
        Plano em construção. Assim que finalizar a triagem, você receberá passos personalizados.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {safeRoadmap.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={clsx(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 print:border-slate-300 print:text-slate-700",
              tab.id === active
                ? "border-white/60 bg-white/15 text-white shadow-[0_10px_30px_rgba(15,23,42,0.35)]"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white",
            )}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.title}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-[0_22px_55px_rgba(6,10,30,0.35)] print:border-slate-200 print:bg-white">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white print:text-slate-900">{activeTab.title}</h3>
            <p className="mt-1 text-sm text-white/70 print:text-slate-600">
              Conquiste microvitórias diariamente. Cada ação colabora para o resultado em 30 dias.
            </p>
          </div>
          {activeTab.cta && <RoadmapCTA action={activeTab.cta} />}
        </header>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {activeTab.quickWins.map((win, index) => (
              <div
                key={`${win.label}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/85 print:border-slate-200 print:bg-white print:text-slate-700"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/40 print:text-slate-500">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1} • Quick win
                </div>
                <h4 className="mt-2 text-base font-medium text-white print:text-slate-900">{win.label}</h4>
                <p className="mt-1 text-sm text-white/65 print:text-slate-600">{win.how}</p>
                {win.evidence && (
                  <p className="mt-2 text-xs text-white/50 print:text-slate-500">Evidência: {win.evidence}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 print:border-slate-200 print:bg-white print:text-slate-600">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/40 print:text-slate-500">Meta da semana</p>
              <p className="text-base font-semibold text-white print:text-slate-900">{activeTab.goal.label}</p>
            </div>
            <div className="text-sm text-white/70 print:text-slate-600">
              <p>Alvo: {activeTab.goal.target}</p>
              <p>Mensuração: {activeTab.goal.measure}</p>
              {activeTab.goal.reminder && <p className="text-xs text-white/40 print:text-slate-500">{activeTab.goal.reminder}</p>}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

type CTAProps = {
  action: AlertAction;
};

function RoadmapCTA({ action }: CTAProps) {
  return (
    <a
      href={action.href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 transition hover:border-white/50 hover:bg-white/20 print:border-slate-400 print:text-slate-700"
    >
      {action.label}
    </a>
  );
}
