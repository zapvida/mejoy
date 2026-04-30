# 🚀 INSTRUÇÕES FINAIS - LANÇAMENTO ZAPFARM EMAGRECIMENTO

**Data:** Janeiro 2025  
**Status:** ✅ **CÓDIGO PRONTO - FALTA CONFIGURAR ENV VARS**

---

## ✅ O QUE JÁ ESTÁ IMPLEMENTADO

### 1. Cookie Banner ✅
- Componente completo e funcional
- Integrado no app
- API de consentimento criada
- Link no Footer

### 2. Planos e Preços ✅
- Configuração centralizada criada
- Todos os componentes atualizados
- Textos otimizados (mobile-first, gatilhos mentais)
- Preços: 12x sem juros (R$ 349, R$ 399, R$ 449)
- Nota legal adicionada

### 3. Consistência ✅
- Todos os textos falam a mesma linguagem
- Preços consistentes em todo o projeto
- IDs mapeados corretamente
- Lint passando (0 erros)

---

## ⚠️ O QUE PRECISA SER FEITO AGORA

### 1. CONFIGURAR VARIÁVEIS DE AMBIENTE NO VERCEL (URGENTE)

**Acesse:** Vercel Dashboard → Seu Projeto → Settings → Environment Variables

**Adicione/Atualize estas 3 variáveis:**

```bash
ASAAS_PRICE_EMAGRECIMENTO_BASICO=418800
ASAAS_PRICE_EMAGRECIMENTO_COMPLETO=478800
ASAAS_PRICE_EMAGRECIMENTO_PREMIUM=538800
```

**⚠️ IMPORTANTE:**
- Valores em **CENTAVOS** (não reais)
- Sem pontos ou vírgulas
- Aplicar em **todas as environments** (Production, Preview, Development)

**Como verificar:**
1. Vercel Dashboard → Settings → Environment Variables
2. Procure por `ASAAS_PRICE_EMAGRECIMENTO_*`
3. Verifique se os 3 valores estão corretos

---

### 2. CONFIGURAR PRODUTOS NO ASAAS

**No painel do Asaas, crie/atualize 3 produtos:**

**Produto 1 - Start GLP-1:**
- Nome: "Start GLP-1 - Emagrecimento"
- Valor: R$ 4.188,00
- ID do produto: Use o mesmo ID que está na env var `ASAAS_PRICE_EMAGRECIMENTO_BASICO`

**Produto 2 - Programa GLP-1 3 Meses:**
- Nome: "Programa GLP-1 3 Meses - Emagrecimento"
- Valor: R$ 4.788,00
- ID do produto: Use o mesmo ID que está na env var `ASAAS_PRICE_EMAGRECIMENTO_COMPLETO`

**Produto 3 - Programa GLP-1 6 Meses Premium:**
- Nome: "Programa GLP-1 6 Meses Premium - Emagrecimento"
- Valor: R$ 5.388,00
- ID do produto: Use o mesmo ID que está na env var `ASAAS_PRICE_EMAGRECIMENTO_PREMIUM`

**⚠️ IMPORTANTE:**
- Os IDs dos produtos no Asaas devem corresponder aos valores nas env vars
- Configure parcelamento: até 12x sem juros no cartão

---

### 3. TESTAR FLUXO COMPLETO EM PRODUÇÃO

**Teste completo (faça 1 vez antes de lançar):**

1. **Landing Page:**
   - Acesse `zapfarm.com.br/obesidade`
   - Verifique se CTAs estão funcionando

2. **Triagem:**
   - Clique em CTA → `/triagem/emagrecimento`
   - Preencha triagem completa
   - Verifique se redireciona para relatório

3. **Relatório:**
   - Verifique se relatório gera corretamente
   - Verifique se CTAs de planos aparecem
   - Verifique se preços estão corretos

4. **Checkout:**
   - Clique em um plano
   - Verifique se preços estão corretos (12x de R$ X)
   - Verifique se nota legal aparece
   - **NÃO FINALIZE O PAGAMENTO** (apenas teste até a tela de pagamento)

5. **Validação:**
   - Verifique se valores exibidos batem com env vars
   - Verifique se parcelamento está correto
   - Verifique se IDs estão sendo enviados corretamente para API

---

## 📋 CHECKLIST FINAL

### Código ✅
- [x] Cookie Banner implementado
- [x] Planos atualizados
- [x] Preços atualizados
- [x] Textos otimizados
- [x] Consistência garantida
- [x] Lint passando

