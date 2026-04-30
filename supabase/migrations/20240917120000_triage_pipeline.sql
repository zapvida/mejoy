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
