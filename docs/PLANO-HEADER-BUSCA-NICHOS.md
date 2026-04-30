# Plano Header, Busca Inteligente e Nichos — MeJoy Farma

> **Objetivo:** Layout premium, busca inteligente com IA (nome, sintomas, ingredientes) e nichos sem travamento — igual ou superior ao concorrente (OficialFarma).  
> **Status:** ✅ Implementado em 2026-03-07

---

## Implementado

### 1. Layout em duas linhas
- **Linha 1:** Logo + busca central (max-w-xl) + ícones (conta, favoritos, carrinho, WhatsApp)
- **Linha 2:** Nichos com `gap-8` e `border-t`
- `backdrop-blur-md` → `backdrop-blur-sm` para reduzir travamento

### 2. Correção do travamento nos nichos
- Removido `animate-fade-in` (0.6s) do dropdown
- Substituído por `transition-opacity duration-150`
- Adicionado delay de 120ms no `onMouseLeave` para evitar fechar ao mover entre botão e dropdown
- `onMouseEnter` cancela o timeout de fechamento

### 3. Nomes em duas linhas
- CATEGORIES com `nameLine1` e `nameLine2` opcionais
- Ex.: Emagrecimento | & Metabolismo; Saúde | Imunidade, Energia & mais; Cabelo | Pele & Beleza

### 4. Busca inteligente
- Novo `lib/store-v2/search-intelligent.ts`
- Busca por: nome, slug, tags, objective, activeIngredients (Prisma)
- **Expansão por sintoma:** insônia→Sono, ansiedade→Ansiedade & Humor, emagrecer→Emagrecimento, etc.
- **Boost por copy v4:** problem_statement, para_que_serve, semantic_entities, keywords
- API `/api/store-v2/search` usa `searchProductsIntelligent`

### 5. Placeholder
- "O que você está buscando?" (header e página /search)

---

## Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `StorefrontHeader.tsx` | Layout 2 linhas, nichos, delay dropdown, nomes 2 linhas |
| `HeaderSearch.tsx` | Placeholder, max-w-xl |
| `search-intelligent.ts` | Novo — busca com sintomas e copy |
| `copy-v2.ts` | Campos problem_statement, semantic_entities, keywords |
| `api/store-v2/search.ts` | Usa searchProductsIntelligent |
| `pages/search.tsx` | Placeholder |
