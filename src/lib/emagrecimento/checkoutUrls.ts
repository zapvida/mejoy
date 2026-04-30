export type EmagrecimentoTrilha =
  | 'tirzepatida'
  | 'semaglutida'
  | 'contrave'
  | 'alternativas_clinicas';

export function buildEmagrecimentoCheckoutUrl(params: {
  reportId: string;
  triageId?: string;
  /** Plano checkout: programa-1m | programa-3m | programa-6m */
  plano?: string;
  trilha: EmagrecimentoTrilha;
  principio?: string;
}): string {
  const q = new URLSearchParams();
  q.set('reportId', params.reportId);
  if (params.triageId) q.set('triageId', params.triageId);
  q.set('trilha', params.trilha);
  if (params.plano) q.set('plano', params.plano);
  if (params.principio) q.set('principio', params.principio);
  return `/emagrecimento/checkout?${q.toString()}`;
}

/** Deriva trilha a partir da preferência declarada na triagem. */
export function trilhaFromPreferencia(
  preferencia: string | undefined | null
): EmagrecimentoTrilha {
  if (preferencia === 'tirzepatida') return 'tirzepatida';
  if (preferencia === 'semaglutida') return 'semaglutida';
  if (preferencia === 'contrave') return 'contrave';
  return 'alternativas_clinicas';
}

/** Normaliza query string do checkout para trilha segura. */
export function normalizeCheckoutTrilhaParam(
  raw: string | string[] | undefined
): EmagrecimentoTrilha {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (
    v === 'tirzepatida' ||
    v === 'semaglutida' ||
    v === 'contrave' ||
    v === 'alternativas_clinicas'
  ) {
    return v;
  }
  return 'alternativas_clinicas';
}
