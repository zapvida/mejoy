# 📧 VARIÁVEIS DE EMAIL - PRONTO PARA COPIAR E COLAR

**Email:** zapvidafarmx@gmail.com  
**Status:** ✅ RESEND_API_KEY já obtida

---

## 🚀 OPÇÃO 1: VIA VERCEL CLI (MAIS RÁPIDO)

**Execute estes comandos no terminal (um por vez):**

```bash
# 1. RESEND_API_KEY (você já tem, mas se precisar configurar novamente)
vercel env add RESEND_API_KEY production
# Cole sua chave quando solicitado: re_xxxxxxxxxxxxxxxxxxxxx

# 2. EMAIL_FROM (remetente)
vercel env add EMAIL_FROM production
# Cole quando solicitado: ZapFarm <zapvidafarmx@gmail.com>

# 3. EMAIL_REPLY_TO (email para respostas)
vercel env add EMAIL_REPLY_TO production
# Cole quando solicitado: zapvidafarmx@gmail.com
```

**⚠️ IMPORTANTE:** Após cada comando, você será solicitado a colar o valor. Cole exatamente como mostrado acima.

---

## 🖥️ OPÇÃO 2: VIA VERCEL DASHBOARD (MAIS VISUAL)

**Acesse:** https://vercel.com/[seu-projeto]/settings/environment-variables

### 1️⃣ RESEND_API_KEY (se ainda não configurou)

```
Name: RESEND_API_KEY
Value: re_SUA_CHAVE_AQUI
Environment: ✅ Production ✅ Preview ✅ Development
```

**Cole sua chave Resend aqui:** `re_xxxxxxxxxxxxxxxxxxxxx`

---

### 2️⃣ EMAIL_FROM

```
Name: EMAIL_FROM
Value: ZapFarm <zapvidafarmx@gmail.com>
Environment: ✅ Production ✅ Preview ✅ Development
```

**⚠️ COPIE EXATAMENTE:** `ZapFarm <zapvidafarmx@gmail.com>`

---

### 3️⃣ EMAIL_REPLY_TO

```
Name: EMAIL_REPLY_TO
Value: zapvidafarmx@gmail.com
Environment: ✅ Production ✅ Preview ✅ Development
```

**⚠️ COPIE EXATAMENTE:** `zapvidafarmx@gmail.com`

---

## ✅ CHECKLIST FINAL

Após configurar, verifique:

- [ ] `RESEND_API_KEY` configurada (Production)
- [ ] `EMAIL_FROM` = `ZapFarm <zapvidafarmx@gmail.com>`
- [ ] `EMAIL_REPLY_TO` = `zapvidafarmx@gmail.com`
- [ ] Todas marcadas para **Production** (e Preview/Development se quiser)

---

## 🧪 TESTAR APÓS CONFIGURAR

```bash
# 1. Validar setup
npm run validate:emails

# 2. Testar envio real (use seu email)
TEST_EMAIL=zapvidafarmx@gmail.com npm run test:emails
```

---

## 📋 RESUMO DOS VALORES

| Variável | Valor |
|----------|-------|
| `RESEND_API_KEY` | `re_SUA_CHAVE_AQUI` |
| `EMAIL_FROM` | `ZapFarm <zapvidafarmx@gmail.com>` |
| `EMAIL_REPLY_TO` | `zapvidafarmx@gmail.com` |

---

## 🚨 IMPORTANTE

1. **Após configurar**, faça um **novo deploy** no Vercel
2. Os emails só funcionarão **após o deploy**
3. Você pode testar localmente também (adicione no `.env.local`)

---

**✅ PRONTO! Copie e cole sem erros!** 🚀







