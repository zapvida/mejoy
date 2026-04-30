# Catálogo Pricing V1 — Playbook

Atualização de preços e conteúdo do catálogo Store V2 via CSV → SQL UPDATE.

---

## 1. Visão geral

- **Objetivo:** Substituir preço único (R$ 99) e textos genéricos por preços variados e conteúdo individualizado.
- **Marca:** Sempre "Me Joy" (nunca "Moonjoy").
- **Compliance:** Sem alegações de cura/tratamento.
- **Reversível:** SQL de rollback disponível.

---

## 2. PASSOS MANUAIS — Ordem exata (faça na sequência)

### PASSO 1 — Gerar SQL (no seu computador)

No terminal, na pasta do projeto:

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
pnpm catalog:pricing:sql
```

**Resultado esperado:** Mensagem "✅ SQL gerado" com caminhos dos arquivos.

**Arquivos gerados:**
- `scripts/generated/store-v2-pricing-content-update.sql`
- `scripts/generated/store-v2-pricing-content-rollback.sql`
- `data/store-v2/pricing-content-v1.csv` (se não existia)

---

### PASSO 2 — Validar localmente (opcional, mas recomendado)

```bash
pnpm catalog:pricing:validate
```

**Resultado esperado:** "🎉 Validação concluída!"

Se falhar: verifique se `data/catalogo_master_mejoy_seed_200.csv` existe.

---

### PASSO 3 — Backup no Supabase + Individualizar (opcional)

**3a. Backup (exportar do Supabase)**

1. Acesse: https://supabase.com/dashboard/project/xbfhvepljmcaztpjbryn/sql/new
2. Execute e exporte como CSV:

```sql
SELECT p.sku, p."shortBenefit", p.description, p."seoTitle", p."seoDescription"
FROM store_v2_products p
ORDER BY p.sku;
```

**3b. Mesclar export com preços (para editar tudo em um CSV)**

Se você exportou o CSV do Supabase e quer individualizar textos + preços em um único arquivo:

```bash
pnpm catalog:merge "/caminho/para/Supabase Snippet Product Variant and Product Field Export.csv"
```

Por padrão gera `data/store-v2/pricing-content-merged.csv` (não sobrescreve). Para sobrescrever: use `--overwrite` no final.

O CSV contém:
- `sku` — identificador
- `priceCents` — preço de venda (ex: 6590 = R$ 65,90)
- `compareAtCents` — opcional: preço "de" (riscado). Deixe vazio se não usar.
- `shortBenefit`, `description`, `seoTitle`, `seoDescription` — textos

Edite o CSV no Excel/Sheets, salve e rode `pnpm catalog:pricing:sql` novamente.

---

### PASSO 4 — Aplicar o UPDATE no Supabase

1. Abra: https://supabase.com/dashboard/project/xbfhvepljmcaztpjbryn/sql/new
2. Abra o arquivo `scripts/generated/store-v2-pricing-content-update.sql` no seu editor
3. Copie **todo** o conteúdo
4. Cole no SQL Editor do Supabase
5. Clique em **Run**

**Resultado esperado:** "Success" — 200 linhas atualizadas em cada UPDATE.

---

### PASSO 5 — Validar produção

No terminal:

```bash
BASE_URL=https://www.mejoy.com.br bash scripts/validate-catalog-pricing-v1.sh
```

```bash
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

```bash
BASE_URL=https://www.mejoy.com.br bash scripts/validate-seo.sh
```

**Resultado esperado:** Todos com "✅" e "🎉 Validação concluída!"

---

### PASSO 6 — Compra E2E (PIX real)

1. Acesse https://www.mejoy.com.br
2. Navegue até um produto (ex: Berberina, Minoxidil)
3. Adicione ao carrinho
4. Vá para Checkout
5. Preencha dados e CEP
6. Gere o PIX e pague
7. Verifique:
   - [ ] Admin (`/admin/store-v2/orders`): pedido com status **PAID**
   - [ ] Email de confirmação recebido
   - [ ] Dashboard (`/dashboard`): pedido aparece
   - [ ] Página do pedido (`/pedidos/[orderId]`): abre e mostra status

---

### PASSO 7 — Se precisar reverter (rollback)

1. Abra: https://supabase.com/dashboard/project/xbfhvepljmcaztpjbryn/sql/new
2. Copie o conteúdo de `scripts/generated/store-v2-pricing-content-rollback.sql`
3. Cole e execute (Run)

Isso restaura todos os preços para R$ 99 e textos genéricos.

---

## 3. Resumo rápido (checklist)

| # | Ação | Onde |
|---|------|------|
| 1 | `pnpm catalog:pricing:sql` | Terminal (pasta do projeto) |
| 2 | `pnpm catalog:pricing:validate` | Terminal |
| 3 | Backup (opcional) | Supabase SQL Editor |
| 4 | Aplicar `store-v2-pricing-content-update.sql` | Supabase SQL Editor |
| 5 | Validar produção (3 scripts) | Terminal |
| 6 | Compra PIX real + checar PAID | Site + Admin |
| 7 | Rollback (se necessário) | Supabase SQL Editor |

---

## 4. Pré-requisitos

- Catálogo base: `data/catalogo_master_mejoy_seed_200.csv` (já existe)
- CSV de preços: `data/store-v2/pricing-content-v1.csv` (gerado automaticamente se não existir)
- Acesso ao Supabase do projeto

---

## 5. Estrutura do CSV de entrada (`pricing-content-v1.csv`)

| Coluna         | Obrigatório | Descrição                                      |
|----------------|-------------|------------------------------------------------|
| sku            | Sim         | Ex: MJOY-0001                                  |
| priceCents     | Sim         | Preço de venda. Ex: 6590 (R$ 65,90). Terminar em 90 quando possível. |
| nome           | Não         | Nome do produto/componente + mg (ex: 5-HTP 50 mg). Exibido para leitura. |
| compareAtCents | Não         | Preço "de" (riscado). Ex: 12900. Deixe vazio se não usar desconto. |
| shortBenefit   | Sim         | 1 frase. Sem Moonjoy.                          |
| description    | Sim         | 5–8 linhas. Sem alegações médicas.             |
| seoTitle       | Sim         | `{Nome} \| Me Joy`                             |
| seoDescription | Sim         | Até ~155 caracteres                            |

---

## 6. Regras de compliance

**Proibido:** cura, trata, reverte, garantido, 100% eficaz

**Preferir:** apoia, pode contribuir, auxilia, favorável a

**Obrigatório:** "Consulte um profissional de saúde antes do uso."

---

## 7. Comandos úteis

| Comando                    | Descrição                          |
|---------------------------|------------------------------------|
| `pnpm catalog:pricing:sql`| Gera SQL update + rollback         |
| `pnpm catalog:pricing:validate` | Valida CSV e produção (se BASE_URL) |
| `pnpm catalog:merge SUPABASE_EXPORT.csv` | Mescla export do Supabase com preços → pricing-content-v1.csv |

---

## 8. Troubleshooting (referência)

**"Moonjoy" ainda aparece**
- Verifique o CSV: nenhum campo pode conter Moonjoy
- Rode `pnpm catalog:pricing:sql` novamente (ele sanitiza)

**Todos os preços iguais**
- O CSV deve ter `priceCents` variados por formKey
- Faixas sugeridas: topical 29–89, caps 35–149, powder 45–129, etc.

**PDP 404**
- Confirme que o slug existe no banco
- Verifique `STORE_V2=1` e `NEXT_PUBLIC_STORE_V2=1` na Vercel

**Validação falha com "priceCents = 0"**
- Corrija o CSV: nenhum preço pode ser 0
