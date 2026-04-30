# Deploy Lançamento Final — Me Joy

**Data:** 05/03/2026  
**Status:** Textos individualizados, PIX corrigido, manifest, catalog com ON CONFLICT DO UPDATE.

---

## O que foi corrigido

| Problema | Solução |
|----------|---------|
| **Textos genéricos** nos cards | `apply-individual-short-benefits.ts` aplicado ao CSV; `catalog-apply.sql` agora usa ON CONFLICT DO UPDATE para atualizar shortBenefit em produtos existentes |
| **Produto 5-HTP 50 mg indisponível** | `catalog-apply.sql` e `short-benefit-update.sql` garantem `status='active'` e `active=true` para todos MEJOY-* |
| **PIX 400 Bad Request** | Causado por produto com status != 'active'. Após rodar o SQL, produtos ficam ativos |
| **manifest.webmanifest 404** | Arquivo criado em `public/manifest.webmanifest` |

---

## Passos para deploy (ordem)

### 1. Supabase — Garantir produtos disponíveis

**Obrigatório:** No **Supabase SQL Editor**, execute para garantir que todos os 162 produtos estejam disponíveis para venda:

```
scripts/generated/ensure-products-active.sql
```

Ou execute manualmente:
```sql
UPDATE store_v2_products SET status = 'active', active = true WHERE sku LIKE 'MEJOY-%';
```

### 2. Supabase — Catálogo completo (opcional)

**Opção A (recomendado):** `scripts/generated/catalog-apply.sql`
- Insere novos produtos MEJOY-*
- Atualiza shortBenefit, description, seoTitle, seoDescription em produtos existentes
- Garante status='active' e active=true

**Opção B (só atualizar textos):** `scripts/generated/short-benefit-update.sql`
- Atualiza shortBenefit individualizado nos 162 produtos
- Garante status='active' e active=true

### 3. Deploy Vercel

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
git add .
git commit -m "feat: textos individuais, manifest, catalog ON CONFLICT DO UPDATE"
pnpm run deploy
```

### 4. Validação pós-deploy

1. **Textos:** https://www.mejoy.com.br — verificar que cada produto tem descrição única
2. **Compra PIX:** Adicionar produto (ex: Melatonina 3 mg), finalizar compra, gerar PIX
3. **Manifest:** Console do navegador não deve mais mostrar 404 em manifest.webmanifest

---

## Comandos úteis (regenerar SQL)

```bash
# Aplicar shortBenefits individuais ao CSV
pnpm tsx scripts/apply-individual-short-benefits.ts

# Regenerar catalog-apply.sql (usa CSV atualizado)
pnpm catalog:sql

# Validar em produção
BASE_URL=https://www.mejoy.com.br pnpm catalog:validate
```

---

## Supabase — Redirect URLs (reset de senha)

Para o fluxo "Esqueci minha senha" funcionar, adicione em **Supabase → Authentication → URL Configuration → Redirect URLs**:

```
https://www.mejoy.com.br/auth/update-password
https://www.mejoy.com.br/auth/callback
```

---

## Arquivos alterados nesta correção

- `data/store-v2/pricing-content-v3-validado.csv` — shortBenefits individuais
- `scripts/catalog-engine.ts` — ON CONFLICT DO UPDATE em vez de DO NOTHING
- `scripts/generated/catalog-apply.sql` — regenerado
- `scripts/generated/short-benefit-update.sql` — UPDATE status/active no início
- `scripts/generated/ensure-products-active.sql` — **novo** — garante todos MEJOY-* ativos
- `public/manifest.webmanifest` — **novo** — evita 404 no console
