'use client';

import { trackFunnelEvent } from '@/lib/funnel/events-client';
import { buildEmagrecimentoReportWhatsappUrl } from '@/lib/emagrecimento/whatsappCta';

interface Props {
  reportId: string;
  firstName?: string;
  triageSlug?: string;
}

/**
 * CTA principal pós-triagem: WhatsApp com link do relatório (conversão + automação Evolution/Meta).
 */
export function ReportWhatsappBanner({ reportId, firstName, triageSlug = 'emagrecimento' }: Props) {
  const href = buildEmagrecimentoReportWhatsappUrl({
    reportId,
    firstName,
    triageSlug,
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
      <div className="max-w-4xl mx-auto rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Próximo passo</p>
            <p className="mt-1 text-base sm:text-lg font-bold text-gray-900">
              Receba seu relatório e orientação no WhatsApp
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Canal oficial: enviamos seu resumo e conectamos você ao time médico. Dados tratados conforme a LGPD.
            </p>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackFunnelEvent('whatsapp_report_cta', {
                report_id: reportId,
                surface: 'report_banner',
              })
            }
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#25D366] px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg transition hover:brightness-95"
          >
            Abrir WhatsApp →
          </a>
        </div>
      </div>
    </div>
  );
}
