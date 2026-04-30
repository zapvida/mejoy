# 📋 RELATÓRIO DOS PRÓXIMOS PASSOS - ZAPFARM MVP

**Data:** Janeiro 2025  
**Status Atual:** Base técnica completa, falta fechar fluxo de vendas  
**Objetivo:** MVP pronto para tráfego pago (e-commerce puro)

---

## ✅ O QUE JÁ ESTÁ PRONTO (CONFIRMADO)

### 1. **Base Técnica Sólida** ✅
- ✅ Configuração centralizada em `src/config/zapfarm/products.ts` com **10 produtos completos**
- ✅ Helpers para carregar produto/planos/cores (`src/lib/zapfarm/product-loader.ts`)
- ✅ Componentes compartilhados (CTA, benefícios, FAQ, como funciona)
- ✅ LPAC dinâmica em `src/pages/[product].tsx` funcionando para todos os slugs
- ✅ API genérica de checkout `src/pages/api/stripe/product-checkout.ts`
- ✅ Emagrecimento com fluxo completo: LPAC → triagem → relatório → checkout → obrigado

### 2. **CTA da LPAC Configurado Corretamente** ✅
- ✅ Emagrecimento: CTA redireciona para `/triagem/emagrecimento` (mantém triagem obrigatória)
- ✅ Outros 9 produtos: CTA já redireciona para `/{product}/checkout` (direto para venda)

### 3. **Arquitetura Escalável** ✅
- ✅ Sistema parametrizável e reutilizável
- ✅ Cores dinâmicas por produto
- ✅ Conteúdo centralizado e fácil de editar

---

## ❌ O QUE FALTA PARA MVP (FASE 1 - VENDAS)

### **PRIORIDADE CRÍTICA: Fechar Fluxo de Vendas**

Para que todos os 10 produtos estejam prontos para tráfego pago, falta:

---

## 🎯 TAREFA 1: Criar Páginas Dinâmicas de Checkout

**Arquivo:** `src/pages/[product]/checkout.tsx`  
**Prioridade:** 🔴 CRÍTICA  
**Estimativa:** 2-3 dias  
**Status:** ❌ Não iniciado

### O que fazer:

1. **Criar estrutura base:**
   ```typescript
   // src/pages/[product]/checkout.tsx
   - Copiar estrutura de src/pages/emagrecimento/checkout.tsx
   - Adaptar para usar productConfig dinamicamente
   - Usar getProductConfig() e getProductPlans() do loader
   ```

2. **Parametrizar tudo:**
   - ✅ Cores do produto (`productConfig.colors`)
   - ✅ Planos do produto (`productConfig.plans.basico/completo/premium`)
   - ✅ Títulos e textos do produto
   - ✅ Stripe Price IDs via env vars (`process.env[plan.stripePriceId]`)

3. **Integrar com API genérica:**
   - ✅ Usar sempre `POST /api/stripe/product-checkout`
   - ✅ Enviar: `productSlug`, `planSlug`, `priceId`
   - ✅ Ler priceId do Stripe via env vars organizadas

4. **Estrutura de env vars (exemplo):**
   ```env
   STRIPE_PRICE_CALVICIE_BASICO=price_xxx
   STRIPE_PRICE_CALVICIE_COMPLETO=price_xxx
   STRIPE_PRICE_CALVICIE_PREMIUM=price_xxx
   STRIPE_PRICE_SONO_BASICO=price_xxx
   STRIPE_PRICE_SONO_COMPLETO=price_xxx
   STRIPE_PRICE_SONO_PREMIUM=price_xxx
   # ... repetir para todos os 9 produtos
   ```

5. **Upsell ZapVida (opcional):**
   - Adicionar seção/box no checkout:
   - "Adicionar opção de falar com um médico online (ZapVida) por R$ 49 – opcional"
   - Inicialmente pode ser apenas um link claro no "Obrigado"
   - Botão: "Quero falar com um médico agora" → `https://zapvida.com/assinatura?utm_source=zapfarm`

### Checklist:
- [ ] Criar arquivo `src/pages/[product]/checkout.tsx`
- [ ] Implementar GetStaticPaths e GetStaticProps
- [ ] Carregar productConfig dinamicamente
- [ ] Adaptar formulário de dados (nome, email, telefone, endereço)
- [ ] Integrar seleção de planos (básico/completo/premium)
- [ ] Conectar com API `/api/stripe/product-checkout`
- [ ] Implementar leitura de env vars para Stripe Price IDs
- [ ] Adicionar upsell ZapVida (opcional)
- [ ] Testar responsividade mobile
- [ ] Validar fluxo completo de checkout

---

## 🎯 TAREFA 2: Criar Páginas Dinâmicas de Obrigado

**Arquivo:** `src/pages/[product]/obrigado.tsx`  
**Prioridade:** 🔴 CRÍTICA  
**Estimativa:** 1 dia  
**Status:** ❌ Não iniciado

### O que fazer:

1. **Criar estrutura base:**
   ```typescript
   // src/pages/[product]/obrigado.tsx
   - Copiar estrutura de src/pages/emagrecimento/obrigado.tsx
   - Adaptar para usar productConfig dinamicamente
   ```

2. **Parametrizar conteúdo:**
   - ✅ Cores do produto (`productConfig.colors`)
   - ✅ Título e textos específicos do produto
   - ✅ Próximos passos adaptados ao produto
   - ✅ Call-to-action para suporte (WhatsApp/e-mail)

