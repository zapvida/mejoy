# 🚨 CONFIGURAR RESEND AGORA - PASSO A PASSO

**Status:** ⚠️ **RESOLVENDO AGORA**  
**Data:** 27/11/2025

---

## 🎯 PROBLEMA IDENTIFICADO

Pelos screenshots:
- ✅ API Key existe: `re_P3HGAEGN_GdGZznTsjAQAtPkdBL447...`
- ✅ Variáveis configuradas no Vercel: EMAIL_FROM e EMAIL_REPLY_TO
- ❌ **0 emails enviados** (dashboard mostra "No sent emails yet")
- ❌ Possível problema: API key não está sendo lida em produção

---

## ✅ SOLUÇÃO IMEDIATA - FAÇA AGORA

### **PASSO 1: Verificar API Key no Vercel (2 minutos)**

1. **Acesse:** https://vercel.com/[seu-projeto]/settings/environment-variables
2. **Procure por:** `RESEND_API_KEY`
3. **VERIFIQUE:**
   - ✅ Está configurada?
   - ✅ Valor está correto? (`re_P3HGAEGN_GdGZznTsjAQAtPkdBL447...`)
   - ✅ Está marcada para **Production**? ✅ **Preview**? ✅ **Development**?

**Se NÃO estiver configurada ou estiver diferente:**

```bash
# Via CLI (mais rápido)
vercel env add RESEND_API_KEY production
# Quando solicitado, cole: re_P3HGAEGN_GdGZznTsjAQAtPkdBL447...
# Repita para Preview e Development se quiser
```

**OU via Dashboard:**
1. Clique em "Add New"
2. Name: `RESEND_API_KEY`
3. Value: `re_P3HGAEGN_GdGZznTsjAQAtPkdBL447...` (sua chave completa)
4. Environments: ✅ Production ✅ Preview ✅ Development
5. Save

---

### **PASSO 2: Verificar Outras Variáveis (1 minuto)**

No mesmo lugar (Vercel → Environment Variables), verifique:

1. **EMAIL_FROM**
   - Valor: `ZapFarm <zapvidafarmx@gmail.com>`
   - Ou: `ZapFarm <noreply@zapfarm.com.br>`
   - Ambientes: ✅ Production

2. **EMAIL_REPLY_TO**
   - Valor: `zapvidafarmx@gmail.com`
   - Ambientes: ✅ Production

---

### **PASSO 3: Fazer REDEPLOY (CRÍTICO!)**

**⚠️ IMPORTANTE:** Após mudar variáveis de ambiente, SEMPRE faça redeploy!

**Opção A: Via Git (Automático)**
```bash
git commit --allow-empty -m "trigger: redeploy para aplicar RESEND_API_KEY"
git push origin main
```

**Opção B: Via Vercel Dashboard**
1. Vá em: **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Clique em **"Redeploy"**
4. Aguarde concluir (2-3 minutos)

---

### **PASSO 4: Testar AGORA (1 minuto)**

**Opção A: Via Endpoint de Teste (Mais Rápido)**

Após o deploy, acesse no navegador ou execute:

```bash
curl -X POST https://www.zapfarm.com.br/api/test-resend \
  -H "Content-Type: application/json" \
  -d '{"email": "zapvidafarmx@gmail.com"}'
```

**Ou acesse diretamente no navegador (após fazer POST):**
- Abra o DevTools (F12)
- Vá em Console
- Execute:
```javascript
fetch('/api/test-resend', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'zapvidafarmx@gmail.com' })
}).then(r => r.json()).then(console.log)
```

**Opção B: Teste Real (Complete uma Triagem)**

1. Acesse: https://www.zapfarm.com.br
2. Complete uma triagem qualquer
3. Verifique se recebeu email em `zapvidafarmx@gmail.com`
4. Verifique no Resend: https://resend.com/emails

---

## 🔍 VERIFICAÇÃO DE PROBLEMAS

### **Se ainda não funcionar:**

1. **Verifique logs no Vercel:**
   - Vá em: **Deployments** → **[último deploy]** → **Functions**
   - Procure por: `/api/test-resend` ou `/api/analytics/event`
   - Procure por: `✅ Email enviado com sucesso` ou `⚠️ RESEND_API_KEY não configurada`

2. **Verifique se a API key está correta:**
   - No Resend: https://resend.com/api-keys
   - Confirme que a chave `re_P3HGAEGN...` tem "Sending access" ✅
   - Se não tiver, crie uma nova com permissão de envio

3. **Teste direto no Resend:**
   - Acesse: https://resend.com/emails
   - Clique em "Send Test Email"
   - Se funcionar, a API key está OK
   - Se não funcionar, problema na conta Resend

---

## 📋 CHECKLIST RÁPIDO

- [ ] RESEND_API_KEY configurada no Vercel (Production)
- [ ] EMAIL_FROM configurada no Vercel
- [ ] EMAIL_REPLY_TO configurada no Vercel
- [ ] **REDEPLOY feito após configurar variáveis** ⚠️ CRÍTICO!
- [ ] Teste executado (`/api/test-resend`)
- [ ] Email recebido em zapvidafarmx@gmail.com
- [ ] Dashboard do Resend mostra email enviado

---

## 🚨 SE AINDA NÃO FUNCIONAR

**Execute este diagnóstico completo:**

1. **Verificar código está chamando:**
   ```bash
   # Complete uma triagem e verifique logs
   # Vercel → Deployments → Functions → /api/analytics/event
   ```

2. **Verificar se email está sendo passado:**
   - Complete uma triagem com email válido
   - Verifique logs se `payload.email` está presente

3. **Testar API diretamente:**
   ```bash
   curl -X POST https://www.zapfarm.com.br/api/analytics/event \
     -H "Content-Type: application/json" \
     -d '{
       "event": "TRIAGE_COMPLETED",
       "payload": {
         "name": "Teste",
         "email": "zapvidafarmx@gmail.com",
         "phone": "47999009923"
       }
     }'
   ```

---

## ✅ PRÓXIMOS PASSOS

1. **AGORA:** Verifique as 3 variáveis no Vercel
2. **AGORA:** Faça REDEPLOY
3. **AGORA:** Teste via `/api/test-resend`
4. **AGORA:** Complete uma triagem de teste
5. **DEPOIS:** Configure domínio no Resend (melhor deliverability)

---

**Última atualização:** 27/11/2025

