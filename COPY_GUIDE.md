# Copy Overhaul AlloeHealth - Documentação

## Resumo Executivo

Este documento descreve a implementação completa do sistema de overhaul de copys para o AlloeHealth, focando nas 4 conversões principais: Passe R$49, Presente R$89, Produtos Alloe Brasil e Médico em minutos (ZapVida).

## Arquitetura Implementada

### 1. Sistema de Internacionalização (`src/lib/i18n.ts`)

- **Arquivo centralizado**: `content/pt-BR/alloe.json`
- **Função principal**: `t(path, vars?)` para carregar textos
- **Variantes A/B**: `tVariant(path, index)` para testes
- **Arrays**: `tArray(path)` para listas de strings
- **Feature flag**: `NEXT_PUBLIC_COPY_OVERHAUL` para controle de rollout

### 2. Sistema de UTMs Dinâmicas (`src/lib/utm.ts`)

- **URLs padronizadas** para Alloe Brasil e ZapVida
- **Contextos válidos**: landing, triagem, report, pdf, email, whatsapp
- **CTAs na ordem oficial**: pass → gift → products → doctor
- **Target="_blank"** para links externos

### 3. Controle de Acesso (`src/lib/accessGuard.ts`)

- **Triagem GI gratuita**: sem paywall até o relatório
- **Triagens pagas**: redirecionamento para paywall
- **Verificação de passe ativo** e gifts válidos

## Páginas Atualizadas

### Home (`src/pages/index.tsx`)
- ✅ Hero com variantes A/B
- ✅ SEO otimizado
- ✅ CTAs padronizados
- ✅ Seção "Como funciona" atualizada

### Triagem GI (`src/pages/triagem/gastro.tsx`)
- ✅ Título e descrição atualizados
- ✅ Barra de progresso com texto dinâmico
- ✅ SEO específico para triagem

### Relatório (`src/pages/relatorio/[id].tsx`)
- ✅ Título e seções padronizados
- ✅ Deck de CTAs na ordem oficial
- ✅ UTMs dinâmicas para links externos

### Assinatura (`src/pages/assinatura.tsx`)
- ✅ Headlines com variantes A/B
- ✅ Benefícios claros
- ✅ CTA otimizado

### Presente (`src/pages/presente.tsx`)
- ✅ Headlines com variantes A/B
- ✅ Formulário de dados do presenteado
- ✅ CTA otimizado

### Obrigado (`src/pages/obrigado.tsx`)
- ✅ Mensagens por tipo de compra
- ✅ CTAs de próxima ação

## Componentes Criados

### CtaDeck (`src/components/ui/CtaDeck.tsx`)
- **Variantes**: default, compact, grid
- **UTMs automáticas** baseadas no contexto
- **Ordem oficial** sempre respeitada

## Templates de Comunicação

### Email (`src/lib/emailTemplates.ts`)
- **D0**: Relatório pronto
- **D+1**: 3 passos práticos
- **D+3**: Oferta de passe
- **D+7**: Oferta de presente

### WhatsApp (`src/lib/whatsappTemplates.ts`)
- **Notificação**: Relatório pronto
- **Dicas**: Sequência de 7 dias
- **Urgente**: Falar com médico

## Fluxo de Conversão

### 1. Entrada Gratuita
```
Home → Triagem GI → Relatório (sem paywall)
```

### 2. CTAs no Relatório (ordem oficial)
1. **Passe R$49** → `/assinatura`
2. **Presente R$89** → `/presente`
3. **Produtos Alloe** → `https://alloeoficial.com.br/` + UTMs
4. **Médico agora** → `https://zapvida.com/plantao` + UTMs

### 3. Fluxo Pago
```
Triagem Premium → Paywall → Assinatura → Acesso Liberado
```

## UTMs Implementadas

### Produtos Alloe Brasil
```
?utm_source=alloehealth&utm_medium={context}&utm_campaign=cta_produtos&utm_content={triagem}
```

### ZapVida
```
?utm_source=alloehealth&utm_medium={context}&utm_campaign=cta_plantao&utm_content={triagem}
```

## Testes Implementados

### Unitários (`__tests__/copy-overhaul.test.ts`)
- ✅ Sistema de internacionalização
- ✅ Sistema de UTMs
- ✅ Controle de acesso
- ✅ Validação de conteúdo
- ✅ Integração de fluxo

## Variantes A/B Prontas

### Home
- **H1**: 7 variações
- **Sub**: 5 variações
- **CTA**: Padronizado

### Assinatura
- **H1**: 5 variações
- **Sub**: 3 variações

### Presente
- **H1**: 5 variações
- **Sub**: 2 variações

## Compliance e Segurança

### Disclaimers Médicos
- ✅ Presente em relatórios
- ✅ Presente em PDFs
- ✅ Presente em emails
- ✅ "Não substitui consulta médica"

### Privacidade
- ✅ LGPD compliance
- ✅ Descadastro fácil
- ✅ Política de privacidade

## Monitoramento

### Métricas de Conversão
- **CTR**: Triagem GI (home → triagem)
- **CR**: Passe (assinatura → pagamento)
- **CR**: Presente (presente → pagamento)
- **CTR**: Produtos Alloe (relatório → alloeoficial.com.br)
- **CTR**: ZapVida (relatório → zapvida.com/plantao)

### UTMs para Tracking
- **Source**: alloehealth
- **Medium**: contexto da página
- **Campaign**: tipo de CTA
- **Content**: tipo de triagem

## Próximos Passos

### 1. Deploy
- [ ] Feature flag ativada em produção
- [ ] Monitoramento de conversões
- [ ] A/B testing das variantes

### 2. Otimizações
- [ ] Análise de heatmaps
- [ ] Testes de usabilidade
- [ ] Otimização de CTAs

### 3. Expansão
- [ ] Novas triagens
- [ ] Novos templates de email
- [ ] Integração com CRM

## Checklist GO/NO-GO

### ✅ GO (Pronto para Produção)
- [x] Sistema de internacionalização funcionando
- [x] UTMs dinâmicas implementadas
- [x] Fluxo GI gratuito sem paywall
- [x] CTAs na ordem oficial
- [x] Templates de email/WhatsApp
- [x] Testes unitários passando
- [x] Disclaimers médicos presentes
- [x] Dark/Light theme preservado

### ⚠️ ATENÇÃO
- [ ] Testar fluxo completo E2E
- [ ] Validar UTMs em produção
- [ ] Monitorar performance inicial
- [ ] Backup do sistema anterior

### ❌ NO-GO (Bloqueadores)
- [ ] Erros de build
- [ ] Testes falhando
- [ ] Quebra do tema Dark/Light
- [ ] Paywall aparecendo na triagem GI

## Contatos

- **Desenvolvimento**: Sistema implementado conforme especificações
- **QA**: Testes automatizados + validação manual
- **Produto**: Aprovação das variantes A/B
- **Marketing**: UTMs configuradas para tracking

---

**Status**: ✅ PRONTO PARA PRODUÇÃO
**Data**: $(date)
**Versão**: 1.0.0
