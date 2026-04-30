'use client';

import { motion } from "framer-motion";

type ReportKPIBarProps = {
  scoreNow: number;
  scorePotential: number;
};

function formatScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function ReportKPIBar({ scoreNow, scorePotential }: ReportKPIBarProps) {
  const current = formatScore(scoreNow);
  const potential = formatScore(scorePotential);
  const delta = Math.max(0, potential - current);

  return (
    <div
      aria-label="Indicadores principais"
      className="grid grid-cols-2 gap-3 rounded-2xl bg-white/8 p-3 text-white shadow-sm ring-1 ring-white/10 backdrop-blur-lg sm:grid-cols-3"
    >
      <KpiCard label="Score atual" value={current} badge="de 100" />
      <KpiCard label="Score potencial" value={potential} badge="em 3 meses" />
      <div className="col-span-2 flex items-center justify-between rounded-xl bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-100 ring-1 ring-emerald-400/30 sm:col-span-1">
        <span>Ganho se aplicar evidências em Saúde</span>
        <span className="text-lg font-semibold text-emerald-200">+{delta}</span>
      </div>
    </div>
  );
}

type KpiCardProps = {
  label: string;
  value: number;
  badge: string;
};

function KpiCard({ label, value, badge }: KpiCardProps) {
  return (
    <div className="flex h-20 flex-col justify-between rounded-xl bg-white/10 px-3 py-2 text-white ring-1 ring-white/15">
      <span className="text-xs uppercase tracking-wide text-white/60">{label}</span>
      <div className="flex items-baseline gap-1">
        <motion.span
          layout
          className="text-2xl font-semibold"
          aria-live="polite"
        >
          {value}
        </motion.span>
        <span className="text-xs text-white/50">{badge}</span>
      </div>
    </div>
  );
}
