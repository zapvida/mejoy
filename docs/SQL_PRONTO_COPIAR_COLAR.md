# 🚀 SQL PRONTO PARA COPIAR E COLAR

## 📋 PASSO 1: Executar Setup Completo

### **Copie e cole este SQL completo no Supabase:**

```sql
-- ============================================
-- SETUP COMPLETO SUPABASE - ZAPFARM
-- Execute este SQL completo no Supabase SQL Editor
-- ============================================

-- 1. Criar tabela profiles (Perfis de usuários)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text UNIQUE,
  name text,
  email text,
  whatsapp text,
  sex text CHECK (sex IN ('male','female','undisclosed')),
  birth_date date,
  weight_kg numeric,
  height_cm numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Criar tabela triage_sessions (Sessões de triagem)
CREATE TABLE IF NOT EXISTS public.triage_sessions (
  triage_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  triage_slug text NOT NULL,
  answers jsonb DEFAULT '{}'::jsonb,
  profile_snapshot jsonb,
  progress_percent integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Criar índices para triage_sessions
CREATE INDEX IF NOT EXISTS triage_sessions_client_idx ON public.triage_sessions(client_id);
CREATE INDEX IF NOT EXISTS triage_sessions_slug_idx ON public.triage_sessions(triage_slug);
CREATE INDEX IF NOT EXISTS triage_sessions_completed_idx ON public.triage_sessions(completed_at) WHERE completed_at IS NOT NULL;

-- 4. Criar tabela triage_steps (Passos individuais da triagem)
CREATE TABLE IF NOT EXISTS public.triage_steps (
  triage_id uuid REFERENCES public.triage_sessions(triage_id) ON DELETE CASCADE,
  step_key text,
  answer jsonb,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (triage_id, step_key)
);

-- 5. Criar tabela reports (Relatórios - compatibilidade)
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  triage_id uuid UNIQUE REFERENCES public.triage_sessions(triage_id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending','running','completed','failed')) DEFAULT 'pending',
  sections jsonb,
  summary text,
  audio_url text,
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reports_status_idx ON public.reports(status);
CREATE INDEX IF NOT EXISTS reports_triage_id_idx ON public.reports(triage_id);

-- 6. Criar tabela triage_reports (Relatórios - usado pelo código atual)
CREATE TABLE IF NOT EXISTS public.triage_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  triage_id uuid UNIQUE REFERENCES public.triage_sessions(triage_id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending','running','completed','failed')) DEFAULT 'pending',
  sections jsonb,
  summary text,
  audio_url text,
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS triage_reports_status_idx ON public.triage_reports(status);
CREATE INDEX IF NOT EXISTS triage_reports_triage_id_idx ON public.triage_reports(triage_id);

-- 7. Criar tabela lgpd_consents (Consentimentos LGPD)
CREATE TABLE IF NOT EXISTS public.lgpd_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  consent_at timestamptz NOT NULL,
  policy_version text NOT NULL,
  ip_hash text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lgpd_consents_user_id_idx ON public.lgpd_consents(user_id);
CREATE INDEX IF NOT EXISTS lgpd_consents_consent_at_idx ON public.lgpd_consents(consent_at);
```

---

## ✅ PASSO 2: Validar Setup

### **Copie e cole este SQL para validar:**

```sql
-- ============================================
-- VALIDAÇÃO COMPLETA - Verificar Setup
-- ============================================

-- 1. Verificar se todas as tabelas foram criadas (deve retornar 6)
SELECT 
  '✅ Tabelas criadas:' as status,
  COUNT(*) as total_tabelas
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports', 'lgpd_consents');

-- 2. Listar todas as tabelas criadas
SELECT 
  table_name,
  '✅ Criada' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports', 'lgpd_consents')
ORDER BY table_name;

-- 3. Verificar índices criados (deve retornar vários índices)
SELECT 
  tablename,
  indexname,
  '✅ Índice criado' as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports', 'lgpd_consents')
ORDER BY tablename, indexname;

-- 4. Verificar foreign keys (deve retornar 4 relacionamentos)
SELECT 
  tc.table_name,
  tc.constraint_name,
  '✅ FK criada' as status
FROM information_schema.table_constraints AS tc
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('triage_sessions', 'triage_steps', 'reports', 'triage_reports')
ORDER BY tc.table_name;

-- 5. Resumo final (deve mostrar: 6 tabelas, vários índices, 4 FKs)
SELECT 
  '🎯 RESUMO FINAL' as titulo,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports', 'lgpd_consents')) as tabelas_criadas,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND tablename IN ('profiles', 'triage_sessions', 'triage_steps', 'reports', 'triage_reports', 'lgpd_consents')) as indices_criados,
  (SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public' AND table_name IN ('triage_sessions', 'triage_steps', 'reports', 'triage_reports')) as foreign_keys;
```

---

## 📊 RESULTADOS ESPERADOS

### **Após executar o SETUP:**
- ✅ 6 tabelas criadas
- ✅ Múltiplos índices criados
- ✅ 4 foreign keys criadas

### **Após executar a VALIDAÇÃO:**
- ✅ `tabelas_criadas` = 6
- ✅ `indices_criados` = 10+ (aproximadamente)
- ✅ `foreign_keys` = 4

---

## 🎯 INSTRUÇÕES PASSO A PASSO

1. **Acesse:** https://supabase.com → Seu Projeto
2. **Vá em:** SQL Editor → New Query
3. **Cole o SQL do PASSO 1** → Clique em "Run"
4. **Aguarde** → Deve aparecer "Success. No rows returned"
5. **Cole o SQL do PASSO 2** → Clique em "Run"
6. **Verifique os resultados** → Deve mostrar 6 tabelas criadas

---

## ✅ CHECKLIST

- [ ] SQL do PASSO 1 executado com sucesso
- [ ] SQL do PASSO 2 mostra 6 tabelas criadas
- [ ] Tabelas visíveis no Table Editor do Supabase
- [ ] Pronto para configurar variáveis no Vercel

---

**Arquivos criados:**
- `supabase/SETUP_COMPLETO.sql` - SQL completo para setup
- `supabase/VALIDACAO.sql` - SQL para validação

**Última atualização:** Janeiro 2025

