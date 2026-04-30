# 🚀 SMOKE TEST RÁPIDO - VALIDAÇÃO FINAL

**Data:** Janeiro 2025  
**Status:** Env vars atualizadas ✅ | Deploy feito ✅  
**Próximo:** Rodar este smoke test (15 minutos)

---

## ✅ CHECKLIST RÁPIDO (MARQUE CONFORME TESTA)

### 1. Cookie Banner (2 min)
- [ ] Acesse: `https://zapfarm.com.br`
- [ ] Cookie banner aparece?
- [ ] Clica "Aceitar todos" → banner some?
- [ ] Site funciona normal?

**✅ Se sim:** Marque e continue

---

### 2. Landing Page → Triagem (3 min)
- [ ] Vai para `/obesidade`
- [ ] CTAs aparecem?
- [ ] Clica no CTA principal
- [ ] Redireciona para `/triagem/emagrecimento`?

**✅ Se sim:** Marque e continue

---

### 3. Triagem Completa (5 min)
- [ ] Preenche formulário com caso típico:
  - Sem contraindicações graves
  - IMC > 30 (obesidade)
  - Comorbidades leves (diabetes tipo 2, hipertensão)
- [ ] Finaliza triagem
- [ ] Loading aparece?
- [ ] Redireciona para relatório?

**✅ Se sim:** Marque e continue

---

### 4. Relatório (2 min)
- [ ] Relatório carrega? (aguarde se estiver gerando)
- [ ] Texto faz sentido?
- [ ] CTAs de planos aparecem?
- [ ] Clica em um CTA → abre checkout?

**✅ Se sim:** Marque e continue

---

### 5. Checkout - VALIDAÇÃO CRÍTICA (3 min)

**⚠️ ESTE É O TESTE MAIS IMPORTANTE:**

- [ ] Checkout carrega?
- [ ] **3 planos aparecem?**
  - [ ] Start GLP-1: **12x de R$ 349** = Total **R$ 4.188**
  - [ ] Programa 3 Meses: **12x de R$ 399** = Total **R$ 4.788** ⭐
  - [ ] Programa 6 Meses: **12x de R$ 449** = Total **R$ 5.388**
- [ ] Valores estão CORRETOS? (não aparecem valores antigos?)
- [ ] Seleciona plano recomendado
- [ ] Preenche dados (passo 1)
- [ ] Preenche endereço (passo 2)
- [ ] Confirma plano (passo 3)
- [ ] Avança até pagamento (passo 4)
- [ ] Formulário de pagamento Asaas carrega?

**✅ Se TODOS os valores estão corretos:** ✅ **VALIDADO!**

**❌ Se algum valor está errado:** ⚠️ Verificar env vars novamente

---

## 🎯 CRITÉRIO DE SUCESSO

**✅ VALIDADO se:**
- Cookie banner funciona
- Fluxo completo funciona (LP → Triagem → Relatório → Checkout)
- **Valores no checkout estão CORRETOS** (R$ 4.188 / 4.788 / 5.388)
- Formulário de pagamento carrega

**❌ NÃO VALIDADO se:**
- Algum erro aparece
- Valores no checkout estão errados
- Formulário de pagamento não carrega

---

## 📝 SE ENCONTRAR ERRO

**Documente:**
1. Onde: URL exata
2. O que: Ação que estava fazendo
3. Erro: Mensagem exata
4. Print: Screenshot se possível

**Exemplo:**
```
ERRO:
- URL: /emagrecimento/checkout
- Ação: Selecionando plano
- Erro: "Preço não configurado"
- Print: [anexar]
```

---

## ✅ APÓS VALIDAR

Se tudo passou:
1. ✅ Marque como **"100% VALIDADO"**
2. ✅ Produto está pronto para receber pedidos
3. ✅ Pode comunicar ao time

---

**Tempo total:** ~15 minutos  
**Status atual:** Aguardando smoke test

