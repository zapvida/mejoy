# ⚠️ VALIDAÇÃO PÓS-DEPLOY - FLUXO EMAGRECIMENTO

**Status:** 🔴 **CRÍTICO - SUPABASE NECESSÁRIO EM PRODUÇÃO**

---

## 🚨 PROBLEMA IDENTIFICADO

Você deixou estas variáveis **VAZIAS** na Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=          ← VAZIO
SUPABASE_SERVICE_ROLE_KEY=         ← VAZIO
```

**⚠️ EM PRODUÇÃO, O FLUXO NÃO FUNCIONA SEM SUPABASE!**

O código tem fallback apenas para desenvolvimento. Em produção, você **PRECISA** configurar Supabase.

---

## ✅ O QUE ESTÁ FUNCIONANDO

### ✅ Funciona SEM Supabase:
- **LPAC** (`/emagrecimento`) - Página estática, funciona sempre

### ❌ NÃO Funciona SEM Supabase:
- **Triagem** (`/triagem/emagrecimento`) - Precisa criar sessões
- **Relatório** (`/emagrecimento/relatorio`) - Precisa buscar dados salvos
- **Checkout** - Precisa do `reportId` da triagem

---

## 🔧 O QUE VOCÊ PRECISA FAZER AGORA

### 1. Configurar Supabase (OBRIGATÓRIO)

**Opção A: Criar novo projeto Supabase**
1. Acesse: https://supabase.com
2. Crie um novo projeto
3. Vá em Settings → API
4. Copie:
   - **Project URL** → Cole em `NEXT_PUBLIC_SUPABASE_URL`
   - **Service Role Key** → Cole em `SUPABASE_SERVICE_ROLE_KEY`

**Opção B: Usar projeto existente**
- Se já tem um projeto Supabase, use as credenciais dele

### 2. Executar Migrações no Supabase

Após configurar as envs, você precisa criar as tabelas:

```sql
-- Execute no Supabase SQL Editor

-- Tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT UNIQUE,
  name TEXT,
  sex TEXT,
  whatsapp TEXT,
  email TEXT,
  birth_date DATE,
  weight_kg NUMERIC,
  height_cm NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de sessões de triagem
CREATE TABLE IF NOT EXISTS triage_sessions (
  triage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id TEXT,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  triage_slug TEXT NOT NULL,
  answers JSONB DEFAULT '{}',
  profile_snapshot JSONB,
  progress_percent INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_triage_sessions_client_id ON triage_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_triage_sessions_slug ON triage_sessions(triage_slug);

-- Tabela de relatórios
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  triage_id UUID UNIQUE REFERENCES triage_sessions(triage_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  report_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
```

### 3. Atualizar Envs na Vercel

Vá em Vercel Dashboard → Settings → Environment Variables e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (chave completa)
```

### 4. Redeploy

Após preencher as envs, faça redeploy na Vercel.

---

## ✅ CHECKLIST DE VALIDAÇÃO

### Envs Obrigatórias (Preencha todas!)

- [ ] `OPENAI_API_KEY` - ✅ Preenchida?
- [ ] `STRIPE_SECRET_KEY` - ✅ Preenchida?
- [ ] `STRIPE_PRICE_ZAPFARM_MENSAL` - ✅ Preenchida?
- [ ] `STRIPE_PRICE_ZAPFARM_TRIMESTRAL` - ✅ Preenchida?
- [ ] `STRIPE_PRICE_ZAPFARM_SEMESTRAL` - ✅ Preenchida?
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - ⚠️ **PRECISA PREENCHER**
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - ⚠️ **PRECISA PREENCHER**
- [ ] `NEXT_PUBLIC_BASE_URL` - ✅ Preenchida?
- [ ] `NEXT_PUBLIC_SITE_URL` - ✅ Preenchida?

### Validação do Fluxo

Após configurar tudo, teste:

1. **LPAC**
   ```
   https://seu-dominio.com.br/emagrecimento
   ```
   ✅ Deve carregar sem erros

2. **Triagem**
   ```
   https://seu-dominio.com.br/triagem/emagrecimento
   ```
   ✅ Deve criar sessão e permitir responder perguntas
   ⚠️ Se der erro 500, Supabase não está configurado

3. **Relatório**
   ```
   Após completar triagem, deve redirecionar para:
   https://seu-dominio.com.br/emagrecimento/relatorio?id={triageId}
   ```
   ✅ Deve mostrar relatório gerado pela IA
   ⚠️ Se der "Ambiente não configurado", Supabase não está configurado

4. **Checkout**
   ```
   No relatório, clique em "Ver planos"
   ```
   ✅ Deve mostrar os 3 planos
   ✅ Ao clicar em "Assinar", deve criar sessão Stripe

---

## 🎯 RESUMO

### ✅ Está funcionando:
- LPAC (página estática)
- Envs básicas configuradas

### ⚠️ Precisa fazer:
1. **Configurar Supabase** (obrigatório para produção)
2. **Criar tabelas no Supabase** (SQL acima)
3. **Preencher envs vazias** na Vercel
4. **Redeploy**
5. **Testar fluxo completo**

---

## 🚀 PRÓXIMOS PASSOS

1. **AGORA:** Configure Supabase e preencha as envs vazias
2. **DEPOIS:** Execute as migrações SQL no Supabase
3. **DEPOIS:** Redeploy na Vercel
4. **DEPOIS:** Teste o fluxo completo

---

**⚠️ SEM SUPABASE, O FLUXO NÃO FUNCIONA EM PRODUÇÃO!**

