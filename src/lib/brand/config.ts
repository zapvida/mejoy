export type BrandId = 'zapfarm';

export interface BrandConfig {
  id: BrandId;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    gradient?: string;
  };
  logo: string;
  theme: 'default' | 'zapfarm';
}

export const BRAND_CONFIG: Record<BrandId, BrandConfig> = {
  zapfarm: {
    id: 'zapfarm',
    name: 'MeJoy',
    colors: {
      primary: '#4C1D95',   // roxo profundo
      secondary: '#F97316', // laranja
      accent: '#10B981',    // verde confiança
      gradient: 'from-purple-700 via-orange-500 to-amber-400',
    },
    logo: '/logosmejoy/logomejoy.svg',
    theme: 'zapfarm',
  },
};

export function getBrandBySlug(slug: string): BrandId {
  if (slug === 'emagrecimento') return 'zapfarm';
  return 'zapfarm';
}

export function getBrandByRoute(pathname: string): BrandId {
  if (pathname.startsWith('/emagrecimento')) return 'zapfarm';
  return 'zapfarm';
}
