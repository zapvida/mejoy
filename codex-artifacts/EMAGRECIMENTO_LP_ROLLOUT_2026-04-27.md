# Emagrecimento LP Rollout (2026-04-27)

## Objetivo

Elevar o fluxo de emagrecimento para padrão de lançamento contínuo com:

- design premium e consistente (desktop + mobile)
- copy orientada à conversão com conformidade regulatória
- imagens otimizadas e alinhadas ao contexto de saúde/autoridade

## Entrega de assets

### Bibliotecas completas extraídas

- `public/images/benchmarks/medvi-home/` (111 arquivos)
- `public/images/benchmarks/medvi-glp/` (111 arquivos)

### Kit curado em produção

- `public/images/emagrecimento/medvi/` (24 arquivos)

### Pacotes finais prontos para uso

- `codex-artifacts/medvi-site-images-2026-04-27.zip` (extração completa original)
- `codex-artifacts/medvi-site-images-best-2026-04-27.zip` (versão otimizada máxima)
- `codex-artifacts/mejoy-curated-emagrecimento-medvi-2026-04-27.zip` (kit curado em produção)
- `codex-artifacts/medvi-image-bundles-summary-2026-04-27.csv` (inventário de arquivos e bytes)

## Mudanças estruturais

- LP principal `/emagrecimento` com nova hierarquia visual e bloco extra de decisão:
  - Hero reforçado
  - prova de confiança
  - explicação de fluxo
  - diferenciais e acompanhamento
  - planos
  - novo decision fold pré-FAQ
- Páginas auxiliares também elevadas para o mesmo padrão:
  - `/emagrecimento/como-funciona`
  - `/emagrecimento/tratamentos`
  - `/emagrecimento/especialistas`
  - `/emagrecimento/resultados`
  - `/emagrecimento/obrigado`
- Rodada final de consistência de funil e painel:
  - `/triagem` (entrada de triagens com UX mobile otimizada e paleta alinhada)
  - `/triagem/[slug]` e `/triagem/[slug]/resumo` (loading/erro/conclusão mais confiáveis visualmente)
  - `/dashboard` (painel do cliente alinhado à identidade premium do fluxo)

## Design system aplicado

- Troca de paleta dominante para `emerald/slate/amber`
- Remoção da dominância visual roxa no fluxo de emagrecimento
- Tipografia dedicada via `next/font`:
  - display: `Sora`
  - body: `Manrope`
- Variáveis de tema da LP adicionadas em `ObesidadeImageGlobalStyles`

## Copywriting aplicado

- Mensagens orientadas a decisão (clareza de processo + redução de risco percebido)
- CTA unificado para triagem/elegibilidade
- Linguagem de autoridade sem promessas absolutas
- Ajustes de confiança/privacidade/conformidade em pontos críticos

## Robustez

- Verificação de referências de imagem: `44` referências verificadas, `0` ausentes
- Ajustes de contatos e links de marca para `mejoy.com.br`

## Observação de validação local

- Não foi possível executar build/lint automatizado nesta sessão porque o ambiente atual não possui `node_modules` e não possui `pnpm/npm` instalados.
