# 🔧 CORREÇÃO DEFINITIVA - DIRECT_URL

**Erro Identificado:** `FATAL: Tenant or user not found`

**Causa Raiz:** Prisma está tentando usar `DATABASE_URL` (pooler/pgbouncer) para operações de escrita, quando deveria usar `DIRECT_URL` (conexão direta).

---

## ✅ CORREÇÃO APLICADA

1. ✅ Validação explícita do Prisma Client
2. ✅ Verificação se `brandingDraft` existe
3. ✅ Mensagens de erro específicas para cada caso
4. ✅ Hint sobre `DIRECT_URL` quando falhar

---

## ⚠️ VERIFICAÇÃO NECESSÁRIA NO VERCEL

**Vercel Dashboard → Settings → Environment Variables → Production**

Confirme que `DIRECT_URL` está configurada corretamente:

```
DIRECT_URL=postgresql://your_user:your_password@your_host:5432/your_database
```

**Importante:**
- ✅ Porta **5432** (não 6543)
- ✅ Sem `?pgbouncer=true`
- ✅ Com senha correta (DdVu8MWxAGTXUT3P)

---

## 🧪 TESTE APÓS DEPLOY

Após o deploy completar (2-3 min):

```bash
curl -s -X POST "https://aistotele.com/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Teste","brandColor":"#10b981","accentColor":"#059669","ctaText":"Teste","ctaUrl":"https://wa.me/123"}' | jq '.'
```

**Se ainda falhar, verifique:**
1. `DIRECT_URL` está setada no Vercel (Production)
2. `DIRECT_URL` usa porta 5432 (não 6543)
3. Senha está correta

---

**Aguardando deploy completar para testar!**

