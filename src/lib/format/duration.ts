export type DurationAnswer = { value: number; unit: "meses" | "anos" };

export const toMonths = (d?: DurationAnswer): number => {
  if (!d || !Number.isFinite(d.value)) return 0;
  const v = Math.max(0, Math.round(d.value));
  return d.unit === "meses" ? v : v * 12;
};

export const humanizeDuration = (months: number): string => {
  const m = Math.max(0, Math.round(months));
  if (m >= 12) {
    const y = Math.round(m / 12);
    return `${y} ${y === 1 ? "ano" : "anos"}`;
  }
  return `${m} ${m === 1 ? "mês" : "meses"}`;
};
