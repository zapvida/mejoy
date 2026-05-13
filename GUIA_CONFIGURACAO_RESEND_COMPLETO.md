# 🚀 GUIA COMPLETO - CONFIGURAR RESEND PARA FUNCIONAR AGORA

**Status:** ⚠️ **RESOLVENDO AGORA**  
**Data:** 27/11/2025

---

## 🎯 PROBLEMA IDENTIFICADO

Pelos screenshots, vejo que:
- ✅ API Key configurada (`re_P3HGAEGN...`)
- ✅ Variáveis EMAIL_FROM e EMAIL_REPLY_TO configuradas
- ❌ **0 emails enviados** (dashboard mostra "No sent emails yet")
- ❌ Domínio não configurado no Resend
- ❌ Webhooks não configurados (mas não são obrigatórios)

---

## ✅ SOLUÇÃO PASSO A PASSO

### **PASSO 1: Verificar API Key no Vercel**

1. Acesse: https://vercel.com/[seu-projeto]/settings/environment-variables
2. Procure por `RESEND_API_KEY`
3. **VERIFIQUE:** A chave deve ser `re_P3HGAEGN_GdGZznTsjAQAtPkdBL447...` (a mesma que você vê no Resend)
4. **IMPORTANTE:** Deve estar marcada para **Production**, **Preview** e **Development**

**Se não estiver configurada ou estiver diferente:**
```bash
# Via CLI (mais rápido)
vercel env add RESEND_API_KEY production
# Cole a chave completa: re_P3HGAEGN_GdGZznTsjAQAtPkdBL447...
```

---

### **PASSO 2: Configurar Domínio no Resend (RECOMENDADO)**

**Por que configurar?**
- Melhor deliverability (emails não vão para spam)
- Emails vêm de `@zapfarm.com.br` ao invés de `@resend.dev`
- Mais profissional

**Como fazer:**

1. **Acesse:** https://resend.com/domains
2. **Clique em:** "+ Add Domain"
3. **Configure:**
   - **Name:** `notifications.zapfarm.com.br` (ou `mail.zapfarm.com.br`)
   - **Region:** São Paulo (sa-east-1) ✅ (já está selecionado)
   - **Custom Return-Path:** `send` (deixe padrão)
4. **Clique em:** "+ Add Domain"
5. **Copie os registros DNS** que aparecerem
6. **Adicione no seu provedor DNS** (onde você gerencia zapfarm.com.br):
   - **SPF:** `v=spf1 include:resend.com ~all`
   - **DKIM:** Os registros que o Resend fornecer
   - **DMARC:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@zapfarm.com.br`
7. **Aguarde verificação** (pode levar algumas horas)

**⚠️ IMPORTANTE:** 
- Você pode usar o sistema **AGORA** mesmo sem configurar domínio
- Os emails funcionarão, mas virão de `@resend.dev`
- Configure o domínio depois para melhorar deliverability

---

### **PASSO 3: Verificar Variáveis no Vercel**

Acesse: https://vercel.com/[seu-projeto]/settings/environment-variables

**Verifique estas 3 variáveis:**

1. **RESEND_API_KEY**
   - Valor: `re_P3HGAEGN_GdGZznTsjAQAtPkdBL447...` (sua chave completa)
   - Ambientes: ✅ Production ✅ Preview ✅ Development

2. **EMAIL_FROM**
   - Valor: `ZapFarm <zapvidafarmx@gmail.com>` ou `ZapFarm <noreply@zapfarm.com.br>`
   - Ambientes: ✅ Production ✅ Preview ✅ Development

3. **EMAIL_REPLY_TO**
   - Valor: `zapvidafarmx@gmail.com`
   - Ambientes: ✅ Production ✅ Preview ✅ Development

---

### **PASSO 4: Fazer Novo Deploy**

Após verificar/atualizar as variáveis:

1. **Via Git (automático):**
   ```bash
   git commit --allow-empty -m "trigger: redeploy para aplicar envs do Resend"
   git push origin main
   ```

2. **Ou via Vercel Dashboard:**
   - Vá em: Deployments
   - Clique nos 3 pontos do último deploy
   - "Redeploy"

**⚠️ IMPORTANTE:** Após mudar variáveis de ambiente, sempre faça redeploy!

---

### **PASSO 5: Testar Envio de Email**

**Opção A: Teste Manual (Rápido)**

1. Complete uma triagem em produção
2. Verifique se recebeu email em `zapvidafarmx@gmail.com`
3. Verifique no Resend Dashboard: https://resend.com/emails
4. Deve aparecer o email enviado

**Opção B: Teste via API (Mais Confiável)**

Crie um arquivo `test-resend.js` na raiz:

```javascript
// test-resend.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ZapFarm <zapvidafarmx@gmail.com>',
      to: 'zapvidafarmx@gmail.com',
      subject: 'Teste Resend - ZapFarm',
      html: '<h1>Teste funcionando!</h1><p>Se você recebeu isso, o Resend está configurado corretamente.</p>',
    });

    if (error) {
      console.error('❌ Erro:', error);
      return;
    }

    console.log('✅ Email enviado com sucesso!');
    console.log('ID:', data?.id);
  } catch (err) {
    console.error('❌ Erro ao enviar:', err);
  }
}

