/**
 * Utilitários para mapear Stripe Price IDs
 * 
 * CONVENÇÃO DE ENV VARS:
 * 
 * Para cada produto e plano, use a seguinte convenção:
 * STRIPE_PRICE_{PRODUTO}_{PLANO}
 * 
 * Onde:
 * - PRODUTO: nome do produto em MAIÚSCULAS (ex: CALVICIE, SONO, ANSIEDADE)
 * - PLANO: básico, completo ou premium em MAIÚSCULAS
 * 
 * Exemplos:
 * STRIPE_PRICE_CALVICIE_BASICO=price_xxx
 * STRIPE_PRICE_CALVICIE_COMPLETO=price_yyy
 * STRIPE_PRICE_CALVICIE_PREMIUM=price_zzz
 * STRIPE_PRICE_SONO_BASICO=price_aaa
 * STRIPE_PRICE_SONO_COMPLETO=price_bbb
 * STRIPE_PRICE_SONO_PREMIUM=price_ccc
 * 
 * ... e assim por diante para todos os produtos.
 * 
 * IMPORTANTE: O código falhará de forma clara se a env var não estiver configurada.
 */

import type { PlanConfig } from '@/config/zapfarm/products';

/**
 * Obtém o nome da env var para um Stripe Price ID
 */
export function getStripePriceEnvVarName(productSlug: string, planSlug: string): string {
  // Normalizar slug do produto para MAIÚSCULAS
  const productUpper = productSlug.toUpperCase().replace(/-/g, '_');
  
  // Normalizar slug do plano para MAIÚSCULAS
  const planUpper = planSlug.toUpperCase();
  
  return `STRIPE_PRICE_${productUpper}_${planUpper}`;
}

/**
 * Obtém o Stripe Price ID de uma env var
 * 
 * @throws Error se a env var não estiver configurada
 */
export function getStripePriceId(productSlug: string, planSlug: string): string {
  const envVarName = getStripePriceEnvVarName(productSlug, planSlug);
  const priceId = process.env[envVarName];
  
  if (!priceId) {
    throw new Error(
      `Stripe Price ID não configurado. Configure a variável de ambiente: ${envVarName}\n` +
      `Exemplo: ${envVarName}=price_xxx`
    );
  }
  
  return priceId;
}

/**
 * Obtém o Stripe Price ID a partir de um PlanConfig
 * 
 * O PlanConfig já contém o nome da env var em stripePriceId
 */
export function getStripePriceIdFromPlan(planConfig: PlanConfig): string {
  const priceId = process.env[planConfig.stripePriceId];
  
  if (!priceId) {
    throw new Error(
      `Stripe Price ID não configurado. Configure a variável de ambiente: ${planConfig.stripePriceId}\n` +
      `Exemplo: ${planConfig.stripePriceId}=price_xxx`
    );
  }
  
  return priceId;
}

/**
 * Valida se todas as env vars necessárias estão configuradas
 * (útil para validação em desenvolvimento)
 */
export function validateStripePriceIds(productSlug: string): {
  valid: boolean;
  missing: string[];
} {
  const plans = ['BASICO', 'COMPLETO', 'PREMIUM'];
  const missing: string[] = [];
  
  for (const plan of plans) {
    const envVarName = getStripePriceEnvVarName(productSlug, plan.toLowerCase());
    if (!process.env[envVarName]) {
      missing.push(envVarName);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

