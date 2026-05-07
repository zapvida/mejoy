/**
 * Valida token Magic Link e retorna URL de login Supabase.
 * GET /api/auth/magic-link/validate?token=xxx&redirect=yyy
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { validateMagicLink } from '@/lib/auth/magic-link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mejoy.com.br';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const token = req.query.token as string | undefined;
  const redirect = (req.query.redirect as string) || '/dashboard';

  if (!token) {
    return res.status(400).json({ error: 'Token obrigatório' });
  }

  try {
    const result = await validateMagicLink(token);
    if (!result) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    const redirectTo = redirect.startsWith('/') ? `${BASE_URL.replace(/\/$/, '')}${redirect}` : redirect;
    const adminAuth = supabaseAdmin.auth as any;

    await adminAuth.admin.createUser({
      email: result.email,
      email_confirm: true,
    }).catch(() => {});

    const { data: linkData, error } = await adminAuth.admin.generateLink({
      type: 'magiclink',
      email: result.email,
      options: {
        redirectTo,
      },
    });

    if (error) {
      const isExistingUser = error.message?.toLowerCase().includes('already') ?? false;
      if (isExistingUser) {
        const retry = await adminAuth.admin.generateLink({
          type: 'magiclink',
          email: result.email,
          options: { redirectTo },
        });
        if (!retry.error && retry.data?.properties?.action_link) {
          return res.status(200).json({ actionLink: retry.data.properties.action_link });
        }
      }
      console.error('[magic-link/validate] Supabase generateLink:', error);
      return res.status(500).json({ error: 'Erro ao gerar link de acesso' });
    }

    const actionLink = (linkData as { properties?: { action_link?: string } })?.properties?.action_link;
    if (!actionLink) {
      return res.status(500).json({ error: 'Link não gerado' });
    }

    return res.status(200).json({ actionLink });
  } catch (e) {
    console.error('[magic-link/validate] Erro:', e);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