### Configuração ⚠️
- [ ] Env vars configuradas no Vercel
- [ ] Produtos criados no Asaas
- [ ] IDs dos produtos batem com env vars
- [ ] Parcelamento configurado (12x sem juros)

### Testes ⚠️
- [ ] Fluxo completo testado em produção
- [ ] Preços verificados
- [ ] Pagamento testado (até tela final, sem finalizar)

---

## 🎯 VALORES FINAIS DOS PLANOS

### Plano 1 - Start GLP-1
- **Parcelamento:** 12x de R$ 349
- **Total:** R$ 4.188,00
- **Env Var:** `ASAAS_PRICE_EMAGRECIMENTO_BASICO=418800`
- **Duração:** 3 meses

### Plano 2 - Programa GLP-1 3 Meses (RECOMENDADO)
- **Parcelamento:** 12x de R$ 399
- **Total:** R$ 4.788,00
- **Env Var:** `ASAAS_PRICE_EMAGRECIMENTO_COMPLETO=478800`
- **Duração:** 3 meses

### Plano 3 - Programa GLP-1 6 Meses Premium
- **Parcelamento:** 12x de R$ 449
- **Total:** R$ 5.388,00
- **Env Var:** `ASAAS_PRICE_EMAGRECIMENTO_PREMIUM=538800`
- **Duração:** 6 meses

---

## 📝 TEXTOS DOS PLANOS (PARA REFERÊNCIA)

### Plano 1 - Start GLP-1
**Badge:** "Comece com segurança"  
**Título:** "Start GLP-1"  
**Subtítulo:** "Seu primeiro ciclo com médico ao lado."  
**Preço:** "12x de R$ 349"  
**Detalhe:** "Total de R$ 4.188 em até 12x sem juros no cartão."

**Benefícios:**
- Consulta online com endocrino especialista
- Balança inteligente conectada ao app
- Primeiro ciclo ajustado ao seu caso
- Acompanhamento por WhatsApp em horário comercial
- Relatório claro pra entender seu corpo

### Plano 2 - Programa GLP-1 3 Meses (RECOMENDADO)
**Badge:** "Mais escolhido"  
**Título:** "Programa GLP-1 3 Meses"  
**Subtítulo:** "90 dias de cuidado contínuo."  
**Preço:** "12x de R$ 399"  
**Detalhe:** "Total de R$ 4.788 em até 12x sem juros no cartão."

**Benefícios:**
- Tudo do Start GLP-1 incluso
- 2 consultas de retorno para ajustes finos
- Check-ins semanais da equipe pelo WhatsApp
- Grupo VIP com pacientes e equipe médica
- Mais aderência e acompanhamento próximo

### Plano 3 - Programa GLP-1 6 Meses Premium
**Badge:** "Mais completo"  
**Título:** "Programa GLP-1 6 Meses Premium"  
**Subtítulo:** "6 meses com médico e time do seu lado."  
**Preço:** "12x de R$ 449"  
**Detalhe:** "Total de R$ 5.388 em até 12x sem juros no cartão."

**Benefícios:**
- Tudo do Programa 3 Meses incluso
- 4–5 consultas ao longo de 6 meses
- Prioridade nas respostas da equipe
- Encontros em grupo online com médico e nutri
- Plano de manutenção pra evitar reganho de peso

---

## 🔒 NOTA LEGAL

**Texto exibido em todos os lugares:**
> "O uso de medicações como GLP-1 depende sempre da avaliação do endocrinologista. Nenhuma prescrição é automática: o médico decide junto com você, seguindo as diretrizes atuais de obesidade."

---

## ✅ PRÓXIMOS PASSOS IMEDIATOS

1. **Configurar env vars no Vercel** (5 minutos)
2. **Configurar produtos no Asaas** (10 minutos)
3. **Testar fluxo completo** (15 minutos)
4. **Validar preços** (5 minutos)

**Total:** ~35 minutos para estar 100% pronto

---

## 🎉 RESULTADO

**Status:** 🟢 **PRONTO PARA LANÇAR**

- ✅ Código implementado
- ✅ Textos otimizados
- ✅ Consistência garantida
- ⚠️ Falta apenas configurar env vars e testar

**Você pode começar a vender amanhã!** 🚀

---

**Última atualização:** Janeiro 2025  
**Próxima ação:** Configurar env vars no Vercel

