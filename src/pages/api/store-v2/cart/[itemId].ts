/**
 * PATCH: atualiza quantidade
 * DELETE: remove item
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getRuntimeErrorMessage, isDataStoreUnavailable } from '@/lib/prisma/runtime-errors';
import { removeFallbackCartItem, updateFallbackCartItem } from '@/lib/store-v2/cart-fallback';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const itemId = req.query.itemId as string;
  if (!itemId) return res.status(400).json({ error: 'itemId obrigatório' });

  const sessionId = (req.headers['x-session-id'] as string) || req.cookies?.['store_v2_session'] || null;
  const profileId = (req as NextApiRequest & { profileId?: string | null }).profileId ?? null;

  try {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });
    if (sessionId && item.cart.sessionId !== sessionId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (req.method === 'PATCH') {
      const { quantity } = req.body as { quantity?: number };
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ error: 'quantity deve ser >= 1' });
      }
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    if (isDataStoreUnavailable(err)) {
      if (req.method === 'PATCH') {
        const { quantity } = req.body as { quantity?: number };
        if (typeof quantity !== 'number' || quantity < 1) {
          return res.status(400).json({ error: 'quantity deve ser >= 1' });
        }
        const cart = updateFallbackCartItem(sessionId, profileId, itemId, quantity);
        if (!cart) return res.status(404).json({ error: 'Item não encontrado' });
        return res.status(200).json({ ok: true, degraded: true, code: 'DATASTORE_UNAVAILABLE' });
      }

      if (req.method === 'DELETE') {
        const cart = removeFallbackCartItem(sessionId, profileId, itemId);
        if (!cart) return res.status(404).json({ error: 'Item não encontrado' });
        return res.status(200).json({ ok: true, degraded: true, code: 'DATASTORE_UNAVAILABLE' });
      }
    }

    return res.status(500).json({ error: getRuntimeErrorMessage(err) || 'Cart item error' });
  }
}
