# 🧪 SMOKE TEST MANUAL - ZAPFARM PRODUÇÃO

**Data:** $(date)  
**Status:** Pronto para executar

---

## 🚀 DEPLOY REALIZADO

✅ **Commit:** `feat: zapfarm go-live - asaas + otimizacoes performance + validacoes finais`  
✅ **Push:** Enviado para `origin/main`  
✅ **Deploy:** Automático no Vercel (aguardar 2-5 minutos)

---

## 📋 SMOKE TEST AUTOMÁTICO (Terminal)

Execute no terminal:

```bash
cd /Users/teobeckert/desenvolvimento/zapfarm
./scripts/smoke-test.sh
```

Ou com URL customizada:

```bash
BASE_URL=https://www.zapfarm.com.br ./scripts/smoke-test.sh
```

**O que testa:**
- ✅ Todas as 10 LPACs (Landing Pages)
- ✅ Todos os 10 Checkouts
- ✅ Todas as 10 páginas de Obrigado
- ✅ APIs críticas (webhook, profile)

---

## 🧪 SMOKE TEST MANUAL (Navegador)

### ⚠️ CRÍTICO - Testar Primeiro:

#### 1. **Emagrecimento** (Produto Principal)

**LPAC:**
- [ ] Acesse: `https://www.zapfarm.com.br/emagrecimento`
- [ ] Verifique: Nome "MetaboSlim" no hero
- [ ] Verifique: Protocolo mencionado

**Triagem:**
- [ ] Clique em "Iniciar" / "Começar"
- [ ] Preencha formulário completo
- [ ] Finalize triagem
- [ ] Verifique: Mensagem "gerando relatório" aparece
- [ ] ⏱️ **Tempo:** Relatório deve aparecer em **segundos** (não minutos)

**Relatório:**
- [ ] Verifique: Primeiro frame carrega sem erro
- [ ] Verifique: Nome "MetaboSlim" aparece
- [ ] Console do navegador: Sem erros vermelhos

**Checkout:**
- [ ] Clique em "Escolher plano" / "Comprar"
- [ ] Verifique: 3 planos com preços:
  - Plano 1: **R$ 2.949**
  - Plano 2: **R$ 4.423**
  - Plano 3: **R$ 5.898**
- [ ] Mude quantidade para 2: Total deve ser R$ 5.898
- [ ] Avance para Step 2 (Dados)
- [ ] Verifique: Nome, email, WhatsApp **pré-preenchidos**
- [ ] Digite CEP: `01310-100` (ou qualquer CEP válido)
- [ ] Verifique: Rua, bairro, cidade, UF preenchem **automaticamente**
- [ ] Complete endereço
- [ ] Avance para Step 3 (Pagamento)

**Pagamento PIX:**
- [ ] Selecione PIX
- [ ] Clique em "Gerar PIX"
- [ ] Verifique: QR Code aparece
- [ ] Verifique: Código PIX aparece
- [ ] ⚠️ **NÃO PAGUE AINDA** (só verifique se aparece)

**Pagamento Cartão:**
- [ ] Volte e selecione Cartão de Crédito
- [ ] Preencha dados do cartão (use cartão de teste se sandbox)
- [ ] Verifique: Parcelamento funciona (1x a 12x)
- [ ] ⚠️ **NÃO FINALIZE AINDA** (só verifique se formulário funciona)

---

#### 2. **Calvície** (Segundo Crítico)

Repita o mesmo fluxo acima, mas:
- LPAC: `https://www.zapfarm.com.br/calvicie`
- Verifique: Nome "CapilMax" aparece
- Preços devem ser: **R$ 139 / R$ 209 / R$ 278**

---

### ✅ IMPORTANTE - Testar Mais 2 Produtos:

Escolha 2 produtos aleatórios e teste apenas:
- [ ] LPAC carrega
- [ ] Triagem funciona
- [ ] Relatório gera em segundos
- [ ] Checkout mostra preços corretos (R$ 139 / 209 / 278)
- [ ] PIX funciona

---

## 🔍 VALIDAÇÕES PÓS-TESTE

### No Painel Asaas:
- [ ] Acesse: https://www.asaas.com.br (ou seu painel)
- [ ] Verifique: Pagamentos de teste aparecem
- [ ] Verifique: Webhook está recebendo eventos

### No Banco de Dados:
- [ ] Verifique: Pedidos foram criados na tabela `zapfarm_orders`
- [ ] Verifique: Status de pagamento está correto

---

## ✅ CHECKLIST FINAL

- [ ] Smoke test automático passou (script)
- [ ] Emagrecimento testado (PIX + Cartão)
- [ ] Calvície testada (PIX + Cartão)
- [ ] Mais 2 produtos testados (PIX)
- [ ] Webhook funcionando no Asaas
- [ ] Pedidos salvos no banco

---

## 🎯 PRÓXIMOS PASSOS

Se todos os testes passarem:

1. ✅ **PRONTO PARA VENDER!**
2. ✅ Monitore primeiras vendas reais
3. ✅ Acompanhe logs do Vercel
4. ✅ Verifique webhook recebendo pagamentos

---

**Boa sorte com o lançamento! 🚀**

