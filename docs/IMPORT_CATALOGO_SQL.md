# Import do catálogo Store V2 via SQL

O script via API (`bash scripts/import-catalog-production.sh`) pode falhar por `ADMIN_SECRET_KEY` ou timeout. Use SQL diretamente no Supabase:

## Opção 1 — SQL no Supabase (recomendado)

1. **Gere o arquivo SQL:**
   ```bash
   pnpm exec tsx scripts/generate-catalog-sql.ts
   ```
   Cria `scripts/catalog-import.sql` com 200 produtos, preço R$ 99.

2. **Abra o SQL Editor do Supabase:**  
   https://supabase.com/dashboard/project/xbfhvepljmcaztpjbryn/sql/new

3. **Cole o conteúdo** de `scripts/catalog-import.sql`

4. **Execute** (Run)

5. **Confira:** https://www.mejoy.com.br — a home deve exibir as seções por objetivo.

---

## Opção 2 — Import local (contra o banco de produção)

```bash
# Com .env.local carregado (DATABASE_URL = pooler produção)
STORE_V2_SEED_PRICE_CENTS=9900 pnpm exec tsx scripts/import-catalog-local.ts
```

Pode demorar ~1–2 min (200 inserts via pooler).

---

## Opção 3 — API (se ADMIN_SECRET_KEY estiver correto)

1. Adicione na Vercel: `STORE_V2_SEED_PRICE_CENTS=9900` (preenche preços vazios)
2. Redeploy
3. Execute:
   ```bash
   bash scripts/import-catalog-production.sh
   ```

---

## Preço padrão

O CSV não tem preços. Usamos R$ 99,00 (9900 centavos) como padrão.

Para outro valor:
```bash
PRICE_CENTS=14900 pnpm exec tsx scripts/generate-catalog-sql.ts   # R$ 149
```
