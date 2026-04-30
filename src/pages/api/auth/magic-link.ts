/**
 * API para geração de Magic Link (uso interno/server-side)
 * POST { profileId, redirectPath? } -> { magicUrl, expiresAt }
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createMagicLink } from '@/lib/auth/magic-link';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { profileId, redirectPath } = req.body as { profileId?: string; redirectPath?: string };
    if (!profileId) {
      return res.status(400).json({ error: 'profileId obrigatório' });
    }

    const result = await createMagicLink({
      profileId,
      redirectPath: redirectPath || '/dashboard',
    });

    if (!result) {
      return res.status(404).json({ error: 'Profile não encontrado ou sem email' });
    }

    return res.status(200).json({
      magicUrl: result.magicUrl,
      expiresAt: result.expiresAt.toISOString(),
    });
  } catch (e) {
    console.error('[api/magic-link] Erro:', e);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
