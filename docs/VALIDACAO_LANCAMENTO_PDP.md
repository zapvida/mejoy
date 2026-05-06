# Validação Lançamento PDP — MeJoy

**Data:** 2026-03-05  
**Status:** ✅ Validado e pronto para deploy

## Resumo das alterações

### 1. Layout mobile-first
- **Produto no primeiro frame (mobile):** TrustBar movida para ABAIXO do produto. No mobile, o primeiro frame é sempre: header → breadcrumb → imagem do produto → preço → benefícios → quantidade → CTA.
- **Padding otimizado:** `pt-2`, `py-4` no mobile para produto aparecer mais alto.
- **Breadcrumb compacto:** `text-xs`, `mb-4` no mobile.

### 2. TrustBar (4 cards)
- Removido card "Parcelamento" (redundante).
- Grid 2x2 mobile / 4 colunas desktop.
- Card "Frete grátis R$ 190" com destaque âmbar.
- **Despacho em até 24h** como primeiro card.

### 3. Envio 24h (todas as páginas de produto)
- Prazo: "Envio em até 24h após manipulação. Entrega rápida para todo o Brasil."
- TrustBar, FAQ, Como funciona e seção "Prazo de manipulação + entrega" alinhados.

### 4. Benefícios entre preço e quantidade
- 3–5 benefícios factuais e validados:
  1. shortBenefit individualizado (por produto)
  2. Fórmula manipulada com controle ANVISA
  3. Despacho em até 24h
  4. Troca ou reembolso em até 7 dias
  5. Entrega para todo o Brasil com rastreio
- Bloco com fundo cinza, bordas arredondadas, ícones check.

## Validação técnica

| Item | Status |
|------|--------|
| ESLint | ✅ Passou |
| Build Next.js | ✅ Passou |
| Mobile-first (produto primeiro) | ✅ Implementado |
| TrustBar responsiva | ✅ Grid 2x2 / 4 cols |
| Benefícios factuais | ✅ Apenas dados validados |
| Sequência lógica | ✅ Preço → Benefícios → Quantidade → CTA |

## Envs necessárias (produção)

- `STORE_V2=1` e `NEXT_PUBLIC_STORE_V2=1` para loja Store V2
- `STORE_V2_CONVERSION=1` e `NEXT_PUBLIC_STORE_V2_CONVERSION=1` para TrustBar ampliada (4 cards)

## Checklist pós-deploy

1. [ ] https://www.mejoy.com.br/p/amora-negra-500-mg-60-capsulas — produto no primeiro frame
2. [ ] Testar mobile (viewport 375px) — produto visível sem scroll
3. [ ] TrustBar com 4 cards abaixo do produto
4. [ ] Benefícios entre preço e quantidade visíveis
5. [ ] Texto "Envio em até 24h" em todas as seções
