# Próximos passos manuais após o deploy

**Data:** 25 de fevereiro de 2025  
**Deploy:** Push enviado para `zapfarmx/zapfarm` → Vercel `monjoy-mejoy/zapfarm`  
**Domínio produção:** mejoy.com.br

---

## 1. Verificar o deploy na Vercel

1. Acesse: https://vercel.com/monjoy-mejoy/zapfarm/deployments  
2. Confira se há um deploy **Building** ou **Ready** do commit mais recente  
3. Aguarde até o status ficar **Ready** (verde)

---

## 2. Executar migration no Supabase

Para que o checkout “never repeat” funcione, execute a migration:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard) do projeto mejoy  
2. Vá em **SQL Editor** → **New query**  
3. Cole e execute:

```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS checkout_cache jsonb DEFAULT '{}'::jsonb;
COMMENT ON COLUMN public.profiles.checkout_cache IS 'Cache de dados de checkout: CPF, CEP, endereço';
```

---

## 3. Validar variáveis de ambiente na Vercel

1. Acesse: https://vercel.com/monjoy-mejoy/zapfarm/settings/environment-variables  
2. Confirme que estão configuradas:

| Variável | Uso |
|----------|-----|
| `ASAAS_API_KEY` | Pagamentos PIX e cartão |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase |
| `EVOLUTION_MAGIC_LINK_ENABLED` | Ativar WhatsApp pós-triagem (`true` ou `1`) |
| `EVOLUTION_API_URL` | Base URL da Evolution API |
| `EVOLUTION_INSTANCE` | Nome da instância (ex: mejoy) |
| `EVOLUTION_API_KEY` | Chave da Evolution API |
| `NEXT_PUBLIC_BASE_URL` ou `NEXT_PUBLIC_SITE_URL` | URL do site (ex: https://mejoy.com.br) |

---

## 4. Testes manuais de validação

### A) Triagem → Relatório → Checkout

1. Abra **mejoy.com.br** em aba anônima  
2. Faça uma triagem (ex: `/triagem/emagrecimento`) até o fim  
3. Preencha nome, email e WhatsApp no ProfileDataCollector  
4. Confirme que o relatório é gerado  
5. Clique em **Ver Produtos** ou **Quero receber este protocolo**  
6. Verifique se o checkout abre com **nome, email e telefone preenchidos**

### B) PIX

1. No checkout, escolha **PIX**  
2. Gere o pagamento  
3. Verifique se o **QR Code** ou o **link de pagamento** aparece  
4. (Opcional) Teste um pagamento real em modo sandbox do Asaas

### C) Cartão

1. No checkout, escolha **Cartão**  
2. Preencha os dados e finalize  
3. Confirme redirecionamento ou confirmação na tela

### D) Evolution WhatsApp (se configurado)

1. Com `EVOLUTION_MAGIC_LINK_ENABLED=true` e Evolution API ativa  
2. Conclua uma triagem com WhatsApp válido  
3. Verifique se recebe a mensagem com o **Magic Link** para o painel

---

## 5. Corrigir o erro do Vercel CLI (opcional)

Se `vercel env ls` ou outros comandos derem erro:

```bash
rm -rf .vercel
vercel link
```

Escolha:
- **Scope:** monjoy-mejoy (ou a org correta)
- **Project:** zapfarm

Depois disso, `vercel env ls` deve funcionar.

---

## 6. Webhook Asaas

Se ainda não configurou:

1. Acesse o [Asaas Dashboard](https://www.asaas.com/)  
2. Configurações → Webhooks  
3. Adicione: `https://mejoy.com.br/api/asaas/webhook`  
4. Eventos sugeridos: PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE

---

## Resumo do que foi deployado

- Admin: Magic Link, Leads, KPIs  
- Evolution API: mensagem WhatsApp pós-triagem  
- Funnel e métricas no admin  
- Migrations: magic_links, lead_funnel_steps  

*Obs: As alterações de checkout inteligente (session-by-id, checkout-data, never repeat) precisam das novas APIs e da migration `checkout_cache` – se ainda não foram incluídas, será necessário um novo deploy.*
