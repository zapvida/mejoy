/**
 * Tipos ZapFarm para variantes e produtos
 */

export type VariantKey = 'core' | 'pro';

export interface VariantInfo {
  key: VariantKey;
  displayName: string;
  description?: string;
}

export interface ProductWithVariants {
  slug: string;
  variants: {
    core: VariantInfo;
    pro: VariantInfo;
  };
}
