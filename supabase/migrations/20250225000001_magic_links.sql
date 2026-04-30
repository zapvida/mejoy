-- Tabela magic_links para tokens de acesso sem senha (Magic Link via WhatsApp)
-- Usado pós-triagem: cliente recebe link no WhatsApp e acessa dashboard em 1 clique

CREATE TABLE IF NOT EXISTS public.magic_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE,
  profile_id uuid NOT NULL,
  redirect_path text DEFAULT '/dashboard',
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_magic_links_token_hash ON public.magic_links(token_hash);
CREATE INDEX IF NOT EXISTS idx_magic_links_profile ON public.magic_links(profile_id);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON public.magic_links(expires_at);

-- Comentário para documentação
COMMENT ON TABLE public.magic_links IS 'Tokens Magic Link para acesso ao dashboard sem senha via WhatsApp';
