# 🔑 GUIA RÁPIDO - COMO OBTER AS CHAVES

## ✅ 1. NEXTAUTH_SECRET - JÁ GERADO!

**Valor gerado:**
```
Os5XKCrU+1KHLar/j7TSVZM/zpzDuRaov3m/93c7MzI=
```

**✅ Copie este valor e cole no Vercel:**
- Name: `NEXTAUTH_SECRET`
- Value: `Os5XKCrU+1KHLar/j7TSVZM/zpzDuRaov3m/93c7MzI=`

---

## 🔑 2. ASAAS_API_KEY - PASSO A PASSO

### **Passo 1: Acesse o Asaas**
1. Vá para: https://www.asaas.com
2. Clique em **"Acessar minha conta"** (canto superior direito)
3. Faça login com suas credenciais

### **Passo 2: Acesse as Configurações**
1. Após fazer login, você verá o dashboard do Asaas
2. No menu lateral esquerdo, procure por **"Configurações"** ou **"Integrações"**
3. Clique em **"Integrações"** ou **"API"**

### **Passo 3: Encontre a Chave da API**
1. Procure por uma seção chamada **"API"** ou **"Chaves de API"**
2. Você verá uma chave que começa com `aact_prod_` ou `aact_YTUw...`
3. **IMPORTANTE:** 
   - Para **PRODUÇÃO**, use a chave que começa com `aact_prod_`
   - Para **TESTES**, use a chave que começa com `aact_YTUw...` (sandbox)

### **Passo 4: Copiar a Chave**
1. Clique no ícone de **"Copiar"** ou selecione e copie a chave completa
2. A chave será algo como: `aact_prod_XXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### **Passo 5: Adicionar no Vercel**
1. Vercel Dashboard → Seu Projeto → Settings → Environment Variables
2. Clique em **"Add New"**
3. Name: `ASAAS_API_KEY`
4. Value: Cole a chave que você copiou
5. Environment: ✅ Production ✅ Preview ✅ Development
6. Clique em **"Save"**

---

## 📋 RESUMO DOS VALORES

### ✅ NEXTAUTH_SECRET
```
Os5XKCrU+1KHLar/j7TSVZM/zpzDuRaov3m/93c7MzI=
```
**Status:** ✅ Pronto para usar!

### ⏳ ASAAS_API_KEY
```
[OBTER DO DASHBOARD ASAAS]
```
**Status:** ⏳ Precisa obter do dashboard

---

## 🚨 SE NÃO ENCONTRAR A CHAVE DA API NO ASAAS

### **Opção 1: Criar Nova Chave**
1. No dashboard do Asaas, vá em **Configurações → Integrações → API**
2. Procure por **"Gerar nova chave"** ou **"Criar API Key"**
3. Clique e gere uma nova chave
4. **IMPORTANTE:** Anote a chave imediatamente, ela só aparece uma vez!

### **Opção 2: Contatar Suporte**
Se não encontrar a opção de API:
1. Entre em contato com o suporte do Asaas
2. Peça para habilitar acesso à API
3. Peça para gerar uma chave de produção

### **Opção 3: Verificar Documentação**
1. Acesse: https://docs.asaas.com
2. Procure por "API" ou "Autenticação"
3. Siga as instruções para obter a chave

---

## ✅ CHECKLIST FINAL

- [ ] NEXTAUTH_SECRET copiado e adicionado no Vercel
- [ ] ASAAS_API_KEY obtida do dashboard
- [ ] ASAAS_API_KEY adicionada no Vercel
- [ ] Ambiente selecionado: Production, Preview, Development

---

## 🎯 PRÓXIMOS PASSOS

Após obter ambas as chaves:

1. ✅ Adicione ambas no Vercel
2. ✅ Faça redeploy (ou aguarde próximo deploy automático)
3. ✅ Teste o checkout para validar que a chave do Asaas está funcionando

---

**💡 DICA:** Se você já tem uma conta no Asaas, a chave da API geralmente está em:
- **Configurações → Integrações → API**
- Ou no menu lateral: **"Desenvolvedores" → "API"**

