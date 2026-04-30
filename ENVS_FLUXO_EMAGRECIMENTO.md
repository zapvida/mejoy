# 🔐 VARIÁVEIS DE AMBIENTE - FLUXO EMAGRECIMENTO COMPLETO

**Data:** Janeiro 2025  
**Fluxo:** LPAC → Triagem → Checkout  
**Status:** ⚠️ CONFIGURAÇÃO NECESSÁRIA

---

## 📋 RESUMO EXECUTIVO

Para rodar o fluxo completo de emagrecimento (LPAC até checkout), você precisa configurar as seguintes variáveis de ambiente:

### ✅ OBRIGATÓRIAS (Fluxo não funciona sem elas)
1. **OPENAI_API_KEY** - Para geração de relatórios pela IA
2. **STRIPE_SECRET_KEY** - Para processar pagamentos
3. **STRIPE_PRICE_ZAPFARM_MENSAL** - Preço mensal
4. **STRIPE_PRICE_ZAPFARM_TRIMESTRAL** - Preço trimestral  
5. **STRIPE_PRICE_ZAPFARM_SEMESTRAL** - Preço semestral

### ⚠️ OPCIONAIS (Funciona sem, mas com limitações)
6. **NEXT_PUBLIC_SUPABASE_URL** - Para persistir sessões de triagem
7. **SUPABASE_SERVICE_ROLE_KEY** - Para operações server-side
8. **AI_REPORT_ENABLED** - Ativa geração de relatórios pela IA (padrão: "1")

---

## 🔧 CONFIGURAÇÃO DETALHADA

### 1. OPENAI_API_KEY (OBRIGATÓRIA)

**O que faz:** Gera relatórios personalizados usando IA baseada nas respostas da triagem.

**Como obter:**
1. Acesse https://platform.openai.com/api-keys
2. Crie uma nova API key
3. Copie a chave (formato: `sk-proj-...`)

**Configuração:**
```bash
OPENAI_API_KEY=sk-proj-sua-chave-aqui
AI_REPORT_ENABLED=1
```

**Fallback:** Se não configurada, o sistema usa relatórios mock (sem personalização pela IA).

---

### 2. STRIPE_SECRET_KEY (OBRIGATÓRIA)

**O que faz:** Processa pagamentos no checkout.

**Como obter:**
1. Acesse https://dashboard.stripe.com/apikeys
2. Use a chave "Secret key" (formato: `sk_test_...` para teste ou `sk_live_...` para produção)

**Configuração:**
```bash
STRIPE_SECRET_KEY=sk_test_sua-chave-aqui
```

**⚠️ IMPORTANTE:** Use `sk_test_...` para desenvolvimento e `sk_live_...` apenas em produção.

---

### 3. STRIPE_PRICE_ZAPFARM_* (OBRIGATÓRIAS)

**O que faz:** Define os preços dos planos de emagrecimento.

**Como obter:**
1. Acesse https://dashboard.stripe.com/products
2. Crie produtos para cada plano (Mensal, Trimestral, Semestral)
3. Crie preços para cada produto
4. Copie os Price IDs (formato: `price_...`)

**Configuração:**
```bash
STRIPE_PRICE_ZAPFARM_MENSAL=price_1ABC123...
STRIPE_PRICE_ZAPFARM_TRIMESTRAL=price_1DEF456...
STRIPE_PRICE_ZAPFARM_SEMESTRAL=price_1GHI789...
```

**⚠️ IMPORTANTE:** 
- Use preços de TESTE (`price_...`) para desenvolvimento
- Use preços de PRODUÇÃO para ambiente real
- Configure o modo de pagamento como `payment` (pagamento único, não assinatura)

---

### 4. SUPABASE (OPCIONAL - Funciona sem em dev)

**O que faz:** Persiste sessões de triagem, respostas e relatórios.

**Como obter:**
1. Acesse https://supabase.com
2. Crie um projeto
3. Vá em Settings → API
4. Copie:
   - Project URL (formato: `https://xxxxx.supabase.co`)
   - Service Role Key (formato: `eyJhbGc...`)

**Configuração:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**Fallback:** Em desenvolvimento (`NODE_ENV=development`), o sistema funciona sem Supabase usando sessões mock em memória. Em produção, Supabase é necessário.

---

## 📝 ARQUIVO .env.local COMPLETO

Crie um arquivo `.env.local` na raiz do projeto com:

