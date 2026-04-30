-- Políticas RLS para segurança do sistema de triagem
-- Execute no Supabase SQL Editor

-- Habilitar RLS nas tabelas
ALTER TABLE public.triage_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.triage_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Política para triage_sessions: usuário só pode acessar suas próprias sessões
CREATE POLICY "Users can only access their own triage sessions" ON public.triage_sessions
  FOR ALL USING (
    -- Permitir acesso se client_id for null (sessão anônima) ou se for o próprio usuário
    client_id IS NULL OR 
    client_id = auth.uid()::text OR
    -- Permitir acesso via service_role (server-side only)
    auth.role() = 'service_role'
  );

-- Política para triage_steps: usuário só pode acessar steps de suas próprias sessões
CREATE POLICY "Users can only access steps from their own sessions" ON public.triage_steps
  FOR ALL USING (
    -- Verificar se a sessão pertence ao usuário
    triage_id IN (
      SELECT triage_id FROM public.triage_sessions 
      WHERE client_id IS NULL OR client_id = auth.uid()::text
    ) OR
    -- Permitir acesso via service_role (server-side only)
    auth.role() = 'service_role'
  );

-- Política para profiles: usuário só pode acessar seu próprio perfil
CREATE POLICY "Users can only access their own profile" ON public.profiles
  FOR ALL USING (
    client_id IS NULL OR 
    client_id = auth.uid()::text OR
    -- Permitir acesso via service_role (server-side only)
    auth.role() = 'service_role'
  );

-- Política para reports: usuário só pode acessar relatórios de suas próprias sessões
CREATE POLICY "Users can only access reports from their own sessions" ON public.reports
  FOR ALL USING (
    -- Verificar se a sessão pertence ao usuário
    triage_id IN (
      SELECT triage_id FROM public.triage_sessions 
      WHERE client_id IS NULL OR client_id = auth.uid()::text
    ) OR
    -- Permitir acesso via service_role (server-side only)
    auth.role() = 'service_role'
  );

-- Política adicional: permitir inserção de novas sessões anônimas
CREATE POLICY "Allow anonymous session creation" ON public.triage_sessions
  FOR INSERT WITH CHECK (
    client_id IS NULL OR 
    client_id = auth.uid()::text OR
    auth.role() = 'service_role'
  );

-- Política adicional: permitir inserção de novos steps
CREATE POLICY "Allow step creation for valid sessions" ON public.triage_steps
  FOR INSERT WITH CHECK (
    triage_id IN (
      SELECT triage_id FROM public.triage_sessions 
      WHERE client_id IS NULL OR client_id = auth.uid()::text
    ) OR
    auth.role() = 'service_role'
  );

-- Política adicional: permitir inserção de novos perfis
CREATE POLICY "Allow profile creation for valid users" ON public.profiles
  FOR INSERT WITH CHECK (
    client_id IS NULL OR 
    client_id = auth.uid()::text OR
    auth.role() = 'service_role'
  );

-- Política adicional: permitir inserção de novos relatórios
CREATE POLICY "Allow report creation for valid sessions" ON public.reports
  FOR INSERT WITH CHECK (
    triage_id IN (
      SELECT triage_id FROM public.triage_sessions 
      WHERE client_id IS NULL OR client_id = auth.uid()::text
    ) OR
    auth.role() = 'service_role'
  );

-- Comentários para documentação
COMMENT ON POLICY "Users can only access their own triage sessions" ON public.triage_sessions IS 
'Garante que usuários só acessem suas próprias sessões de triagem, permitindo sessões anônimas';

COMMENT ON POLICY "Users can only access steps from their own sessions" ON public.triage_steps IS 
'Garante que usuários só acessem steps de suas próprias sessões de triagem';

COMMENT ON POLICY "Users can only access their own profile" ON public.profiles IS 
'Garante que usuários só acessem seus próprios perfis';

COMMENT ON POLICY "Users can only access reports from their own sessions" ON public.reports IS 
'Garante que usuários só acessem relatórios de suas próprias sessões de triagem';
