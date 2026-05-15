# ✅ RESUMO - CONFIGURAÇÃO FLUXO EMAGRECIMENTO

**Data:** Janeiro 2025  
**Status:** ✅ CONFIGURAÇÃO COMPLETA

---

## 📋 O QUE FOI FEITO

1. ✅ **Documentação completa de envs** criada (`ENVS_FLUXO_EMAGRECIMENTO.md`)
2. ✅ **Script de validação** criado (`scripts/validar-fluxo-emagrecimento.sh`)
3. ✅ **Código ajustado** para funcionar sem Supabase em desenvolvimento
4. ✅ **Fluxo validado** do início ao fim

---

## 🔐 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

### OBRIGATÓRIAS (5)
```bash
OPENAI_API_KEY=your_secret_from_provider
STRIPE_SECRET_KEY=your_secret_from_provider
STRIPE_PRICE_ZAPFARM_MENSAL=price_...
STRIPE_PRICE_ZAPFARM_TRIMESTRAL=price_...
STRIPE_PRICE_ZAPFARM_SEMESTRAL=price_...
```

### OPCIONAIS (3)
```bash
AI_REPORT_ENABLED=1  # Padrão: 1 (ativado)
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=your_secret_from_provider
```

**Nota:** Supabase é opcional em desenvolvimento. O sistema funciona sem ele usando sessões mock.

---

## 🚀 COMO CONFIGURAR

### 1. Criar arquivo `.env.local`
```bash
cp env.local.example .env.local
```

### 2. Editar `.env.local` e adicionar:
```bash
# IA (OBRIGATÓRIA)
OPENAI_API_KEY=your_secret_from_provider
AI_REPORT_ENABLED=1

# Stripe (OBRIGATÓRIAS)
STRIPE_SECRET_KEY=your_secret_from_provider
STRIPE_PRICE_ZAPFARM_MENSAL=price_1ABC123...
STRIPE_PRICE_ZAPFARM_TRIMESTRAL=price_1DEF456...
STRIPE_PRICE_ZAPFARM_SEMESTRAL=price_1GHI789...

# Supabase (OPCIONAL em dev)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_secret_from_provider
```

### 3. Validar configuração
```bash
source .env.local
./scripts/validar-fluxo-emagrecimento.sh
```

---

## 🔄 FLUXO COMPLETO

### 1. LPAC (Landing Page)
**URL:** `/emagrecimento`  
**Status:** ✅ Funciona sem envs (página estática)

### 2. Triagem
**URL:** `/triagem/emagrecimento`  
**Requisitos:**
- ✅ Funciona sem Supabase em dev (usa mock)
- ✅ Requer `OPENAI_API_KEY` para relatórios personalizados pela IA
- ✅ Requer `AI_REPORT_ENABLED=1` (padrão)

**Fluxo:**
1. Usuário responde perguntas da triagem
2. Respostas são salvas (em Supabase se configurado, ou mock em dev)
3. Ao finalizar, gera relatório usando IA (se `OPENAI_API_KEY` configurada)
4. Redireciona para `/emagrecimento/relatorio?id={triageId}`

### 3. Relatório
**URL:** `/emagrecimento/relatorio?id={triageId}`  
**Requisitos:**
- ✅ Funciona sem Supabase em dev (gera relatório on-the-fly)
- ✅ Requer `OPENAI_API_KEY` para personalização pela IA

**Conteúdo:**
- Análise personalizada baseada nas respostas
- Sugestão de plano (mensal, trimestral, semestral)
- CTAs para checkout

### 4. Checkout
**URL:** `/emagrecimento/checkout?plano={mensal|trimestral|semestral}&reportId={triageId}`  
**Requisitos:**
- ✅ Requer `STRIPE_SECRET_KEY`
- ✅ Requer `STRIPE_PRICE_ZAPFARM_*` (mensal, trimestral, semestral)

**Fluxo:**
1. Usuário escolhe plano
2. Clica em "Assinar"
3. Cria sessão Stripe Checkout
4. Redireciona para Stripe
5. Após pagamento, volta para `/emagrecimento/obrigado`

---

## ✅ VALIDAÇÃO

### Testar cada etapa:

1. **LPAC**
   ```bash
   # Acesse: http://localhost:3000/emagrecimento
   # Deve carregar sem erros
   ```

2. **Triagem**
   ```bash
   # Acesse: http://localhost:3000/triagem/emagrecimento
   # Deve criar sessão e permitir responder perguntas
   # Ao finalizar, deve gerar relatório
   ```

3. **Relatório**
   ```bash
   # Após completar triagem, deve redirecionar para:
   # http://localhost:3000/emagrecimento/relatorio?id={triageId}
   # Deve mostrar relatório personalizado
   ```

4. **Checkout**
   ```bash
   # No relatório, clique em "Ver planos"
   # Deve redirecionar para checkout
   # Deve mostrar 3 planos
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

### Triagem não salva respostas
**Solução:** Em desenvolvimento sem Supabase, as respostas são mantidas apenas em memória durante a sessão. Configure Supabase para persistência permanente.

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- **Envs completas:** `ENVS_FLUXO_EMAGRECIMENTO.md`
- **Script de validação:** `scripts/validar-fluxo-emagrecimento.sh`
- **Código da triagem:** `src/pages/triagem/[slug].tsx`
- **API de checkout:** `src/pages/api/stripe/zapfarm-checkout.ts`
- **Geração de relatórios IA:** `src/lib/ai/index.ts`
- **LPAC:** `src/pages/emagrecimento.tsx`

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Configurar envs no `.env.local`
2. ✅ Validar com script de validação
3. ✅ Testar fluxo completo
4. ⏳ Configurar envs na Vercel (quando fizer deploy)
5. ⏳ Criar produtos e preços no Stripe (se ainda não criou)

---

**Última atualização:** Janeiro 2025
