# 📊 Status da Configuração do Supabase

## ✅ O QUE JÁ ESTÁ PRONTO

### 1. **Migrações SQL Criadas** ✅
- ✅ Arquivo: `supabase/migrations/20240917120000_triage_pipeline.sql`
- ✅ Contém todas as tabelas necessárias:
  - `profiles` - Perfis de usuários
  - `triage_sessions` - Sessões de triagem (com `profile_snapshot` JSONB)
  - `triage_steps` - Passos individuais da triagem
  - `reports` - Relatórios gerados

### 2. **Código Preparado** ✅
- ✅ Código já usa Supabase corretamente
- ✅ Suporta modo mock em desenvolvimento (sem Supabase)
- ✅ Retorna erro claro em produção sem Supabase

### 3. **Variáveis de Ambiente Definidas** ✅
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto Supabase
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço (server-side)

---

## ⚠️ O QUE PRECISA SER FEITO

### **PASSO 1: Criar Tabelas no Supabase** ⚠️

**As migrações SQL existem, mas precisam ser executadas manualmente no Supabase.**

#### Como fazer:

1. **Acesse o Supabase Dashboard:**
   - Vá para: https://supabase.com
   - Faça login e selecione seu projeto

2. **Abra o SQL Editor:**
   - Clique em **"SQL Editor"** no menu lateral
   - Clique em **"New query"**

3. **Execute este SQL completo:**

```sql
-- Sistema de Triagem - Migração Completa
-- Execute este SQL completo no Supabase SQL Editor

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

CREATE INDEX IF NOT EXISTS triage_sessions_client_idx ON public.triage_sessions(client_id);
CREATE INDEX IF NOT EXISTS triage_sessions_slug_idx ON public.triage_sessions(triage_slug);

CREATE TABLE IF NOT EXISTS public.triage_steps (
  triage_id uuid REFERENCES public.triage_sessions(triage_id) ON DELETE CASCADE,
  step_key text,
  answer jsonb,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (triage_id, step_key)
);

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

-- Tabela adicional para relatórios (usada pelo código atual)
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
```

4. **Clique em "Run"** para executar

5. **Verifique se as tabelas foram criadas:**
   - Vá em **"Table Editor"** no menu lateral
   - Você deve ver as tabelas: `profiles`, `triage_sessions`, `triage_steps`, `reports`, `triage_reports`

---

### **PASSO 2: Configurar Variáveis de Ambiente no Vercel** ⚠️

**As variáveis precisam estar configuradas no Vercel para produção funcionar.**

#### Como fazer:

1. **Acesse o Vercel Dashboard:**
   - Vá para: https://vercel.com/dashboard
   - Selecione o projeto **zapfarm**

2. **Vá em Settings → Environment Variables**

3. **Adicione/Verifique estas 2 variáveis:**

#### Variável 1: `NEXT_PUBLIC_SUPABASE_URL`
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://SEU_PROJETO.supabase.co`
  - Onde encontrar: Supabase Dashboard → Settings → API → Project URL
- **Environments:** ✅ Production ✅ Preview ✅ Development

#### Variável 2: `SUPABASE_SERVICE_ROLE_KEY`
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGc...` (chave completa)
  - Onde encontrar: Supabase Dashboard → Settings → API → Service Role Key (clique no olho para revelar)
- **Environments:** ✅ Production ✅ Preview ✅ Development
- ⚠️ **IMPORTANTE:** Esta chave é secreta, nunca exponha no cliente!

---

## ✅ CHECKLIST FINAL

### No Supabase:
- [ ] Tabelas criadas (`profiles`, `triage_sessions`, `triage_steps`, `reports`, `triage_reports`)
- [ ] SQL executado com sucesso
- [ ] Tabelas visíveis no Table Editor

### No Vercel:
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada
- [ ] Variáveis disponíveis em Production, Preview e Development

### Teste:
- [ ] Preencher triagem em produção
- [ ] Verificar se dados são salvos no Supabase
- [ ] Verificar se relatório é gerado corretamente

---

## 🚨 IMPORTANTE

### **Desenvolvimento Local:**
- ✅ Funciona **SEM Supabase** (modo mock)
- ✅ Usa dados fixos para testes
- ⚠️ Logs avisam quando modo mock está ativo

### **Produção:**
- ❌ **NÃO funciona sem Supabase**
- ✅ Retorna erro claro se não configurado
- ✅ Funciona perfeitamente COM Supabase configurado

---

## 📝 RESUMO

**O que já está feito:**
- ✅ Código pronto
- ✅ Migrações SQL criadas
- ✅ Suporte a modo mock

**O que você precisa fazer:**
1. ⚠️ Executar SQL no Supabase (criar tabelas)
2. ⚠️ Configurar 2 variáveis no Vercel
3. ✅ Testar em produção

**Tempo estimado:** 5-10 minutos

---

**Última atualização:** Janeiro 2025

