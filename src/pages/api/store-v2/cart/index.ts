/**
 * GET: retorna carrinho (por sessionId ou profileId)
 * POST: adiciona item ou atualiza carrinho
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getProductBySlug } from '@/lib/store-v2/catalog';
import { storeLogger } from '@/lib/store-v2/logger';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

function isDataStoreUnavailable(err: unknown): boolean {
  const msg = getErrorMessage(err).toLowerCase();
  return (
    msg.includes('denied access') ||
    msg.includes("can't reach database") ||
    msg.includes('prismaclientinitializationerror') ||
    msg.includes('p1000') ||
    msg.includes('p1001') ||
    msg.includes('p1010')
  );
}

async function getOrCreateCart(sessionId: string | null, profileId: string | null) {
  if (profileId) {
    const existing = await prisma.cart.findUnique({
      where: { profileId },
      include: { items: true },
    });
    if (existing) return existing;
  }
  if (sessionId) {
    const existing = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });
    if (existing) return existing;
  }

  const cart = await prisma.cart.create({
    data: {
      sessionId: sessionId || undefined,
      profileId: profileId || undefined,
    },
    include: { items: true },
  });
  return cart;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
  const sessionId = (req.headers['x-session-id'] as string) || req.cookies?.['store_v2_session'] || null;
  const profileId = (req as any).profileId ?? null;

  if (req.method === 'GET') {
    const cart = await getOrCreateCart(sessionId, profileId);
    if (cart.items.length === 0) {
      return res.status(200).json({
        cartId: cart.id,
        items: [],
        itemCount: 0,
      });
    }
    const productIds = [...new Set(cart.items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'active' },
      include: {
        variants: true,
        priceVersions: { where: { validTo: null }, take: 1 },
      },
    });
    type ProductWithPricing = (typeof products)[number];
    const productMap = new Map<string, ProductWithPricing>(products.map((p) => [p.id, p]));
    const itemsWithProduct: Array<{
      id: string;
      productId: string;
      variantId: string | null;
      quantity: number;
      product?: Awaited<ReturnType<typeof getProductBySlug>>;
    }> = [];
    for (const item of cart.items) {
      const product = productMap.get(item.productId);
      if (!product) continue;
      const priceCents = product.variants[0]?.priceCents ?? product.priceVersions[0]?.priceCents ?? null;
      itemsWithProduct.push({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        product: {
          id: product.id,
          slug: product.slug,
          name: product.name,
          priceCents,
          images: product.images,
          formDisplay: product.formDisplay,
        } as Awaited<ReturnType<typeof getProductBySlug>>,
      });
    }
    return res.status(200).json({
      cartId: cart.id,
      items: itemsWithProduct,
      itemCount: itemsWithProduct.reduce((s, i) => s + i.quantity, 0),
    });
  }

  if (req.method === 'POST') {
    const { productSlug, quantity = 1 } = req.body as { productSlug?: string; quantity?: number };
    if (!productSlug) {
      return res.status(400).json({ error: 'productSlug obrigatório' });
    }

    const product = await prisma.product.findFirst({
      where: { slug: productSlug, status: 'active', active: true },
      include: { variants: true },
    });
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const cart = await getOrCreateCart(sessionId, profileId);
    const variantId = product.variants[0]?.id ?? null;

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: product.id },
    });

    if (existing) {
      const newQty = Math.max(1, (existing.quantity + quantity));
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          variantId,
          quantity: Math.max(1, quantity),
        },
      });
    }

    storeLogger.cart('Item added', { productSlug, quantity, cartId: cart.id });
    return res.status(200).json({ ok: true, cartId: cart.id });
  }

  return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    storeLogger.error('Cart API error', err);
    if (req.method === 'GET' && isDataStoreUnavailable(err)) {
      return res.status(200).json({
        cartId: null,
        items: [],
        itemCount: 0,
        degraded: true,
      });
    }
    return res.status(500).json({ error: getErrorMessage(err) || 'Cart error' });
  }
}
