/**
 * Evento para sincronizar contagem do carrinho entre header e páginas.
 * Disparado quando: item adicionado, removido ou quantidade alterada.
 */

export const CART_UPDATED_EVENT = 'store-v2-cart-updated';

export function dispatchCartUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  }
}
