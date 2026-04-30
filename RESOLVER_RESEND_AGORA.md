# 🚨 RESOLVER RESEND AGORA - GUIA RÁPIDO

**Status:** ⚠️ **AÇÃO NECESSÁRIA**  
**Tempo estimado:** 5 minutos

---

## 🎯 O QUE FAZER AGORA (PASSO A PASSO)

### **1️⃣ Verificar API Key no Vercel (2 min)**

1. Acesse: **https://vercel.com/[seu-projeto]/settings/environment-variables**
2. Procure por: `RESEND_API_KEY`
3. **VERIFIQUE:**
   - ✅ Está configurada?
   - ✅ Valor: `re_P3HGAEGN_GdGZznTsjAQAtPkdBL447...` (sua chave completa)
   - ✅ Marcada para **Production**? ✅ **Preview**? ✅ **Development**?

**Se NÃO estiver ou estiver diferente:**

**Via Dashboard:**
1. Clique em **"Add New"** (ou edite a existente)
2. **Name:** `RESEND_API_KEY`
3. **Value:** Cole sua chave completa do Resend (`re_P3HGAEGN...`)
4. **Environments:** ✅ Production ✅ Preview ✅ Development
5. **Save**

**Via CLI (mais rápido):**
```bash
vercel env add RESEND_API_KEY production
# Cole quando solicitado: re_P3HGAEGN_GdGZznTsjAQAtPkdBL447...
```

---

### **2️⃣ Verificar Outras Variáveis (1 min)**

No mesmo lugar, verifique estas 2 variáveis:

**EMAIL_FROM:**
- Name: `EMAIL_FROM`
- Value: `ZapFarm <zapvidafarmx@gmail.com>`
- Environments: ✅ Production

**EMAIL_REPLY_TO:**
- Name: `EMAIL_REPLY_TO`
- Value: `zapvidafarmx@gmail.com`
- Environments: ✅ Production

---

### **3️⃣ FAZER REDEPLOY (CRÍTICO!) ⚠️**

**⚠️ IMPORTANTE:** Após mudar variáveis, SEMPRE faça redeploy!

**Opção A: Via Git (Automático)**
```bash
git commit --allow-empty -m "trigger: redeploy para aplicar RESEND_API_KEY"
git push origin main
```

**Opção B: Via Vercel Dashboard**
1. Vá em: **Deployments**
2. Clique nos **3 pontos** (⋯) do último deploy
3. Clique em **"Redeploy"**
4. Aguarde concluir (2-3 minutos)

---

### **4️⃣ TESTAR AGORA (1 min)**

**Após o deploy concluir, teste:**

**Opção A: Via Endpoint de Teste (Mais Rápido)**

Abra o DevTools do navegador (F12) e execute:

```javascript
fetch('https://www.zapfarm.com.br/api/test-resend', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'zapvidafarmx@gmail.com' })
})
.then(r => r.json())
.then(data => {
  console.log('Resultado:', data);
  if (data.success) {
    alert('✅ Email enviado! Verifique sua caixa de entrada.');
  } else {
    alert('❌ Erro: ' + data.error);
  }
});
```

**Opção B: Teste Real (Complete uma Triagem)**

1. Acesse: https://www.zapfarm.com.br
2. Complete uma triagem qualquer
3. Use email: `zapvidafarmx@gmail.com`
4. Verifique se recebeu email
5. Verifique no Resend: https://resend.com/emails

---

## ✅ CHECKLIST FINAL

- [ ] RESEND_API_KEY configurada no Vercel (Production)
- [ ] EMAIL_FROM configurada no Vercel
- [ ] EMAIL_REPLY_TO configurada no Vercel
- [ ] **REDEPLOY feito** ⚠️ CRÍTICO!
- [ ] Teste executado (`/api/test-resend`)
- [ ] Email recebido em zapvidafarmx@gmail.com
- [ ] Dashboard do Resend mostra email enviado

---

## 🔍 SE AINDA NÃO FUNCIONAR

### **Verificar Logs no Vercel:**

1. Vá em: **Deployments** → **[último deploy]** → **Functions**
2. Procure por: `/api/test-resend` ou `/api/analytics/event`
3. Procure por:
   - ✅ `✅ Email enviado com sucesso` → Funcionando!
   - ⚠️ `⚠️ RESEND_API_KEY não configurada` → Problema na variável
   - ❌ `❌ Erro ao enviar email` → Problema na API key

### **Verificar API Key no Resend:**

1. Acesse: https://resend.com/api-keys
2. Verifique se a chave `re_P3HGAEGN...` tem:
   - ✅ "Sending access"
   - ✅ Status: Ativa
3. Se não tiver permissão, crie uma nova com "Sending access"

### **Testar Direto no Resend:**

1. Acesse: https://resend.com/emails
2. Clique em **"Send Test Email"**
3. Se funcionar → API key está OK
4. Se não funcionar → Problema na conta Resend

---

## 📞 PRÓXIMOS PASSOS

1. **AGORA:** Verifique as 3 variáveis no Vercel
2. **AGORA:** Faça REDEPLOY
3. **AGORA:** Teste via `/api/test-resend`
4. **AGORA:** Complete uma triagem de teste
5. **DEPOIS:** Configure domínio no Resend (opcional, melhora deliverability)

---

## 🎯 GARANTIA

**Após seguir estes passos:**
- ✅ Emails serão enviados automaticamente após triagem
- ✅ Emails serão enviados após pagamento confirmado
- ✅ Sistema de notificações funcionando 100%

**Última atualização:** 27/11/2025

