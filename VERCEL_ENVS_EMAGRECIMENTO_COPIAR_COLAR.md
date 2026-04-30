# 🔧 ENV VARS - EMAGRECIMENTO - COPIAR E COLAR

**Data:** Janeiro 2025  
**Ação:** ATUALIZAR (não remover) as 3 variáveis abaixo

---

## ✅ VALORES CORRETOS PARA EMAGRECIMENTO

### ⚠️ IMPORTANTE: ATUALIZAR (não criar novas)

As 3 variáveis abaixo **JÁ EXISTEM** no Vercel. Você precisa **ATUALIZAR** os valores delas.

---

## 📋 COMANDOS PRONTOS PARA COPIAR/COLAR

### Opção 1: Via Vercel CLI (Mais Rápido)

```bash
# Atualizar BÁSICO
vercel env add ASAAS_PRICE_EMAGRECIMENTO_BASICO production preview development
# Quando pedir o valor, cole: 418800

# Atualizar COMPLETO
vercel env add ASAAS_PRICE_EMAGRECIMENTO_COMPLETO production preview development
# Quando pedir o valor, cole: 478800

# Atualizar PREMIUM
vercel env add ASAAS_PRICE_EMAGRECIMENTO_PREMIUM production preview development
# Quando pedir o valor, cole: 538800
```

**⚠️ NOTA:** O comando `vercel env add` vai perguntar se você quer sobrescrever. Digite **"y"** (yes) para confirmar.

---

### Opção 2: Via Dashboard Vercel (Mais Visual)

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **zapfarm**
3. Vá em **Settings** → **Environment Variables**
4. Para cada uma das 3 variáveis abaixo:

#### Variável 1: ASAAS_PRICE_EMAGRECIMENTO_BASICO
- Clique nos **3 pontos** (⋯) ao lado da variável
- Clique em **"Edit"**
- Altere o **Value** para: `418800`
- Confirme que está marcado: ✅ Production ✅ Preview ✅ Development
- Clique em **"Save"**

#### Variável 2: ASAAS_PRICE_EMAGRECIMENTO_COMPLETO
- Clique nos **3 pontos** (⋯) ao lado da variável
- Clique em **"Edit"**
- Altere o **Value** para: `478800`
- Confirme que está marcado: ✅ Production ✅ Preview ✅ Development
- Clique em **"Save"**

#### Variável 3: ASAAS_PRICE_EMAGRECIMENTO_PREMIUM
- Clique nos **3 pontos** (⋯) ao lado da variável
- Clique em **"Edit"**
- Altere o **Value** para: `538800`
- Confirme que está marcado: ✅ Production ✅ Preview ✅ Development
- Clique em **"Save"**

---

## 📊 VALORES CORRETOS (EM CENTAVOS)

| Variável | Valor (centavos) | Valor em Reais | Parcela Mensal |
|----------|------------------|----------------|----------------|
| `ASAAS_PRICE_EMAGRECIMENTO_BASICO` | `418800` | R$ 4.188,00 | 12x de R$ 349 |
| `ASAAS_PRICE_EMAGRECIMENTO_COMPLETO` | `478800` | R$ 4.788,00 | 12x de R$ 399 |
| `ASAAS_PRICE_EMAGRECIMENTO_PREMIUM` | `538800` | R$ 5.388,00 | 12x de R$ 449 |

---

## ⚠️ O QUE NÃO FAZER

❌ **NÃO REMOVER** nenhuma variável  
❌ **NÃO CRIAR** variáveis duplicadas  
✅ **APENAS ATUALIZAR** os valores das 3 variáveis existentes

---

## ✅ VALIDAÇÃO

Após atualizar, verifique:

```bash
vercel env ls | grep EMAGRECIMENTO
```

Você deve ver as 3 variáveis com os valores corretos:
- `ASAAS_PRICE_EMAGRECIMENTO_BASICO` = `418800`
- `ASAAS_PRICE_EMAGRECIMENTO_COMPLETO` = `478800`
- `ASAAS_PRICE_EMAGRECIMENTO_PREMIUM` = `538800`

---

## 🚀 PRÓXIMO PASSO

Após atualizar as env vars:

1. ✅ Forçar redeploy (ver `docs/PLAYBOOK_VALIDACAO_EMAGRECIMENTO.md`)
2. ✅ Rodar smoke test (ver `docs/PLAYBOOK_VALIDACAO_EMAGRECIMENTO.md`)

---

**Última atualização:** Janeiro 2025
