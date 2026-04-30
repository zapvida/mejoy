# Configuração do Sistema de Emails - ZapFarm

## Visão Geral

O ZapFarm utiliza o **Resend** como provedor de email transacional para enviar notificações e acompanhamento aos clientes. O sistema está integrado nos pontos críticos do fluxo de usuário.

## Por que Resend?

✅ **Moderno e fácil de usar**: API simples e intuitiva  
✅ **Bom free tier**: 3.000 emails/mês grátis, depois $20/100k emails  
✅ **Excelente deliverability**: Taxa de entrega alta  
✅ **TypeScript nativo**: SDK oficial com tipos  
✅ **Templates React**: Suporte a templates React (futuro)  
✅ **Analytics**: Dashboard com métricas de abertura e cliques  

## Alternativas Consideradas

### SendGrid
- ✅ Muito popular e confiável
- ✅ 100 emails/dia grátis
- ❌ Interface mais complexa
- ❌ Preço mais alto após free tier

### AWS SES
- ✅ Muito barato ($0.10/1000 emails)
- ✅ Escalável
- ❌ Configuração mais complexa
- ❌ Requer configuração de domínio e SPF/DKIM

### Postmark
- ✅ Excelente deliverability
- ✅ 100 emails/mês grátis
- ❌ Focado em transacionais (não marketing)
- ❌ Preço mais alto

### Mailgun
- ✅ Bom free tier
- ✅ API robusta
- ❌ Interface menos intuitiva
- ❌ Preço intermediário

**Decisão**: Resend foi escolhido por ser moderno, fácil de configurar e ter um bom equilíbrio entre preço e funcionalidades.

## Configuração

### 1. Criar conta no Resend

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Vá em **API Keys** e crie uma nova chave
4. Copie a chave (ela só aparece uma vez!)

### 2. Configurar variáveis de ambiente

Adicione as seguintes variáveis no seu `.env.local` ou `.env.production`:

```bash
# Resend API Key (obrigatório)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Email remetente (opcional, padrão: ZapFarm <noreply@zapfarm.com.br>)
EMAIL_FROM=ZapFarm <noreply@zapfarm.com.br>

# Email para respostas (opcional, padrão: contato@zapfarm.com.br)
EMAIL_REPLY_TO=contato@zapfarm.com.br

# URL base do site (já deve estar configurada)
NEXT_PUBLIC_SITE_URL=https://www.zapfarm.com.br
```

### 3. Verificar domínio (Recomendado para produção)

Para melhor deliverability, configure um domínio verificado:

1. No Resend Dashboard, vá em **Domains**
2. Adicione seu domínio (`zapfarm.com.br`)
3. Adicione os registros DNS conforme instruções:
   - **SPF**: `v=spf1 include:resend.com ~all`
   - **DKIM**: Registros fornecidos pelo Resend
   - **DMARC**: `v=DMARC1; p=quarantine; rua=mailto:dmarc@zapfarm.com.br`

### 4. Testar envio

O sistema funciona mesmo sem configuração completa (em desenvolvimento apenas loga). Para testar:

```typescript
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail('seu-email@exemplo.com', {
  name: 'Seu Nome',
  firstName: 'Seu',
});
```

## Templates Disponíveis

### 1. `triage-completed`
**Quando**: Usuário completa uma triagem  
**Assunto**: "Triagem recebida - ZapFarm"

### 2. `report-ready`
**Quando**: Relatório está pronto para visualização  
**Assunto**: "Seu relatório ZapFarm está pronto 📄"

### 3. `payment-confirmed`
**Quando**: Pagamento é confirmado  
**Assunto**: "Pagamento confirmado - ZapFarm ✅"

### 4. `welcome`
**Quando**: Novo usuário se cadastra  
**Assunto**: "Bem-vindo(a) à ZapFarm! 🎉"

### 5. `gift-received`
**Quando**: Usuário recebe um presente  
**Assunto**: "Você recebeu um presente! 🎁"

### 6. `follow-up-d1`
**Quando**: Follow-up 24h após triagem  
**Assunto**: "3 passos práticos para hoje"

### 7. `follow-up-d3`
**Quando**: Follow-up 72h após triagem  
**Assunto**: "Desbloqueie todas as triagens por R$ 49"

### 8. `follow-up-d7`
**Quando**: Follow-up 7 dias após triagem  
**Assunto**: "Um presente útil de verdade 🎁"

## Integrações Atuais

### ✅ Triagem Completada
- **Arquivo**: `src/pages/api/analytics/event.ts`
- **Evento**: `TRIAGE_COMPLETED`
- **Email**: `triage-completed`

### ✅ Relatório Pronto
- **Arquivo**: `src/pages/api/analytics/event.ts`
- **Evento**: `PDF_GENERATED`
- **Email**: `report-ready`

### ✅ Pagamento Confirmado (Stripe)
- **Arquivo**: `src/lib/stripe/handlers.ts`
- **Função**: `handleCheckoutCompleted`
- **Emails**: `payment-confirmed` + `welcome`

### ✅ Pagamento Confirmado (Asaas)
- **Arquivo**: `src/pages/api/asaas/webhook.ts`
- **Função**: `processPayment`
- **Emails**: `payment-confirmed` + `welcome`

## Estrutura do Código

```
src/lib/email/
├── index.ts          # Funções principais de envio
├── client.ts         # Cliente Resend
├── templates.ts     # Templates HTML
└── types.ts         # Tipos TypeScript
```

## Uso

### Envio simples

```typescript
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail('cliente@exemplo.com', {
  name: 'João Silva',
  firstName: 'João',
});
```

### Envio customizado

```typescript
import { sendEmail } from '@/lib/email';

await sendEmail({
  to: 'cliente@exemplo.com',
  subject: 'Assunto personalizado',
  template: 'report-ready',
  data: {
    name: 'João Silva',
    firstName: 'João',
    reportUrl: 'https://zapfarm.com.br/report/123',
  },
});
```

## Monitoramento

### Dashboard Resend
- Acesse [resend.com/dashboard](https://resend.com/dashboard)
- Veja métricas de:
  - Emails enviados
  - Taxa de abertura
  - Taxa de cliques
  - Bounces e spam

### Logs da Aplicação
Os emails são logados no console:
- ✅ Sucesso: `Email enviado com sucesso`
- ❌ Erro: `Erro ao enviar email`

## Troubleshooting

### Email não está sendo enviado

1. **Verificar API Key**: Confirme que `RESEND_API_KEY` está configurada
2. **Verificar logs**: Veja o console para erros
3. **Verificar email**: Confirme que o email do destinatário é válido
4. **Verificar domínio**: Em produção, domínio deve estar verificado

### Emails indo para spam

1. **Verificar domínio**: Configure SPF/DKIM/DMARC
2. **Verificar conteúdo**: Evite palavras spam
3. **Verificar remetente**: Use um email verificado
4. **Warm-up**: Comece com volumes baixos

### Erro "RESEND_API_KEY não configurada"

- Em desenvolvimento: Normal, apenas loga
- Em produção: Configure a variável de ambiente

## Próximos Passos

- [ ] Implementar sistema de follow-up automático (D+1, D+3, D+7)
- [ ] Adicionar templates React para emails mais complexos
- [ ] Implementar tracking de abertura/cliques
- [ ] Adicionar A/B testing de assuntos
- [ ] Implementar unsubscribe automático
- [ ] Adicionar templates de recuperação de senha

## Referências

- [Documentação Resend](https://resend.com/docs)
- [Resend Dashboard](https://resend.com/dashboard)
- [Best Practices de Email](https://resend.com/docs/send-with-nodejs)

