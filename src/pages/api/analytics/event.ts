import type { NextApiRequest, NextApiResponse } from 'next';

import { readUtmFromReq } from '@/lib/analytics/utm';
import { upsertContact, upsertOpportunity, sendMessage, buildCheckoutContextNotes } from '@/lib/crm/ghl';
import { sendTriageCompletedEmail, sendReportReadyEmail } from '@/lib/email';
import { logger } from '@/lib/log';
import type { CheckoutVariant } from '@/lib/stripe/metadata';
import { withRateLimit } from '@/pages/api/_utils/withRateLimit';

const PIPELINE = process.env.GHL_PIPELINE_ID!;
const STAGE_VISIT = process.env.GHL_STAGE_VISIT!;
const STAGE_TRIAGE = process.env.GHL_STAGE_TRIAGE!;
const STAGE_CHECKOUT = process.env.GHL_STAGE_CHECKOUT!;
// const STAGE_WON = process.env.GHL_STAGE_WON!; // usado na E7 com webhook Stripe

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  monetary?: number;
  variant?: CheckoutVariant;
  extraSeats?: number;
  beneficiaryEmail?: string;
  reportId?: string;
  triageType?: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { event, payload } = req.body as { event: string; payload?: Payload };
  const utm = readUtmFromReq(req);

  try {
    // 1) Garante contato no GHL
    const contactId = await upsertContact({
      name: payload?.name, email: payload?.email, phone: payload?.phone, utm
    });

    // 2) Roteia por evento
    if (event === 'LP_VISITED') {
      await upsertOpportunity({
        contactId, pipelineId: PIPELINE, stageId: STAGE_VISIT, title: 'Visitou LP'
      });
    }

    if (event === 'TRIAGE_COMPLETED') {
      await upsertOpportunity({
        contactId, pipelineId: PIPELINE, stageId: STAGE_TRIAGE, title: 'Triagem concluída'
      });
      // Mensagem automática no WhatsApp
      await sendMessage({
        contactId, message: 'Recebemos sua triagem! Em breve enviamos seu relatório e próximos passos.', channel:'whatsapp'
      });
      // Email de confirmação
      if (payload?.email) {
        try {
          await sendTriageCompletedEmail(payload.email, {
            name: payload?.name,
            firstName: payload?.name?.split(' ')[0],
            reportUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zapfarm.com.br'}/dashboard`,
          });
        } catch (emailError) {
          logger.error({ error: emailError }, 'failed_to_send_triage_email');
        }
      }
    }

    if (event === 'PDF_GENERATED') {
      await sendMessage({
        contactId, message: 'Seu relatório foi gerado. Acesse seu painel para visualizar o PDF e recomendações.', channel:'whatsapp'
      });
      // Email de relatório pronto
      if (payload?.email) {
        try {
          const reportUrl = payload.reportId 
            ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zapfarm.com.br'}/report/${payload.reportId}`
            : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zapfarm.com.br'}/dashboard`;
          await sendReportReadyEmail(payload.email, {
            name: payload?.name,
            firstName: payload?.name?.split(' ')[0],
            reportUrl,
            triageType: payload.triageType as string | undefined,
          });
        } catch (emailError) {
          logger.error({ error: emailError }, 'failed_to_send_report_email');
        }
      }
    }

    if (event === 'CHECKOUT_STARTED') {
      const contextNotes = buildCheckoutContextNotes({
        variant: payload?.variant,
        extraSeats: typeof payload?.extraSeats === 'number' ? payload.extraSeats : undefined,
        beneficiaryEmail: payload?.beneficiaryEmail
      });
      const checkoutTitle = contextNotes
        ? `Checkout iniciado - ${contextNotes}`
        : 'Checkout iniciado';

      await upsertOpportunity({
        contactId,
        pipelineId: PIPELINE,
        stageId: STAGE_CHECKOUT,
        title: checkoutTitle,
        monetary: payload?.monetary,
        notes: contextNotes || undefined
      });
      await sendMessage({
        contactId, message: 'Estamos quase lá! Se precisar, posso ajudar a finalizar seu pagamento.', channel:'whatsapp'
      });
    }

    // 'CHECKOUT_SUCCESS' será finalizado na ETAPA 7 via webhook Stripe => STAGE_WON + mensagens pós-venda

    return res.status(200).json({ ok:true, contactId });
  } catch (e:any) {
    logger.error(
      {
        event,
        hasPayload: Boolean(payload),
        payloadFieldCount: payload ? Object.keys(payload).length : 0,
        error: e?.message,
      },
      'analytics_event_error'
    );
    return res.status(200).json({
      ok: true,
      degraded: true,
      error: 'analytics_event_degraded',
    });
  }
}

export default withRateLimit(handler, { limit: 120, windowSec: 60 });
