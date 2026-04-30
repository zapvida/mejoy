# Plano Definitivo: Checkout Me Joy — Layout Zapvida + Máxima Confiança

**Versão:** 2.0 FINAL  
**Data:** 05/03/2025  
**Objetivo:** Refatorar o checkout Me Joy com layout idêntico ao Zapvida (anexos), adaptado ao contexto e-commerce, gateway Asaas, e máxima confiança para os clientes.

---

## Referência visual (anexos Zapvida)

Os anexos em `assets/Captura_de_Tela_*.png` mostram o checkout Zapvida. Replicar fielmente:

- Header com logo + "Ambiente seguro"
- Barra de progresso com círculos numerados e linhas tracejadas
- Banner verde de benefício
- Layout 2 colunas: formulário à esquerda, resumo à direita
- Cards brancos com sombra e bordas arredondadas
- **Seção Pagamento**: PIX e Cartão como cards clicáveis lado a lado
- **Footer**: Termos, reCAPTCHA, badges SSL e PCI DSS

---

## 1. Especificação visual: Seção PAGAMENTO (PIX + Cartão)

### 1.1 Header da seção

- **Título:** "Pagamento" com ícone de cartão (CreditCard) à esquerda
- **Logos bandeiras:** Visa, Mastercard, Amex, Elo — pequenos, coloridos, alinhados à direita do título
- **Estilo:** `flex justify-between items-center`

### 1.2 Seleção de método (2 cards lado a lado)

| Estado | PIX | Cartão de Crédito |
|--------|-----|-------------------|
| **Selecionado** | Borda `border-2 border-orange-500`, fundo `bg-orange-50`, ícone e texto `text-orange-600` | Idem |
| **Não selecionado** | Borda `border border-gray-200`, fundo `bg-white`, ícone e texto `text-gray-500` | Idem |

**Estrutura de cada card:**
- Retângulo com `rounded-xl`, `p-4`
- Ícone central (PIX: 4 círculos/diamantes; Cartão: ícone de cartão)
- Texto abaixo: "Pix" ou "Cartão de Crédito"
- Clicável: `cursor-pointer`, `transition-colors`

### 1.3 Blocos informativos PIX (quando PIX selecionado)

**Bloco 1 — "Como funciona?"**
- Ícone: círculo com "i" (info)
- Título: "Como funciona?"
- Texto: "Clique em 'Gerar PIX'. É simples e o processamento é instantâneo." (adaptar: "Pagar com PIX" / "Gerar PIX do Pedido")
- Estilo: `bg-gray-50 rounded-lg p-4 border border-gray-100`

**Bloco 2 — "Finalize sua compra com facilidade"**
- Ícone: QR code estilizado
- Título: "Finalize sua compra com facilidade"
- Texto: "Abra o app do seu banco, acesse o PIX e escaneie o QR code ou copie o código"
- Estilo: idem

### 1.4 Formulário Cartão (quando Cartão selecionado)

**Layout 2 colunas no desktop:** `lg:grid-cols-2` — campos à esquerda, preview do cartão à direita.

**Campos:**
- **Nome no cartão:** placeholder "Nome como está no cartão"
- **Número do cartão:** ícone de cartão à esquerda do input, placeholder "Digite o número do cartão"
- **Validade e CVV:** lado a lado, placeholders "MM/AA" e "123"

**Preview do cartão (desktop):**
- Card escuro: `bg-gray-800` ou `bg-slate-800`, `rounded-xl`
- Chip dourado no canto superior esquerdo
- Número: pontos brancos (•••• •••• •••• ••••) — atualiza com últimos 4 dígitos visíveis
- "TITULAR DO CARTÃO" + valor do campo nome em maiúsculas
- "VALIDADE" + MM/AA
- Atualização em tempo real conforme o usuário digita

### 1.5 CTA (Call to Action)

- **PIX:** "Gerar PIX do Pedido →" ou "Pagar com PIX →"
- **Cartão:** "Confirmar Pedido →"
- Estilo: `w-full py-4 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors`
- Altura mínima 48px

---

## 2. Especificação visual: Footer (Trust)

### 2.1 Texto legal

- Centralizado, `text-center`
- Linha 1: "Ao confirmar o pagamento, você concorda com nossos" + link "Termos de Uso e Política de Privacidade" (azul, `text-blue-600 hover:underline`)
- Linha 2: "Este site está protegido pelo Google reCAPTCHA. " + link "Política de Privacidade e Termos de Serviço." (azul)

### 2.2 Badges de confiança

Dois badges lado a lado, centralizados:

| Badge | Texto | Cores |
|-------|-------|-------|
| **SSL** | SITE SEGURO SSL 256 BITS | Verde/amarelo, ícone de cadeado |
| **PCI DSS** | PCI DSS COMPLIANT | Verde/cinza |

**Implementação:** SVGs ou imagens. Estilo: `flex justify-center gap-4 mt-4`

---

## 3. Especificação visual: Header e Progresso

### 3.1 Header

