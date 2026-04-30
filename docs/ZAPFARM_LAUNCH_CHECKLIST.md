# 🚀 CHECKLIST DE LANÇAMENTO - ZAPFARM MVP

**Data:** Janeiro 2025  
**Status:** ✅ **CÓDIGO PRONTO PARA LANÇAMENTO**

---

## ✅ RESUMO EXECUTIVO

O código do ZapFarm está **100% pronto para lançamento**. Faltam apenas configurações de infraestrutura (env vars, Stripe, banco de dados).

### O que está implementado:
- ✅ LPAC dinâmica para 10 produtos
- ✅ Checkout dinâmico para todos os produtos
- ✅ Página de obrigado dinâmica
- ✅ Webhook Stripe para persistir pedidos
- ✅ Modelo Prisma para pedidos ZapFarm
- ✅ Tratamento de erros melhorado
- ✅ Copy ajustada para produtos sem triagem
- ✅ Suporte a UTM tracking

### O que falta fazer (fora do código):
1. Configurar env vars no ambiente de produção
2. Criar preços no Stripe
3. Configurar webhook no Stripe Dashboard
4. Configurar DATABASE_URL e rodar migrations

---

## 📋 CHECKLIST COMPLETO

### **1. CONFIGURAR VARIÁVEIS DE AMBIENTE**

#### **1.1 Stripe Keys (Obrigatório)**
```env
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET_ZAPFARM=whsec_xxx
```

**Como obter:**
- `STRIPE_SECRET_KEY`: Dashboard Stripe > Developers > API keys > Secret key (modo live)
- `STRIPE_PUBLISHABLE_KEY`: Dashboard Stripe > Developers > API keys > Publishable key (modo live)
- `STRIPE_WEBHOOK_SECRET_ZAPFARM`: Ver seção 3 abaixo

---

#### **1.2 Preços Stripe (27 env vars - Obrigatório)**

Criar 27 preços no Stripe (9 produtos × 3 planos) e adicionar as seguintes env vars:

```env
# Calvicie
STRIPE_PRICE_CALVICIE_BASICO=price_xxx
STRIPE_PRICE_CALVICIE_COMPLETO=price_yyy
STRIPE_PRICE_CALVICIE_PREMIUM=price_zzz

# Sono
STRIPE_PRICE_SONO_BASICO=price_aaa
STRIPE_PRICE_SONO_COMPLETO=price_bbb
STRIPE_PRICE_SONO_PREMIUM=price_ccc

# Ansiedade
STRIPE_PRICE_ANSIEDADE_BASICO=price_ddd
STRIPE_PRICE_ANSIEDADE_COMPLETO=price_eee
STRIPE_PRICE_ANSIEDADE_PREMIUM=price_fff

# Intestino
STRIPE_PRICE_INTESTINO_BASICO=price_ggg
STRIPE_PRICE_INTESTINO_COMPLETO=price_hhh
STRIPE_PRICE_INTESTINO_PREMIUM=price_iii

# Figado
STRIPE_PRICE_FIGADO_BASICO=price_jjj
STRIPE_PRICE_FIGADO_COMPLETO=price_kkk
STRIPE_PRICE_FIGADO_PREMIUM=price_lll

# Libido Masculina
STRIPE_PRICE_LIBIDO_BASICO=price_mmm
STRIPE_PRICE_LIBIDO_COMPLETO=price_nnn
STRIPE_PRICE_LIBIDO_PREMIUM=price_ooo

# Menopausa
STRIPE_PRICE_MENOPAUSA_BASICO=price_ppp
STRIPE_PRICE_MENOPAUSA_COMPLETO=price_qqq
STRIPE_PRICE_MENOPAUSA_PREMIUM=price_rrr

# Articulações
STRIPE_PRICE_ARTICULACOES_BASICO=price_sss
STRIPE_PRICE_ARTICULACOES_COMPLETO=price_ttt
STRIPE_PRICE_ARTICULACOES_PREMIUM=price_uuu

# Imunidade
STRIPE_PRICE_IMUNIDADE_BASICO=price_vvv
STRIPE_PRICE_IMUNIDADE_COMPLETO=price_www
STRIPE_PRICE_IMUNIDADE_PREMIUM=price_xxx
```

**Como criar preços no Stripe:**
1. Acessar Dashboard Stripe > Products
2. Para cada produto/plano:
   - Criar novo Price
   - Selecionar produto ou criar novo
   - Definir valor (ex: R$ 299,00)
   - Tipo: One-time payment
   - Copiar o Price ID (começa com `price_`)
   - Adicionar como env var seguindo a convenção acima

