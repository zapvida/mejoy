import type { NextApiRequest, NextApiResponse } from 'next';

import { methodNotAllowed } from '@/lib/mobile/http';
import { getStoredShareBundle } from '@/lib/mobile/service';
import { verifyShareBundleToken } from '@/lib/mobile/share-bundles';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET']);
  }

  try {
    const bundleId = typeof req.query.bundleId === 'string' ? req.query.bundleId : null;
    const token = typeof req.query.token === 'string' ? req.query.token : null;

    if (!bundleId || !token) {
      return res.status(400).json({ error: 'bundleId e token são obrigatórios' });
    }

    const verification = verifyShareBundleToken(token, bundleId);
    if (!verification.valid) {
      return res.status(401).json({ error: verification.reason });
    }

    const bundle = await getStoredShareBundle(bundleId);
    if (!bundle) {
      return res.status(404).json({ error: 'Pacote clínico não encontrado' });
    }

    return res.status(200).json(bundle);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro ao abrir pacote clínico',
    });
  }
}
