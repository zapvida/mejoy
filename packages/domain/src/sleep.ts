export function scoreSleepSnapshot(params: {
  durationHours: number | null | undefined;
  latencyMinutes?: number | null;
  awakenings?: number | null;
}): number | null {
  if (!params.durationHours || params.durationHours <= 0) return null;

  let score = 100;

  if (params.durationHours < 6) score -= 30;
  else if (params.durationHours < 7) score -= 15;
  else if (params.durationHours > 9.5) score -= 10;

  if (params.latencyMinutes && params.latencyMinutes > 30) score -= 12;
  if (params.awakenings && params.awakenings >= 3) score -= 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getSleepCoachingTip(durationHours: number | null | undefined): string {
  if (!durationHours) {
    return 'Sincronize o wearable ou registre seu sono manualmente para receber coaching contextual.';
  }

  if (durationHours < 6) {
    return 'Priorize uma janela de sono mais protegida hoje e evite cafeína no fim da tarde.';
  }

  if (durationHours < 7) {
    return 'Você está perto da meta. Tente manter horário fixo para dormir pelos próximos 3 dias.';
  }

  return 'Boa base de sono. Foque em consistência de horário para sustentar fome e energia mais estáveis.';
}