3. **Blocos essenciais:**
   - Confirmação do pedido
   - Próximos passos (como usar o produto, prazo médio)
   - Link para upsell ZapVida (se não foi feito no checkout)
   - Informações de contato/suporte

### Checklist:
- [ ] Criar arquivo `src/pages/[product]/obrigado.tsx`
- [ ] Implementar GetStaticPaths e GetStaticProps
- [ ] Carregar productConfig dinamicamente
- [ ] Adaptar cores e gradientes do produto
- [ ] Personalizar textos de confirmação
- [ ] Adicionar próximos passos específicos do produto
- [ ] Incluir link para upsell ZapVida
- [ ] Testar responsividade mobile
- [ ] Validar fluxo completo após pagamento

---

## 🎯 TAREFA 3: Configurar Preços Stripe

**Prioridade:** 🟡 MÉDIA (pode ser feito em paralelo)  
**Estimativa:** 1 dia  
**Status:** ❌ Não iniciado

### O que fazer:

1. **Criar preços no Stripe para todos os produtos:**
   - Para cada produto (calvicie, sono, ansiedade, etc.)
   - Para cada plano (básico, completo, premium)
   - Total: 9 produtos × 3 planos = **27 preços**

2. **Organizar env vars:**
   ```env
   # Calvicie
   STRIPE_PRICE_CALVICIE_BASICO=price_xxx
   STRIPE_PRICE_CALVICIE_COMPLETO=price_xxx
   STRIPE_PRICE_CALVICIE_PREMIUM=price_xxx
   
   # Sono
   STRIPE_PRICE_SONO_BASICO=price_xxx
   STRIPE_PRICE_SONO_COMPLETO=price_xxx
   STRIPE_PRICE_SONO_PREMIUM=price_xxx
   
   # ... repetir para todos os 9 produtos
   ```

3. **Atualizar API de checkout:**
   - Garantir que a API lê corretamente as env vars
   - Validar que o mapeamento está funcionando

### Checklist:
- [ ] Criar 27 preços no Stripe (9 produtos × 3 planos)
- [ ] Adicionar env vars no `.env.local` e produção
- [ ] Validar leitura das env vars na API
- [ ] Testar checkout com cada produto/plano

---

## 📊 RESUMO DO FLUXO POR PRODUTO

### **EMAGRECIMENTO** (100% Completo) ✅
```
✅ LPAC → ✅ Triagem → ✅ Relatório → ✅ Checkout → ✅ Obrigado
```

### **OUTROS 9 PRODUTOS** (20% Completo) ⚠️
```
✅ LPAC → ❌ Checkout → ❌ Obrigado
```

**Nota:** Triagem e relatório não são obrigatórios para MVP. Podem ser adicionados na Fase 2.

---

## 🚫 O QUE NÃO FAZER AGORA (FASE 2)

### Deixar para depois:
- ❌ Triagens específicas para os 9 produtos
- ❌ Relatórios individuais para cada condição
- ❌ Qualquer lógica de IA mais avançada por produto

**Foco atual:** Vender agora, triagem full depois.

---

## 📈 PROGRESSO GERAL

| Etapa | Status | Progresso |
|-------|--------|-----------|
| Configuração Centralizada | ✅ | 100% |
| LPAC Dinâmica | ✅ | 100% |
| Componentes Compartilhados | ✅ | 100% |
| API Checkout Genérica | ✅ | 100% |
| **Páginas Checkout Dinâmicas** | ❌ | **0%** |
| **Páginas Obrigado Dinâmicas** | ❌ | **0%** |
| **Preços Stripe** | ❌ | **0%** |

**PROGRESSO TOTAL MVP: ~60%**

---

## ⏱️ ESTIMATIVA DE TEMPO

- **Tarefa 1 (Checkout):** 2-3 dias
- **Tarefa 2 (Obrigado):** 1 dia
- **Tarefa 3 (Stripe):** 1 dia (pode ser paralelo)

**TOTAL: 3-4 dias para MVP completo**

---

## ✅ CRITÉRIOS DE SUCESSO (MVP)

Para considerar o MVP pronto para tráfego pago:

1. ✅ Todos os 10 produtos têm LPAC funcionando
2. ✅ Todos os 10 produtos têm checkout funcionando
3. ✅ Todos os 10 produtos têm página de obrigado funcionando
4. ✅ Checkout integrado com Stripe (card + PIX)
5. ✅ Mobile-first e responsivo
6. ✅ Upsell ZapVida preparado (mesmo que seja apenas link)

---

## 🎯 PRÓXIMA AÇÃO IMEDIATA

**Começar pela Tarefa 1:** Criar `src/pages/[product]/checkout.tsx`

1. Copiar `src/pages/emagrecimento/checkout.tsx`
2. Adaptar para usar `getProductConfig()` e `getProductPlans()`
3. Parametrizar cores, planos e textos
4. Integrar com API `/api/stripe/product-checkout`
5. Testar com um produto (ex: calvicie)

---

## 📝 NOTAS IMPORTANTES

- **Emagrecimento continua com triagem obrigatória** - não mexer no fluxo atual
- **Outros produtos vão direto para checkout** - sem triagem no MVP
- **Upsell ZapVida é opcional** - não travar MVP por causa disso
- **Foco em vendas agora** - triagem e relatórios podem vir depois

---

**Última atualização:** Janeiro 2025  
**Próxima revisão:** Após conclusão da Tarefa 1
