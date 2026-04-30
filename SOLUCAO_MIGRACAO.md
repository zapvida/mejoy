# 🚨 SOLUÇÃO IMEDIATA - APLICAR MIGRAÇÃO SQL

## ❌ PROBLEMA IDENTIFICADO
O erro `Could not find the table 'public.triage_sessions'` acontece porque as tabelas do novo sistema de triagem não foram criadas no Supabase.

## ✅ SOLUÇÃO RÁPIDA

### 1. **Acesse o Painel do Supabase**
- Vá para [supabase.com](https://supabase.com)
- Faça login na sua conta
- Selecione o projeto correto

### 2. **Abra o SQL Editor**
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New query"**

### 3. **Execute o SQL Abaixo**
Copie e cole **TODO** o código SQL abaixo no editor e clique em **"Run"**:

```sql
-- Triagem resiliente: profiles, triage_sessions, triage_steps, reports

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  client_id text unique,
  name text,
  email text,
  whatsapp text,
  sex text check (sex in ('male','female','undisclosed')),
  birth_date date,
  weight_kg numeric,
  height_cm numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.triage_sessions (
  triage_id uuid primary key default gen_random_uuid(),
  client_id text,
  profile_id uuid references public.profiles(id) on delete set null,
  triage_slug text not null,
  answers jsonb default '{}'::jsonb,
  profile_snapshot jsonb,
  progress_percent integer default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists triage_sessions_client_idx on public.triage_sessions(client_id);
create index if not exists triage_sessions_slug_idx on public.triage_sessions(triage_slug);

create table if not exists public.triage_steps (
  triage_id uuid references public.triage_sessions(triage_id) on delete cascade,
  step_key text,
  answer jsonb,
  updated_at timestamptz default now(),
  primary key (triage_id, step_key)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  triage_id uuid unique references public.triage_sessions(triage_id) on delete cascade,
  status text check (status in ('pending','running','completed','failed')) default 'pending',
  sections jsonb,
  summary text,
  audio_url text,
  error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists reports_status_idx on public.reports(status);
```

### 4. **Verificar se Funcionou**
Após executar o SQL, você deve ver uma mensagem de sucesso. 

### 5. **Testar o Sistema**
- Volte para o terminal onde está rodando `pnpm dev`
- Acesse `http://localhost:3000/triagem/gastro`
- O erro deve ter desaparecido e a triagem deve funcionar!

## 🎯 RESULTADO ESPERADO

Após aplicar a migração:
- ✅ Tabela `profiles` criada
- ✅ Tabela `triage_sessions` criada  
- ✅ Tabela `triage_steps` criada
- ✅ Tabela `reports` criada
- ✅ Índices otimizados criados
- ✅ Sistema de triagem funcionando perfeitamente

## 🔧 SE AINDA DER ERRO

Se ainda houver problemas após aplicar a migração:

1. **Verifique as variáveis de ambiente** no `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui
   ```

2. **Reinicie o servidor de desenvolvimento**:
   ```bash
   # Pare o servidor (Ctrl+C) e rode novamente:
   pnpm dev
   ```

3. **Verifique se as tabelas foram criadas** no Supabase:
   - Vá em **"Table Editor"** no painel do Supabase
   - Você deve ver as 4 novas tabelas listadas

## 🎉 APÓS APLICAR A MIGRAÇÃO

O sistema estará 100% funcional com:
- ✅ Triagem no formato Typeform
- ✅ Persistência de dados
- ✅ Retomada de sessões
- ✅ Geração de relatórios com áudio
- ✅ Todas as 17 triagens funcionando

**Execute o SQL acima e o sistema funcionará perfeitamente!** 🚀
