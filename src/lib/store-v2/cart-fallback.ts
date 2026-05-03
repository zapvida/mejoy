import { getFallbackProductBySlug } from './catalog-fallback';

type FallbackCartItem = {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product?: {
    slug: string;
    name: string;
    priceCents: number | null;
    images: string[];
    formDisplay: string | null;
  };
};

type FallbackCart = {
  cartId: string;
  items: FallbackCartItem[];
  itemCount: number;
};

const fallbackCarts = new Map<string, FallbackCart>();

function normalizeCartKey(sessionId: string | null, profileId: string | null): string | null {
  if (profileId) return `profile:${profileId}`;
  if (sessionId) return `session:${sessionId}`;
  return null;
}

function recalc(cart: FallbackCart): FallbackCart {
  cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return cart;
}

function clone(cart: FallbackCart): FallbackCart {
  return {
    cartId: cart.cartId,
    itemCount: cart.itemCount,
    items: cart.items.map((item) => ({
      ...item,
      product: item.product ? { ...item.product, images: [...item.product.images] } : undefined,
    })),
  };
}

export function getFallbackCart(sessionId: string | null, profileId: string | null): FallbackCart {
  const key = normalizeCartKey(sessionId, profileId);
  if (!key) {
    return { cartId: 'fallback-cart-anonymous', items: [], itemCount: 0 };
  }

  const existing = fallbackCarts.get(key);
  if (existing) return clone(existing);

  const created: FallbackCart = {
    cartId: `fallback-cart-${key.replace(/[^a-z0-9_-]/gi, '-')}`,
    items: [],
    itemCount: 0,
  };
  fallbackCarts.set(key, created);
  return clone(created);
}

export function addFallbackCartItem(
  sessionId: string | null,
  profileId: string | null,
  productSlug: string,
  quantity: number
): FallbackCart | null {
  const key = normalizeCartKey(sessionId, profileId);
  if (!key) return null;

  const product = getFallbackProductBySlug(productSlug);
  if (!product) return null;

  const cart = fallbackCarts.get(key) ?? getFallbackCart(sessionId, profileId);
  const existing = cart.items.find((item) => item.product?.slug === productSlug);

  if (existing) {
    existing.quantity = Math.max(1, existing.quantity + quantity);
  } else {
    cart.items.push({
      id: `fallback-item-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`,
      productId: product.id,
      variantId: null,
      quantity: Math.max(1, quantity),
      product: {
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        images: product.images,
        formDisplay: product.formDisplay,
      },
    });
  }

  fallbackCarts.set(key, recalc(cart));
  return clone(cart);
}

export function updateFallbackCartItem(
  sessionId: string | null,
  profileId: string | null,
  itemId: string,
  quantity: number
): FallbackCart | null {
  const key = normalizeCartKey(sessionId, profileId);
  if (!key) return null;

  const cart = fallbackCarts.get(key);
  if (!cart) return null;

  const item = cart.items.find((entry) => entry.id === itemId);
  if (!item) return null;

  item.quantity = Math.max(1, quantity);
  fallbackCarts.set(key, recalc(cart));
  return clone(cart);
}

export function removeFallbackCartItem(
  sessionId: string | null,
  profileId: string | null,
  itemId: string
): FallbackCart | null {
  const key = normalizeCartKey(sessionId, profileId);
  if (!key) return null;

  const cart = fallbackCarts.get(key);
  if (!cart) return null;

  const nextItems = cart.items.filter((entry) => entry.id !== itemId);
  cart.items = nextItems;
  fallbackCarts.set(key, recalc(cart));
  return clone(cart);
}
