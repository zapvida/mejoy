# 🚀 Quick Start - Sistema de Emails ZapFarm

## ⚡ Configuração Rápida (5 minutos)

### 1. Criar conta no Resend
- Acesse [resend.com](https://resend.com) e crie conta gratuita
- Vá em **API Keys** → **Create API Key**
- Copie a chave (ela só aparece uma vez!)

### 2. Configurar variáveis de ambiente

**Local (.env.local):**
```bash
RESEND_API_KEY=your_secret_from_provider
EMAIL_FROM=ZapFarm <noreply@zapfarm.com.br>
EMAIL_REPLY_TO=contato@zapfarm.com.br
NEXT_PUBLIC_SITE_URL=https://www.zapfarm.com.br
```

**Vercel (Produção):**
```bash
vercel env add RESEND_API_KEY
vercel env add EMAIL_FROM
vercel env add EMAIL_REPLY_TO
```

### 3. Validar setup
```bash
npm run validate:emails
```

### 4. Testar envio
```bash
TEST_EMAIL=seu-email@exemplo.com npm run test:emails
```

### 5. Preview visual
Acesse: `http://localhost:3000/admin/email-validation`

## ✅ Checklist Rápido

- [ ] Conta Resend criada
- [ ] API Key configurada
- [ ] Variáveis de ambiente setadas
- [ ] Setup validado (`npm run validate:emails`)
- [ ] Emails testados (`npm run test:emails`)
- [ ] Preview visualizado

## 📧 Templates Disponíveis

1. **Triagem Completada** - Quando usuário completa triagem
2. **Relatório Pronto** - Quando relatório está disponível
3. **Pagamento Confirmado** - Quando pagamento é aprovado
4. **Boas-vindas** - Para novos usuários
5. **Presente Recebido** - Quando usuário recebe presente
6. **Follow-up D+1** - 24h após triagem
7. **Follow-up D+3** - 72h após triagem
8. **Follow-up D+7** - 7 dias após triagem

## 🔗 Links Úteis

- **Dashboard Resend**: [resend.com/dashboard](https://resend.com/dashboard)
- **Documentação**: `docs/EMAIL_SETUP.md`
- **Checklist Completo**: `docs/EMAIL_VALIDATION_CHECKLIST.md`
- **Preview**: `/admin/email-validation`

## 🆘 Problemas?

### Email não envia
- Verificar `RESEND_API_KEY` está configurada
- Verificar logs no console
- Verificar dashboard do Resend

### Emails vão para spam
- Verificar domínio no Resend
- Configurar DNS (SPF/DKIM/DMARC)
- Verificar conteúdo do email

## 📚 Documentação Completa

- **Setup Detalhado**: `docs/EMAIL_SETUP.md`
- **Checklist de Validação**: `docs/EMAIL_VALIDATION_CHECKLIST.md`

---

**Pronto em 5 minutos!** 🎉

