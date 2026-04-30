import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { serverEnv } from '@/lib/env';
import { coercePhoneLike } from '@/lib/phone/normalize';

interface ProfileBasic {
  name?: string;
  email?: string;
  whatsapp?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProfileBasic | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientId = req.cookies.client_id;
    
    if (!clientId) {
      // Sem client_id, retornar vazio (usuário não fez triagem ainda)
      return res.status(200).json({});
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('[profile/me-basic] Supabase não configurado');
      return res.status(200).json({});
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar perfil pelo client_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, email, whatsapp')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (profileError) {
      console.error('[profile/me-basic] Erro ao buscar perfil:', profileError);
      // Não falhar, apenas retornar vazio
      return res.status(200).json({});
    }

    // Se não encontrou perfil, tentar buscar da última sessão de triagem
    if (!profile) {
      const { data: session } = await supabase
        .from('triage_sessions')
        .select('profile_snapshot')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (session?.profile_snapshot) {
        const snapshot = session.profile_snapshot as any;
        return res.status(200).json({
          name: snapshot.name || undefined,
          email: snapshot.email || undefined,
          whatsapp: coercePhoneLike(snapshot.whatsapp),
        });
      }
    }

    return res.status(200).json({
      name: profile?.name || undefined,
      email: profile?.email || undefined,
      whatsapp: coercePhoneLike(profile?.whatsapp),
    });
  } catch (error: any) {
    console.error('[profile/me-basic] Erro:', error);
    return res.status(200).json({}); // Retornar vazio em caso de erro
  }
}

