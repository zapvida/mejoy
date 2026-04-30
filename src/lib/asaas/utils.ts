/**
 * Utilitários para mapear Asaas Payment IDs
 * 
 * CONVENÇÃO DE ENV VARS:
 * 
 * Para cada produto e plano, use a seguinte convenção:
 * ASAAS_PRICE_{PRODUTO}_{PLANO}
 * 
 * Onde:
 * - PRODUTO: nome do produto em MAIÚSCULAS (ex: CALVICIE, SONO, ANSIEDADE)
 * - PLANO: básico, completo ou premium em MAIÚSCULAS
 * 
 * Exemplos:
 * ASAAS_PRICE_CALVICIE_BASICO=29900 (valor em centavos)
 * ASAAS_PRICE_CALVICIE_COMPLETO=49900
 * ASAAS_PRICE_CALVICIE_PREMIUM=79900
 * 
 * IMPORTANTE: O código falhará de forma clara se a env var não estiver configurada.
 */

import type { PlanConfig } from '@/config/zapfarm/products';

/** Tirzepatida: basico→2_5, completo→5, premium→20 */
const TIRZEPATIDA_PLAN_MAP: Record<string, string> = {
  basico: '2_5',
  completo: '5',
  premium: '20',
  '2_5': '2_5',
  '5': '5',
  '20': '20',
};

/**
 * Obtém o nome da env var para um Asaas Price (valor em centavos)
 */
export function getAsaasPriceEnvVarName(productSlug: string, planSlug: string): string {
  const productUpper = productSlug.toUpperCase().replace(/-/g, '_');
  let planUpper = planSlug.toUpperCase().replace(/\./g, '_');

  if (productSlug === 'tirzepatida') {
    planUpper = (TIRZEPATIDA_PLAN_MAP[planSlug.toLowerCase()] ?? planSlug).toUpperCase().replace(/\./g, '_');
  }

  return `ASAAS_PRICE_${productUpper}_${planUpper}`;
}

/**
 * Obtém o valor do Asaas Price (em centavos) de uma env var
 * 
 * @throws Error se a env var não estiver configurada
 */
export function getAsaasPrice(productSlug: string, planSlug: string): number {
  const envVarName = getAsaasPriceEnvVarName(productSlug, planSlug);
  const priceStr = process.env[envVarName];
  
  if (!priceStr) {
    throw new Error(
      `Asaas Price não configurado. Configure a variável de ambiente: ${envVarName}\n` +
      `Exemplo: ${envVarName}=29900 (valor em centavos, ex: 29900 = R$ 299,00)`
    );
  }
  
  const price = parseInt(priceStr, 10);
  
  if (isNaN(price) || price <= 0) {
    throw new Error(
      `Valor inválido para ${envVarName}. Deve ser um número positivo em centavos.\n` +
      `Exemplo: ${envVarName}=29900`
    );
  }
  
  return price;
}

/**
 * Obtém o valor do Asaas Price (em centavos) a partir de um PlanConfig
 * 
 * @param planConfig - Configuração do plano
 * @param productSlug - Slug do produto (ex: 'libido-masculina', 'emagrecimento')
 */
export function getAsaasPriceFromPlan(planConfig: PlanConfig, productSlug: string): number {
  // O planConfig.slug é o slug do plano ('essencial', 'produto-consulta', etc)
  // Precisamos do productSlug para construir o nome da env var corretamente
  const planSlug = planConfig.id; // 'basico', 'completo', 'premium'
  
  return getAsaasPrice(productSlug, planSlug);
}

/**
 * Valida se todas as env vars necessárias estão configuradas
 * (útil para validação em desenvolvimento)
 */
export function validateAsaasPrices(productSlug: string): {
  valid: boolean;
  missing: string[];
} {
  const plans = ['basico', 'completo', 'premium'];
  const missing: string[] = [];
  
  for (const plan of plans) {
    const envVarName = getAsaasPriceEnvVarName(productSlug, plan);
    if (!process.env[envVarName]) {
      missing.push(envVarName);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Converte data para formato do Asaas (YYYY-MM-DD)
 */
export function formatAsaasDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calcula data de vencimento (padrão: 3 dias a partir de hoje)
 */
export function calculateDueDate(days: number = 3): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatAsaasDate(date);
}

