import type { NextApiRequest, NextApiResponse } from 'next';

import { readUtmFromReq } from '@/lib/analytics/utm';
import { upsertContact } from '@/lib/crm/ghl';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { name, email, phone } = req.body || {};
    const utm = readUtmFromReq(req);
    const contactId = await upsertContact({ name, email, phone, utm });
    return res.status(200).json({ ok: true, contactId });
  } catch (e:any) {
    console.error('[GHL upsert] error', e?.message);
    return res.status(500).json({ ok:false, error: e?.message });
  }
}
