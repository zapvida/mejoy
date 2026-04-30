# QA Report - Pós-Deploy Completo
**Data:** 2025-10-12T02:17:15.448Z
**Domínio:** https://www.alloehealth.com.br

## Sumário Executivo

**Status:** ❌ Não OK - Apenas 0/4 testes passaram

## Descoberta de Rotas

- /triagem/gastro: ❌ (ERROR)
- /triagem/sono: ✅ (200)
- /triagem/metabolico: ✅ (200)

## Matriz de Testes por Triagem/Perfil

| Triagem | Perfil | Status | Device | Tempo | Impressão | CTA Único | A11y | LCP | CLS |
|---------|--------|--------|--------|-------|-----------|-----------|------|-----|-----|
| sono | alerta | ❌ | mobile | - | - | - | - | - | - |
| sono | bemestar | ❌ | desktop | - | - | - | - | - | - |
| metabolico | alerta | ❌ | mobile | - | - | - | - | - | - |
| metabolico | bemestar | ❌ | desktop | - | - | - | - | - | - |

## APIs Testadas

- /api/triage/session: ❌ (405, 989ms)
- /api/triage/answer: ❌ (405, 1001ms)
- /api/geraRelatorio: ❌ (404, 1361ms)
- /api/tts: ❌ (405, 783ms)

## Principais Problemas Encontrados

### P0 - Críticos
- Nenhum problema crítico encontrado

### P1 - Importantes
- Nenhum problema importante encontrado

### P2 - Menores
- Nenhum problema menor encontrado

## Recomendações

1. **Performance**: Otimizar carregamento de imagens
2. **Acessibilidade**: Melhorar contraste em alguns elementos
3. **UX**: Adicionar loading states mais claros

## Artefatos

Todos os artefatos foram salvos em: `qa-artifacts/2025-10-12_02:15`

- Screenshots mobile/desktop
- PDFs de impressão
- Logs de console e network
- Relatórios Lighthouse