**Valores de referência (do `products.ts`):**
- Calvicie: R$ 299/mês (básico), R$ 799 à vista (completo), R$ 1.399 à vista (premium)
- Sono: R$ 199/mês (básico), R$ 549 à vista (completo), R$ 999 à vista (premium)
- Ansiedade: R$ 199/mês (básico), R$ 549 à vista (completo), R$ 999 à vista (premium)
- Intestino: R$ 179/mês (básico), R$ 479 à vista (completo), R$ 879 à vista (premium)
- Figado: R$ 199/mês (básico), R$ 549 à vista (completo), R$ 999 à vista (premium)
- Libido Masculina: R$ 249/mês (básico), R$ 699 à vista (completo), R$ 1.299 à vista (premium)
- Menopausa: R$ 249/mês (básico), R$ 699 à vista (completo), R$ 1.299 à vista (premium)
- Articulações: R$ 249/mês (básico), R$ 699 à vista (completo), R$ 1.299 à vista (premium)
- Imunidade: R$ 199/mês (básico), R$ 549 à vista (completo), R$ 999 à vista (premium)

---

#### **1.3 Database (Obrigatório)**
```env
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
```

**Como configurar:**
- Se usar Vercel: adicionar DATABASE_URL nas env vars do projeto
- Se usar outro provider: seguir instruções do Prisma para PostgreSQL

---

### **2. RODAR MIGRATIONS PRISMA**

Após configurar `DATABASE_URL`, rodar:

```bash
# Gerar migrations (se ainda não foram geradas)
pnpm prisma migrate dev --name add_zapfarm_orders

# OU em produção (sem prompts interativos)
pnpm prisma migrate deploy
```

**Modelo criado:**
- `ZapfarmOrder` - Armazena pedidos do ZapFarm
  - Campos principais: `productSlug`, `planSlug`, `stripeSessionId`, `status`, `customerEmail`, `amount`
  - Ver `prisma/schema.prisma` para detalhes completos

---

### **3. CONFIGURAR WEBHOOK NO STRIPE**

#### **3.1 Criar Webhook Endpoint**

1. Acessar Dashboard Stripe > Developers > Webhooks
2. Clicar em "Add endpoint"
3. URL do endpoint: `https://seu-dominio.com/api/stripe/zapfarm-webhook`
4. Selecionar eventos:
   - `checkout.session.completed` ✅
5. Clicar em "Add endpoint"
6. Copiar o "Signing secret" (começa com `whsec_`)
7. Adicionar como env var: `STRIPE_WEBHOOK_SECRET_ZAPFARM=whsec_xxx`

#### **3.2 Testar Webhook**

1. Fazer um pedido de teste (modo teste do Stripe)
2. Verificar no Stripe Dashboard > Webhooks > [seu endpoint] > "Recent events"
3. Verificar no banco de dados se o pedido foi criado:
   ```sql
   SELECT * FROM zapfarm_orders ORDER BY created_at DESC LIMIT 1;
   ```

---

### **4. VALIDAÇÃO ANTES DO LANÇAMENTO**

#### **4.1 Build e Lint**
```bash
pnpm lint
pnpm build
```

**Deve passar sem erros.**

#### **4.2 Testes Manuais por Produto**

Para cada produto (ex: calvicie), testar:

- [ ] `/calvicie` abre LPAC corretamente
- [ ] CTA principal leva para `/calvicie/checkout` (não para triagem)
- [ ] Checkout carrega planos corretos (básico/completo/premium)
- [ ] Cores do produto aparecem corretamente
- [ ] Formulário de dados funciona
- [ ] Seleção de plano funciona
- [ ] Botão "Finalizar pagamento" chama API sem erro
- [ ] Após pagamento (modo teste), redireciona para `/calvicie/obrigado`
- [ ] Página de obrigado renderiza corretamente
- [ ] Link ZapVida funciona
- [ ] Mobile-first responsivo

**Produto especial - Emagrecimento:**
- [ ] `/emagrecimento` abre LPAC corretamente
- [ ] CTA principal leva para `/triagem/emagrecimento` (não para checkout direto)
- [ ] Fluxo completo: LPAC → Triagem → Relatório → Checkout → Obrigado

#### **4.3 Testes de Integração Stripe**

- [ ] Testar checkout com cartão de teste (4242 4242 4242 4242)
- [ ] Testar checkout com PIX
- [ ] Validar redirecionamento após pagamento bem-sucedido
- [ ] Validar redirecionamento após cancelamento
- [ ] Verificar metadata no Stripe Dashboard:
  - `tipo: zapfarm`
  - `product: [slug]`
  - `plano: [basico|completo|premium]`
  - `customer_email`, `customer_name`, `customer_phone`
  - UTM params (se disponíveis)
- [ ] Verificar pedido criado no banco (`zapfarm_orders`)

---

## 📊 FLUXOS POR PRODUTO

### **Emagrecimento (Fluxo Completo)**
```
LPAC → /triagem/emagrecimento → /emagrecimento/relatorio → /emagrecimento/checkout → /emagrecimento/obrigado
```

### **Outros 9 Produtos (Fluxo MVP)**
```
LPAC → /[product]/checkout → /[product]/obrigado
```

