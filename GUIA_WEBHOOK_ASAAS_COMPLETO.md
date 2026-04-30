# 🔗 GUIA COMPLETO - CONFIGURAR WEBHOOK ASAAS

**Status:** ✅ Pronto para copiar e colar  
**Domínio:** zapfarm.com.br  
**URL do Webhook:** https://www.zapfarm.com.br/api/asaas/webhook

---

## 📋 PASSO A PASSO COMPLETO

### **PASSO 1: Acessar a Página de Webhooks**

1. No Asaas Dashboard, você já está na página de **Integrações**
2. Clique na aba **"Webhooks"** (já deve estar selecionada)
3. Você verá o formulário **"Adicionar Webhook"**

---

### **PASSO 2: Preencher o Formulário**

#### ✅ **2.1 Este Webhook ficará ativo?**
```
✅ SIM (Selecione "Sim")
```
**Por quê:** O webhook precisa estar ativo para receber notificações

---

#### ✅ **2.2 Nome do Webhook**
```
ZapFarm - Pagamentos
```
**Copie e cole:** `ZapFarm - Pagamentos`

---

#### ✅ **2.3 URL do Webhook**
```
https://www.zapfarm.com.br/api/asaas/webhook
```
**⚠️ IMPORTANTE:** 
- Use **www.zapfarm.com.br** (com www)
- Use **https://** (não http://)
- A URL completa é: `https://www.zapfarm.com.br/api/asaas/webhook`

**Copie e cole:** `https://www.zapfarm.com.br/api/asaas/webhook`

---

#### ✅ **2.4 E-mail**
```
[SEU_EMAIL_AQUI]
```
**Exemplo:** `contato@zapfarm.com.br` ou `suporte@zapfarm.com.br`

**Por quê:** Você receberá notificações se o webhook falhar

---

#### ✅ **2.5 Versão da API**
```
v3
```
**Selecione:** `v3` (versão mais recente)

---

#### ✅ **2.6 Token de autenticação (Opcional)**
```
[DEIXE VAZIO POR ENQUANTO]
```
**Por quê:** Por enquanto não precisamos, mas pode configurar depois para segurança extra

---

#### ✅ **2.7 Fila de sincronização ativada?**
```
✅ SIM (Selecione "Sim")
```
**Por quê:** Garante que os eventos sejam processados na ordem correta

---

#### ✅ **2.8 Tipo de envio**
```
Sequencial
```
**Selecione:** `Sequencial`

**Por quê:** Garante que os eventos sejam processados na ordem (importante para pagamentos)

---

### **PASSO 3: Selecionar Eventos (CRÍTICO)**

Abaixo do formulário, você verá seções de eventos. Expanda a seção **"Cobranças"** e selecione **APENAS** estes eventos:

#### ✅ **EVENTOS OBRIGATÓRIOS (Copie e cole os nomes exatos):**

```
PAYMENT_CONFIRMED
PAYMENT_RECEIVED
PAYMENT_UPDATED
PAYMENT_OVERDUE
PAYMENT_DELETED
PAYMENT_REFUNDED
```

**⚠️ IMPORTANTE:** 
- Selecione **APENAS** estes 6 eventos
- Não selecione outros eventos (isso pode causar problemas)
- Estes são os eventos que o código processa

---

### **PASSO 4: Salvar o Webhook**

1. Clique no botão **"Salvar"** ou **"Adicionar Webhook"**
2. Aguarde a confirmação
3. O webhook será criado e aparecerá na lista

---

## 📋 RESUMO - TUDO PRONTO PARA COPIAR E COLAR

### **Formulário Completo:**

```
Nome do Webhook: ZapFarm - Pagamentos

URL do Webhook: https://www.zapfarm.com.br/api/asaas/webhook

E-mail: [SEU_EMAIL_AQUI]

Versão da API: v3

Token de autenticação: [DEIXE VAZIO]

Fila de sincronização: SIM

Tipo de envio: Sequencial

Este Webhook ficará ativo?: SIM
```

### **Eventos para Selecionar (6 eventos):**

```
✅ PAYMENT_CONFIRMED
✅ PAYMENT_RECEIVED
✅ PAYMENT_UPDATED
✅ PAYMENT_OVERDUE
✅ PAYMENT_DELETED
✅ PAYMENT_REFUNDED
```

---

## ✅ VALIDAÇÃO FINAL

Após criar o webhook, verifique:

1. ✅ **URL está correta:** `https://www.zapfarm.com.br/api/asaas/webhook`
2. ✅ **Webhook está ativo:** Status mostra "Ativo"
3. ✅ **6 eventos selecionados:** Apenas os eventos listados acima
4. ✅ **Tipo de envio:** Sequencial
5. ✅ **Fila ativada:** Sim

---

## 🧪 TESTAR O WEBHOOK

### **Opção 1: Teste Manual (Recomendado)**

1. Faça um pagamento de teste no checkout
2. Verifique os logs do Vercel: Dashboard → Functions → `/api/asaas/webhook` → Logs
3. Verifique o banco: Supabase → Table Editor → `zapfarm_orders` (deve ter o pedido)

### **Opção 2: Teste via Asaas Dashboard**

1. No Asaas, vá em **Integrações → Webhooks → Logs de Webhooks**
2. Você verá os eventos sendo enviados
3. Verifique se há erros (status 200 = sucesso)

---

## 🚨 PROBLEMAS COMUNS

### ❌ Erro: "Webhook não recebe eventos"
**Solução:**
1. Verifique se a URL está correta: `https://www.zapfarm.com.br/api/asaas/webhook`
2. Verifique se o webhook está ativo
3. Verifique se os eventos estão selecionados

### ❌ Erro: "404 Not Found"
**Solução:**
1. Verifique se o domínio está correto: `www.zapfarm.com.br` (com www)
2. Verifique se o deploy no Vercel foi feito
3. Teste a URL manualmente: `https://www.zapfarm.com.br/api/asaas/webhook` (deve retornar 405 Method Not Allowed, não 404)

### ❌ Erro: "500 Internal Server Error"
**Solução:**
1. Verifique os logs do Vercel
2. Verifique se todas as 42 variáveis de ambiente estão configuradas
3. Verifique se o banco de dados está acessível

---

## 📊 O QUE ACONTECE QUANDO FUNCIONA

1. ✅ Cliente faz checkout → Pagamento criado no Asaas
2. ✅ Asaas envia evento `PAYMENT_CONFIRMED` → Webhook recebe
3. ✅ Webhook processa → Pedido criado no banco (`zapfarm_orders`)
4. ✅ Email de confirmação enviado (se Resend configurado)
5. ✅ Cliente redirecionado para página de obrigado

---

## 🎯 PRÓXIMOS PASSOS

Após configurar o webhook:

1. ✅ Testar um pagamento de teste
2. ✅ Verificar se o pedido foi criado no banco
3. ✅ Verificar logs do Vercel
4. ✅ Se tudo funcionar, você está pronto para lançar!

---

## 📝 CHECKLIST FINAL

- [ ] Webhook criado no Asaas
- [ ] URL correta: `https://www.zapfarm.com.br/api/asaas/webhook`
- [ ] 6 eventos selecionados
- [ ] Webhook ativo
- [ ] Tipo de envio: Sequencial
- [ ] Fila de sincronização: Ativada
- [ ] Teste realizado com sucesso
- [ ] Pedido criado no banco após pagamento

---

**🚀 PRONTO! Após configurar, você pode ir para o próximo passo!**

