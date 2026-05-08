# Manifesto de Paridade Visual — LP Emagrecimento

Data de referência principal: `2026-05-02`

## Fonte oficial do benchmark

- Desktop congelado: `medvi.zip`
- Mobile e comportamento: `https://glp1.medvi.org/` observado em `May 2, 2026`
- Página alvo: `https://www.mejoy.com.br/emagrecimento`

## Princípio de fidelidade

- Espelhar hierarquia, ritmo, frames, ordem das imagens e spacing da Medvi.
- Manter marca Mejoy, copy PT-BR e compliance Brasil.
- Quando houver conflito entre copy e footprint, adaptar a copy para caber no layout. Não expandir o layout.

## Frames aprovados da Mejoy

1. Hero
   - Selector: `[data-testid="emagrecimento-hero"]`
   - Conteúdo esperado:
     - faixa superior simples
     - header mínimo
     - headline central
     - até 4 bullets
     - um CTA dominante
     - mosaico humano integrado
2. Prova / autoridade
   - Selector: `[data-testid="emagrecimento-proof"]`
   - Conteúdo esperado:
     - heading curto
     - badges de confiança
     - 3 cards de autoridade
3. Tratamentos / formatos
   - Selector: `[data-testid="emagrecimento-treatments"]`
   - Conteúdo esperado:
     - 3 cards
     - card central destacado
     - imagens em ordem editorial, sem cara de grade genérica
4. Resultados / depoimentos
   - Selector: `[data-testid="emagrecimento-results"]`
   - Conteúdo esperado:
     - quote principal
     - imagens editoriais
     - sem carrossel
5. Decisão final
   - Selector: `[data-testid="emagrecimento-decision"]`
   - Conteúdo esperado:
     - CTA final dominante
     - 3 bullets
     - imagem e sinais de confiança

## Ordem dos assets principais

### Hero / mosaico

1. `/images/emagrecimento/medvi/reviews-06.webp`
2. `/images/emagrecimento/medvi/hero-main.webp`
3. `/images/emagrecimento/medvi/hero-secondary.webp`
4. `/images/emagrecimento/medvi/reviews-07.webp`
5. `/images/emagrecimento/medvi/reviews-04.avif`

### Resultados / prova editorial

1. `/images/emagrecimento/medvi/reviews-01.webp`
2. `/images/emagrecimento/medvi/reviews-03.avif`
3. `/images/emagrecimento/medvi/reviews-04.avif`
4. `/images/emagrecimento/medvi/support-whatsapp.avif`

### Tratamentos / formatos

1. `/images/emagrecimento/medvi/treatment-comprimidos.avif`
2. `/images/emagrecimento/medvi/treatment-escolha.avif`
3. `/images/emagrecimento/medvi/treatment-injetavel.webp`

## Checklist de validação manual

- Ordem dos frames igual ao manifesto
- Ordem das imagens preservada
- Quebras de linha da headline estáveis em desktop e `390px`
- CTA principal visível acima da dobra
- Banner de cookies mobile não cobre CTA, price line nem início da hero
- Nenhum placeholder numérico ou texto provisório em hero, relatório ou checkout
- Sem quebra de cards, truncamento ou sobreposição em desktop e mobile
