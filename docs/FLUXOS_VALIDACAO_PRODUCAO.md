# ✅ Página Fluxos MeJoy — Validação para Produção

**Data:** 27/02/2026  
**Status:** Implementado e funcional — 12 raios (11 produtos + Assinatura 6m)

---

## 1. O que foi implementado

- **Página `/fluxos`**: Diagrama do sol com MeJoy no centro e **12 raios** (11 produtos + Assinatura 6 meses)
- **Página `/fluxos/[slug]`**: Detalhe de cada fluxo com 3 níveis (Simples, Moderado, Completo)
- **Link "Fluxos"** no FooterB2C e FooterZapfarm
- **Sitemap** configurado para prioridade 0.85 em `/fluxos` e `/fluxos/*`
- **Números em destaque**: 33 SKUs, R$ 139 – R$ 2.700, Assinatura 6m R$ 2.382
- **MonetizationTable**: 11 produtos, assinatura 6 meses (Sócio/Não-sócio)

---

## 2. Links em produção

- `https://www.mejoy.com.br/fluxos`
- `https://www.mejoy.com.br/fluxos/emagrecimento`
- `https://www.mejoy.com.br/fluxos/tirzepatida`
- `https://www.mejoy.com.br/fluxos/assinatura-6m`
- ... (17 slugs: 11 produtos + Assinatura 6m + 5 triagens)

---

## 3. Produtos (11 raios)

| # | Slug | Nome comercial |
|---|------|----------------|
| 1 | emagrecimento | MetaboSlim |
| 2 | calvicie | CapilMax |
| 3 | sono | SonoZen |
| 4 | ansiedade | ZenDay |
| 5 | intestino | FloraBalance |
| 6 | figado | HepaDetox |
| 7 | libido-masculina | VigorMax |
| 8 | menopausa | FemBalance |
| 9 | articulacoes | ArticFlex |
| 10 | imunidade | Imuno360 |
| 11 | tirzepatida | Metabólico Rx |
| 12 | assinatura-6m | Assinatura 6m |

**Triagens (5):** gastro, geral, mental, cardiovascular, diabetes-metabolismo

---

## 4. Deploy

```bash
pnpm run deploy
# ou
git add -A && git commit -m "feat(fluxos): 11 raios, Tirzepatida, layout otimizado" && pnpm run deploy
```

---

## 5. Envs Vercel (Tirzepatida)

Se ainda não configuradas:

```bash
vercel env add ASAAS_PRICE_TIRZEPATIDA_2_5   # 120000
vercel env add ASAAS_PRICE_TIRZEPATIDA_5     # 220000
vercel env add ASAAS_PRICE_TIRZEPATIDA_20    # 270000
```
