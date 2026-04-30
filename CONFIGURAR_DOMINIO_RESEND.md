# 🌐 CONFIGURAR DOMÍNIO NO RESEND - GUIA COMPLETO

**Status:** ⚠️ **RECOMENDADO MAS NÃO OBRIGATÓRIO**  
**Tempo estimado:** 15-30 minutos (mais tempo de propagação DNS)

---

## 🎯 DOMÍNIO É OBRIGATÓRIO?

### ❌ **NÃO é obrigatório para funcionar**
- O Resend **permite enviar emails sem configurar domínio**
- Emails virão de `@resend.dev` (ex: `onboarding@resend.dev`)
- **Funciona perfeitamente** para testes e início

### ✅ **MAS é RECOMENDADO para produção**
- ✅ **Melhor deliverability** (menos chance de ir para spam)
- ✅ **Mais profissional** (emails vêm de `@zapfarm.com.br`)
- ✅ **Maior confiança** dos provedores de email (Gmail, Outlook, etc)
- ✅ **Melhor reputação** do domínio

---

## 🚨 SE NÃO ESTÁ FUNCIONANDO SEM DOMÍNIO

Se mesmo com API key correta não está funcionando, pode ser:

1. **Limite de emails sem domínio** - Resend pode limitar envios sem domínio verificado
2. **Bloqueio por spam** - Alguns provedores bloqueiam `@resend.dev`
3. **Configuração incorreta** - Verifique logs no Vercel

**SOLUÇÃO RÁPIDA:** Configure o domínio seguindo este guia!

---

## 📋 PASSO A PASSO - CONFIGURAR DOMÍNIO

### **PASSO 1: Adicionar Domínio no Resend (5 min)**

1. **Acesse:** https://resend.com/domains
2. **Clique em:** "+ Add Domain"
3. **Configure:**
   - **Domain:** `zapfarm.com.br` (ou `mail.zapfarm.com.br` ou `notifications.zapfarm.com.br`)
   - **Region:** São Paulo (sa-east-1) ✅ (já está selecionado)
   - **Custom Return-Path:** Deixe padrão (`send`)
4. **Clique em:** "+ Add Domain"

---

### **PASSO 2: Copiar Registros DNS (2 min)**

Após adicionar, o Resend mostrará registros DNS que você precisa adicionar:

**Exemplo de registros que aparecerão:**

1. **SPF Record (TXT):**
   ```
   v=spf1 include:resend.com ~all
   ```
   - **Type:** TXT
   - **Name:** `@` (ou deixe vazio)
   - **Value:** `v=spf1 include:resend.com ~all`

2. **DKIM Records (CNAME):**
   ```
   resend._domainkey.zapfarm.com.br → resend._domainkey.resend.com
   ```
   - **Type:** CNAME
   - **Name:** `resend._domainkey` (ou o que o Resend fornecer)
   - **Value:** `resend._domainkey.resend.com`

