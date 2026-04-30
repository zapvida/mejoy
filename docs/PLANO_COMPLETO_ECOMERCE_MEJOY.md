# Plano Completo — E-commerce Me Joy (Melhor do Mundo)

**Objetivo:** Do catálogo vazio hoje até o melhor e-commerce de farmácia de manipulação, validado e conversível — da chegada ao site até o produto em casa.

---

## Estado atual (diagnóstico)

| Área | Status | Gap |
|------|--------|-----|
| **Catálogo** | Vazio | Import CSV não executado |
| **Home** | Funcional | Mostra "Catálogo em construção" quando sections vazio |
| **Listagem /c/[objetivo]** | Pronto | Depende do catálogo |
| **PDP /p/[slug]** | Pronto | Depende do catálogo |
| **Carrinho** | Funcional | — |
| **Checkout PIX** | Funcional | — |
| **Webhook Asaas** | Funcional | Atualiza Order (store_v2) |
| **Dashboard paciente** | Parcial | Mostra só ZapfarmOrder, não Order (Store V2) |
| **Admin** | Parcial | KPIs/funil só ZapfarmOrder, sem Store V2 |
| **Página obrigado** | Genérica | Não mostra detalhes do pedido |
| ** tracking/envio** | Ausente | Sem rastreio até a entrega |
| **Email pós-pagamento** | Ausente | Não envia confirmação |
| **RX/Validação** | Parcial | API existe, fluxo incompleto |
| **Assinaturas** | Ausente | — |

---

## Fases do plano

### Fase 1 — Lançamento mínimo (esta semana)

**1.1 Import do catálogo**

```bash
bash scripts/import-catalog-production.sh
```

- Garantir `ADMIN_SECRET_KEY` igual na Vercel e no `.env.local`
- Se preços vazios: configurar `STORE_V2_SEED_PRICE_CENTS=9900` na Vercel e reimportar (ou ajustar CSV)

**1.2 Validação do fluxo básico**

1. Home com seções por objetivo
2. Clicar em produto → PDP
3. Adicionar ao carrinho → /cart
4. Ir ao checkout → preencher CEP, dados, PIX
5. Simular pagamento (sandbox Asaas) → webhook atualiza Order

**1.3 Página de sucesso contextual**

- Usar `orderId` da URL para mostrar resumo do pedido
- Próximos passos (PIX, entrega estimada)
- Link para dashboard/pedidos

---

### Fase 2 — Jornada do paciente completa

**2.1 Dashboard paciente com pedidos Store V2**

- Nova API `/api/store-v2/orders` (por email ou profileId)
- Incluir Order (store_v2_orders) no dashboard junto com ZapfarmOrder
- Cards por pedido: itens, valor, status, data
- Estado de pagamento: Pago, Pendente, Cancelado, Reembolsado

**2.2 Página de pedido individual**

- `/pedidos/[orderId]` — detalhes, itens, endereço, status, próximos passos

**2.3 Unificação de login/sessão**

- Carrinho anônimo → ao logar, vincular ao profileId
- Pedidos Store V2 vinculados ao email/profile

---

### Fase 3 — Conversão e confiança

**3.1 UX conversão**

- PDP: provas sociais, garantias, benefícios claros
- Badges (ANVISA, entrega rápida)
- Upsell/related products no PDP e no carrinho
- Sticky CTA em mobile
- Urgência leve (estoque, prazo) sem dark patterns

**3.2 Trust signals**

- Selos (ANVISA, manipulação segura)
- Avaliações/reviews (modelo ProductReview existe)
- Depoimentos na home e PDP
- Política de troca e reembolso em destaque

**3.3 SEO e performance**

- Sitemap (já existe)
- Meta dinâmicos por produto
- Imagens otimizadas (WebP, lazy)
- Core Web Vitals

---

### Fase 4 — Admin e operação

**4.1 Admin — pedidos Store V2**

- Nova aba "Pedidos Loja" no admin
- Listagem com filtros (status, data, valor)
- Detalhe do pedido, edição de status
- Integração com funil e KPIs de receita Store V2

**4.2 Catálogo admin**

- Edição de produtos (nome, preço, status)
- Gestão de preços (PriceVersion)
- Import incremental via API

---

### Fase 5 — Pós-venda e entrega

**5.1 Comunicação pós-pagamento**

- Email de confirmação (Resend) ao pagar PIX
- Template com resumo, valor, próximos passos
- WhatsApp (Evolution) opcional: "Pagamento confirmado, vamos enviar em X dias"

**5.2 Rastreamento de envio**

- Campo `trackingCode` e `trackingUrl` no Order
- Admin: preenchimento manual ou integração transportadora
- Dashboard paciente: "Rastrear pedido" com link
- Notificação quando código preenchido

**5.3 Status de entrega**

- Order: PENDING_PAYMENT → PAID → PREPARING → SHIPPED → DELIVERED
- Dashboard e email em cada mudança (opcional)

---

### Fase 6 — RX, assinaturas e escala

**6.1 RX/validação**

- Fluxo completo: produto requiresValidation → upload receita → fila
- Admin: aprovar/rejeitar
- WhatsApp/email ao paciente com resultado
- Pagamento só após aprovação (já suportado)

**6.2 Assinaturas**

- ProductSubscription + Asaas subscription
- Desconto recorrente no PDP
- Gestão no dashboard paciente (cancelar, alterar plano)

**6.3 Cartão de crédito**

- Form ou redirect Asaas (CREDIT_CARD já em create-payment)
- 1-click para assinantes

---

## Jornada completa (visão final)

```
Visitante chega → Home (catálogo) 
  → Navega /c/sono, /c/emagrecimento 
    → PDP /p/5-htp-50-mg (benefícios, reviews, CTA) 
      → Adiciona ao carrinho 
        → /cart (upsell?) 
          → /checkout (dados, CEP, frete, PIX) 
            → Paga PIX 
              → Webhook atualiza Order 
                → Email confirmação 
                  → Dashboard: "Pedido #X — Pago" 
                    → Admin: prepara envio, preenche tracking 
                      → Dashboard: "Pedido em trânsito" 
                        → Cliente rastreia 
                          → Produto em casa 
                            → Email "Sua compra chegou"
```

---

## Prioridade sugerida

| # | Ação | Impacto | Esforço |
|---|------|---------|---------|
| 1 | Import catálogo | Crítico | 5 min |
| 2 | Página sucesso com orderId | Alto | 2h |
| 3 | API + dashboard pedidos Store V2 | Alto | 4h |
| 4 | Admin pedidos Store V2 | Alto | 4h |
| 5 | Email confirmação PIX | Alto | 2h |
| 6 | Trust signals + UX PDP | Médio | 4h |
| 7 | Tracking envio | Médio | 4h |
| 8 | RX fluxo completo | Médio | 8h |
| 9 | Assinaturas | Baixo (curto prazo) | 16h |

---

## Comandos imediatos (Fase 1)

```bash
# 1. Import catálogo
bash scripts/import-catalog-production.sh

# 2. Validação
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh

# 3. Teste manual
# - Home → seções visíveis
# - /c/sono → produtos
# - /p/[slug] → PDP
# - Adicionar → cart → checkout → PIX
```

---

**Documento vivo:** atualizar conforme fases forem concluídas.
