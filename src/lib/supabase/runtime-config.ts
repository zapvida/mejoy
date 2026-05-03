const DEFAULT_PUBLIC_SUPABASE_URL = 'https://ksmrownmfwcywhxtpshq.supabase.co';
const DEFAULT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_zsyeTlTXL4jzYVpz5RyiKQ_xQdOGyQQ';

function shouldUseManagedFallback() {
  return process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL_ENV);
}

export function getSupabasePublicConfig() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    (shouldUseManagedFallback() ? DEFAULT_PUBLIC_SUPABASE_URL : '');

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    (shouldUseManagedFallback() ? DEFAULT_PUBLIC_SUPABASE_PUBLISHABLE_KEY : '');

  return { url, anonKey };
}

export function getSupabaseServerConfig() {
  const { url, anonKey } = getSupabasePublicConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return {
    url,
    anonKey,
    serviceRoleKey,
    readKey: serviceRoleKey || anonKey,
  };
}

export function hasSupabasePublicConfig() {
  const { url, anonKey } = getSupabasePublicConfig();
  return Boolean(url && anonKey);
}

export function hasSupabaseAdminRuntimeConfig() {
  const { url } = getSupabasePublicConfig();
  return Boolean(url && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