```bash
# ============================================
# CORE - CONFIGURAÇÃO BÁSICA
# ============================================
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ============================================
# IA - GERAÇÃO DE RELATÓRIOS (OBRIGATÓRIA)
# ============================================
OPENAI_API_KEY=sk-proj-sua-chave-openai-aqui
AI_REPORT_ENABLED=1
MOCK_AI=0

# ============================================
# STRIPE - CHECKOUT (OBRIGATÓRIAS)
# ============================================
STRIPE_SECRET_KEY=sk_test_sua-chave-stripe-aqui

# Preços ZapFarm (OBRIGATÓRIOS)
STRIPE_PRICE_ZAPFARM_MENSAL=price_1ABC123...
STRIPE_PRICE_ZAPFARM_TRIMESTRAL=price_1DEF456...
STRIPE_PRICE_ZAPFARM_SEMESTRAL=price_1GHI789...

# ============================================
# SUPABASE - TRIAGENS (OPCIONAL EM DEV)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# ============================================
# FEATURE FLAGS
# ============================================
NEXT_PUBLIC_TRIAGE_GI_ENHANCED=1
NEXT_PUBLIC_SHOW_PARTNER_CTAS=1
```

---

## 🚀 CONFIGURAÇÃO NO VERCEL

Se você vai fazer deploy na Vercel, adicione todas as variáveis acima no dashboard:

1. Acesse: Vercel Dashboard → Seu Projeto → Settings → Environment Variables
2. Adicione cada variável para os ambientes:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

**⚠️ IMPORTANTE:** 
- Use valores de TESTE para Preview/Development
- Use valores de PRODUÇÃO apenas para Production
- Nunca commite o arquivo `.env.local` no git

---

## ✅ CHECKLIST DE VALIDAÇÃO

Antes de rodar o fluxo, verifique:

- [ ] `OPENAI_API_KEY` configurada e válida
- [ ] `STRIPE_SECRET_KEY` configurada (teste ou live)
- [ ] `STRIPE_PRICE_ZAPFARM_MENSAL` configurado
- [ ] `STRIPE_PRICE_ZAPFARM_TRIMESTRAL` configurado
- [ ] `STRIPE_PRICE_ZAPFARM_SEMESTRAL` configurado
- [ ] `AI_REPORT_ENABLED=1` (ou omitida, padrão é 1)
- [ ] (Opcional) `NEXT_PUBLIC_SUPABASE_URL` configurada
- [ ] (Opcional) `SUPABASE_SERVICE_ROLE_KEY` configurada

---

## 🔍 COMO TESTAR

### 1. Testar LPAC
```bash
# Acesse: http://localhost:3000/emagrecimento
# Deve carregar a landing page sem erros
```

### 2. Testar Triagem
```bash
# Acesse: http://localhost:3000/triagem/emagrecimento
# Deve criar uma sessão e permitir responder perguntas
# Ao finalizar, deve gerar relatório (com IA se OPENAI_API_KEY configurada)
```

### 3. Testar Checkout
```bash
# Após completar triagem, clique em "Ver planos"
# Deve redirecionar para /emagrecimento/checkout
# Deve mostrar os 3 planos (mensal, trimestral, semestral)
# Ao clicar em "Assinar", deve criar sessão Stripe
```

---

## 🐛 TROUBLESHOOTING

### Erro: "OPENAI_API_KEY não configurada"
**Solução:** Adicione `OPENAI_API_KEY` no `.env.local` e reinicie o servidor.

### Erro: "Plano inválido" no checkout
**Solução:** Verifique se `STRIPE_PRICE_ZAPFARM_*` estão configurados corretamente.

### Erro: "Supabase não configurado"
**Solução:** Em desenvolvimento, isso é normal. O sistema funciona sem Supabase. Em produção, configure Supabase.

### Relatório não é gerado pela IA
**Solução:** 
1. Verifique se `OPENAI_API_KEY` está configurada
2. Verifique se `AI_REPORT_ENABLED=1`
3. Verifique logs do servidor para erros da API OpenAI

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- [Fluxo de Triagem](./src/pages/triagem/[slug].tsx)
- [API de Checkout](./src/pages/api/stripe/zapfarm-checkout.ts)
- [Geração de Relatórios IA](./src/lib/ai/index.ts)
- [LPAC Emagrecimento](./src/pages/emagrecimento.tsx)

---

**Última atualização:** Janeiro 2025

