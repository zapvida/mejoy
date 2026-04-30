# Validação — Template PDP Unificado (Todos os Produtos)

> **Data:** 2026-03-07  
> **Objetivo:** Garantir que todos os produtos usem o mesmo layout, estrutura e formatação do template mestre Akkermat.

---

## 1. Template Único para Todos

A PDP (`src/pages/p/[slug].tsx`) é **uma única página** que renderiza todos os produtos com a **mesma estrutura**:

| Seção | Ordem | Todos os produtos |
|-------|-------|-------------------|
| **First fold** | Esquerda | Galeria (5 thumbnails) + imagem hero |
| | Direita | Badges → formDisplay → H1 → Rating → Hero bullets → Trust line → Frete → Preço + Qtd + CTA |
| **Corpo** | 1–12 | O que é → Como funciona → Benefícios → Diferencial → Para quem → Como usar → Composição → Advertências → Referências → FAQ → Como funciona compra → Reviews |
| **Rodapé** | — | Quem viu, viu também |

**Diferenças apenas em dados (não em layout):**
- **Imagens:** Akkermat usa `/products/akkermat-150mg.png`; demais usam ProductPackShot (mejoy1branco + overlay) ou `/products/{slug}.png` quando existir
- **Copy:** Vem de blueprint v4, overrides ou DB
- **Rating:** Akkermat tem 4.7 (247) de demo; demais usam dados reais ou "Seja o primeiro a avaliar"

---

## 2. Correção de Imagens (2026-03-07)

**Problema:** PDPs sem imagem dedicada exibiam área em branco. Akkermat às vezes mostrava ProductPackShot. Layout sem thumbnails em produtos sem imagem.

**Solução aplicada:**
- Container da galeria: `min-h-[200px]`, `relative`
- ProductPackShot em wrapper `absolute inset-0` para preencher o espaço
- **Akkermat:** fallback por slug `akkermat-150-mg-30-capsulas` além de SKU (garante imagem dedicada)
- **Layout unificado:** 5 thumbnails sempre — imagens reais ou ProductPackShot (variant cart)
- **Dimensões fixas:** container `max-w-[380px] aspect-square min-h-[280px]` — mesmo tamanho e proporções em 100% zoom
- **ProductPackShot PDP:** scale(1.35) para preencher como foto dedicada (mejoy1branco é portrait, Akkermat é quase quadrado)
- Garante que todos os produtos exibam galeria idêntica ao template

**Arquivos:** `src/pages/p/[slug].tsx`

---

## 3. Checklist de Validação

- [x] PDP usa mesmo template para Akkermat e demais produtos
- [x] ProductPackShot renderiza corretamente na PDP (não mais em branco)
- [x] Galeria com 5 thumbnails (duplicação quando < 5)
- [x] First fold: preço + quantidade + CTA no bloco decisório
- [x] Bullets com emoji no início
- [x] Tabela de composição (PdpCompositionTable)
- [x] Advertências (PdpWarnings)
- [x] Sticky CTA mobile e desktop

---

## 4. Produto Ouro (Akkermat)

- **SKU:** MEJOY-0048
- **Slug:** akkermat-150-mg-30-capsulas
- **Imagem:** `/products/akkermat-150mg.png` (5 slots)
- **Copy:** PDP_MASTER_FULL_OVERRIDES em `copy-v2.ts`
- **Status:** Validado e intocável

---

## 5. Convenção de Imagens

| Produto | Fonte da imagem |
|---------|-----------------|
| Akkermat | `/products/akkermat-150mg.png` (hardcoded) |
| Com PNG em `public/products/` | `/products/{slug}.png` |
| Sem imagem dedicada | ProductPackShot (mejoy1branco + nome) |

Para adicionar imagem dedicada: colocar `{slug}.png` em `public/products/` e rodar `pnpm run sync:product-images`.
