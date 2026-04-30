# CHANGELOG - PR-2 Monetização Stripe + Gift (Plus)

## [2.0.0] - 2025-10-13

### 🚀 Adicionado
- **Sistema Stripe completo** com planos R$29/R$49 + versões anuais
- **Páginas de monetização**: `/pricing`, `/dashboard`, `/billing`, `/settings/profile`
- **Sistema de presentes**: criação e resgate com antifraude
- **Portal de cobrança** integrado ao Stripe
- **Tracking GA4** completo com conversões
- **APIs de assinatura**: checkout, webhooks, portal
- **APIs de presente**: create, redeem com validação
- **Tabela GiftToken** no banco de dados
- **Testes Playwright** para fluxos de monetização
- **Documentação completa** de GA4 e rollback

### 🔧 Modificado
- **Configuração Stripe** com 4 prices específicos
- **Webhooks** para processar eventos de subscription
- **CTAs do relatório** integrados com pricing
- **Hook useGA4** com função trackEvent
- **Schema Prisma** com campos de assinatura

### 🎨 Design
- **Página pricing** com 2 cards e toggle mensal/anual
- **Dashboard funcional** para assinantes e não-assinantes
- **Sistema de presentes** com 3 steps
- **Badge "Presente"** no plano Plus
- **Botão PIX** desabilitado com tooltip "Em breve"

### 📊 Analytics
- **Eventos GA4**: subscribe_click, gift_created, gift_redeemed
- **Custom Definitions**: plan, period, method, cta_variant, gift_token
- **Conversão**: subscribe_click marcado como conversão
- **Tracking completo** da jornada de monetização

### 🔒 Segurança
- **Rate limiting** para criação de presentes
- **Validação de expiração** de tokens
- **Antifraude** com limite de 1 presente/mês por usuário
- **Autenticação** preparada para APIs sensíveis

### 🧪 Testes
- **Playwright** para fluxos de assinatura
- **Testes de presente** create/redeem
- **Testes de acessibilidade** pricing page
- **Testes de performance** e Lighthouse

### 📚 Documentação
- **MONETIZATION_GA4.md** - Configuração completa de analytics
- **ROLLBACK_PLAN.md** - Plano de rollback detalhado
- **WEBHOOKS_STRIPE.md** - Configuração de webhooks
- **Testes E2E** documentados

### 🔄 Migração
- **Nova tabela**: GiftToken com relacionamentos
- **Campos adicionais**: planType, planPrice na Subscription
- **Compatibilidade**: mantida com sistema anterior

### 🚨 Breaking Changes
- **Nenhum** - Sistema mantém compatibilidade total

### 📈 Impacto Esperado
- **Receita mensal**: R$ 705+ (12 assinaturas × R$ 49 + presentes)
- **Conversão**: 8% pricing → assinatura
- **Viralização**: Sistema de presentes
- **Retenção**: Portal de cobrança reduz churn

---

## Configurações Necessárias

### Variáveis de Ambiente
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC_M=price_...
STRIPE_PRICE_PLUS_M=price_...
STRIPE_PRICE_BASIC_Y=price_...
STRIPE_PRICE_PLUS_Y=price_...
NEXT_PUBLIC_BASE_URL=https://alloehealth.com.br
```

### Webhooks Stripe
- Endpoint: `https://alloehealth.com.br/api/stripe/webhook`
- Eventos: checkout.session.completed, customer.subscription.*, invoice.*

### GA4
- Marcar `subscribe_click` como conversão
- Criar 5 custom definitions
- Configurar funil de conversão

---

## Próximos Passos (PR-3)
- PIX Inter CobV + dunning
- Webhooks banco
- Página billing com QR/linha digitável
- Failover para cartão
