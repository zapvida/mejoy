# Plano Completo — Lançamento Me Joy | Melhor E-commerce de Farmácia de Manipulação do Brasil

**Objetivo:** Lançamento contínuo, estável e validado — front e backend funcionando, alta conversão, início das vendas garantido.

---

## ✅ O QUE JÁ FIZEMOS

### Infraestrutura e Deploy

| # | Feito | Detalhe |
|---|-------|---------|
| 1 | **DATABASE_URL com pooler** | Porta 6543 (Supabase pooler) para Vercel serverless — evita "Can't reach database server" |
| 2 | **Fix build timeout** | Removido `prisma migrate deploy` do postbuild — build termina em ~2-3 min (antes 45+ min) |
| 3 | **Migrações** | Tabelas Store V2 criadas via `scripts/store-v2-migrations.sql` e Prisma schema |
| 4 | **Deploy automático** | GitHub (zapfarmx) → Vercel → www.mejoy.com.br |

### Catálogo

| # | Feito | Detalhe |
|---|-------|---------|
| 5 | **Script SQL de import** | `scripts/generate-catalog-sql.ts` → `catalog-import.sql` — 200 produtos, preço R$ 99 |
| 6 | **Import via Supabase** | Catálogo inserido diretamente no SQL Editor (produtos + variantes + price_versions) |
| 7 | **STORE_V2_SEED_PRICE_CENTS** | Suporte no import-csv para preencher preços vazios |

### Store V2 (Front + Back)

| # | Feito | Detalhe |
|---|-------|---------|
| 8 | **Home** | StoreV2Home com seções por objetivo (Sono, Saúde, Emagrecimento, etc.) |
| 9 | **Listagem** | `/c/[objetivo]` — produtos por categoria |
| 10 | **PDP** | `/p/[slug]` — página de produto |
| 11 | **Carrinho** | API + página /cart — add, remove, update qty |
| 12 | **Checkout** | /checkout — dados, CEP, frete, PIX |
| 13 | **Create Payment** | API cria Order + pagamento Asaas PIX |
| 14 | **Webhook Asaas** | PAYMENT_CONFIRMED → Order.status = PAID |
| 15 | **API cart** | Corrigido include inválido no Prisma |

### Documentação e Scripts

| # | Feito | Detalhe |
|---|-------|---------|
| 16 | **ENVS_VERCEL_COPIAR_COLAR.md** | Envs prontas para copiar na Vercel |
| 17 | **docs/FIX_BUILD_TIMEOUT.md** | Explicação do fix de timeout |
| 18 | **docs/IMPORT_CATALOGO_SQL.md** | Guia de import via SQL |
| 19 | **scripts/validate-store-v2-production.sh** | Validação automatizada em produção |

---

## 🚧 O QUE FALTA PARA LANÇAMENTO E INÍCIO DAS VENDAS

### Crítico (antes de vender)

| # | Pendente | Impacto | Como fazer |
|---|----------|---------|------------|
| 1 | **Validar fluxo completo** | Garantir que compra funciona | Rodar `BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh` + teste manual (home → PDP → cart → checkout → PIX sandbox) |
| 2 | **Webhook Asaas configurado** | Sem isso, Order não atualiza ao pagar | Asaas Dashboard → Webhooks → URL `https://www.mejoy.com.br/api/asaas/webhook` + eventos PAYMENT_CONFIRMED, PAYMENT_RECEIVED |
| 3 | **ASAAS_WEBHOOK_TOKEN** | Segurança do webhook | Configurar na Vercel e no Asaas (mesmo valor) |
| 4 | **Página obrigado/sucesso** | Cliente vê confirmação | Usar orderId da URL para mostrar resumo do pedido + próximos passos (já existe /checkout/sucesso — pode ser genérica) |

### Alto (primeira semana de vendas)

| # | Pendente | Impacto | Como fazer |
|---|----------|---------|------------|
| 5 | **Dashboard paciente — pedidos Store V2** | Cliente vê seus pedidos | API `/api/store-v2/orders` + exibir no dashboard junto com ZapfarmOrder |
| 6 | **Email confirmação PIX** | Confiança pós-compra | Resend: template com resumo, valor, próximos passos — disparar no webhook quando status = PAID |
| 7 | **Admin — pedidos Store V2** | Operação consegue ver pedidos | Aba "Pedidos Loja" no admin — listar Order (store_v2) com filtros |
| 8 | **Slugs canônicos** | URLs limpas (ex: /p/5-htp-50-mg) | Verificar se slugs do SQL batem com navegação; ajustar se necessário |

### Médio (conversão e operação)

| # | Pendente | Impacto | Como fazer |
|---|----------|---------|------------|
| 9 | **Trust signals PDP** | Aumenta conversão | Badges (ANVISA, manipulação segura), garantias, política de troca em destaque |
| 10 | **Rastreamento de envio** | Cliente acompanha entrega | Campos trackingCode/trackingUrl no Order; admin preenche; dashboard mostra link |
| 11 | **Página /pedidos/[orderId]** | Detalhe do pedido | Itens, endereço, status, próximos passos |
| 12 | **Status Order** | Fluxo operacional | PAID → PREPARING → SHIPPED → DELIVERED |

### Pós-lançamento (escala)

| # | Pendente | Impacto | Como fazer |
|---|----------|---------|------------|
| 13 | **RX/Validação completo** | Produtos que exigem receita | Upload receita → admin aprova → libera pagamento |
| 14 | **Assinaturas** | Recorrência | ProductSubscription + Asaas subscription |
| 15 | **Cartão de crédito** | Mais opções de pagamento | CREDIT_CARD já em create-payment — habilitar form ou redirect |
| 16 | **Reviews/avaliações** | Prova social | Modelo ProductReview existe — UI de exibição e envio |

