import crypto from 'crypto';

import type { NextApiRequest, NextApiResponse } from 'next';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN =
  process.env.META_CONVERSIONS_API_ACCESS_TOKEN || process.env.META_API_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes (name, email ou phone)' });
  }

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Meta CAPI não configurado no servidor' });
  }

  // Função de hash para dados sensíveis
  const hash = (value: string) =>
    crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');

  // Payload para o Meta
  const payload = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_id:
      typeof req.body?.eventId === 'string' && req.body.eventId.trim()
        ? req.body.eventId.trim()
        : crypto.randomUUID(),
    action_source: 'website',
    event_source_url: 'https://zapfarm.com.br/triagem', // opcionalmente pode vir dinâmico
    user_data: {
      em: [hash(email)],
      ph: [hash(phone)],
      fn: [hash(name.split(' ')[0])],
    },
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [payload] }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('[META_LEAD_CAPI_ERROR]', {
        status: response.status,
        errorType: result?.error?.type,
        errorCode: result?.error?.code,
      });
      return res.status(500).json({ error: 'Erro ao enviar evento para o Meta' });
    }

    return res.status(200).json({ success: true, eventId: payload.event_id });
  } catch (error: any) {
    console.error('[META_LEAD_UNEXPECTED_ERROR]', {
      message: error instanceof Error ? error.message : 'unknown_error',
    });
    return res.status(500).json({ error: 'Erro interno ao enviar evento para o Meta' });
  }
}
