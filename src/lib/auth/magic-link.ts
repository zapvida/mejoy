/**
 * Lógica centralizada de Magic Link
 * Usado pós-triagem: gera token único, valida e cria sessão Supabase
 */

import { createHash, randomBytes } from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const TOKEN_BYTES = 32;
const EXPIRY_HOURS = 24;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mejoy.com.br';

export interface CreateMagicLinkResult {
  magicUrl: string;
  token: string;
  expiresAt: Date;
}

/**
 * Gera um Magic Link para o profile.
 * Retorna a URL completa e o token (para uso em mensagem).
 */
export async function createMagicLink(params: {
  profileId: string;
  redirectPath?: string;
}): Promise<CreateMagicLinkResult | null> {
  const { profileId, redirectPath = '/dashboard' } = params;

  const profile = await supabaseAdmin
    .from('profiles')
    .select('id, email')
    .eq('id', profileId)
    .maybeSingle();

  if (!profile?.data?.email) {
    console.warn('[magic-link] Profile sem email:', profileId);
    return null;
  }

  const token = randomBytes(TOKEN_BYTES).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);

  const { error } = await supabaseAdmin.from('magic_links').insert({
    token_hash: tokenHash,
    profile_id: profileId,
    redirect_path: redirectPath,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error('[magic-link] Erro ao inserir token:', error);
    return null;
  }

  const magicUrl = `${BASE_URL.replace(/\/$/, '')}/auth/magic-link?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirectPath)}`;

  return {
    magicUrl,
    token,
    expiresAt,
  };
}

export interface ValidateMagicLinkResult {
  profileId: string;
  email: string;
  redirectPath: string;
}

/**
 * Valida o token e marca como usado.
 * Retorna dados do profile ou null se inválido.
 */
export async function validateMagicLink(token: string): Promise<ValidateMagicLinkResult | null> {
  const tokenHash = createHash('sha256').update(token).digest('hex');

  const { data: row, error } = await supabaseAdmin
    .from('magic_links')
    .select('profile_id, redirect_path, expires_at, used_at')
    .eq('token_hash', tokenHash)
    .maybeSingle();

  if (error || !row) {
    return null;
  }

  if (row.used_at) {
    return null;
  }

  const expiresAt = new Date(row.expires_at);
  if (expiresAt < new Date()) {
    return null;
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, email')
    .eq('id', row.profile_id)
    .maybeSingle();

  if (!profile?.email) {
    return null;
  }

  await supabaseAdmin
    .from('magic_links')
    .update({ used_at: new Date().toISOString() })
    .eq('token_hash', tokenHash);

  return {
    profileId: row.profile_id,
    email: profile.email,
    redirectPath: row.redirect_path || '/dashboard',
  };
}
