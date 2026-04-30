# Smoke Test Completo - 10 Produtos ZapFarm

Este script valida o fluxo completo de todos os 10 produtos ZapFarm em produção, garantindo que tudo está funcionando antes do lançamento contínuo.

## 🎯 O que é testado

Para cada um dos 10 produtos, o script valida:

1. **Página do Produto (LPAC)** - `/[product]`
   - Verifica se a página carrega corretamente
   - Valida status HTTP 200

2. **Página de Triagem** - `/triagem/[slug]`
   - Verifica se a página de triagem está acessível
   - Valida que o fluxo pode ser iniciado

3. **API de Sessão de Triagem** - `/api/triage/session`
   - Testa criação de sessão de triagem
   - Valida resposta da API

4. **API de Relatório** - `/api/triage/finalize`
   - Verifica se a API está acessível
   - Valida estrutura de resposta

5. **Página de Checkout** - `/[product]/checkout` ou `/checkout`
   - Verifica se a página de checkout está disponível
   - Valida que o fluxo de compra pode ser iniciado

## 📦 Produtos Testados

1. **MetaboSlim** (emagrecimento)
2. **CapilMax** (calvicie)
3. **SonoZen** (sono)
4. **VigorMax** (ansiedade)
5. **FloraBalance** (intestino)
6. **HepaDetox** (figado)
7. **VigorMax** (libido-masculina)
8. **FemBalance 360** (menopausa)
9. **ArticFlex** (articulacoes)
10. **Imuno360** (imunidade)

## 🚀 Como Executar

### Teste em Produção (padrão)
```bash
npm run qa:zapfarm:prod
```

### Teste em Ambiente Customizado
```bash
PRODUCTION_URL=https://www.zapfarm.com.br npm run qa:zapfarm
```

### Execução Direta
```bash
tsx scripts/qa/zapfarm-production-smoke.ts
```

## 📊 Saída do Teste

O script gera um relatório completo mostrando:

- ✅ Testes que passaram
- ❌ Testes que falharam
- ⏱️ Duração de cada teste
- 📦 Resumo por produto
- 📈 Estatísticas gerais

### Exemplo de Saída

```
🚀 ZAPFARM - SMOKE TEST COMPLETO EM PRODUÇÃO
================================================================================
🎯 Target: https://www.zapfarm.com.br
📦 Produtos: 10
⏰ Início: 2024-01-15T10:30:00.000Z
================================================================================

🏗️  TESTANDO INFRAESTRUTURA BÁSICA
--------------------------------------------------------------------------------
  ✅ Homepage: ✅ 200 (245ms)
  ✅ Sitemap: ✅ 200 (189ms)
  ✅ Robots.txt: ✅ 200 (156ms)
  ✅ Health Check: ✅ 200 (98ms)

🛍️  TESTANDO FLUXOS DOS PRODUTOS
================================================================================

📦 Testando: MetaboSlim (emagrecimento)
--------------------------------------------------------------------------------
  ✅ Página MetaboSlim: ✅ 200 (312ms)
  ✅ Triagem MetaboSlim: ✅ 200 (298ms)
  ✅ API Sessão Triagem MetaboSlim: ✅ API respondeu (456ms) - ID: abc12345...
  ✅ API Relatório MetaboSlim: ✅ 400 (234ms)
  ✅ Checkout MetaboSlim: ✅ 200 (567ms)

...

📊 RELATÓRIO FINAL
================================================================================
⏱️  Duração Total: 45.32s
✅ Passou: 48/50 (96.0%)
❌ Falhou: 2/50 (4.0%)
⏭️  Pulado: 0/50

📦 RESUMO POR PRODUTO:
  ✅ MetaboSlim: 5/5 testes passaram
  ✅ CapilMax: 5/5 testes passaram
  ...
```

## ⚠️ Importante

- **Este script cria sessões reais de triagem** em produção para validar o fluxo completo
- Os dados criados são mínimos e identificados como "Smoke Test"
- O script não finaliza triagens completas (não gera relatórios reais) para evitar poluição de dados
- Use com cuidado em produção - idealmente execute antes de lançamentos importantes

## 🔧 Troubleshooting

### Erro de Timeout
Se algum teste falhar por timeout, verifique:
- Conexão com a internet
- Status do servidor de produção
- Latência da rede

### Erro 500 em APIs
Se APIs retornarem erro 500:
- Verifique logs do Vercel
- Confirme que variáveis de ambiente estão configuradas
- Valide que serviços externos (Supabase, etc.) estão funcionando

### Página não encontrada (404)
Se uma página retornar 404:
- Verifique se a rota existe no código
- Confirme que o produto está configurado em `src/config/zapfarm/products.ts`
- Valide que o build foi feito corretamente

## 📝 Notas

- O script usa timeouts de 30 segundos por requisição
- Há um delay de 1.5s entre produtos para não sobrecarregar o servidor
- Todos os testes são não-destrutivos (não deletam dados)
- O script pode ser executado múltiplas vezes sem problemas

