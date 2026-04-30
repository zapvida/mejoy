# 📋 PLAYBOOK – Validação Final e Lançamento ZapFarm Emagrecimento

**Data:** Janeiro 2025  
**Objetivo:** Validar 100% o fluxo de Emagrecimento para lançamento oficial  
**Tempo estimado:** ~20 minutos

---

## 🎯 VISÃO GERAL

Este playbook descreve os **3 passos operacionais** necessários para considerar o produto **100% validado** após o código estar pronto.

**Status atual:**
- ✅ Código: **100% pronto**
- ⚠️ Operações: **Pendente** (este playbook)

---

## 📋 PASSO 1: CONFIGURAR ENV VARS NO VERCEL

**Tempo estimado:** 5 minutos

### 1.1 Acessar o Painel da Vercel

1. Acesse: https://vercel.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto **zapfarm** (ou o nome do seu projeto)

### 1.2 Navegar até Environment Variables

1. Clique em **Settings** (no menu superior)
2. Clique em **Environment Variables** (menu lateral esquerdo)

### 1.3 Adicionar as 3 Variáveis de Preço

Para cada uma das 3 variáveis abaixo, siga estes passos:

**a) Clique em "Add New"**

**b) Preencha os campos:**

#### Variável 1:
- **Name:** `ASAAS_PRICE_EMAGRECIMENTO_BASICO`
- **Value:** `418800`
- **Environments:** ✅ Marque todas as opções:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

**c) Clique em "Save"**

#### Variável 2:
- **Name:** `ASAAS_PRICE_EMAGRECIMENTO_COMPLETO`
- **Value:** `478800`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **Save**

#### Variável 3:
- **Name:** `ASAAS_PRICE_EMAGRECIMENTO_PREMIUM`
- **Value:** `538800`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **Save**

### 1.4 Validação

**Verifique que as 3 variáveis foram criadas:**
- Procure por `ASAAS_PRICE_EMAGRECIMENTO_*` na lista
- Confirme que os valores estão corretos (em centavos, sem pontos ou vírgulas)
- Confirme que estão marcadas para todos os ambientes

**✅ Critério de sucesso:** As 3 variáveis aparecem na lista com os valores corretos.

---

## 📋 PASSO 2: FORÇAR REDEPLOY

**Tempo estimado:** 1 minuto

Você tem **2 opções** para forçar um novo deploy:

### Opção A: Via Git Push (Recomendado)

```bash
# No terminal, na pasta do projeto:
git add .
git commit -m "chore: atualizar env vars para lançamento"
git push origin main
```

A Vercel detectará o push automaticamente e iniciará um novo deploy.

**Aguarde:** O deploy leva ~2-3 minutos. Você pode acompanhar no dashboard da Vercel.

### Opção B: Via Botão "Redeploy" (Alternativa)

1. Acesse: Vercel Dashboard → Seu Projeto → **Deployments**
2. Encontre o último deploy de **Production**
3. Clique nos **3 pontos** (⋯) ao lado do deploy
4. Clique em **"Redeploy"**
5. Confirme o redeploy

**Aguarde:** O deploy leva ~2-3 minutos.

### 2.1 Validação do Deploy

**Verifique que o deploy foi bem-sucedido:**
- No dashboard da Vercel, o último deploy deve estar com status **"Ready"** (verde)
- Não deve haver erros de build

**✅ Critério de sucesso:** Deploy concluído com sucesso e site acessível.

---

## 📋 PASSO 3: SMOKE TEST EM PRODUÇÃO

**Tempo estimado:** 15 minutos

**🌐 Acesse:** `https://zapfarm.com.br` (ou seu domínio de produção)

### 3.1 Teste do Cookie Banner

**O que verificar:**
- [ ] Cookie banner aparece ao carregar a página inicial
- [ ] Banner tem design adequado e texto legível
- [ ] Ao clicar em **"Aceitar todos"**, o banner desaparece
- [ ] Site funciona normalmente após aceitar (sem erros no console)

**✅ Critério de sucesso:** Banner aparece e funciona corretamente.

---

### 3.2 Teste da Landing Page

**O que verificar:**
- [ ] Página `/obesidade` carrega corretamente
- [ ] CTAs estão visíveis e funcionais
- [ ] Design responsivo funciona (teste em mobile se possível)
- [ ] Sticky CTA mobile aparece na parte inferior (se testando em mobile)

**Ação:**
- [ ] Clicar no **CTA principal** (ex: "Verificar minha elegibilidade")
- [ ] Deve redirecionar para `/triagem/emagrecimento`

**✅ Critério de sucesso:** LP carrega e CTAs redirecionam corretamente.

---

### 3.3 Teste da Triagem

**O que verificar:**
- [ ] Formulário de triagem carrega corretamente
- [ ] Todas as perguntas aparecem sequencialmente
- [ ] Validações funcionam (campos obrigatórios, formato de email, etc.)

**Ação - Preencher com caso típico candidato a GLP-1:**
- [ ] **Sem contraindicações graves** (sem câncer ativo, sem gravidez, etc.)
- [ ] **Com obesidade** (IMC > 30)
- [ ] **Com comorbidades leves** (ex: diabetes tipo 2, hipertensão controlada)
- [ ] Preencher todas as perguntas até o final

**Ao finalizar:**
- [ ] Tela **não trava** na última pergunta
- [ ] **Loading aparece** após clicar em "Finalizar"
- [ ] Você é redirecionado para o relatório (ou aparece mensagem de "gerando relatório")

