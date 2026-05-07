import { NextApiRequest } from 'next';
import { createClient } from '@supabase/supabase-js';
import { hasSupabaseAdminConfig, supabaseAdmin } from '../supabaseAdmin';
import { getSupabaseServerConfig } from './runtime-config';

/**
 * Helper para criar cliente Supabase no servidor usando request (API Routes)
 */
export function createServerSupabaseClientFromRequest() {
  const { url: supabaseUrl, anonKey: supabaseAnonKey, serviceRoleKey } = getSupabaseServerConfig();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  // Criar cliente com service role para operações server-side
  if (!serviceRoleKey) {
    console.warn('[createServerSupabaseClientFromRequest] SUPABASE_SERVICE_ROLE_KEY não configurado');
  }

  return createClient(supabaseUrl, serviceRoleKey || supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Obter usuário autenticado do Supabase a partir de um request
 */
export async function getAuthenticatedUser(req: NextApiRequest): Promise<{ user: any; error: any }> {
  const supabase = createServerSupabaseClientFromRequest();
  
  if (!supabase) {
    return { user: null, error: new Error('Supabase não configurado') };
  }

  // Tentar obter usuário do header Authorization (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const auth = supabase.auth as any;
    const { data, error } = await auth.getUser(token);
    return { user: data.user, error };
  }

  // Para API routes, vamos usar uma abordagem mais simples:
  // Se não houver token no header, retornar null (usuário não autenticado)
  // O frontend deve enviar o token via Authorization header quando disponível
  return { user: null, error: null };
}

/**
 * Buscar Profile pelo email ou auth_user_id
 */
export async function getProfileByEmail(email: string) {
  if (!email) return null;
  if (!hasSupabaseAdminConfig) return null;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error('[getProfileByEmail] Error:', error);
    return null;
  }

  return data;
}

/**
 * Buscar Profile pelo auth_user_id (se existir campo auth_user_id em profiles)
 */
export async function getProfileByAuthUserId(authUserId: string) {
  if (!authUserId) return null;
  if (!hasSupabaseAdminConfig) return null;

  // Primeiro tentar buscar por auth_user_id se o campo existir
  const { data: profileByAuthId, error: errorAuthId } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle();

  if (!errorAuthId && profileByAuthId) {
    return profileByAuthId;
  }

  // Se não encontrar, buscar pelo email do usuário auth
  const adminAuth = supabaseAdmin.auth as any;
  const { data: authUser, error: authError } = await adminAuth.admin.getUserById(authUserId);
  
  if (authError || !authUser?.user?.email) {
    return null;
  }

  return getProfileByEmail(authUser.user.email);
}

/**
 * Buscar Profile pelo client_id
 */
export async function getProfileByClientId(clientId: string) {
  if (!clientId) return null;
  if (!hasSupabaseAdminConfig) return null;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('client_id', clientId)
    .maybeSingle();

  if (error) {
    console.error('[getProfileByClientId] Error:', error);
    return null;
  }

  return data;
}
