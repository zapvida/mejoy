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
      primary: '#004c2e',
      secondary: '#0b6b46',
      accent: '#0f8a59',
      gradient: 'from-[#003522] via-[#004c2e] to-[#0b6b46]',
    },
    logo: '/brand/logo-horizontal-primary.png',
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