**✅ Critério de sucesso:** Triagem completa sem erros e redireciona para relatório.

---

### 3.4 Teste do Relatório

**O que verificar:**
- [ ] Relatório carrega (se não carregar imediatamente, aguarde o polling)
- [ ] Texto faz sentido (endócrino, atual, individualizado)
- [ ] Pré-prescrição aparece apenas se você for candidato elegível
- [ ] Disclaimers e notas legais estão presentes

**Ação:**
- [ ] Verificar se os **CTAs de planos aparecem** na seção final do relatório
- [ ] Clicar em um dos CTAs (ex: "Iniciar com este plano")

**✅ Critério de sucesso:** Relatório gerado corretamente e CTAs funcionam.

---

### 3.5 Teste do Checkout

**O que verificar:**
- [ ] Página de checkout carrega corretamente
- [ ] **3 planos aparecem** com:
  - ✅ **Start GLP-1:** 12x de R$ 349 = Total R$ 4.188
  - ✅ **Programa 3 Meses (Recomendado):** 12x de R$ 399 = Total R$ 4.788
  - ✅ **Programa 6 Meses Premium:** 12x de R$ 449 = Total R$ 5.388
- [ ] Copy está curta e limpa
- [ ] Nota legal aparece no final

**Ação:**
- [ ] Selecionar o **plano recomendado** (Programa 3 Meses)
- [ ] Preencher dados pessoais (passo 1)
- [ ] Preencher endereço (passo 2)
- [ ] Confirmar escolha do plano (passo 3)
- [ ] Avançar até a etapa de pagamento (passo 4)

**✅ Critério de sucesso:** Checkout mostra os 3 planos com valores corretos e permite avançar até pagamento.

---

### 3.6 Teste do Pagamento (Opcional)

**⚠️ IMPORTANTE:** Este passo é opcional. Você pode parar aqui se não tiver ambiente de teste do Asaas.

**O que verificar:**
- [ ] Formulário de pagamento do Asaas carrega
- [ ] Opções de PIX e Cartão aparecem
- [ ] Valores estão corretos

**Ação (se tiver ambiente de teste):**
- [ ] Tentar simular um pagamento de teste
- [ ] Verificar se o retorno (webhook + redirect) funciona ou pelo menos não quebra

**✅ Critério de sucesso:** Formulário de pagamento carrega sem erros.

---

### 3.7 Como Anotar Eventuais Erros

Se encontrar algum erro durante o teste:

**Documente:**
1. **Tempo:** Quando ocorreu (ex: "15:30")
2. **URL:** Qual página você estava (ex: `/emagrecimento/checkout`)
3. **Ação:** O que você estava fazendo (ex: "Clicando em 'Finalizar pagamento'")
4. **Erro:** Mensagem de erro exata (copie e cole)
5. **Print:** Tire um screenshot se possível

**Exemplo de anotação:**
```
ERRO ENCONTRADO:
- Tempo: 15:30
- URL: /emagrecimento/checkout?plano=programa-glp1-3m
- Ação: Clicando em "Finalizar pagamento"
- Erro: "Preço não configurado para este produto/plano"
- Print: [anexar screenshot]
```

---

## ✅ CRITÉRIO DE "OK, VALIDADO"

**O produto está 100% validado se:**

✅ Todas as etapas acima passaram sem erro  
✅ Cookie banner funciona  
✅ Fluxo completo (LP → Triagem → Relatório → Checkout) funciona  
✅ Preços aparecem corretos no checkout  
✅ Formulário de pagamento carrega (ou pelo menos não quebra)

**Se todas as etapas passaram:** ✅ **Marcar como "100% validado MLP para Emagrecimento"**

**Se encontrou erros:** ⚠️ Documentar os erros e corrigir antes de considerar validado.

---

## 📝 CHECKLIST RÁPIDO

Use este checklist para marcar o progresso:

### Passo 1: Env Vars
- [ ] Acessei Vercel Dashboard
- [ ] Naveguei até Environment Variables
- [ ] Adicionei `ASAAS_PRICE_EMAGRECIMENTO_BASICO=418800`
- [ ] Adicionei `ASAAS_PRICE_EMAGRECIMENTO_COMPLETO=478800`
- [ ] Adicionei `ASAAS_PRICE_EMAGRECIMENTO_PREMIUM=538800`
- [ ] Marquei todas para Production, Preview e Development
- [ ] Validei que aparecem na lista

### Passo 2: Redeploy
- [ ] Fiz git push OU cliquei em "Redeploy"
- [ ] Aguardei deploy completar (~2-3 min)
- [ ] Validei que deploy foi bem-sucedido

### Passo 3: Smoke Test
- [ ] Cookie banner aparece e funciona
- [ ] LP carrega e CTAs funcionam
- [ ] Triagem completa sem erros
- [ ] Relatório gera corretamente
- [ ] Checkout mostra 3 planos com valores corretos
- [ ] Formulário de pagamento carrega (ou não quebra)

---

## 🎯 PRÓXIMOS PASSOS APÓS VALIDAÇÃO

Após validar 100%:

1. ✅ **Marcar como "Pronto para vender"**
2. ✅ **Comunicar ao time que está pronto**
3. ✅ **Preparar material de marketing** (se necessário)
4. ✅ **Monitorar primeiras vendas** de perto

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0

