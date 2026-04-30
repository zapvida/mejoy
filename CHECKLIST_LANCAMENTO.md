# ✅ CHECKLIST LANÇAMENTO - ZAPFARM
## Passo a Passo Sucinto

**Status Atual:** ✅ 95% Pronto  
**Tempo Estimado:** ~30 minutos

---

## 🚀 PASSO A PASSO PARA LANÇAR

### **1. QA Manual (15 min)** ⚠️ OBRIGATÓRIO

Testar **3 produtos** completos no localhost:

```bash
# Iniciar servidor local
pnpm dev
```

**Testar cada produto:**
- [ ] Acessar `http://localhost:3000/[produto]` (ex: `/calvicie`)
- [ ] Clicar em "Verificar elegibilidade" → vai para triagem
- [ ] Preencher triagem completa
- [ ] Ver relatório gerado
- [ ] Ir para checkout (modo teste Stripe)
- [ ] Verificar página obrigado
- [ ] Verificar Dashboard mostra dados
- [ ] Verificar Relatórios lista o relatório
- [ ] Verificar Perfil mostra dados corretos

**Produtos para testar:**
1. ✅ `emagrecimento` (já validado)
2. ⚠️ `calvicie` (testar agora)
3. ⚠️ `sono` (testar agora)

---

### **2. Migration Local (2 min)**

```bash
cd /Users/teobeckert/desenvolvimento/zapfarm
pnpm prisma migrate dev --name add_profile_to_zapfarm_order
```

**O que faz:** Adiciona campo `profileId` na tabela `zapfarm_orders`

---

### **3. Git Commit (3 min)**

```bash
git add .
git commit -m "feat: integrar dashboard e perfil ZapFarm com dados reais"
git push origin main
```

**Aguardar:** Deploy automático na Vercel completar (~5 min)

---

### **4. Verificar Envs na Vercel (5 min)**

Acessar: https://vercel.com → Projeto ZapFarm → Settings → Environment Variables

**Verificar se estão configuradas:**
- [ ] `DATABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET_ZAPFARM`
- [ ] `STRIPE_PRICE_*` (30 envs - 10 produtos × 3 planos)

**Se faltar alguma:** Adicionar agora

---

### **5. Migration Produção (2 min)**

Após deploy completar, rodar migration em produção:

```bash
# Opção 1: Via Vercel CLI
vercel env pull
pnpm prisma migrate deploy

# Opção 2: Via terminal do servidor (se tiver acesso SSH)
pnpm prisma migrate deploy
```

**O que faz:** Aplica migration no banco de produção

---

### **6. Verificar Stripe Webhook (2 min)**

Acessar: https://dashboard.stripe.com → Webhooks

**Verificar:**
- [ ] Webhook apontando para: `https://seu-dominio.com/api/stripe/zapfarm-webhook`
- [ ] Evento `checkout.session.completed` está ativo
- [ ] Webhook está recebendo eventos (testar se necessário)

---

### **7. Smoke Test Produção (10 min)**

Acessar domínio real: `https://seu-dominio.com`

**Testar 1 produto completo:**
- [ ] Acessar `/protocolos` → ver os 10 produtos
- [ ] Clicar em 1 produto (ex: `/calvicie`)
- [ ] Fazer triagem completa
- [ ] Ver relatório gerado
- [ ] Fazer checkout (cartão teste: `4242 4242 4242 4242`)
- [ ] Verificar Dashboard mostra pedido
- [ ] Verificar Relatórios lista relatório
- [ ] Verificar Perfil mostra dados

**Se tudo funcionar:** ✅ **PRONTO PARA LANÇAR!**

---

## 📋 RESUMO RÁPIDO

```
1. QA Manual (3 produtos)      → 15 min
2. Migration Local              → 2 min
3. Git Commit + Push            → 3 min
4. Verificar Envs Vercel        → 5 min
5. Migration Produção            → 2 min
6. Verificar Stripe Webhook     → 2 min
7. Smoke Test Produção           → 10 min
─────────────────────────────────────────
TOTAL:                           ~40 min
```

---

## ✅ CRITÉRIO DE SUCESSO

**Considerar PRONTO quando:**
- ✅ QA manual passou (3 produtos)
- ✅ Migration local rodou sem erros
- ✅ Deploy completou sem erros
- ✅ Migration produção rodou sem erros
- ✅ Smoke test produção passou (1 produto completo)
- ✅ Dashboard/Relatórios/Perfil funcionando

---

## 🆘 SE ALGO DER ERRADO

**Erro na migration:**
- Verificar `DATABASE_URL` está correto
- Verificar conexão com banco
- Rodar `pnpm prisma migrate status` para ver estado

**Erro no deploy:**
- Verificar logs na Vercel
- Verificar envs estão todas configuradas
- Verificar build local passa (`pnpm build`)

**Erro no webhook:**
- Verificar URL do webhook está correta
- Verificar `STRIPE_WEBHOOK_SECRET_ZAPFARM` está correto
- Testar webhook manualmente no Stripe Dashboard

---

## 🎉 PRONTO!

Após completar todos os passos acima, o ZapFarm estará **100% pronto para lançamento oficial**.

**Documentação completa:** `RELATORIO_FINAL_LANCAMENTO.md`

