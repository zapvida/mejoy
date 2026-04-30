-- Migração para rate limiting
-- Criar tabela para controlar quota de API por client_id

create table if not exists public.api_quota (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  endpoint text not null,
  ts timestamptz not null default now()
);

-- Índice composto para consultas eficientes por client_id, endpoint e timestamp
create index if not exists api_quota_idx on public.api_quota(client_id, endpoint, ts desc);

-- Índice para limpeza de registros antigos
create index if not exists api_quota_ts_idx on public.api_quota(ts);
