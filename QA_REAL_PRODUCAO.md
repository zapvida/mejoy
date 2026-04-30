# 🧪 QA REAL PRODUÇÃO - TESTES OBRIGATÓRIOS

## 🎯 Testes Críticos (Executar na Ordem)

### 1. Teste de Assinatura Básica (LIVE)
**URL**: `https://www.alloehealth.com.br/pricing`
**Passos**:
1. Acessar página de pricing
2. Selecionar plano Básico mensal (R$ 29)
3. Clicar em "Assinar com Cartão"
4. Completar checkout no Stripe LIVE
5. Verificar redirecionamento para `/billing`
6. Confirmar status "active" na página de billing

**Resultado Esperado**: ✅ Assinatura ativa em `/billing`

### 2. Teste do Portal de Cobrança
**URL**: `https://www.alloehealth.com.br/billing`
**Passos**:
1. Acessar página de billing
2. Clicar em "Gerenciar Cobrança"
3. Verificar abertura do portal Stripe LIVE
4. Testar alteração de plano (se disponível)
5. Retornar para `/billing`
6. Confirmar retorno OK

**Resultado Esperado**: ✅ Portal abre e retorna OK

### 3. Teste do Sistema de Presentes
**Passos**:
1. Assinar plano Plus mensal (R$ 49)
2. Acessar `/presente`
3. Preencher dados do presenteado
4. Criar presente (gerar token)
5. Abrir janela anônima
6. Acessar `/resgatar`
7. Inserir código do presente
8. Resgatar presente
9. Confirmar acesso de 30 dias

**Resultado Esperado**: ✅ Presente resgatado com sucesso

### 4. Teste de Eventos GA4
**Verificar no GA4 Dashboard**:
- `subscribe_click` com parâmetros (plan, period, method)
- `gift_created` com parâmetros (gift_token_id, plan, source)
- `gift_redeemed` com parâmetros (gift_token_id, plan, source)

**Resultado Esperado**: ✅ Eventos chegando no GA4

## 🔍 Validações Técnicas

### APIs Funcionando
- ✅ `/api/stripe/create-checkout-session` - 200 OK
- ✅ `/api/stripe/create-portal-session` - 200 OK
- ✅ `/api/stripe/webhook` - 200 OK
- ✅ `/api/gift/create` - 200 OK
- ✅ `/api/gift/redeem` - 200 OK

### Páginas Funcionando
- ✅ `/pricing` - Carrega corretamente
- ✅ `/dashboard` - Funcional para todos
- ✅ `/billing` - Status e portal OK
- ✅ `/presente` - Criação funcional
- ✅ `/resgatar` - Resgate funcional

### Banco de Dados
- ✅ Tabela GiftToken criada
- ✅ Subscription com dados corretos
- ✅ Relacionamentos funcionando
- ✅ Índices criados

## 📊 Métricas de Sucesso

### Performance
- **Tempo de carregamento**: < 3s
- **Lighthouse Score**: > 90
- **A11y Score**: 100
- **Erros no console**: 0

### Funcionalidade
- **Checkout**: Funcionando
- **Portal**: Funcionando
- **Presentes**: Funcionando
- **Webhooks**: Funcionando

### Analytics
- **GA4 Events**: Chegando
- **Conversões**: Configuradas
- **Custom Definitions**: Ativas

## 🚨 Pontos de Atenção

### Críticos
- Verificar se webhooks estão processando
- Verificar se assinaturas estão sendo criadas
- Verificar se presentes estão funcionando
- Verificar se GA4 está recebendo eventos

### Importantes
- Verificar performance em produção
- Verificar logs de erro
- Verificar métricas de conversão
- Verificar experiência do usuário

## ✅ Checklist de Validação

- [ ] Assinatura básica funcionando
- [ ] Portal de cobrança funcionando
- [ ] Sistema de presentes funcionando
- [ ] Eventos GA4 chegando
- [ ] APIs respondendo corretamente
- [ ] Páginas carregando corretamente
- [ ] Banco de dados funcionando
- [ ] Performance adequada
- [ ] Logs sem erros críticos

## 🎯 Status dos Testes

**Teste 1 - Assinatura**: ⏳ Aguardando execução
**Teste 2 - Portal**: ⏳ Aguardando execução
**Teste 3 - Presentes**: ⏳ Aguardando execução
**Teste 4 - GA4**: ⏳ Aguardando execução

**Status Geral**: ⏳ Aguardando execução dos testes
