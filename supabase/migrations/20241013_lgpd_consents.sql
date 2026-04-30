-- Migração para tabela de consentimentos LGPD
-- Execute no Supabase SQL Editor

-- Criar tabela de consentimentos LGPD
CREATE TABLE IF NOT EXISTS public.lgpd_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  consent_at TIMESTAMPTZ NOT NULL,
  policy_version TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS lgpd_consents_user_id_idx ON public.lgpd_consents(user_id);
CREATE INDEX IF NOT EXISTS lgpd_consents_consent_at_idx ON public.lgpd_consents(consent_at);
CREATE INDEX IF NOT EXISTS lgpd_consents_policy_version_idx ON public.lgpd_consents(policy_version);

-- Habilitar RLS
ALTER TABLE public.lgpd_consents ENABLE ROW LEVEL SECURITY;

-- Política RLS: usuários só podem ver seus próprios consentimentos
CREATE POLICY "Users can only access their own consents" ON public.lgpd_consents
  FOR ALL USING (
    user_id IS NULL OR 
    user_id = auth.uid()::text OR
    -- Permitir acesso via service_role (server-side only)
    auth.role() = 'service_role'
  );

-- Política para inserção
CREATE POLICY "Allow consent creation" ON public.lgpd_consents
  FOR INSERT WITH CHECK (
    user_id IS NULL OR 
    user_id = auth.uid()::text OR
    auth.role() = 'service_role'
  );

-- Política para atualização (revogação)
CREATE POLICY "Allow consent revocation" ON public.lgpd_consents
  FOR UPDATE USING (
    user_id IS NULL OR 
    user_id = auth.uid()::text OR
    auth.role() = 'service_role'
  );

-- Comentários para documentação
COMMENT ON TABLE public.lgpd_consents IS 'Registro de consentimentos LGPD dos usuários';
COMMENT ON COLUMN public.lgpd_consents.user_id IS 'ID do usuário (pode ser null para usuários anônimos)';
COMMENT ON COLUMN public.lgpd_consents.consent_at IS 'Data e hora do consentimento';
COMMENT ON COLUMN public.lgpd_consents.policy_version IS 'Versão da política de privacidade aceita';
COMMENT ON COLUMN public.lgpd_consents.ip_hash IS 'Hash do IP do usuário para auditoria';
COMMENT ON COLUMN public.lgpd_consents.revoked_at IS 'Data e hora da revogação (se aplicável)';

-- Função para verificar se usuário tem consentimento válido
CREATE OR REPLACE FUNCTION public.has_valid_consent(user_id_param TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.lgpd_consents 
    WHERE (user_id_param IS NULL AND user_id IS NULL) OR user_id = user_id_param
    AND revoked_at IS NULL
    AND policy_version = '1.0.0' -- Versão atual da política
    ORDER BY consent_at DESC 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para revogar consentimento
CREATE OR REPLACE FUNCTION public.revoke_consent(user_id_param TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.lgpd_consents 
  SET revoked_at = now(), updated_at = now()
  WHERE (user_id_param IS NULL AND user_id IS NULL) OR user_id = user_id_param
  AND revoked_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
