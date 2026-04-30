-- Migração para idempotência em relatórios
-- Criar tabela para controlar requests de relatórios e evitar duplicação

create table if not exists public.report_requests (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text unique not null,
  report_id uuid,
  created_at timestamptz not null default now()
);

-- Índice para consultas recentes por key
create index if not exists report_requests_key_idx on public.report_requests(idempotency_key);

-- Índice para consultas por report_id
create index if not exists report_requests_report_idx on public.report_requests(report_id);
