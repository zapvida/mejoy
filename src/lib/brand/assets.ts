const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mejoy.com.br';

export const BRAND_NAME = 'MeJoy';
export const BRAND_THEME_COLOR = '#004c2e';
export const BRAND_BACKGROUND_COLOR = '#ffffff';

export const BRAND_ASSETS = {
  logo: {
    primary: '/brand/logo-horizontal-primary.png',
    inverse: '/brand/logo-horizontal-inverse.png',
    dark: '/brand/logo-horizontal-dark.png',
    mono: '/brand/logo-horizontal-mono.png',
  },
  icon: {
    primary: '/brand/logo-icon-primary.png',
    inverse: '/brand/logo-icon-inverse.png',
    dark: '/brand/logo-icon-dark.png',
  },
  meta: {
    faviconIco: '/favicon.ico',
    favicon16: '/favicon-16x16.png',
    favicon32: '/favicon-32x32.png',
    icon48: '/icon-48x48.png',
    icon96: '/icon-96x96.png',
    icon: '/icon.png',
    appleTouch: '/apple-touch-icon.png',
    android192: '/android-chrome-192x192.png',
    android512: '/android-chrome-512x512.png',
    manifest: '/manifest.webmanifest',
    og: '/og-default.png',
  },
} as const;

export type BrandHorizontalVariant = keyof typeof BRAND_ASSETS.logo;
export type BrandIconVariant = keyof typeof BRAND_ASSETS.icon;

export function getBrandHorizontalLogoSrc(variant: BrandHorizontalVariant = 'primary') {
  return BRAND_ASSETS.logo[variant];
}

export function getBrandIconSrc(variant: BrandIconVariant = 'primary') {
  return BRAND_ASSETS.icon[variant];
}

export function getBrandAssetUrl(path: string) {
  return `${BASE_URL}${path}`;
}

export const BRAND_OG_IMAGE_URL = getBrandAssetUrl(BRAND_ASSETS.meta.og);
