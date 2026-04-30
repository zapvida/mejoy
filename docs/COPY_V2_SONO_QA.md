# QA Copy v2 — Cluster Sono

**Data:** 2026-03-06  
**Status:** ✅ Aprovado (11/11 PDPs)

## Resumo

Validação técnica/editorial do piloto Sono. As 11 PDPs do cluster possuem dados v2 completos (hero_benefit, description_md, faq, cautions, seoTitle, seoDescription, seo_h1).

---

## Checklist de validação

| Item | Status |
|------|--------|
| `NEXT_PUBLIC_COPY_V2_PILOT` documentada | ✅ |
| 11 SKUs do cluster Sono no v2 | ✅ |
| hero_benefit preenchido | ✅ |
| description_md preenchido | ✅ |
| faq com pares Q&A | ✅ |
| cautions preenchido | ✅ |
| seoTitle, seoDescription, seo_h1 | ✅ |
| Slugs mapeados (catalog-report) | ✅ |

---

## Produtos do piloto

| SKU | Produto | Slug |
|-----|---------|------|
| MEJOY-0152 | Gaba 200 mg | gaba-200-mg-60-capsulas |
| MEJOY-0153 | Gaba 400 mg | gaba-400-mg-60-capsulas |
| MEJOY-0154 | Melatonina 3 mg | melatonina-3-mg-100-capsulas |
| MEJOY-0155 | Melatonina 5 mg | melatonina-5-mg-100-capsulas |
| MEJOY-0156 | Melatonina 5 mg | melatonina-5-mg-30-capsulas |
| MEJOY-0157 | Mulungu 200 mg | mulungu-200-mg-60-capsulas |
| MEJOY-0158 | Passiflora 200 mg | passiflora-200-mg-60-capsulas-1 |
| MEJOY-0159 | Proslepp 130 mg | proslepp-130-mg-60-capsulas |
| MEJOY-0160 | Relora 250 mg | relora-250-mg-60-capsulas |
| MEJOY-0161 | Relora 500 mg | relora-500-mg-30-capsulas |
| MEJOY-0162 | Valeriana 100 mg | valeriana-100-mg-60-capsulas |

---

## Validação manual no navegador

**Com `NEXT_PUBLIC_COPY_V2_PILOT=1`:**

1. **https://www.mejoy.com.br/c/sono** — cards com hero_benefit do v2
2. **PDPs** — FAQ, H1, description, cautions do v2
3. **PDP fora do piloto** — fallback (comportamento atual)

**Com flag desligada:**

- Tudo em fallback (Prisma/pricing)

---

## Comando

```bash
pnpm run copy:qa-sono
```

Relatório: `scripts/generated/copy-v2-sono-qa-report.json`