- Logo Me Joy à esquerda (link para `/`)
- À direita: ícone Lock + "Ambiente seguro" (`text-gray-600`)
- `sticky top-0 z-50`, `bg-white/95 backdrop-blur`, `border-b border-gray-100`
- `px-4 sm:px-6 lg:px-8 py-4`

### 3.2 Barra de progresso

- 2 passos: "1 Dados e Entrega" | "2 Pagamento"
- Círculos: `w-10 h-10 rounded-full flex items-center justify-center font-semibold`
- Atual: `bg-orange-500 text-white`
- Concluído: `bg-green-500 text-white` + ícone Check
- Pendente: `bg-gray-200 text-gray-500`
- Conectores: linha tracejada `border-dashed border-gray-300`

### 3.3 Banner de benefício

- `bg-emerald-50 border border-emerald-100 rounded-xl p-4`
- Texto dinâmico conforme CEP e frete (ver seção 4 do plano mestre)

---

## 4. Especificação visual: Cards de formulário

### 4.1 Card genérico

- `bg-white rounded-xl shadow-sm border border-gray-100`
- `CardHeader`: ícone (User, MapPin, CreditCard) + título + subtítulo opcional
- `CardContent`: `p-6 space-y-4`

### 4.2 Card "Dados do Cliente"

- Ícone: User
- Título: "Dados do Cliente"
- Subtítulo: "Preencha seus dados para continuar"
- Campos: Nome completo, E-mail, Celular, CPF (opcional)

### 4.3 Card "Endereço de Entrega"

- Ícone: MapPin
- Título: "Endereço de Entrega"
- CEP com ViaCEP; após sucesso: "✓ Endereço preenchido automaticamente" (verde)
- Campos: CEP, Rua, Número, Complemento, Bairro, Cidade, UF

### 4.4 Card "Resumo do Pedido"

- Ícone: FileText ou ShoppingBag
- Título: "Resumo do Pedido"
- Lista de itens (nome, qtd × preço)
- Subtotal, Frete, **Total** (destaque)
- Sticky no desktop: `sticky top-24`

---

## 5. Background e layout geral

### 5.1 Background da página

- Zapvida usa fundo escuro (`#282436` ou similar). Para Me Joy, opções:
  - **Opção A:** `bg-gray-100` (mais suave, comum em e-commerce)
  - **Opção B:** `bg-slate-800` ou `bg-gray-900` (mais dramático, destaca os cards)

Recomendação: **Opção A** (`bg-gray-100`) para manter consistência com o restante da loja.

### 5.2 Layout 2 colunas

- Desktop: `grid lg:grid-cols-[1fr_400px]` ou `lg:grid-cols-[1fr_380px]`
- Gap: `gap-8`
- Mobile: coluna única, resumo colapsável no topo

---

## 6. Gateway e contexto Me Joy

- **Gateway:** Asaas (mesmo do Zapvida)
- **API:** `POST /api/store-v2/create-payment`
- **Body PIX:** `{ cartId, nome, email, telefone, cep, endereco, numero, complemento, bairro, cidade, estado, paymentMethod: 'PIX' }`
- **Body Cartão:** idem + `paymentMethod: 'CREDIT_CARD'`, `creditCard: { holderName, number, expiryMonth, expiryYear, ccv }`
- **Sucesso:** redirect para `/checkout/sucesso?orderId=...`

---

## 7. Ordem de execução (checklist)

1. [ ] **Validação backend** — create-payment: validar CEP/endereço, frete padrão R$ 29,90
2. [ ] **CheckoutHeader** — Logo + Ambiente seguro
3. [ ] **CheckoutSteps** — 2 passos com círculos e linhas tracejadas
4. [ ] **CheckoutBanner** — Banner verde dinâmico
5. [ ] **Layout 2 colunas** — Grid desktop, mobile coluna única
6. [ ] **Card Dados do Cliente** — Nome, Email, Celular, CPF (opcional)
7. [ ] **Card Endereço** — CEP + ViaCEP + campos restantes
8. [ ] **OrderSummaryCard** — sticky, itens + subtotal + frete + total
9. [ ] **PaymentForm** — 2 cards PIX/Cartão lado a lado
10. [ ] **Blocos PIX** — "Como funciona?" + "Finalize com facilidade"
11. [ ] **Formulário Cartão** — Campos + preview dinâmico
12. [ ] **CheckoutFooter** — Termos, reCAPTCHA, badges SSL/PCI
13. [ ] **Validação Step 1** — Bloquear avanço sem CEP/endereço válido
14. [ ] **Persistência** — localStorage para dados do formulário
15. [ ] **Testes** — Fluxo PIX, fluxo Cartão, responsividade

---

## 8. PROMPT para o agente (copiar e colar)

Ver arquivo `PROMPT_CHECKOUT_DEFINITIVO_MEJOY.txt`

---

*Plano alinhado aos anexos Zapvida. Gateway Asaas. Máxima confiança para clientes Me Joy.*
