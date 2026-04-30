'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { getOrCreateSessionId } from '@/lib/store-v2/session';
import { dispatchCartUpdated } from '@/lib/store-v2/cart-events';
import { track } from '@/lib/analytics';

interface AddToCartButtonProps {
  productSlug: string;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  /** Se true, redireciona para checkout (evita delay do carrinho). Se false, fica na página. */
  redirectToCart?: boolean;
  /** Se true, redireciona direto para checkout em vez de carrinho (melhor UX) */
  redirectToCheckout?: boolean;
  onAdded?: () => void;
}

export default function AddToCartButton({
  productSlug,
  quantity = 1,
  className = '',
  children,
  redirectToCart = false,
  redirectToCheckout = false,
  onAdded,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    try {
      const sessionId = getOrCreateSessionId();
      const qty = Math.max(1, Math.min(99, Math.floor(quantity)));
      const res = await fetch('/api/store-v2/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
        },
        body: JSON.stringify({ productSlug, quantity: qty }),
      });
      const data = await res.json();
      if (data.ok) {
        track('add_to_cart', { product_slug: productSlug, quantity: qty, cart_id: data.cartId });
        dispatchCartUpdated();
        onAdded?.();
        if (redirectToCheckout && data.cartId) {
          router.push(`/checkout?cartId=${data.cartId}`);
        } else if (redirectToCart) {
          router.push('/cart');
        }
      } else {
        throw new Error(data.error || 'Erro ao adicionar');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao adicionar ao carrinho');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? 'Adicionando...' : children ?? 'Adicionar ao carrinho'}
    </button>
  );
}
