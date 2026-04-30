# Validação ENVs e Próximos Passos

## Envs já configuradas (Vercel) ✅

| Categoria | Variáveis | Status |
|-----------|-----------|--------|
| **Asaas** | ASAAS_API_KEY, ASAAS_ENVIRONMENT, ASAAS_PRICE_* (todos produtos) | ✅ |
| **Supabase** | NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY | ✅ |
| **Site** | NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_SITE_URL | ✅ |
| **Email** | RESEND_API_KEY, EMAIL_FROM, EMAIL_REPLY_TO | ✅ |
| **Outros** | OPENAI_API_KEY, AI_REPORT_ENABLED, WEBHOOK_ASAAS_URL, DATABASE_URL, NEXTAUTH_* | ✅ |

---

## Envs faltantes (se quiser Evolution WhatsApp)

| Variável | Valor sugerido | Onde adicionar |
|----------|----------------|----------------|
| EVOLUTION_MAGIC_LINK_ENABLED | `true` | Vercel → Settings → Environment Variables |
| EVOLUTION_API_URL | `https://sua-evolution-api.com` | (URL da sua Evolution API) |
| EVOLUTION_INSTANCE | `mejoy` | (nome da instância) |
| EVOLUTION_API_KEY | `sua-chave` | (chave da API) |

**Comando CLI (copiar/colar):**
```bash
vercel env add EVOLUTION_MAGIC_LINK_ENABLED production
# digite: true

vercel env add EVOLUTION_API_URL production
# digite: https://SUA_URL_EVOLUTION

vercel env add EVOLUTION_INSTANCE production
# digite: mejoy

vercel env add EVOLUTION_API_KEY production
# digite: sua_chave_secreta
```
*Se não tiver Evolution ainda, pode pular — o resto funciona sem.*

---

## 1. Migration Supabase (copiar/colar)

Supabase Dashboard → SQL Editor → New query:

```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS checkout_cache jsonb DEFAULT '{}'::jsonb;
COMMENT ON COLUMN public.profiles.checkout_cache IS 'Dados de checkout: CPF, CEP, endereço (never repeat)';
```

---

## 2. Checklist de validação (marcar ao testar)

```
[ ] 1. Triagem completa (ex: /triagem/emagrecimento)
[ ] 2. Nome, email, WhatsApp preenchidos → relatório gerado
[ ] 3. CTA "Ver Produtos" → checkout abre com dados preenchidos
[ ] 4. PIX: QR Code ou link aparece
[ ] 5. Cartão: formulário ou redirecionamento OK
[ ] 6. Mejoy.com.br carrega sem erro 500
[ ] 7. Admin /admin acessível (se Magic Link configurado)
```

---

## 3. Webhook Asaas (se ainda não configurou)

Asaas Dashboard → Configurações → Webhooks:

- **URL:** `https://mejoy.com.br/api/asaas/webhook`
- **Eventos:** PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE

---

## Resumo

**Produção pronta:** Asaas, Supabase, checkout, emails.  
**Opcional:** Evolution (WhatsApp pós-triagem) — adicionar 4 envs.  
**Ação imediata:** Rodar migration `checkout_cache` no Supabase.