---

## 🎯 JORNADA COMPLETA (VISÃO FINAL)

```
Visitante → Home (200 produtos por objetivo)
  → /c/sono, /c/emagrecimento...
    → PDP /p/[slug] (benefícios, selos, CTA)
      → Adiciona ao carrinho → /cart
        → /checkout (dados, CEP, frete, PIX)
          → Paga PIX
            → Webhook → Order PAID
              → Email confirmação
                → Dashboard: "Pedido #X — Pago"
                  → Admin: prepara, preenche tracking
                    → "Pedido em trânsito"
                      → Cliente rastreia
                        → Produto em casa
```

---

## 📋 CHECKLIST PRÉ-VENDA (ordem)

- [ ] Catálogo no banco (200 produtos com preço) ✅ feito via SQL
- [ ] Home exibe seções por objetivo
- [ ] /c/sono retorna 200 e lista produtos
- [ ] /p/[slug] retorna 200 (slug canônico do banco, ex: /p/5-htp-50-mg-1)
- [ ] Adicionar ao carrinho funciona
- [ ] /cart exibe itens
- [ ] /checkout aceita dados e gera PIX
- [ ] Webhook Asaas configurado e testado
- [ ] ASAAS_WEBHOOK_TOKEN igual na Vercel e Asaas
- [ ] Teste E2E: compra sandbox → Order PAID

---

## 🛠 COMANDOS ÚTEIS

```bash
# Validação em produção
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh

# Gerar SQL do catálogo (outro preço)
PRICE_CENTS=14900 pnpm exec tsx scripts/generate-catalog-sql.ts

# Import local (se API falhar)
STORE_V2_SEED_PRICE_CENTS=9900 pnpm exec tsx scripts/import-catalog-local.ts
```

---

## 📁 ARQUIVOS-CHAVE

| Arquivo | Uso |
|---------|-----|
| **`docs/GO_LIVE_LOCKDOWN.md`** | **1 página — passos manuais, rollback, campanha** |
| `scripts/catalog-import.sql` | Import catálogo no Supabase SQL Editor |
| `scripts/generate-catalog-sql.ts` | Gera SQL a partir do CSV |
| `scripts/validate-store-v2-production.sh` | Valida rotas em produção (PDP usa slug dinâmico via /api/store-v2/catalog/sample-slug — evita falso positivo 404) |
| `ENVS_VERCEL_COPIAR_COLAR.md` | Envs para Vercel |
| `docs/FIX_BUILD_TIMEOUT.md` | Por que build não roda migrate |
| `docs/IMPORT_CATALOGO_SQL.md` | Guia import SQL |

---

## 🚀 PASSOS MANUAIS FINAIS (Go-Live)

### 1. Migration em produção
**Opção A (recomendado — não trava):** Supabase SQL Editor → copiar `scripts/store-v2-migrations.sql` → Run.

**Opção B:** `pnpm migrate:deploy` (usa .env.local; pode demorar/travar em conexão remota).

### 2. Envs obrigatórias (Vercel)
| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `STORE_V2` | Sim | `1` para ativar |
| `NEXT_PUBLIC_STORE_V2` | Sim | `1` para ativar |
| `DATABASE_URL` | Sim | URL PostgreSQL (pooler porta 6543) |
| `ASAAS_API_KEY` | Sim | Chave Asaas (prod ou sandbox) |
| `ASAAS_WEBHOOK_TOKEN` | Sim (prod) | Token do webhook — **obrigatório em produção** |
| `ADMIN_SECRET_KEY` | Sim | Token para admin store-v2 |
| `RESEND_API_KEY` | Sim | Emails confirmação pós-compra |

### 3. Configurar webhook no painel Asaas
- **URL:** `https://www.mejoy.com.br/api/asaas/webhook`
- **Eventos:** PAYMENT_CONFIRMED, PAYMENT_RECEIVED
- **Token:** mesmo valor de `ASAAS_WEBHOOK_TOKEN` (header `x-asaas-webhook-token` ou `asaas-access-token`)

### 4. Rodar validate em produção
```bash
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

### 5. Compra teste real end-to-end
1. Home → PDP → Adicionar ao carrinho → Checkout
2. Preencher dados, CEP, gerar PIX
3. Pagar PIX (sandbox ou prod)
4. Verificar: Order PAID + email recebido + aparece no dashboard + admin vê pedido

---

## 🔄 PLANO DE ROLLBACK

**Se algo quebrar, rollback imediato em ~1 minuto:**

1. Vercel → Project → Settings → Environment Variables
2. `STORE_V2=0` e `NEXT_PUBLIC_STORE_V2=0`
3. Salvar → Redeploy ou aguardar próximo deploy

A loja volta ao B2CLanding e fluxos legados **sem novo deploy**.

---

## 📋 CHECKLIST DE CAMPANHA (quando liberar tráfego)

- [ ] Migration prod aplicada
- [ ] Envs configuradas (ASAAS_WEBHOOK_TOKEN obrigatório em prod)
- [ ] Webhook Asaas configurado com token
- [ ] Validate script passou (200 em todos os health + PDP + admin 401)
- [ ] Compra teste real E2E confirmada (PAID → email → dashboard)
- [ ] Liberar tráfego gradualmente: 10% → 30% → 100%
- [ ] Rollback pronto: `STORE_V2=0` em caso de incidente

---

**Documento vivo — atualizar conforme itens forem concluídos.**
