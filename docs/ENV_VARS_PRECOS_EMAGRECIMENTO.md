# 🔧 VARIÁVEIS DE AMBIENTE - PREÇOS EMAGRECIMENTO

**Data:** Janeiro 2025  
**Status:** ⚠️ **CONFIGURAR NO VERCEL**

---

## 📋 VARIÁVEIS NECESSÁRIAS

Configure estas variáveis no Vercel (Settings → Environment Variables):

```bash
# Preços em CENTAVOS (valores totais dos planos)
ASAAS_PRICE_EMAGRECIMENTO_BASICO=418800      # R$ 4.188,00 (12x de R$ 349)
ASAAS_PRICE_EMAGRECIMENTO_COMPLETO=478800    # R$ 4.788,00 (12x de R$ 399)
ASAAS_PRICE_EMAGRECIMENTO_PREMIUM=538800      # R$ 5.388,00 (12x de R$ 449)
```

---

## ✅ VALIDAÇÃO

**Valores corretos:**
- ✅ Básico: 418800 centavos = R$ 4.188,00
- ✅ Completo: 478800 centavos = R$ 4.788,00  
- ✅ Premium: 538800 centavos = R$ 5.388,00

**Parcelamento:**
- ✅ Todos os planos: 12x sem juros no cartão
- ✅ Básico: 12x de R$ 349
- ✅ Completo: 12x de R$ 399
- ✅ Premium: 12x de R$ 449

---

## 🔍 COMO VERIFICAR

1. Acesse Vercel Dashboard
2. Vá em Settings → Environment Variables
3. Procure por `ASAAS_PRICE_EMAGRECIMENTO_*`
4. Verifique se os valores estão corretos (em centavos)

---

## ⚠️ IMPORTANTE

- **Valores devem estar em CENTAVOS** (não em reais)
- **Não incluir pontos ou vírgulas** (apenas números)
- **Aplicar em todas as environments** (Production, Preview, Development)

---

**Última atualização:** Janeiro 2025

