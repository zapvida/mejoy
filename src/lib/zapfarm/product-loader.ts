/**
 * Helpers para carregar e trabalhar com configurações de produtos ZapFarm
 */

import { 
  getProductConfig as getConfig, 
  getAllProducts as getAll,
  getProductPlans as getPlans,
  getProductsByCategory as getByCategory,
  type ZapfarmProductConfig 
} from '@/config/zapfarm/products';

/**
 * Obtém configuração completa de um produto por slug
 */
export function getProductConfig(slug: string): ZapfarmProductConfig | null {
  return getConfig(slug);
}

/**
 * Obtém todos os produtos
 */
export function getAllProducts(): ZapfarmProductConfig[] {
  return getAll();
}

/**
 * Obtém planos de um produto
 */
export function getProductPlans(slug: string) {
  return getPlans(slug);
}

/**
 * Obtém produtos por categoria
 */
export function getProductsByCategory(category: string): ZapfarmProductConfig[] {
  return getByCategory(category);
}

/**
 * Verifica se um produto existe
 */
export function productExists(slug: string): boolean {
  return getConfig(slug) !== null;
}

/**
 * Obtém cores de um produto para uso em componentes
 */
export function getProductColors(slug: string) {
  const product = getConfig(slug);
  if (!product) return null;
  
  return product.colors;
}

/**
 * Obtém informações SEO de um produto
 */
export function getProductSEO(slug: string) {
  const product = getConfig(slug);
  if (!product) return null;
  
  return product.seo;
}

/**
 * Obtém URL da triagem de um produto
 */
export function getTriageUrl(slug: string): string {
  const product = getConfig(slug);
  if (!product) return '/';
  
  return `/triagem/${product.triageSlug}`;
}

/**
 * Obtém URL do checkout de um produto
 */
export function getCheckoutUrl(slug: string, plano?: string, reportId?: string): string {
  const params = new URLSearchParams();
  if (plano) params.set('plano', plano);
  if (reportId) params.set('reportId', reportId);
  
  const query = params.toString();
  return `/${slug}/checkout${query ? `?${query}` : ''}`;
}

/**
 * Obtém URL do relatório de um produto
 */
export function getRelatorioUrl(slug: string, reportId: string): string {
  return `/${slug}/relatorio?id=${reportId}`;
}

