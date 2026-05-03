import { createClient } from '@supabase/supabase-js';
import {
  getSupabasePublicConfig,
  getSupabaseServerConfig,
} from '@/lib/supabase/runtime-config';

const { url: configuredUrl } = getSupabasePublicConfig();
const { serviceRoleKey: configuredServiceKey, anonKey: configuredAnonKey } =
  getSupabaseServerConfig();

// Evita crash no import quando envs não estão presentes no ambiente local.
const fallbackUrl = 'https://local-placeholder.supabase.co';
const fallbackKey = configuredAnonKey || 'local-placeholder-key';

const url = configuredUrl || fallbackUrl;
const key = configuredServiceKey || fallbackKey;

export const hasSupabaseAdminConfig = Boolean(configuredUrl && configuredServiceKey);

if (!hasSupabaseAdminConfig) {
  console.warn('[supabaseAdmin] Supabase URL or Service Role Key not configured');
}

export const supabaseAdmin = createClient(url, key, { 
  auth: { persistSession: false },
  db: { schema: 'public' }
});
