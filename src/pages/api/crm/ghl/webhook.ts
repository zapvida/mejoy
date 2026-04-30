import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // TODO: validar assinatura se configurada (X-Signature)
    const body = req.body;
    // Ex.: quando contato responder no WhatsApp, poderíamos anexar ao timeline do usuário
    console.log('[GHL webhook]', JSON.stringify(body));
    return res.status(200).json({ ok:true });
  } catch (e:any) {
    console.error('[GHL webhook] error', e?.message);
    return res.status(500).json({ ok:false, error: e?.message });
  }
}
