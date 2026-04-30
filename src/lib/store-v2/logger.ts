/**
 * Logger estruturado para Store V2 (catalog, cart, checkout, payments)
 * Reutiliza pino e integra com Sentry para erros.
 */

import { logger as pinoLogger } from '@/lib/log';

export type StoreV2LogContext = Record<string, unknown>;

export const storeLogger = {
  catalog: (msg: string, ctx?: StoreV2LogContext) =>
    pinoLogger.info({ ...ctx, component: 'catalog' }, msg),
  cart: (msg: string, ctx?: StoreV2LogContext) =>
    pinoLogger.info({ ...ctx, component: 'cart' }, msg),
  checkout: (msg: string, ctx?: StoreV2LogContext) =>
    pinoLogger.info({ ...ctx, component: 'checkout' }, msg),
  payment: (msg: string, ctx?: StoreV2LogContext) =>
    pinoLogger.info({ ...ctx, component: 'payment' }, msg),
  shipping: (msg: string, ctx?: StoreV2LogContext) =>
    pinoLogger.info({ ...ctx, component: 'shipping' }, msg),
  webhook: (msg: string, ctx?: StoreV2LogContext) =>
    pinoLogger.info({ ...ctx, component: 'webhook' }, msg),
  error: (msg: string, err?: unknown, ctx?: StoreV2LogContext) =>
    pinoLogger.error({ ...ctx, err, component: 'store-v2' }, msg),
};