**Produtos:**
- calvicie
- sono
- ansiedade
- intestino
- figado
- libido-masculina
- menopausa
- articulacoes
- imunidade

---

## 🔧 ARQUIVOS CRIADOS/MODIFICADOS

### **Novos Arquivos:**
1. `src/pages/api/stripe/zapfarm-webhook.ts` - Webhook específico para ZapFarm
2. `docs/ZAPFARM_LAUNCH_CHECKLIST.md` - Este arquivo

### **Arquivos Modificados:**
1. `prisma/schema.prisma` - Adicionado modelo `ZapfarmOrder`
2. `src/pages/api/stripe/product-checkout.ts` - Melhorado tratamento de erros e UTM tracking
3. `src/pages/[product]/checkout.tsx` - Melhorado UX de erros
4. `src/pages/[product].tsx` - Ajustado copy para produtos sem triagem

---

## 🗄️ MODELO PRISMA - ZapfarmOrder

```prisma
model ZapfarmOrder {
  id                    String    @id @default(cuid())
  productSlug          String    // ex: "calvicie", "sono"
  planSlug              String    // "basico" | "completo" | "premium"
  stripeSessionId      String    @unique
  stripePaymentIntentId String?
  status                String    @default("PENDING") // PENDING | PAID | CANCELED | FAILED | REFUNDED
  customerName          String
  customerEmail         String
  customerPhone         String?
  amount                Int       // Valor em centavos
  currency              String    @default("BRL")
  reportId              String?
  triageId              String?
  utmSource             String?
  utmMedium             String?
  utmCampaign           String?
  utmContent            String?
  utmTerm               String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  paidAt                DateTime?

  @@index([productSlug])
  @@index([status])
  @@index([stripeSessionId])
  @@index([customerEmail])
  @@index([createdAt])
  @@map("zapfarm_orders")
}
```

---

## 🔍 COMO O WEBHOOK FUNCIONA

1. **Usuário completa checkout no Stripe**
2. **Stripe envia evento `checkout.session.completed`** para `/api/stripe/zapfarm-webhook`
3. **Webhook valida assinatura** usando `STRIPE_WEBHOOK_SECRET_ZAPFARM`
4. **Webhook verifica metadata** (`tipo: zapfarm`) para identificar pedidos ZapFarm
5. **Webhook faz upsert** no banco usando `stripeSessionId` como chave (idempotente)
6. **Status é determinado** pelo `payment_status` da sessão:
   - `paid` → `PAID`
   - `unpaid` → `PENDING`
   - `expired` → `CANCELED`

**Idempotência:** O webhook usa `upsert` com `stripeSessionId` como chave única, garantindo que eventos duplicados não criem pedidos duplicados.

---

## ⚠️ PONTOS DE ATENÇÃO

### **1. Env Vars Faltando**
- Se uma env var de preço estiver faltando, a API retornará erro amigável
- O frontend mostrará mensagem: "No momento este produto/plano não está disponível"

### **2. Webhook Secret**
- **NUNCA** commitar `STRIPE_WEBHOOK_SECRET_ZAPFARM` no código
- Usar apenas em env vars de produção
- Cada ambiente (staging/prod) deve ter seu próprio secret

### **3. Database**
- Garantir que `DATABASE_URL` está configurado antes de rodar migrations
- Em produção, usar `prisma migrate deploy` (não `prisma migrate dev`)

### **4. Stripe Mode**
- **Modo Teste:** Usar keys que começam com `sk_test_` e `pk_test_`
- **Modo Live:** Usar keys que começam com `sk_live_` e `pk_live_`
- Webhook secret também muda entre modos

---

## ✅ CRITÉRIOS DE SUCESSO

Para considerar o lançamento completo:

1. ✅ Todas as 27 env vars de preços configuradas
2. ✅ Stripe keys configuradas (modo live)
3. ✅ Webhook configurado e testado
4. ✅ Database configurado e migrations rodadas
5. ✅ Teste completo de 1 produto funcionando
6. ✅ Pedido aparecendo no Stripe Dashboard
7. ✅ Pedido aparecendo no banco (`zapfarm_orders`)

---

## 🚀 PRÓXIMOS PASSOS APÓS LANÇAMENTO

### **Fase 2 (Opcional - Futuro):**
- Implementar triagens para os 9 produtos restantes
- Criar relatórios IA para todos os produtos
- Dashboard de pedidos/admin
- Notificações por email/SMS
- Integração com CRM

---

## 📞 SUPORTE

Se algo não funcionar:

1. Verificar logs do webhook no Stripe Dashboard
2. Verificar logs da aplicação (Vercel/outro provider)
3. Verificar se pedido foi criado no banco
4. Verificar se env vars estão corretas

---

**Última atualização:** Janeiro 2025  
**Status:** ✅ **CÓDIGO PRONTO PARA LANÇAMENTO**

