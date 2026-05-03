import type { NextApiRequest } from 'next';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { getProfileByEmail } from '@/lib/supabase/server';

function allowLegacyEmailIdentity(): boolean {
  return process.env.ALLOW_LEGACY_EMAIL_HEADER === '1' || process.env.NODE_ENV !== 'production';
}

/**
 * Helper para obter o email do usuário autenticado de diferentes formas
 * Prioridade:
 * 1. Header Authorization (Bearer token) - extrair email do token
 * 2. Header X-User-Email (para desenvolvimento/testes)
 * 3. Query param email (para desenvolvimento/testes)
 * 4. Tentar obter do Supabase Auth via cookies
 */
export async function getUserEmailFromRequest(req: NextApiRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const { user } = await getAuthenticatedUser(req);
      if (user?.email) {
        return user.email;
      }
    } catch {
      // Continuar tentando outras formas permitidas
    }
  }

  if (allowLegacyEmailIdentity()) {
    const emailFromHeader = req.headers['x-user-email'] as string | undefined;
    if (emailFromHeader) {
      return emailFromHeader.toLowerCase();
    }

    const emailFromQuery = req.query.email as string | undefined;
    if (emailFromQuery) {
      return emailFromQuery.toLowerCase();
    }
  }

  return null;
}

/**
 * Obter Profile do usuário autenticado
 */
export async function getProfileFromRequest(req: NextApiRequest) {
  const email = await getUserEmailFromRequest(req);
  if (!email) {
    return null;
  }

  return getProfileByEmail(email);
}
