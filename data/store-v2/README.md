# Store V2 — Dados de catálogo

## Origem dos CSVs

Os arquivos de catálogo real (MEJOY-*) foram copiados do Desktop para o repo:

- `pricing-content-v3.csv` ← `~/Desktop/XXpricing-content-v3.csv`
- `catalogo_mejoy_validado_v2.csv` ← `~/Desktop/XXcatalogo_mejoy_validado_v2.csv`

**162 SKUs** (MEJOY-0001 a MEJOY-0162). O Catalog Engine restringe ao catálogo validado e reporta extras se houver.

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `catalogo_mejoy_validado_v2.csv` | Fonte de verdade: sku, niche, base_name, dose, pack, form_key, priceCents |
| `pricing-content-v3.csv` | Conteúdo: priceCents, nome, shortBenefit, description, seoTitle, seoDescription |
| `pricing-content-v3-validado.csv` | Gerado pelo Catalog Engine: normalizado (Title Case, typos, seoDescription ≤155) |
