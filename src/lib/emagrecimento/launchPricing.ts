/**
 * Camada de pricing do launch emagrecimento — valores finais vêm de decisão humana + operação.
 * Use envs para atualizar sem redeploy de copy hardcoded (quando configuradas).
 */

/** Texto seguro para LP: nunca promete medicamento nem preço fixo de tarja. */
export function getLpPriceHook(): string {
  const env = process.env.NEXT_PUBLIC_EMAGRECIMENTO_LP_FROM_PRICE?.trim();
  if (env) return env;
  return 'Programas com avaliação médica e acompanhamento: consulte faixas após a triagem — o investimento varia conforme prescrição, dose e disponibilidade.';
}

/** Faixa / estimativa exibida na results (placeholder até financeiro fechar). */
export function getResultsInvestmentBand(): string {
  const env = process.env.NEXT_PUBLIC_EMAGRECIMENTO_RESULTS_BAND?.trim();
  if (env) return env;
  return 'Estimativa do investimento no programa (ex.: 3 meses): definida após a consulta, conforme conduta médica e disponibilidade — não constitui orçamento fechado nesta etapa.';
}