3. **DMARC Record (TXT) - Opcional mas recomendado:**
   ```
   v=DMARC1; p=quarantine; rua=mailto:dmarc@zapfarm.com.br
   ```
   - **Type:** TXT
   - **Name:** `_dmarc`
   - **Value:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@zapfarm.com.br`

---

### **PASSO 3: Adicionar Registros no Provedor DNS (10-15 min)**

**Onde você gerencia o DNS de `zapfarm.com.br`?**

#### **Opção A: Vercel (se domínio está no Vercel)**
1. Acesse: https://vercel.com/[seu-projeto]/settings/domains
2. Clique em `zapfarm.com.br`
3. Vá em "DNS Records"
4. Adicione os registros que o Resend forneceu

#### **Opção B: Cloudflare**
1. Acesse: https://dash.cloudflare.com
2. Selecione o domínio `zapfarm.com.br`
3. Vá em "DNS" → "Records"
4. Adicione os registros:
   - Clique em "Add record"
   - Selecione o tipo (TXT ou CNAME)
   - Cole o Name e Value do Resend
   - Salve

#### **Opção C: Registro.br / Outros Provedores**
1. Acesse o painel do seu provedor DNS
2. Vá em "Gerenciar DNS" ou "DNS Records"
3. Adicione os registros fornecidos pelo Resend
4. Salve

---

### **PASSO 4: Aguardar Verificação (15 minutos - 48 horas)**

1. **Volte ao Resend:** https://resend.com/domains
2. **Clique em:** "Verify Domain" (ou aguarde verificação automática)
3. **Status:** 
   - ⏳ "Pending" → Aguardando propagação DNS
   - ✅ "Verified" → Pronto para usar!
   - ❌ "Failed" → Verifique os registros DNS

**Tempo de propagação:**
- Mínimo: 15-30 minutos
- Normal: 1-4 horas
- Máximo: 48 horas

---

### **PASSO 5: Atualizar EMAIL_FROM (2 min)**

Após verificação, atualize no Vercel:

**EMAIL_FROM:**
- Valor antigo: `ZapFarm <zapvidafarmx@gmail.com>`
- Valor novo: `ZapFarm <noreply@zapfarm.com.br>` ✅

**Ou use subdomínio:**
- `ZapFarm <notifications@zapfarm.com.br>`
- `ZapFarm <mail@zapfarm.com.br>`

**Como atualizar:**
1. Vercel → Settings → Environment Variables
2. Edite `EMAIL_FROM`
3. Cole: `ZapFarm <noreply@zapfarm.com.br>`
4. Save
5. **Faça REDEPLOY** ⚠️

---

## ✅ CHECKLIST COMPLETO

- [ ] Domínio adicionado no Resend
- [ ] Registros DNS copiados do Resend
- [ ] SPF adicionado no provedor DNS
- [ ] DKIM adicionado no provedor DNS
- [ ] DMARC adicionado no provedor DNS (opcional)
- [ ] Aguardado propagação DNS (15min - 48h)
- [ ] Domínio verificado no Resend (status: ✅ Verified)
- [ ] EMAIL_FROM atualizado no Vercel
- [ ] REDEPLOY feito após atualizar EMAIL_FROM
- [ ] Teste executado (`/test-resend`)

---

## 🔍 VERIFICAR STATUS DO DOMÍNIO

**No Resend:**
- Acesse: https://resend.com/domains
- Veja o status do domínio:
  - ✅ **Verified** → Pronto para usar!
  - ⏳ **Pending** → Aguardando DNS
  - ❌ **Failed** → Verifique registros DNS

**Verificar DNS manualmente:**
```bash
# Verificar SPF
dig TXT zapfarm.com.br | grep spf

# Verificar DKIM
dig CNAME resend._domainkey.zapfarm.com.br

# Verificar DMARC
dig TXT _dmarc.zapfarm.com.br
```

---

## 🚨 PROBLEMAS COMUNS

### **Domínio não verifica**
- ✅ Verifique se os registros DNS foram salvos corretamente
- ✅ Aguarde mais tempo (pode levar até 48h)
- ✅ Use ferramentas como https://mxtoolbox.com para verificar

### **Emails ainda vêm de @resend.dev**
- ✅ Verifique se `EMAIL_FROM` está usando `@zapfarm.com.br`
- ✅ Faça redeploy após atualizar `EMAIL_FROM`
- ✅ Verifique se o domínio está "Verified" no Resend

### **Emails vão para spam**
- ✅ Configure DMARC (recomendado)
- ✅ Use um subdomínio dedicado (ex: `notifications@zapfarm.com.br`)
- ✅ Evite enviar muitos emails de uma vez

---

## 💡 DICAS

1. **Use subdomínio dedicado:**
   - `notifications@zapfarm.com.br` → Para notificações
   - `mail@zapfarm.com.br` → Para emails gerais
   - `noreply@zapfarm.com.br` → Para emails automáticos

2. **Teste antes de produção:**
   - Envie emails de teste para Gmail, Outlook, Yahoo
   - Verifique se não vão para spam
   - Teste em diferentes clientes de email

3. **Monitore deliverability:**
   - Resend Dashboard mostra taxa de entrega
   - Verifique logs no Vercel
   - Monitore reclamações de spam

---

## 🎯 RESUMO RÁPIDO

**Para funcionar AGORA (sem domínio):**
- ✅ API Key configurada
- ✅ Variáveis no Vercel
- ✅ Redeploy feito
- ✅ Emails virão de `@resend.dev` (funciona!)

**Para produção profissional (com domínio):**
- ✅ Configure domínio no Resend
- ✅ Adicione registros DNS
- ✅ Aguarde verificação
- ✅ Atualize `EMAIL_FROM` para `@zapfarm.com.br`
- ✅ Redeploy

---

**Última atualização:** 27/11/2025

