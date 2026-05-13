# Passo a Passo — Lançamento Store V2 (TUDO em ordem)

**Status atual do código:** F1 (PDP premium) e F2 (Carrinho premium) implementados. Core de venda já existia. **Você ainda não executou nada manualmente.** Este doc tem TUDO na ordem certa.

---

## 📊 O que está pronto (%)

| Área | % | O que foi feito |
|------|---|-----------------|
| **Core venda** (Home, catálogo, PDP, cart, checkout PIX) | 100% | Já existia |
| **Admin** (orders, status, tracking, emails) | 100% | Já existia |
| **Dashboard cliente** | 100% | Já existia |
| **Webhook Asaas** (PAID, emails) | 100% | Já existia |
| **PDP premium** (trust bar, badges, como funciona, schema) | 100% | F1 — atrás de flag |
| **Cart premium** (progress bar frete, upsell, trust) | 100% | F2 — atrás de flag |
| **Checkout premium** (validação CPF, máscaras, WhatsApp fallback) | 0% | F3 — não implementado |
| **Analytics GA4 completo** | 0% | F4 — não implementado |
| **Reviews** | 0% | F5 — não implementado |
| **Recovery carrinho** | 0% | F6 — não implementado |

**Para VENDER agora:** ~99% (falta 1 compra E2E PIX real como validação final).  
**Para “melhor e-commerce” completo:** ~40% (F1+F2 prontos, F3–F6 pendentes).

---

## ⚠️ Importante: domínio

O projeto está linkado ao Vercel como **zapfarm**. O site da MeJoy pode estar em:
- `mejoy.com.br` (domínio customizado no projeto zapfarm), ou
- Outro projeto

Substitua `https://www.mejoy.com.br` pelos seus URLs reais nos comandos abaixo se necessário.

---

# 🔧 PASSO A PASSO (faça NA ORDEM)

---

## ETAPA 1 — Banco de dados (Supabase)

### 1.1 Migrations Store V2

1. Acesse o **Supabase** do projeto.
2. Vá em **SQL Editor**.
3. Abra o arquivo `scripts/store-v2-migrations.sql` no seu editor.
4. Copie **todo o conteúdo**.
5. Cole no SQL Editor e clique em **Run**.
6. Confirme que não há erros (se as tabelas já existirem, `IF NOT EXISTS` evita erro).

### 1.2 Importar catálogo (se ainda não fez)

Se a tabela `store_v2_products` está vazia:

1. Use o script de import existente ou o SQL em `scripts/catalog-import.sql`.
2. Siga as instruções em `docs/IMPORT_CATALOGO_SQL.md` (se existir).

---

## ETAPA 2 — Variáveis de ambiente (Vercel)

### 2.1 Obrigatórias (para vender)

No Vercel: **Settings → Environment Variables**. Garanta que existem em **Production**, **Preview** e **Development**:

| Variável | Valor | Onde pegar |
|----------|-------|------------|
| `STORE_V2` | `1` | Você já tem |
| `NEXT_PUBLIC_STORE_V2` | `1` | Você já tem |
| `DATABASE_URL` | `postgresql://your_user:your_password@your_host:5432/your_database` | Supabase → Settings → Database |
| `ASAAS_API_KEY` | `$...` | Asaas → Minha Conta → Integrações |
| `ASAAS_WEBHOOK_TOKEN` | string forte (ex: 64 chars) | **Criar e guardar** — mesmo valor do webhook |
| `ADMIN_SECRET_KEY` | string forte (ex: 64 chars) | **Criar e guardar** — para proteger /admin |
| `RESEND_API_KEY` | `re_...` | Resend.com → API Keys |

**ASAAS_ENVIRONMENT:** use `production` para PIX real.

### 2.2 Opcionais (PDP e Carrinho premium — F1 e F2)

Para ativar TrustBar ampliada, badges, progress bar de frete e upsell:

| Variável | Valor |
|----------|-------|
| `STORE_V2_CONVERSION` | `1` |
| `NEXT_PUBLIC_STORE_V2_CONVERSION` | `1` |

Sem essas, a loja funciona normalmente, só sem os extras de conversão.

### 2.3 URL base (checar)

| Variável | Valor esperado |
|----------|----------------|
| `NEXT_PUBLIC_BASE_URL` | `https://www.mejoy.com.br` (ou seu domínio) |

---

## ETAPA 3 — Webhook Asaas

1. Acesse **Asaas** → **Minha Conta** → **Webhooks**.
2. Adicione um novo webhook.
3. **URL:** `https://www.mejoy.com.br/api/webhooks/asaas`  
   (ou `https://SEU-DOMINIO/api/webhooks/asaas`).
