// src/lib/pdf/lab/referenceRanges.ts
export const GI_REF = {
  bristolIdeal: 4,
  bowelPerDay: { low: 1, high: 2, unit: "vezes/dia", note: "Variabilidade individual." },
  waterIntake: { low: 2, unit: "L/dia", note: "Ajustar por clima e atividade." },
  fiberIntake: { low: 25, unit: "g/dia", note: "Mulheres ≥25g, homens ≥38g (individualizar)." },
  bmi: { low: 18.5, high: 24.9, unit: "kg/m²", note: "Adultos; faixas diferentes para idosos." },
  sleepHours: { low: 7, high: 9, unit: "h/noite" },
} as const;
