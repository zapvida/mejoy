import * as Linking from 'expo-linking';

const MOBILE_UTM = {
  utm_source: 'mejoy_native_app',
  utm_medium: 'app',
  utm_campaign: 'native_onboarding',
};

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.trim().replace(/\/$/, '');
}

export function buildAppReturnUrl(path = '/activation-complete') {
  return Linking.createURL(path);
}

export function buildEmagrecimentoEntryUrl(baseUrl: string) {
  const url = new URL('/emagrecimento', normalizeBaseUrl(baseUrl));
  Object.entries(MOBILE_UTM).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

export function buildEmagrecimentoCheckoutUrl(
  baseUrl: string,
  params: {
    planId?: string;
    trilha?: 'tirzepatida' | 'semaglutida' | 'contrave' | 'alternativas_clinicas';
    appReturnUrl?: string;
  } = {}
) {
  const url = new URL('/emagrecimento/checkout', normalizeBaseUrl(baseUrl));
  url.searchParams.set('plano', params.planId || 'programa-3m');
  url.searchParams.set('trilha', params.trilha || 'tirzepatida');
  if (params.appReturnUrl) {
    url.searchParams.set('appReturnUrl', params.appReturnUrl);
  }
  Object.entries(MOBILE_UTM).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}