4. **Token:** opcional — se `ASAAS_WEBHOOK_TOKEN` estiver definido, configure no Asaas; caso contrário, pode deixar em branco.
5. **Eventos:** marque `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED`.
6. Salve.

---

## ETAPA 4 — Deploy

```bash
cd ~/desenvolvimento/mejoy
git add -A
git status   # revise o que vai subir
git commit -m "chore: prep launch store v2"   # se houver algo pendente
git push origin main
```

A Vercel faz o deploy automático. Aguarde terminar.

---

## ETAPA 5 — Validação por scripts

No terminal (ajuste `BASE_URL` se o domínio for outro):

```bash
cd ~/desenvolvimento/mejoy

# 1. Health + páginas principais
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh

# 2. SEO do PDP
BASE_URL=https://www.mejoy.com.br bash scripts/validate-seo.sh

# 3. Cart premium (só passa se STORE_V2_CONVERSION=1)
BASE_URL=https://www.mejoy.com.br bash scripts/validate-cart-premium.sh
```

Os scripts 1 e 2 devem passar. O 3 só passa se você tiver ligado `STORE_V2_CONVERSION` e `NEXT_PUBLIC_STORE_V2_CONVERSION`.

---

## ETAPA 6 — Compra E2E real (PIX)

1. Acesse o site (ex.: `https://www.mejoy.com.br`).
2. Escolha um produto → **Adicionar ao carrinho**.
3. Vá para **Carrinho** → **Finalizar compra**.
4. Preencha nome, email, telefone, CPF, CEP e endereço.
5. Gere o PIX.
6. Pague com PIX (valor real).

Depois, confira:

- [ ] Pedido com status **PAID** no Asaas ou no admin.
- [ ] Email de confirmação recebido (Resend).
- [ ] Pedido visível em **/dashboard** (logado).
- [ ] Pedido visível em **/admin/store-v2/orders** (com `Authorization: Bearer ADMIN_SECRET_KEY`).

Se tudo ✅ → **lançamento liberado para campanha.**

---

## ETAPA 7 — Teste de rollback (opcional, mas recomendado)

1. No Vercel: **Settings** → **Environment Variables**.
2. Altere `STORE_V2` e `NEXT_PUBLIC_STORE_V2` para `0`.
3. Salve e faça um **Redeploy**.
4. Acesse o site: deve voltar à landing/versão antiga.
5. Volte as flags para `1` e redeploie.

---

## ETAPA 8 — Admin e operação

### Acessar admin

- URL: `https://www.mejoy.com.br/admin/store-v2/orders`
- Autenticação: header `Authorization: Bearer SEU_ADMIN_SECRET_KEY`

No browser você pode usar uma extensão para adicionar o header, ou uma ferramenta como Insomnia/Postman.

### Fluxo pós-venda

1. Pedido **PAID** → alterar para **PREPARING**.
2. Enviar → alterar para **SHIPPED** e preencher tracking.
3. Emails de envio e entrega são enviados automaticamente.

---

# 📋 RESUMO: o que você precisa fazer MANUALMENTE

| # | Ação | Onde |
|---|------|------|
| 1 | Rodar SQL das migrations | Supabase SQL Editor |
| 2 | Importar catálogo (se vazio) | Scripts/Supabase |
| 3 | Conferir/adicionar envs na Vercel | Vercel → Settings |
| 4 | Configurar webhook no Asaas | Asaas Dashboard |
| 5 | Fazer deploy | `git push origin main` |
| 6 | Rodar scripts de validação | Terminal local |
| 7 | Fazer 1 compra PIX real | Site em produção |
| 8 | Conferir PAID, email, dashboard, admin | Vários |
| 9 | (Opcional) Testar rollback | Vercel envs |

---

# 🔄 Rollback rápido

Se algo quebrar:

1. Vercel → **Environment Variables**
2. `STORE_V2=0` e `NEXT_PUBLIC_STORE_V2=0`
3. Redeploy

A loja volta para a versão antiga sem precisar de novo deploy de código.

---

# 📞 Checklist final “pronto para campanha”

- [ ] Migrations rodadas
- [ ] Catálogo com produtos
- [ ] Envs conferidas (STORE_V2, ASAAS, RESEND, etc.)
- [ ] Webhook Asaas configurado
- [ ] Deploy em produção
- [ ] `validate-store-v2-production.sh` passou
- [ ] `validate-seo.sh` passou
- [ ] 1 compra PIX real feita e validada
- [ ] PAID + email + dashboard + admin conferidos
- [ ] (Opcional) Rollback testado

Quando todos os itens estiverem marcados, pode iniciar campanhas com rampa 10% → 30% → 100%.
