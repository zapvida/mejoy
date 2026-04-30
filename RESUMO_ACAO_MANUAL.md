# 📋 RESUMO - O QUE FAZER MANUALMENTE

**Data:** 4 de novembro de 2025  
**Tempo estimado:** 30-45 minutos

---

## ✅ O QUE JÁ ESTÁ PRONTO

- ✅ Código 100% implementado
- ✅ Validação local: todos os checks passaram
- ✅ Prisma Client gerado
- ✅ Migração SQL criada
- ✅ Token de segurança gerado: `5cfad740627ac1deb7cc39806de6199bd3bfe1a2521466b2cd1004b51fec9d3c`

---

## 🎯 ORDEM DE EXECUÇÃO (FAZER NA ORDEM)

### 1️⃣ Supabase - Migração SQL (5 min)

**Arquivo:** `prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql`

1. Abrir: https://supabase.com/dashboard → Seu projeto → **SQL Editor**
2. Abrir arquivo `prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql`
3. **Copiar TODO o conteúdo**
4. Colar no SQL Editor
5. Clicar **Run** (F5)
6. Verificar: "Success. No rows returned"

**Depois:** Configurar Storage → Criar bucket `public` → Política de leitura pública

---

### 2️⃣ Vercel - ENVs (10 min)

**Vercel Dashboard → Settings → Environment Variables → Production**

**Adicionar estas ENVs (copiar e colar):**

```bash
# Token de segurança (USAR O VALOR GERADO)
CLEANUP_CRON_TOKEN=5cfad740627ac1deb7cc39806de6199bd3bfe1a2521466b2cd1004b51fec9d3c

# Supabase (CRÍTICO - se não tiver)
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Do dashboard do Supabase

# Outras ENVs (se já não tiverem)
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_ROOT_B2B_DOMAINS=aistotele.com,www.aistotele.com
```

---

### 3️⃣ Vercel - Wildcard DNS (5 min)

**Vercel → Settings → Domains**

1. Adicionar: `aistotele.app`
2. Habilitar: **Wildcard Subdomains** (toggle)
3. Verificar: domínio aparece como "Valid"

---

### 4️⃣ Deploy (5 min)

```bash
git add .
git commit -m "feat: Lote H+I completo - pronto para lançamento"
git push origin main
```

**Aguardar:** 3-5 min (Vercel faz deploy automático)

---

### 5️⃣ Validação (15 min)

#### Teste rápido:
```bash
# Smoke
BASE_URL=https://www.aistotele.com pnpm smoke:prod

# E2E
BASE_URL=https://www.aistotele.com pnpm e2e:prod

# Cron
curl -X POST \
  -H "x-cron-token: 5cfad740627ac1deb7cc39806de6199bd3bfe1a2521466b2cd1004b51fec9d3c" \
  https://www.aistotele.com/api/cron/cleanup
```

#### Teste manual:
1. Acessar `https://www.aistotele.com`
2. Clicar "Personalizar agora (grátis)"
3. Configurar (logo, cores, nome)
4. Assinar → Checkout → Pagar
5. Verificar: Tenant criado, Draft deletado, URL provisória funciona

---

## ✅ APÓS CONCLUIR

**Se tudo passar → GO para lançamento!** 🚀

**Se algo falhar → Consulte `RELATORIO_FINAL_DEPLOY.md` → Runbook de Suporte**

---

## 📞 VALORES IMPORTANTES

- **Token Cron:** `5cfad740627ac1deb7cc39806de6199bd3bfe1a2521466b2cd1004b51fec9d3c`
- **Migração SQL:** `prisma/migrations/20241104_add_branding_draft_and_tenant/migration.sql`
- **Domínio Wildcard:** `aistotele.app`

---

**Próxima ação:** Executar passo 1 (Supabase) agora.

