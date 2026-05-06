# Plano de Embalagens — MeJoy

> **Objetivo:** Cada produto exibe embalagem MeJoy Farma com nome do produto, conforme validado no Akkermat.

---

## Situação corrigida (2026-03-08)

### Problema
Produtos sem imagem no banco exibiam fallback **MetaboSlim** (ZapFarm) em vez da embalagem MeJoy.

### Solução implementada
1. **ProductPackShot** — Usa base `/mejoy1branco.png` (MeJoy Farma) + overlay dinâmico com nome do produto e dose.
2. **shouldUsePackShot** — Agora detecta `metaboslim` e `zapfarm` como placeholders → usa PackShot.
3. **PDP** — Produtos sem imagem real usam ProductPackShot (embalagem branca + nome). Akkermat mantém imagem dedicada.

### Resultado
- **Akkermat:** `/products/akkermat-150mg.png` (imagem dedicada)
- **Demais produtos sem imagem:** ProductPackShot com nome do produto na embalagem MeJoy

---

## Padrão de imagens por produto

### Opção A — ProductPackShot (atual)
- Base: `/mejoy1branco.png`
- Overlay: nome + dose do produto
- **Vantagem:** Funciona para todos os 162 SKUs sem assets adicionais

### Opção B — Imagem dedicada por produto
- Formato: `public/products/{slug}.png` ou `public/products/{sku}.png`
- Exemplo: `/products/5-htp-100-mg-60-capsulas.png`
- **Vantagem:** Controle total de design por produto
- **Requisito:** Gerar 162 imagens no padrão Akkermat

### Convenção automática (implementada)
- **Catalog** resolve imagens: `public/products/{slug}.png`
- Se o arquivo existe → usa. Se não → ProductPackShot.
- **Akkermat** mapeado para `/products/akkermat-150mg.png`
- **Script:** `pnpm run sync:product-images` — lista slugs e pode copiar de pasta backup

### Como adicionar imagens originais
1. Coloque as imagens em `public/products/{slug}.png`
2. Ex: `public/products/5-htp-100-mg-60-capsulas.png`
3. Ou copie de backup: `pnpm run sync:product-images -- --copy-from=./pasta-com-imagens`

---

## Checklist para imagens dedicadas

1. [ ] Gerar imagens no padrão Akkermat (MeJoy Farma, nome do produto)
2. [ ] Salvar em `public/products/{slug}.png`
3. [ ] Rodar `pnpm run sync:product-images` para validar
4. [ ] Validar em PDP, cart, checkout

---

## Arquivos relevantes

| Arquivo | Função |
|---------|--------|
| `src/components/store-v2/ProductPackShot.tsx` | Embalagem dinâmica (base + nome) |
| `src/pages/p/[slug].tsx` | Lógica de imagens na PDP |
| `public/mejoy1branco.png` | Base da embalagem MeJoy |
| `public/products/akkermat-150mg.png` | Imagem dedicada Akkermat |
