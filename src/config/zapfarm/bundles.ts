/**
 * Bundles ZapFarm
 * Usado quando NEXT_PUBLIC_ZAPFARM_BUNDLES=1
 */

export interface BundleConfig {
  id: string;
  name: string;
  productSlugs: string[];
  description?: string;
}

export const ZAPFARM_BUNDLES: Record<string, BundleConfig> = {
  'sono-ansiedade': {
    id: 'sono-ansiedade',
    name: 'Sono + Ansiedade',
    productSlugs: ['sono', 'ansiedade'],
    description: 'Kit 2 frascos: SonoZen + ZenDay',
  },
  'intestino-imunidade': {
    id: 'intestino-imunidade',
    name: 'Intestino + Imunidade',
    productSlugs: ['intestino', 'imunidade'],
    description: 'Base do corpo: FloraBalance + Imuno360',
  },
};

export function getBundleConfig(bundleId: string): BundleConfig | null {
  return ZAPFARM_BUNDLES[bundleId] ?? null;
}

export function getBundleEnvVar(bundleId: string): string {
  const upper = bundleId.toUpperCase().replace(/-/g, '_');
  return `ASAAS_PRICE_BUNDLE_${upper}`;
}
