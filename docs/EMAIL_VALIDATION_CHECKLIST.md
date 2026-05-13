# ✅ Checklist de Validação de Emails - Pré-Lançamento

## 📋 Checklist Completo

### 1. Configuração Inicial

- [ ] **Conta Resend criada**
  - [ ] Acessar [resend.com](https://resend.com)
  - [ ] Criar conta gratuita
  - [ ] Verificar email de confirmação

- [ ] **API Key configurada**
  - [ ] Ir em **API Keys** no dashboard
  - [ ] Criar nova chave de API
  - [ ] Copiar chave (ela só aparece uma vez!)
  - [ ] Adicionar `RESEND_API_KEY` no `.env.production` ou Vercel

- [ ] **Variáveis de ambiente**
  ```bash
  RESEND_API_KEY=your_secret_from_provider
  EMAIL_FROM=ZapFarm <noreply@zapfarm.com.br>
  EMAIL_REPLY_TO=contato@zapfarm.com.br
  NEXT_PUBLIC_SITE_URL=https://www.zapfarm.com.br
  ```

### 2. Verificação de Domínio (Recomendado)

- [ ] **Adicionar domínio no Resend**
  - [ ] Ir em **Domains** no dashboard
  - [ ] Adicionar `zapfarm.com.br`

- [ ] **Configurar DNS**
  - [ ] Adicionar registro SPF: `v=spf1 include:resend.com ~all`
  - [ ] Adicionar registros DKIM (fornecidos pelo Resend)
  - [ ] Adicionar registro DMARC: `v=DMARC1; p=quarantine; rua=mailto:dmarc@zapfarm.com.br`
  - [ ] Aguardar verificação (pode levar até 48h)

### 3. Testes de Templates

#### 3.1. Preview Visual

- [ ] **Acessar preview de cada template:**
  ```
  http://localhost:3000/api/admin/email-preview?template=triage-completed&format=html
  http://localhost:3000/api/admin/email-preview?template=report-ready&format=html
  http://localhost:3000/api/admin/email-preview?template=payment-confirmed&format=html
  http://localhost:3000/api/admin/email-preview?template=welcome&format=html
  http://localhost:3000/api/admin/email-preview?template=gift-received&format=html
  http://localhost:3000/api/admin/email-preview?template=follow-up-d1&format=html
  http://localhost:3000/api/admin/email-preview?template=follow-up-d3&format=html
  http://localhost:3000/api/admin/email-preview?template=follow-up-d7&format=html
  ```

- [ ] **Verificar em diferentes clientes:**
  - [ ] Gmail (web e mobile)
  - [ ] Outlook (web e desktop)
  - [ ] Apple Mail (iOS e macOS)
  - [ ] Yahoo Mail

- [ ] **Verificar responsividade:**
  - [ ] Desktop (600px+)
  - [ ] Tablet (400-600px)
  - [ ] Mobile (<400px)

#### 3.2. Teste de Envio Real

- [ ] **Executar script de teste:**
  ```bash
  TEST_EMAIL=seu-email@exemplo.com npm run test:emails
  ```

- [ ] **Verificar recebimento de cada email:**
  - [ ] ✅ Triagem completada
  - [ ] ✅ Relatório pronto
  - [ ] ✅ Pagamento confirmado
  - [ ] ✅ Boas-vindas
  - [ ] ✅ Presente recebido
  - [ ] ✅ Follow-up D+1
  - [ ] ✅ Follow-up D+3
  - [ ] ✅ Follow-up D+7

- [ ] **Verificar conteúdo:**
  - [ ] Assuntos corretos
  - [ ] Nomes personalizados
  - [ ] Links funcionando
  - [ ] Imagens carregando (se houver)
  - [ ] Botões clicáveis
  - [ ] Footer com unsubscribe

### 4. Validação de Integrações

#### 4.1. Triagem Completada

- [ ] **Fluxo de teste:**
  1. Completar uma triagem com email válido
  2. Verificar evento `TRIAGE_COMPLETED` sendo disparado
  3. Verificar email sendo enviado
  4. Verificar logs: `Email enviado com sucesso`

- [ ] **Arquivo**: `src/pages/api/analytics/event.ts`
- [ ] **Linha**: ~58-64

#### 4.2. Relatório Pronto

- [ ] **Fluxo de teste:**
  1. Gerar um relatório PDF
  2. Verificar evento `PDF_GENERATED` sendo disparado
  3. Verificar email sendo enviado com link do relatório
  4. Verificar link funcionando

- [ ] **Arquivo**: `src/pages/api/analytics/event.ts`
- [ ] **Linha**: ~72-86

#### 4.3. Pagamento Confirmado (Stripe)

- [ ] **Fluxo de teste:**
  1. Realizar checkout via Stripe
  2. Completar pagamento
  3. Verificar webhook sendo processado
  4. Verificar emails sendo enviados (confirmação + boas-vindas)

- [ ] **Arquivo**: `src/lib/stripe/handlers.ts`
- [ ] **Linha**: ~40-58

#### 4.4. Pagamento Confirmado (Asaas)

- [ ] **Fluxo de teste:**
  1. Realizar checkout via Asaas
  2. Completar pagamento (PIX ou cartão)
  3. Verificar webhook sendo processado
  4. Verificar emails sendo enviados (confirmação + boas-vindas)

- [ ] **Arquivo**: `src/pages/api/asaas/webhook.ts`
- [ ] **Linha**: ~201-220

### 5. Validação de Conteúdo

- [ ] **Assuntos dos emails:**
  - [ ] Triagem: "Triagem recebida - ZapFarm"
  - [ ] Relatório: "Seu relatório ZapFarm está pronto 📄"
  - [ ] Pagamento: "Pagamento confirmado - ZapFarm ✅"
  - [ ] Boas-vindas: "Bem-vindo(a) à ZapFarm! 🎉"
  - [ ] Presente: "Você recebeu um presente! 🎁"
  - [ ] D+1: "3 passos práticos para hoje"
  - [ ] D+3: "Desbloqueie todas as triagens por R$ 49"
  - [ ] D+7: "Um presente útil de verdade 🎁"

- [ ] **Personalização:**
  - [ ] Nome do usuário aparece corretamente
  - [ ] Primeiro nome usado quando disponível
  - [ ] Links personalizados funcionando
  - [ ] Dados específicos (valor, produto, etc.) corretos

- [ ] **Compliance:**
  - [ ] Link de unsubscribe presente
  - [ ] Footer com informações da empresa
  - [ ] Disclaimer médico (quando aplicável)
  - [ ] Conformidade com LGPD

### 6. Monitoramento

- [ ] **Dashboard Resend configurado:**
  - [ ] Acessar [resend.com/dashboard](https://resend.com/dashboard)
  - [ ] Verificar métricas de envio
  - [ ] Configurar alertas (opcional)

- [ ] **Logs da aplicação:**
  - [ ] Verificar logs de sucesso: `Email enviado com sucesso`
  - [ ] Verificar logs de erro: `Erro ao enviar email`
  - [ ] Configurar alertas para erros (opcional)

### 7. Testes de Edge Cases

- [ ] **Email inválido:**
  - [ ] Sistema não quebra com email inválido
  - [ ] Erro é logado mas não interrompe o fluxo

- [ ] **Email ausente:**
  - [ ] Sistema não tenta enviar se email não existe
  - [ ] Fluxo continua normalmente

- [ ] **API Key ausente:**
  - [ ] Em desenvolvimento: apenas loga
  - [ ] Em produção: erro é logado mas não quebra

- [ ] **Rate limiting:**
  - [ ] Resend tem limite de 3.000/mês no free tier
  - [ ] Monitorar uso no dashboard

### 8. Documentação

- [ ] **Documentação atualizada:**
  - [ ] `docs/EMAIL_SETUP.md` completo
  - [ ] `docs/EMAIL_VALIDATION_CHECKLIST.md` (este arquivo)
  - [ ] Comentários no código explicando integrações

- [ ] **Equipe informada:**
  - [ ] Time de desenvolvimento sabe como testar
  - [ ] Time de produto sabe quais emails são enviados
  - [ ] Suporte sabe como verificar envios

## 🚀 Comandos Úteis

### Testar todos os emails
```bash
TEST_EMAIL=seu-email@exemplo.com npm run test:emails
```

### Preview de um template específico
```bash
# HTML
curl "http://localhost:3000/api/admin/email-preview?template=welcome&format=html"

# JSON
curl "http://localhost:3000/api/admin/email-preview?template=welcome"
```

### Verificar variáveis de ambiente
```bash
# Local
cat .env.local | grep RESEND

# Vercel (via CLI)
vercel env ls
```

## ⚠️ Problemas Comuns

### Email não está sendo enviado

1. **Verificar API Key:**
   ```bash
   echo $RESEND_API_KEY
   ```

2. **Verificar logs:**
   - Console da aplicação
   - Dashboard do Resend

3. **Verificar email do destinatário:**
   - Formato válido
   - Não está em lista de bloqueio

### Emails indo para spam

1. **Verificar domínio:**
   - Domínio verificado no Resend?
   - DNS configurado corretamente?

2. **Verificar conteúdo:**
   - Evitar palavras spam
   - Usar remetente verificado

3. **Warm-up:**
   - Começar com volumes baixos
   - Aumentar gradualmente

### Erro "RESEND_API_KEY não configurada"

- **Desenvolvimento**: Normal, apenas loga
- **Produção**: Configurar variável de ambiente

## ✅ Critérios de Aprovação

Antes de considerar o sistema pronto para lançamento:

- [x] ✅ Todos os 8 templates testados e funcionando
- [x] ✅ Todas as integrações validadas
- [x] ✅ Emails sendo recebidos corretamente
- [x] ✅ Links funcionando
- [x] ✅ Responsividade verificada
- [x] ✅ Domínio verificado (recomendado)
- [x] ✅ Logs configurados
- [x] ✅ Documentação completa

## 📞 Suporte

- **Resend Support**: [resend.com/support](https://resend.com/support)
- **Documentação**: [resend.com/docs](https://resend.com/docs)
- **Dashboard**: [resend.com/dashboard](https://resend.com/dashboard)

---

**Última atualização**: $(date)  
**Status**: ⏳ Aguardando validação  
**Próxima revisão**: Após testes completos

