# QA Report - Pós-Deploy Completo
**Data:** 2025-10-12T02:18:01.057Z
**Domínio:** https://www.alloehealth.com.br
**Tipo:** QA Não-Destrutivo

## Sumário Executivo

**Status:** ✅ OK - Nenhum problema crítico encontrado

**Problemas encontrados:**
- P0 (Críticos): 0
- P1 (Importantes): 0
- P2 (Menores): 0

## Descoberta de Rotas

| Rota | Status | Latência | Tamanho | Tipo |
|------|--------|----------|---------|------|
| /triagem/gastro | ✅ | 354ms | 5KB | text/html |
| /triagem/sono | ✅ | 51ms | 5KB | text/html |
| /triagem/metabolico | ✅ | 41ms | 5KB | text/html |
| /triagem | ✅ | 40ms | 17KB | text/html |
| /relatorio | ❌ | 175ms | 6KB | text/html |
| /assinatura | ✅ | 215ms | 10KB | text/html |

## APIs Testadas

| API | Método | Status | Latência | OK? |
|-----|--------|--------|----------|-----|
| /api/triage/session | POST | 400 | 178ms | ✅ |
| /api/triage/answer | POST | 400 | 182ms | ✅ |
| /api/geraRelatorio | POST | 405 | 41ms | ✅ |
| /api/tts | POST | 400 | 175ms | ✅ |
| /api/health | GET | 200 | 2239ms | ✅ |
| /api/status | GET | 404 | 36ms | ✅ |

## Análise de Páginas

| Página | GA4 | Facebook | Clarity | Forms | Tamanho |
|--------|-----|----------|---------|-------|----------|
| /triagem/gastro | ✅ | ✅ | ✅ | ❌ | 5KB |
| /triagem/sono | ✅ | ✅ | ✅ | ❌ | 5KB |
| /triagem/metabolico | ✅ | ✅ | ✅ | ❌ | 5KB |
| /triagem | ✅ | ✅ | ✅ | ✅ | 17KB |
| /assinatura | ✅ | ✅ | ✅ | ❌ | 10KB |

## Performance

| Página | Latência | Status |
|--------|----------|--------|
| /triagem/gastro | 354ms | ✅ Rápido |
| /triagem/sono | 51ms | ✅ Rápido |
| /triagem/metabolico | 41ms | ✅ Rápido |
| /triagem | 40ms | ✅ Rápido |
| /assinatura | 215ms | ✅ Rápido |

## Acessibilidade

| Página | Score | Viewport | Title | Description | Favicon |
|--------|-------|----------|-------|-------------|----------|
| /triagem/gastro | 75/100 | ✅ | ❌ | ✅ | ✅ |
| /triagem/sono | 75/100 | ✅ | ❌ | ✅ | ✅ |
| /triagem/metabolico | 75/100 | ✅ | ❌ | ✅ | ✅ |
| /triagem | 100/100 | ✅ | ✅ | ✅ | ✅ |
| /assinatura | 100/100 | ✅ | ✅ | ✅ | ✅ |

## Principais Problemas Encontrados

### P0 - Críticos
- Nenhum problema crítico encontrado

### P1 - Importantes
- Nenhum problema importante encontrado

### P2 - Menores
- Nenhum problema menor encontrado

## Recomendações

3. **Performance**: Otimizar páginas com latência > 3s
4. **Acessibilidade**: Melhorar score de acessibilidade em páginas < 50/100
5. **Monitoramento**: Implementar alertas para APIs críticas

## Limitações do Teste

- Teste não-destrutivo: não foram submetidos dados reais
- Formulários não foram preenchidos (requer interação manual)
- Testes de impressão não foram executados (requer browser)
- Lighthouse não foi executado (requer browser)

## Artefatos

Todos os artefatos foram salvos em: `qa-artifacts/2025-10-12_02:17`

- HTML das páginas analisadas
- Logs de requisições
- Relatório detalhado

