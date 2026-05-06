# Plano Mestre: Checkout MeJoy — Layout Zapvida + UX de Alta Conversão

**Versão:** 2.0  
**Data:** 05/03/2025  
**Objetivo:** Alinhar o checkout MeJoy ao layout Zapvida, reduzir fricção, maximizar conversão e validar o lançamento com o melhor checkout possível.

> **📌 Plano definitivo com specs visuais dos anexos:** `PLANO_DEFINITIVO_CHECKOUT_MEJOY.md`  
> **📌 Prompt pronto para executar:** `PROMPT_CHECKOUT_DEFINITIVO_MEJOY.txt`  
> **📌 Referência visual:** Anexos em `assets/Captura_de_Tela_*.png` (checkout Zapvida)

---

## Índice

1. [Contexto e referências](#1-contexto-e-referências)
2. [Estado atual MeJoy](#2-estado-atual-me-joy)
3. [Fluxo alvo (2 etapas)](#3-fluxo-alvo-2-etapas)
4. [Layout visual (Zapvida)](#4-layout-visual-zapvida)
5. [Validação e regras de negócio](#5-validação-e-regras-de-negócio)
6. [Arquivos MeJoy](#6-arquivos-me-joy)
7. [Ordem de execução](#7-ordem-de-execução)
8. [Critérios de aceitação](#8-critérios-de-aceitação)
9. [PROMPT DEFINITIVO (copiar e colar)](#9-prompt-definitivo-copiar-e-colar)

---

## 1. Contexto e referências

### Zapvida (referência visual)

- **URL:** zapvida.com/pay/plantao
- **Tipo:** Checkout de serviço médico (não e-commerce)
- **Layout:** 2 colunas, cards, header sticky, barra de progresso com círculos numerados, footer com trust badges
- **Componentes:** Header, Steps, Banner, CustomerForm, PaymentForm, Summary, Footer

### MeJoy (e-commerce farmácia)

- **Tipo:** E-commerce com carrinho, endereço de entrega, frete
- **Pagamento:** Asaas (PIX + Cartão de crédito — backend já suporta ambos)
- **Frete:** ViaCEP + regras por região (Sudeste R$ 190, Centro-Oeste R$ 240, Norte/Nordeste R$ 349)

---

## 2. Estado atual MeJoy

### O que funciona

| Item | Status |
|------|--------|
| Carrinho | Adicionar, alterar quantidade, remover |
| Persistência | Cookie `store_v2_session` + Prisma |
| Checkout 3 etapas | Dados → Frete → Pagamento |
| ViaCEP | onBlur do CEP preenche endereço |
| Pagamento PIX | Asaas, QR Code, webhook |
| Página de sucesso | Resumo + endereço + PIX |

### Bugs críticos

1. **Endereço não obrigatório** — Cliente avança sem CEP/endereço
2. **Divergência de frete** — Frontend mostra R$ 29,90 sem CEP; backend cobra R$ 0
3. **Validação backend** — `create-payment` não valida CEP/endereço
4. **Cartão de crédito** — Backend suporta; UI Store V2 só mostra PIX

### Regras de frete (src/lib/store-v2/shipping.ts)

| Região | Frete grátis acima de | Prazo |
|--------|------------------------|-------|
| Sudeste/Sul (SP, RJ, MG, ES, PR, SC, RS) | R$ 190 | 5–7 dias |
| Centro-Oeste (DF, GO, MT, MS) | R$ 240 | 8–10 dias |
| Norte/Nordeste | R$ 349 | 10–15 dias |
| Padrão (sem CEP) | R$ 29,90 fixo | 10 dias |

---

## 3. Fluxo alvo (2 etapas)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ETAPA 1: "Dados e Entrega" (uma tela, scroll)                          │
│  • Dados: Nome, Email, Celular (CPF opcional)                           │
│  • CEP → ViaCEP preenche rua, bairro, cidade, UF                        │
│  • Número + complemento (manual)                                          │
│  • Frete calculado em tempo real                                        │
│  • Resumo: itens + subtotal + frete + TOTAL sempre visível (coluna dir) │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  ETAPA 2: "Pagamento"                                                    │
│  • PIX (padrão) ou Cartão de Crédito                                   │
│  • CTA: "Pagar com PIX →" ou "Pagar com Cartão →"                       │
└─────────────────────────────────────────────────────────────────────────┘
```

**Total: 2 etapas, 1 tela de dados + 1 tela de pagamento.**

---

## 4. Layout visual (Zapvida)

### Header

- Logo MeJoy à esquerda (link para home)
- À direita: ícone de cadeado + "Ambiente seguro"
- `sticky top-0`, fundo branco, `backdrop-blur`

### Barra de progresso

- 2 passos: "1 Dados e Entrega" | "2 Pagamento"
- Círculos numerados; atual: `bg-primary`/`bg-orange-500`; concluído: check verde; pendente: `bg-gray-200`
- Linhas tracejadas entre os passos

### Banner de benefício

- Fundo `bg-emerald-50`, borda `emerald-100`
- Texto dinâmico:
  - Com CEP: "🚚 Frete grátis em compras acima de R$ 190" (ou R$ 240 / R$ 349 conforme região)
  - Sem frete grátis: "Faltam R$ X para frete grátis" + barra de progresso
  - Sem CEP: "📦 Informe seu CEP para calcular o frete"

### Layout 2 colunas (desktop)

- Esquerda: formulário
- Direita: **Resumo do Pedido** sticky — itens, subtotal, frete, total
- Mobile: resumo colapsável no topo

### Cards

- Card branco, `shadow-sm`, `rounded-xl`
- CardHeader: ícone + título (User, MapPin, CreditCard)
- CardContent: `p-6`, `space-y-4`

### Formulário de pagamento

- 2 cards: PIX (esquerda, padrão) e Cartão (direita)
- Logos: Visa, Mastercard, Amex, Elo
- PIX: "Como funciona?" + QR Code / código copiável
- Cartão: Nome, Número, Validade, CVV + preview do cartão (desktop)

### Footer

- Termos de Uso, Política de Privacidade
- reCAPTCHA (texto)
- Badges: SSL 256 bits, PCI DSS

---

## 5. Validação e regras de negócio

### Obrigatórios no Step 1 (bloquear avanço)

- Nome (mín. 3 caracteres)
- E-mail (válido)
- Celular (11 dígitos, formato BR)
- CEP (8 dígitos, válido no ViaCEP)
- Rua, Número, Bairro, Cidade, UF

### Frete

- Sem CEP válido: não permitir avançar
- Frontend e backend: mesma lógica e valor
- CEP inválido: "CEP não encontrado. Verifique ou preencha manualmente."

### Backend (create-payment)

- Validar CEP e endereço antes de criar cobrança
- Retornar 400 com mensagem clara se inválido
- Se CEP ausente: usar R$ 29,90 como frete padrão (evitar divergência)

### Persistência

- Salvar dados em `localStorage`/`sessionStorage` (debounce)
- Restaurar ao retornar (ex.: voltar do app do banco para PIX)

### Guest checkout

- MeJoy já é guest (sessionId). Manter. Pós-compra: "Crie uma conta para acompanhar seu pedido" (opcional).

---

## 6. Arquivos MeJoy

### Checkout Store V2

| Arquivo | Função |
|---------|--------|
| `src/pages/checkout/index.tsx` | Página principal do checkout |
| `src/pages/checkout/sucesso.tsx` | Página de sucesso + PIX |
| `src/pages/api/store-v2/create-payment.ts` | Cria Order + pagamento Asaas |
| `src/pages/api/store-v2/checkout/calculate-shipping.ts` | Cálculo de frete |
| `src/lib/store-v2/shipping.ts` | Regras de frete por região |

### Carrinho

| Arquivo | Função |
|---------|--------|
| `src/pages/cart.tsx` | Página do carrinho |
| `src/pages/api/store-v2/cart/index.ts` | GET/POST carrinho |
| `src/pages/api/store-v2/cart/[itemId].ts` | PATCH/DELETE item |
| `src/components/store-v2/AddToCartButton.tsx` | Botão adicionar |

### Componentes Store V2

| Arquivo | Função |
|---------|--------|
| `src/components/store-v2/StorefrontHeader.tsx` | Header da loja |
| `src/components/store-v2/StorefrontFooter.tsx` | Footer da loja |
| `src/components/store-v2/CartProgressBar.tsx` | Barra frete grátis |
| `src/components/store-v2/CartTrustMini.tsx` | Trust badges |

### Referência Zapvida (estrutura, não código)

- Header: `checkout-header.tsx`
- Steps: `checkout-steps.tsx`
- Banner: `atendimento-rapido-banner.tsx`
- CustomerForm: `customer-form.tsx`
- PaymentForm: `payment-form.tsx`
- Footer: `checkout-footer.tsx`
- Summary: `checkout-summary-card.tsx`

---

## 7. Ordem de execução

| # | Fase | Tarefas |
|---|------|---------|
| 1 | **Validação** | Endereço obrigatório no Step 1; consistência frete front/back; validação no create-payment |
| 2 | **Layout base** | Header checkout (Logo + Ambiente seguro); barra de progresso 2 steps; layout 2 colunas |
| 3 | **Unificar Step 1** | Dados + Endereço + Frete em uma única tela com scroll |
| 4 | **Resumo sticky** | OrderSummaryCard à direita (desktop), colapsável (mobile) |
| 5 | **Banner** | Banner de benefício (frete grátis / faltam R$ X) |
| 6 | **Step 2 Pagamento** | PIX (padrão) + Cartão; cards clicáveis; logos bandeiras |
| 7 | **Footer** | Termos, Política, reCAPTCHA, badges SSL/PCI |
| 8 | **Persistência** | localStorage/sessionStorage para dados do formulário |
| 9 | **Responsividade** | Mobile-first; touch targets 44px; font-size 16px inputs |
| 10 | **Testes** | Fluxo completo; validação; PIX; cartão (se implementado) |

---

## 8. Critérios de aceitação

- [ ] Guest checkout funciona (compra sem cadastro)
- [ ] CEP preenche endereço via ViaCEP
- [ ] Frete calculado em tempo real após CEP
- [ ] Barra "Faltam R$ X para frete grátis" visível quando aplicável
- [ ] PIX é opção padrão
- [ ] Valores de frete idênticos no frontend e backend
- [ ] Endereço obrigatório; não avança sem CEP válido
- [ ] Backend valida endereço antes de criar cobrança
- [ ] Layout 2 colunas no desktop, 1 coluna no mobile
- [ ] Trust badges (SSL, PCI DSS) visíveis
- [ ] Resumo do pedido sempre visível (sticky desktop, colapsável mobile)
- [ ] Dados persistidos ao sair e voltar
- [ ] Cartão de crédito funcional (se implementado na UI)

---

## 9. PROMPT DEFINITIVO (copiar e colar)

**👉 Use o arquivo `PROMPT_CHECKOUT_DEFINITIVO_MEJOY.txt`** — prompt completo com specs visuais dos anexos (PIX + Cartão como cards, preview dinâmico, footer com badges SSL/PCI). Pronto para colar no Cursor.

Resumo do prompt (bloco legado):

---
# MISSÃO: Checkout MeJoy — Layout Zapvida + UX de Alta Conversão

Alinhe o checkout do MeJoy ao layout visual do Zapvida (zapvida.com/pay/plantao) e implemente as práticas de UX abaixo para reduzir fricção, minimizar cliques e maximizar conversão.

---

## PARTE 1 — ESTRUTURA DO FLUXO (2 ETAPAS)

### Etapa 1: "Dados e Entrega" (uma única tela com scroll)
- **Dados do Cliente**: Nome completo, E-mail, Celular (obrigatórios). CPF opcional com tooltip: "Opcional para PIX. Necessário para nota fiscal."
- **Endereço de Entrega**: CEP (obrigatório, ViaCEP no onBlur), Rua, Número, Complemento (opcional), Bairro, Cidade, UF. Após CEP válido: mensagem verde "✓ Endereço preenchido automaticamente."
- **Frete**: Após CEP válido, exibir valor e prazo. Calcular em tempo real via `/api/store-v2/checkout/calculate-shipping`. Regras: Sudeste/Sul R$ 190 grátis, Centro-Oeste R$ 240, Norte/Nordeste R$ 349. Frete padrão R$ 29,90.
- **Resumo**: Itens do carrinho, subtotal, frete, total — sempre visível na coluna direita (desktop) ou colapsável no topo (mobile).
- **Guest checkout**: Já é o padrão (sessionId). Manter.

### Etapa 2: "Pagamento"
- PIX como opção padrão (selecionada ao entrar).
- Cartão de Crédito como alternativa (backend create-payment já suporta).
- CTA principal: "Pagar com PIX →" ou "Pagar com Cartão →".

---

## PARTE 2 — LAYOUT VISUAL (IDÊNTICO AO ZAPVIDA)

### Header
- Logo MeJoy à esquerda (link para home).
- À direita: ícone de cadeado + "Ambiente seguro".
- Sticky top-0, fundo branco com backdrop-blur.

### Barra de Progresso
- 2 passos: "1 Dados e Entrega" | "2 Pagamento".
- Círculos numerados (1, 2). Atual: bg-orange-500 text-white. Concluído: check verde. Pendente: bg-gray-200.
- Linhas tracejadas entre os passos.

### Banner de Benefício (abaixo da barra)
- Fundo verde claro (bg-emerald-50), borda emerald-100.
- Texto dinâmico:
  - Com CEP e frete grátis: "🚚 Frete grátis! Pedidos acima de R$ X para [região]"
  - Com CEP e sem frete grátis: "Faltam R$ X para frete grátis" + barra de progresso visual
  - Sem CEP: "📦 Informe seu CEP para calcular o frete"
- Usar valores reais de src/lib/store-v2/shipping.ts: Sudeste R$ 190, Centro-Oeste R$ 240, Norte/Nordeste R$ 349.

### Layout 2 Colunas (desktop)
- Esquerda: formulário (dados + endereço + frete na Etapa 1; pagamento na Etapa 2).
- Direita: **Resumo do Pedido** fixo/sticky com: lista de itens (nome, qtd, preço unit.), subtotal, frete, total. Sempre visível.
- Mobile: resumo colapsável no topo (expandir com ChevronDown).

### Cards
- Card branco, shadow-sm, bordas arredondadas (rounded-xl).
- CardHeader: ícone + título (ex.: User + "Dados do Cliente", MapPin + "Endereço de Entrega", CreditCard + "Pagamento").
- CardContent: padding p-6, space-y-4.

### Formulário de Pagamento
- Seleção: 2 cards lado a lado — PIX (esquerda) e Cartão de Crédito (direita). PIX selecionado por padrão.
- Logos: Visa, Mastercard, Amex, Elo no header do card de pagamento.
- PIX: blocos "Como funciona?" e "Finalize com facilidade" (QR Code ou código copiável após submit).
- Cartão: Nome, Número, Validade, CVV. Preview do cartão ao lado (desktop). Grid lg:grid-cols-2.

### Footer do Checkout
- "Ao confirmar, você concorda com nossos Termos de Uso e Política de Privacidade."
- "Este site está protegido pelo Google reCAPTCHA. Política de Privacidade e Termos de Serviço."
- Badges: SSL 256 bits + PCI DSS (imagens ou SVGs).

---

## PARTE 3 — VALIDAÇÃO E REGRAS DE NEGÓCIO

### Obrigatórios no Step 1 (bloquear avanço)
- Nome (mín. 3 caracteres)
- E-mail (válido)
- Celular (formato BR, 11 dígitos)
- CEP (8 dígitos, válido no ViaCEP)
- Rua, Número, Bairro, Cidade, UF (preenchidos automaticamente ou manualmente)

### Frete
- Sem CEP válido: não permitir avançar. Mensagem: "Informe seu CEP para calcular o frete."
- Frontend e backend: usar a mesma lógica. Sem divergência. Se CEP ausente no backend, usar R$ 29,90 como padrão.
- CEP inválido: "CEP não encontrado. Verifique ou preencha manualmente."

### Backend (create-payment)
- Validar CEP (8 dígitos) e endereço completo antes de criar cobrança.
- Retornar 400 com mensagem clara se inválido.
- Se CEP ausente: aplicar frete R$ 29,90 para evitar divergência com frontend.

### Persistência
- Salvar dados do formulário em localStorage/sessionStorage ao preencher (onBlur ou debounce 500ms).
- Restaurar ao retornar à página (ex.: voltar do app do banco para PIX).

---

## PARTE 4 — RESPONSIVIDADE

- Mobile-first. Campos em coluna única no mobile.
- CTA: altura mínima 48px, largura total no mobile.
- Resumo: colapsável no mobile, expandir com ChevronDown.
- Touch targets: mínimo 44x44px.
- Inputs: font-size 16px para evitar zoom no iOS.

---

## PARTE 5 — COPY E TEXTOS

| Elemento | Texto |
|----------|-------|
| Step 1 | Dados e Entrega |
| Step 2 | Pagamento |
| Banner (frete grátis) | Frete grátis! Pedidos acima de R$ X para [região] |
| Banner (progresso) | Faltam R$ X para frete grátis |
| Banner (sem CEP) | Informe seu CEP para calcular o frete |
| CEP sucesso | ✓ Endereço preenchido automaticamente |
| CEP erro | CEP não encontrado. Verifique ou preencha manualmente. |
| CTA PIX | Pagar com PIX → |
| CTA Cartão | Pagar com Cartão → |

---

## PARTE 6 — ARQUIVOS MEJOY (CONTEXTO)

### Modificar
- src/pages/checkout/index.tsx — página principal
- src/pages/api/store-v2/create-payment.ts — validação CEP/endereço, frete padrão

### Criar (novos componentes)
- src/components/store-v2/checkout/CheckoutHeader.tsx
- src/components/store-v2/checkout/CheckoutSteps.tsx
- src/components/store-v2/checkout/CheckoutBanner.tsx
- src/components/store-v2/checkout/OrderSummaryCard.tsx
- src/components/store-v2/checkout/CheckoutFooter.tsx
- src/components/store-v2/checkout/AddressForm.tsx (com ViaCEP)
- src/components/store-v2/checkout/PaymentForm.tsx (PIX + Cartão)

### Referência Zapvida (estrutura visual, adaptar ao MeJoy)
- checkout-header.tsx, checkout-steps.tsx, atendimento-rapido-banner.tsx
- customer-form.tsx, payment-form.tsx, checkout-footer.tsx, checkout-summary-card.tsx

---

## PARTE 7 — ORDEM DE EXECUÇÃO

1. Corrigir validação (endereço obrigatório, consistência frete, validação no backend)
2. Implementar layout visual (header, steps, cards, footer)
3. Unificar Step 1 (dados + endereço + frete em uma tela)
4. Implementar OrderSummaryCard sticky
5. Adicionar banner de benefício
6. Implementar PaymentForm (PIX + Cartão)
7. Adicionar persistência de dados
8. Testes de responsividade e fluxo completo

---

## PARTE 8 — CRITÉRIOS DE ACEITAÇÃO FINAL

- [ ] Guest checkout funciona
- [ ] CEP preenche endereço via ViaCEP
- [ ] Frete calculado em tempo real após CEP
- [ ] Barra "Faltam R$ X para frete grátis" visível quando aplicável
- [ ] PIX é opção padrão
- [ ] Valores de frete idênticos no frontend e backend
- [ ] Endereço obrigatório; não avança sem CEP válido
- [ ] Backend valida endereço antes de criar cobrança
- [ ] Layout 2 colunas no desktop, 1 coluna no mobile
- [ ] Trust badges (SSL, PCI DSS) visíveis
- [ ] Resumo do pedido sempre visível (sticky desktop, colapsável mobile)
- [ ] Dados persistidos ao sair e voltar
```

---

## Resumo das melhorias

| Antes | Depois |
|-------|--------|
| 3 etapas | 2 etapas (Dados+Entrega \| Pagamento) |
| Endereço opcional | Endereço obrigatório |
| Divergência frete | Frete consistente front/back |
| Total tardio | Resumo sempre visível |
| Layout simples | Layout Zapvida (2 colunas, cards, trust) |
| Só PIX na UI | PIX + Cartão (backend já suporta) |
| Sem persistência | Salvar e restaurar dados |
| Validação fraca | Validação completa + backend |

---

*Documento gerado para execução pelo agente MeJoy. Referência: Zapvida checkout, best practices de conversão, relatório checkout/carrinho MeJoy.*
