# Relatório: Checkout e Carrinho — MeJoy E-commerce

**Data:** 05/03/2025  
**Escopo:** Fluxo completo de carrinho → checkout → pagamento PIX

---

## 1. Visão geral do fluxo

```
Home / PDP → Adicionar ao carrinho → /cart → Finalizar compra → /checkout
                                                                    ↓
                                              Step 1: Dados + Endereço (CEP → ViaCEP)
                                              Step 2: Frete (resumo)
                                              Step 3: Pagamento PIX
                                                                    ↓
                                              /checkout/sucesso (QR Code PIX)
```

---

## 2. Carrinho (`/cart`)

### ✅ Funcionando

| Item | Status | Detalhes |
|------|--------|----------|
| **Adicionar ao carrinho** | ✅ | `AddToCartButton` → `POST /api/store-v2/cart` com `productSlug`, `quantity` |
| **Persistência** | ✅ | Cookie `store_v2_session` (30 dias) + Prisma (Cart, CartItem) |
| **Listar itens** | ✅ | `GET /api/store-v2/cart` com `X-Session-Id` |
| **Alterar quantidade** | ✅ | `PATCH /api/store-v2/cart/[itemId]` |
| **Remover item** | ✅ | `DELETE /api/store-v2/cart/[itemId]` |
| **Redirect** | ✅ | PDP pode usar `redirectToCheckout` (vai direto ao checkout) |
| **Responsividade** | ✅ | `grid-cols-1 lg:grid-cols-3`, barra fixa no mobile (`fixed bottom-0`) |
| **Barra frete grátis** | ✅ | `CartProgressBar` (quando `STORE_V2_CONVERSION=1`) |
| **Trust badges** | ✅ | `CartTrustMini` (quando conversion ativo) |
| **Upsell** | ✅ | `CartUpsell` (quando conversion ativo) |

### ⚠️ Pontos de atenção

- **CEP no carrinho:** Opcional. Usado só para progress bar de frete grátis. **Não há ViaCEP** na página do carrinho — o CEP não preenche endereço aqui.
- **Feature flags:** `CartProgressBar`, `CartTrustMini`, `CartUpsell` só aparecem com `STORE_V2_CONVERSION=1`.

---

## 3. Checkout (`/checkout`)

### 3.1 Steps

| Step | Conteúdo | Validação para avançar |
|------|----------|-------------------------|
| **1** | Nome, e-mail, telefone, CPF (opcional), CEP, endereço, número, complemento, bairro, cidade, UF | Nome ≥2, e-mail com @, telefone ≥10 dígitos, CPF válido (se preenchido) |
| **2** | Resumo: subtotal, frete, total | Nenhuma (sempre pode avançar) |
| **3** | Pagamento PIX + botão "Pagar" | Nenhuma |

### 3.2 CEP e preenchimento automático

| Item | Status | Detalhes |
|------|--------|----------|
| **API ViaCEP** | ✅ | `https://viacep.com.br/ws/{cep}/json/` |
| **Trigger** | ✅ | `onBlur` do campo CEP (quando CEP tem 8 dígitos) |
| **Campos preenchidos** | ✅ | `endereco` ← logradouro, `bairro` ← bairro, `cidade` ← localidade, `estado` ← uf |
| **Mensagem ao usuário** | ✅ | "Endereço preenchido automaticamente ao informar o CEP" |
| **Erro CEP inválido** | ✅ | `setCepError('CEP não encontrado')` ou `'Erro ao buscar CEP'` |
| **Cálculo de frete** | ✅ | `handleCepBlur` chama `fetchViaCep` + `calculateFrete` (API `/api/store-v2/checkout/calculate-shipping`) |

### 3.3 UI/UX

| Item | Status | Detalhes |
|------|--------|----------|
| **Progress bar** | ✅ | 3 barras (step 1, 2, 3) com `bg-orange-500` / `bg-gray-200` |
| **Layout** | ✅ | `max-w-2xl mx-auto`, `px-4 sm:px-6 lg:px-8` |
| **Grid** | ✅ | Número/complemento e cidade/UF em `grid-cols-2` |
| **Inputs** | ✅ | `rounded-xl`, `focus:ring-orange-500` |
| **Botões** | ✅ | Primário laranja, secundário borda cinza |
| **Carrinho vazio** | ✅ | Mensagem + link "Voltar" |

---

## 4. Validação e bugs críticos

### ❌ Problemas encontrados

#### 1. Endereço não obrigatório no Step 1

- **Situação:** `canProceedStep1` não exige CEP, endereço, número, bairro, cidade ou UF.
- **Risco:** Cliente avança e finaliza sem endereço de entrega.
- **Backend:** `create-payment` não valida endereço; Asaas pode rejeitar ou gerar cobrança sem endereço.

