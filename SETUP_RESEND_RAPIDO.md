# ⚡ Setup Rápido - Resend (2 minutos)

## 🎯 Passo a Passo

### 1. Criar conta no Resend
👉 **https://resend.com/signup**
- Use seu email
- Confirme o email

### 2. Obter API Key
👉 **https://resend.com/api-keys**
- Clique em **"Create API Key"**
- Dê um nome (ex: "ZapFarm Production")
- **COPIE A CHAVE** (ela só aparece uma vez!)
- Formato: `re_xxxxxxxxxxxxxxxxxxxxx`

### 3. Configurar no Vercel

#### Opção A: Via Script (Automático)
```bash
./scripts/setup-resend.sh
```

#### Opção B: Via Vercel Dashboard (Manual)
1. Acesse: **https://vercel.com/[seu-projeto]/settings/environment-variables**
2. Clique em **"Add New"**
3. Nome: `RESEND_API_KEY`
4. Valor: Cole sua chave (`re_...`)
5. Ambiente: ✅ **Production** (e Preview se quiser)
6. Salve

#### Opção C: Via Vercel CLI (Manual)
```bash
vercel env add RESEND_API_KEY production
# Cole a chave quando solicitado
```

### 4. Variáveis Opcionais (Recomendadas)

```bash
# Email remetente
vercel env add EMAIL_FROM production
# Valor: ZapFarm <noreply@zapfarm.com.br>

# Email para respostas
vercel env add EMAIL_REPLY_TO production
# Valor: contato@zapfarm.com.br
```

### 5. Testar

```bash
# Após deploy
TEST_EMAIL=seu-email@exemplo.com npm run test:emails
```

## ✅ Checklist

- [ ] Conta Resend criada
- [ ] API Key obtida (`re_...`)
- [ ] `RESEND_API_KEY` configurada no Vercel (Production)
- [ ] Deploy feito
- [ ] Teste executado

## 🔗 Links Diretos

- **Criar conta**: https://resend.com/signup
- **API Keys**: https://resend.com/api-keys
- **Vercel Env Vars**: https://vercel.com/[projeto]/settings/environment-variables

## 💡 Dica

A API Key do Resend tem **3.000 emails/mês grátis**. Perfeito para começar!

---

**Pronto em 2 minutos!** 🚀







