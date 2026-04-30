import { createClient } from '@supabase/supabase-js';

const configuredUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const configuredServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const configuredAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
