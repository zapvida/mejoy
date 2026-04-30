/**
 * Auditoria de preço Store V2
 * Garante: total exibido = total no Order snapshot = total enviado ao gateway
 */

import { storeLogger } from '@/lib/store-v2/logger';

export interface SnapshotItem {
  productId: string;
  productSlug: string;
  name: string;
  quantity: number;
  priceCents: number;
  lineTotalCents?: number;
}

export interface OrderSnapshot {
  items: SnapshotItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

/**
 * Valida snapshot: soma dos itens = subtotal, subtotal + shipping = total
 */
export function auditSnapshot(snapshot: OrderSnapshot): { ok: boolean; error?: string } {
  const itemsSubtotal = snapshot.items.reduce(
    (sum, i) => sum + (i.lineTotalCents ?? i.priceCents * i.quantity),
    0
  );
  if (itemsSubtotal !== snapshot.subtotalCents) {
    return {
      ok: false,
      error: `subtotal divergente: calculado=${itemsSubtotal} snapshot=${snapshot.subtotalCents}`,
    };
  }
  const expectedTotal = snapshot.subtotalCents + snapshot.shippingCents;
  if (expectedTotal !== snapshot.totalCents) {
    return {
      ok: false,
      error: `total divergente: esperado=${expectedTotal} snapshot=${snapshot.totalCents}`,
    };
  }
  return { ok: true };
}

/**
 * Valida que valor enviado ao gateway coincide com snapshot
 */
export function auditGatewayValue(totalCents: number, valueSentReais: number): { ok: boolean; error?: string } {
  const sentRounded = Math.round(valueSentReais * 100);
  if (Math.abs(sentRounded - totalCents) > 0) {
    return {
      ok: false,
      error: `valor gateway divergente: totalCents=${totalCents} valueReais=${valueSentReais}`,
    };
  }
  return { ok: true };
}

/**
 * Recalcula total a partir dos itens + frete e compara com snapshot.
 * Bloqueia se divergência (evita cobrar valor diferente do exibido).
 */
export function recomputeAndAssertMatch(snapshot: OrderSnapshot): void {
  const computedSubtotal = snapshot.items.reduce(
    (sum, i) => sum + (i.lineTotalCents ?? i.priceCents * i.quantity),
    0
  );
  const computedTotal = computedSubtotal + snapshot.shippingCents;
  if (computedTotal !== snapshot.totalCents) {
    const err = `divergência recalculada: computedTotal=${computedTotal} snapshotTotal=${snapshot.totalCents}`;
    storeLogger.error('Price recompute mismatch', new Error(err), {
      computedSubtotal,
      computedTotal,
      snapshotSubtotal: snapshot.subtotalCents,
      snapshotTotal: snapshot.totalCents,
      shippingCents: snapshot.shippingCents,
    });
    throw new Error(`Auditoria de preço: ${err}`);
  }
}

/**
 * Executa auditoria completa e bloqueia se divergência
 */
export function assertPriceAudit(
  snapshot: OrderSnapshot,
  valueInReais: number
): void {
  const audit1 = auditSnapshot(snapshot);
  if (!audit1.ok) {
    storeLogger.error('Price audit failed', new Error(audit1.error), { snapshot });
    throw new Error(`Auditoria de preço: ${audit1.error}`);
  }
  recomputeAndAssertMatch(snapshot);
  const audit2 = auditGatewayValue(snapshot.totalCents, valueInReais);
  if (!audit2.ok) {
    storeLogger.error('Gateway value audit failed', new Error(audit2.error), {
      totalCents: snapshot.totalCents,
      valueInReais,
    });
    throw new Error(`Auditoria de preço: ${audit2.error}`);
  }
}