#### 2. Divergência de valor: frete quando CEP não informado

- **Frontend:** Se `shipping` é `null`, usa `shippingCents = 2990` (R$ 29,90) no total exibido.
- **Backend:** Se CEP vazio ou inválido, `shippingCents` permanece `0`.
- **Efeito:** Cliente vê total maior do que o cobrado (ou cobrança sem frete quando deveria ter).

```ts
// checkout/index.tsx linha 224
const shippingCents = shipping?.shippingCents ?? 2990;

// create-payment.ts: se cepClean.length !== 8, shippingCents fica 0
```

#### 3. Step 2 sem CEP

- Se o cliente não informou CEP no Step 1, o Step 2 mostra "Informe o CEP na etapa anterior para calcular".
- Mesmo assim, o botão "Continuar" permite ir ao Step 3 e pagar.

#### 4. Validação de endereço no backend

- `create-payment` exige apenas `nome`, `email`, `telefone` e `cartId`/`orderId`.
- CEP e demais campos de endereço não são validados.

---

## 5. Página de sucesso (`/checkout/sucesso`)

### ✅ Funcionando

| Item | Status | Detalhes |
|------|--------|----------|
| **QR Code PIX** | ✅ | Base64 em `sessionStorage` (`mejoy_pix_{orderId}`) |
| **Código copiável** | ✅ | Input + botão "Copiar" |
| **Link da fatura** | ✅ | `invoiceUrl` do Asaas |
| **Resumo do pedido** | ✅ | Itens, frete, total |
| **Endereço de entrega** | ✅ | Formatado e exibido |
| **Status** | ✅ | Pago / Aguardando pagamento |
| **CTAs** | ✅ | "Ver detalhes do pedido", "Falar no WhatsApp" |
| **Analytics** | ✅ | `track('purchase', ...)` |

---

## 6. Integração de pagamento

| Item | Status | Detalhes |
|------|--------|----------|
| **Gateway** | ✅ | Asaas (PIX) |
| **Criação de cobrança** | ✅ | `create-payment` → Asaas API |
| **Webhook** | ✅ | `/api/webhooks/asaas` → `PAYMENT_CONFIRMED` / `PAYMENT_RECEIVED` |
| **Atualização de pedido** | ✅ | Status → `PAID`, e-mail e WhatsApp |
| **Auditoria de preço** | ✅ | `assertPriceAudit()` antes de criar cobrança |

---

## 7. Resumo executivo

| Aspecto | Nota | Comentário |
|--------|------|------------|
| **Carrinho** | 9/10 | Funcional, persistente, responsivo. CEP opcional e sem ViaCEP. |
| **Checkout – fluxo** | 7/10 | 3 steps claros, mas Step 1 permite avançar sem endereço. |
| **CEP e auto-fill** | 9/10 | ViaCEP no blur, preenchimento correto. Falta obrigatoriedade. |
| **Responsividade** | 9/10 | Tailwind, mobile-first, barra fixa no carrinho. |
| **Confiança/UX** | 8/10 | Layout limpo, progress bar, trust badges (com flag). |
| **Validação** | 5/10 | CPF ok; endereço e CEP não obrigatórios; divergência de frete. |

---

## 8. Recomendações prioritárias

1. **Obrigar CEP e endereço no Step 1**  
   - Incluir CEP, endereço, número, bairro, cidade e UF em `canProceedStep1`.

2. **Alinhar frete frontend/backend**  
   - Se CEP ausente: usar R$ 29,90 no backend (ou bloquear avanço até CEP válido).

3. **Validar endereço no `create-payment`**  
   - Exigir CEP (8 dígitos) e campos mínimos de endereço antes de criar cobrança.

4. **Opcional: ViaCEP no carrinho**  
   - Se o CEP for informado no carrinho, usar ViaCEP para pré-preencher no checkout (ex.: `localStorage`).

---

## 9. Arquivos principais

| Arquivo | Função |
|---------|--------|
| `src/pages/cart.tsx` | Página do carrinho |
| `src/pages/checkout/index.tsx` | Checkout (3 steps) |
| `src/pages/checkout/sucesso.tsx` | Sucesso + PIX |
| `src/pages/api/store-v2/cart/index.ts` | GET/POST carrinho |
| `src/pages/api/store-v2/cart/[itemId].ts` | PATCH/DELETE item |
| `src/pages/api/store-v2/create-payment.ts` | Cria Order + pagamento Asaas |
| `src/pages/api/store-v2/checkout/calculate-shipping.ts` | Cálculo de frete |
| `src/lib/store-v2/shipping.ts` | Regras de frete por região |
| `src/components/store-v2/AddToCartButton.tsx` | Botão adicionar ao carrinho |
