import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Criar cliente Supabase apenas se as variáveis estiverem configuradas
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

interface CookieConsentRequest {
  preferences: {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  version: string;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { preferences, version, timestamp } = req.body as CookieConsentRequest;
    const clientId =
      req.cookies.mejoy_session_id ||
      req.cookies.mejoy_correlation_id ||
      req.cookies.client_id ||
      'anonymous';
    const ipRaw = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const ip = Array.isArray(ipRaw) ? ipRaw[0] : ipRaw;
    const ipHash = createHash('sha256').update(String(ip)).digest('hex');

    // Salvar no Supabase apenas se configurado
    const supabase = getSupabaseClient();
    if (supabase) {
    const { error } = await supabase.from('lgpd_consents').insert({
      user_id: clientId,
      consent_at: timestamp,
      policy_version: version,
      ip_hash: ipHash,
      metadata: {
        cookie_preferences: preferences,
        analytics_enabled: preferences.analytics,
        marketing_enabled: preferences.marketing,
        source: 'cookie_banner',
      },
    });

    if (error) {
      console.error('Erro ao salvar consentimento de cookies:', error);
      // Não falhar a requisição, apenas logar
      // Soft-fail para não bloquear a UX
      }
    } else {
      // Em desenvolvimento sem Supabase, apenas logar
      if (process.env.NODE_ENV === 'development') {
        console.log('[cookie-consent] Supabase não configurado, consentimento não será persistido');
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro no endpoint de consentimento de cookies:', error);
    // Soft-fail: sempre retornar sucesso para não bloquear UX
    return res.status(200).json({ success: true });
  }
}
