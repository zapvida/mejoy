/**
 * Mapeamento de variantes CORE/PRO por produto ZapFarm
 * Usado quando NEXT_PUBLIC_ZAPFARM_VARIANTS=1
 */

import type { VariantInfo } from '@/types/zapfarm';

export const VARIANT_DISPLAY: Record<string, { core: VariantInfo; pro: VariantInfo }> = {
  emagrecimento: {
    core: { key: 'core', displayName: 'Base Safe', description: 'Mais universal, menor risco' },
    pro: { key: 'pro', displayName: 'Evidence Max', description: 'Mais potente, melhor custo-benefício' },
  },
  calvicie: {
    core: { key: 'core', displayName: 'Base Safe', description: 'Tocotrienóis + zinco + selênio' },
    pro: { key: 'pro', displayName: 'Evidence Max', description: 'Saw palmetto + tocotrienóis' },
  },
  sono: {
    core: { key: 'core', displayName: 'Base Safe', description: 'L-teanina + magnésio + glicina' },
    pro: { key: 'pro', displayName: 'Evidence Max', description: 'L-teanina + ashwagandha' },
  },
  ansiedade: {
    core: { key: 'core', displayName: 'Base Safe', description: 'L-teanina + ashwagandha + B6' },
    pro: { key: 'pro', displayName: 'Evidence Max', description: 'Ashwagandha + L-teanina' },
  },
  intestino: {
    core: { key: 'core', displayName: 'Base Safe', description: 'PHGG + gengibre' },
    pro: { key: 'pro', displayName: 'Evidence Max', description: 'PHGG + probiótico' },
  },
  figado: {
    core: { key: 'core', displayName: 'Base Safe', description: 'NAC + silimarina' },
    pro: { key: 'pro', displayName: 'Evidence Max', description: 'NAC concentrado' },
  },
  'libido-masculina': {
    core: { key: 'core', displayName: 'Base Safe', description: 'Maca + zinco + D3' },
    pro: { key: 'pro', displayName: 'Evidence Max', description: 'Ashwagandha + maca' },
  },
  menopausa: {
    core: { key: 'core', displayName: 'Base Safe', description: 'Magnésio + B6 + saffron' },
    pro: { key: 'pro', displayName: 'Evidence Max', description: 'Black cohosh + saffron' },
  },
  articulacoes: {
    core: { key: 'core', displayName: 'Base Safe', description: 'Curcumina + piperina' },
    pro: { key: 'pro', displayName: 'Evidence Max', description: 'Curcumina + boswellia + piperina' },
  },
  imunidade: {
    core: { key: 'core', displayName: 'Base Safe', description: 'D3 + zinco + selênio' },
    pro: { key: 'pro', displayName: 'Evidence Max', description: 'Base + beta-glucana' },
  },
};

export function getVariantInfo(productSlug: string): { core: VariantInfo; pro: VariantInfo } | null {
  return VARIANT_DISPLAY[productSlug] ?? null;
}

export function hasVariants(productSlug: string): boolean {
  return productSlug in VARIANT_DISPLAY;
}
