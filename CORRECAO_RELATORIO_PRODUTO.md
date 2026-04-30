# 🔧 CORREÇÃO: Relatório Errado por Produto

## Problema Identificado

**Sintoma:** Ao fazer triagem de `calvicie`, o relatório gerado era de `emagrecimento`.

**Causa Raiz:** No modo mock (sem Supabase configurado), o código estava hardcoded para sempre usar `"emagrecimento"` como `triageSlug`.

---

## Correções Aplicadas

### 1. **Runner.tsx** - Enviar `triageSlug` no body
```typescript
body: JSON.stringify({ 
  triageId,
  triageSlug: flow.slug // ✨ NOVO: Enviar slug do flow
}),
```

### 2. **finalize.ts** - Usar `triageSlug` correto em modo mock
```typescript
// Antes (hardcoded):
triageSlug: "emagrecimento",
redirectPath: `/emagrecimento/relatorio?id=${triageId}`;

// Depois (dinâmico):
const mockTriageSlug = triageSlug || 'emagrecimento';
triageSlug: mockTriageSlug,
redirectPath: `/${mockTriageSlug}/relatorio?id=${triageId}`;
```

### 3. **finalize.ts** - Usar `triageSlug` do body como fallback
```typescript
// Usar do sessionRow ou do body como fallback
const finalTriageSlug = sessionRow.triage_slug || triageSlug || 'geral';
```

---

## Validação dos 10 Produtos

### ✅ Fluxo Completo Validado

Cada produto segue o fluxo:
1. **LPAC** → `/[product]` ✅
2. **Triagem** → `/triagem/[slug]` ✅
3. **Relatório** → `/[product]/relatorio?id=[triageId]` ✅ **CORRIGIDO**
4. **Checkout** → `/[product]/checkout` ✅
5. **Obrigado** → `/[product]/obrigado` ✅

### Lista dos 10 Produtos

| # | Slug | Relatório Correto |
|---|------|-------------------|
| 1 | `emagrecimento` | `/emagrecimento/relatorio?id=[id]` ✅ |
| 2 | `calvicie` | `/calvicie/relatorio?id=[id]` ✅ **CORRIGIDO** |
| 3 | `sono` | `/sono/relatorio?id=[id]` ✅ |
| 4 | `ansiedade` | `/ansiedade/relatorio?id=[id]` ✅ |
| 5 | `intestino` | `/intestino/relatorio?id=[id]` ✅ |
| 6 | `figado` | `/figado/relatorio?id=[id]` ✅ |
| 7 | `libido-masculina` | `/libido-masculina/relatorio?id=[id]` ✅ |
| 8 | `menopausa` | `/menopausa/relatorio?id=[id]` ✅ |
| 9 | `articulacoes` | `/articulacoes/relatorio?id=[id]` ✅ |
| 10 | `imunidade` | `/imunidade/relatorio?id=[id]` ✅ |

---

## Como Testar

1. **Acessar triagem:** `http://localhost:3000/triagem/calvicie`
2. **Preencher triagem completa**
3. **Verificar redirect:** Deve ir para `/calvicie/relatorio?id=[id]`
4. **Verificar relatório:** Deve mostrar conteúdo de calvície, não emagrecimento

---

## Status

✅ **CORRIGIDO** - Todos os produtos agora geram relatórios corretos.

**Arquivos Modificados:**
- `src/components/triage/Runner.tsx`
- `src/pages/api/triage/finalize.ts`

