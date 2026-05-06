import { SITE } from '@/lib/seo';

/** Slugs que usam /{slug}/relatorio?id= (alinhado a triagem/[slug].tsx) */
export const ZAPFARM_TRIAGE_SLUGS_WITH_PRODUCT_RELATORIO = [
  'emagrecimento',
  'calvicie',
  'sono',
  'ansiedade',
  'intestino',
  'figado',
  'libido-masculina',
  'menopausa',
  'articulacoes',
  'imunidade',
] as const;

export function relatorioPathForTriageSlug(slug: string, reportId: string): string {
  if (ZAPFARM_TRIAGE_SLUGS_WITH_PRODUCT_RELATORIO.includes(slug as (typeof ZAPFARM_TRIAGE_SLUGS_WITH_PRODUCT_RELATORIO)[number])) {
    return `/${slug}/relatorio?id=${encodeURIComponent(reportId)}`;
  }
  return `/relatorio/${encodeURIComponent(reportId)}`;
}

function digitsOnlyPhone(): string {
  const raw =
    process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ||
    process.env.NEXT_PUBLIC_WHATSAPP_CTA ||
    '5511999999999';
  if (raw.includes('wa.me')) {
    try {
      const url = raw.startsWith('http') ? raw : `https://${raw}`;
      const u = new URL(url);
      const fromPath = u.pathname.replace(/\D/g, '');
      if (fromPath.length >= 10) return fromPath;
    } catch {
      /* fallthrough */
    }
  }
  const d = raw.replace(/\D/g, '');
  return d.length >= 10 ? d : '5511999999999';
}

/**
 * Link wa.me para o paciente enviar o relatório ao canal oficial (handoff humano + automações).
 */
export function buildEmagrecimentoReportWhatsappUrl(params: {
  reportId: string;
  firstName?: string;
  triageSlug?: string;
}): string {
  const phone = digitsOnlyPhone();
  const base = SITE.baseUrl.replace(/\/$/, '');
  const path = relatorioPathForTriageSlug(params.triageSlug || 'emagrecimento', params.reportId);
  const reportUrl = `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const name = params.firstName?.trim();
  const greeting = name ? `Oi, sou ${name}.` : 'Oi!';
  const text = `${greeting} Concluí a triagem na MeJoy e quero receber meu relatório e próximos passos por aqui: ${reportUrl}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
