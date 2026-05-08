import { getProfileByEmail } from '@/lib/supabase/server';
import { hasSupabaseAdminConfig, supabaseAdmin } from '@/lib/supabaseAdmin';

interface EnsureCheckoutProfileParams {
  email: string;
  name?: string | null;
  whatsapp?: string | null;
}

export async function ensureCheckoutProfile({
  email,
  name,
  whatsapp,
}: EnsureCheckoutProfileParams) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !hasSupabaseAdminConfig) {
    return null;
  }

  const normalizedWhatsapp = whatsapp?.replace(/\D/g, '') || null;
  const trimmedName = name?.trim() || null;

  const existing = await getProfileByEmail(normalizedEmail);
  if (existing?.id) {
    const patch: Record<string, string> = {};
    if (!existing.name && trimmedName) patch.name = trimmedName;
    if (!existing.whatsapp && normalizedWhatsapp) patch.whatsapp = normalizedWhatsapp;

    if (Object.keys(patch).length > 0) {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({
          ...patch,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('*')
        .single();

      if (!error && data) {
        return data;
      }
    }

    return existing;
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .insert({
      email: normalizedEmail,
      name: trimmedName,
      whatsapp: normalizedWhatsapp,
    })
    .select('*')
    .single();

  if (error) {
    console.error('[ensureCheckoutProfile] profile insert failed', error);
    return null;
  }

  return data;
}