test();
```

Execute:
```bash
RESEND_API_KEY=your_secret_from_provider node test-resend.js
```

---

## 🔍 VERIFICAÇÃO DE PROBLEMAS

### **Se emails não estão sendo enviados:**

1. **Verifique logs no Vercel:**
   - Vá em: Deployments → [último deploy] → Functions
   - Procure por: `✅ Email enviado com sucesso` ou `❌ Erro ao enviar email`

2. **Verifique se RESEND_API_KEY está correta:**
   ```bash
   # No terminal do Vercel ou local
   echo $RESEND_API_KEY
   # Deve mostrar: re_P3HGAEGN_GdGZznTsjAQAtPkdBL447...
   ```

3. **Verifique se a API key tem permissão:**
   - Acesse: https://resend.com/api-keys
   - Verifique se a chave tem "Sending access" ✅

4. **Teste direto no Resend:**
   - Acesse: https://resend.com/emails
   - Clique em "Send Test Email"
   - Se funcionar, a API key está OK

---

## ✅ CHECKLIST FINAL

- [ ] RESEND_API_KEY configurada no Vercel (Production)
- [ ] EMAIL_FROM configurada no Vercel
- [ ] EMAIL_REPLY_TO configurada no Vercel
- [ ] Deploy feito após configurar variáveis
- [ ] Teste de envio realizado
- [ ] Email recebido em zapvidafarmx@gmail.com
- [ ] Dashboard do Resend mostra email enviado

---

## 🚨 SE AINDA NÃO FUNCIONAR

**Execute este diagnóstico:**

1. **Verificar código:**
   ```bash
   # Verificar se o código está chamando sendEmail
   grep -r "sendTriageCompletedEmail" src/
   ```

2. **Verificar logs em produção:**
   - Complete uma triagem
   - Vá em Vercel → Deployments → Functions
   - Procure por logs de `/api/analytics/event`
   - Deve aparecer: `✅ Email enviado com sucesso` ou erro específico

3. **Testar API diretamente:**
   ```bash
   curl -X POST https://www.zapfarm.com.br/api/analytics/event \
     -H "Content-Type: application/json" \
     -d '{
       "event": "TRIAGE_COMPLETED",
       "payload": {
         "name": "Teste",
         "email": "zapvidafarmx@gmail.com"
       }
     }'
   ```

---

## 📞 PRÓXIMOS PASSOS

1. **AGORA:** Verifique as 3 variáveis no Vercel
2. **AGORA:** Faça redeploy
3. **AGORA:** Complete uma triagem de teste
4. **DEPOIS:** Configure domínio no Resend (melhor deliverability)

---

**Última atualização:** 27/11/2025

