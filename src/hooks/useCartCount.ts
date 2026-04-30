'use client';

import { useState, useEffect, useCallback } from 'react';
import { getOrCreateSessionId } from '@/lib/store-v2/session';
import { CART_UPDATED_EVENT } from '@/lib/store-v2/cart-events';

/**
 * Retorna a quantidade total de itens no carrinho.
 * Atualiza ao montar e quando o evento store-v2-cart-updated é disparado.
 */
export function useCartCount(): number {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(() => {
    const sessionId = getOrCreateSessionId();
    fetch('/api/store-v2/cart', { headers: { 'X-Session-Id': sessionId } })
      .then((r) => r.json())
      .then((data: { itemCount?: number }) => setCount(data.itemCount ?? 0))
      .catch(() => setCount(0));
  }, []);

  useEffect(() => {
    fetchCount();
    const handler = () => fetchCount();
    window.addEventListener(CART_UPDATED_EVENT, handler);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handler);
  }, [fetchCount]);

  return count;
}
