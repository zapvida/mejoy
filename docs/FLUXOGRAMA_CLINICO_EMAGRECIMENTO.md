# FLUXOGRAMA CLÍNICO - EMAGRECIMENTO E GLP-1

**Data de Criação:** 2025-01-27  
**Status:** ✅ Documentado conforme código atual  
**Objetivo:** Documentar exatamente como o fluxo de emagrecimento funciona hoje no código

---

## 📋 VISÃO GERAL

Este documento mapeia a árvore de decisão clínica implementada no fluxo de emagrecimento, desde a triagem inicial até a classificação final de candidatura a GLP-1.

**Arquivos Principais:**
- `src/forms/emagrecimento.ts` - Formulário de triagem
- `src/lib/report/derive.ts` (linhas 266-304) - Lógica de classificação GLP-1
- `src/lib/ai/index.ts` (linhas 199-393) - Prompt e geração de relatório

---

## 🔄 NÓS DO FLUXOGRAMA

### **NÓ 0 – CONSENTIMENTO E ELEGIBILIDADE BÁSICA**

**Pergunta:** `aceita_termos`

**Tipo:** `select` (obrigatório)

**Opções:**
- `aceito` - "Li e concordo com os Termos de Uso, a Política de Privacidade (LGPD), o uso de Inteligência Artificial para geração de relatórios e a realização de atendimentos por Telemedicina, conforme normas vigentes."

**Comportamento:**
- ✅ Se aceita → Continua para Nó 1
- ❌ Se não aceita → Não pode prosseguir (campo obrigatório)

**Links Legais Disponíveis:**
- Termos de Uso (`/termos`)
- Política de Privacidade LGPD (`/politicas-lgpd`)
- Uso de Inteligência Artificial (`/uso-ia`)
- Telemedicina (`/telemedicina`)

**Validação de Idade:**
- Não há validação explícita de idade ≥18 no formulário atual
- ⚠️ **GAP IDENTIFICADO:** Idade é coletada como faixa (`idade_faixa`), não como número exato
- A validação de menor de idade deveria ocorrer aqui, mas não está implementada

---

### **NÓ 1 – DADOS BÁSICOS E GESTAÇÃO**

#### **1.1 Faixa Etária**

**Pergunta:** `idade_faixa`

**Tipo:** `select` (obrigatório)

**Opções:**
- `18-30` - "18–30 anos"
- `31-45` - "31–45 anos"
- `46-60` - "46–60 anos"
- `61+` - "61 anos ou mais"

**Uso:** Usado para contextualizar riscos e personalizar recomendações

#### **1.2 Sexo**

**Pergunta:** `sexo`

**Tipo:** `select` (obrigatório)

**Opções:**
- `M` - "Masculino"
- `F` - "Feminino"
- `Outro` - "Outro"
- `Prefiro não dizer` - "Prefiro não dizer"

**Uso:** Necessário para cálculos de risco e adequação de tratamento

#### **1.3 Gestação (CONDICIONAL)**

**Pergunta:** `gestacao`

**Tipo:** `select` (obrigatório, mas condicional)

**Condição:** Aparece APENAS se `sexo === 'F'`

**Opções:**
- `nao` - "Não"
- `sim` - "Sim, estou grávida"
- `planejando` - "Sim, estou planejando engravidar"

**Comportamento:**
- ✅ Se `nao` → Continua para Nó 2
- ❌ Se `sim` OU `planejando` → Flag de contraindicação GLP-1 (classificação final será `contraindicado`)

**Evidência:** Medicações GLP-1 são contraindicadas durante gestação e planejamento.

---

### **NÓ 2 – IMC (ALTURA E PESO)**

#### **2.1 Altura**

**Pergunta:** `altura`

**Tipo:** `input` (obrigatório)

**Formato:** Centímetros (ex: 170 para 1,70m)

**Validação:** Número positivo

#### **2.2 Peso**

**Pergunta:** `peso`

**Tipo:** `input` (obrigatório)

**Formato:** Quilogramas (ex: 85 para 85kg)

**Validação:** Número positivo

#### **2.3 Cálculo do IMC**

**Fórmula:** `IMC = peso (kg) / (altura (m))²`

**Implementação no código:**
```typescript
const alturaM = altura / 100;
const imc = Math.round((peso / (alturaM * alturaM)) * 10) / 10;
```

#### **2.4 Classificação IMC (OMS)**

**Categorias:**
- `< 18.5` → Abaixo do peso
- `18.5 - 24.9` → Peso normal
- `25.0 - 29.9` → **Sobrepeso**
- `30.0 - 34.9` → **Obesidade Grau I**
- `35.0 - 39.9` → **Obesidade Grau II**
- `≥ 40.0` → **Obesidade Grau III**

**Uso na Classificação GLP-1:**
- IMC ≥ 30 → Candidato potencial
- IMC ≥ 27 + comorbidade → Candidato potencial
- IMC < 27 sem comorbidade → Não indicado

---

### **NÓ 3 – COMORBIDADES E RISCO CARDIOMETABÓLICO**

**Pergunta:** `comorbidades`

**Tipo:** `multiselect` (obrigatório)

**Opções:**
- `diabetes_tipo_2` - "Diabetes tipo 2"
- `pre_diabetes` - "Pré-diabetes"
- `hipertensao` - "Hipertensão (pressão alta)"
- `dislipidemia` - "Dislipidemia (colesterol/triglicerídeos altos)"
- `apneia_sono` - "Apneia do sono"
- `artrose` - "Artrose/artrite"
- `depressao` - "Depressão ou ansiedade"
- `nenhuma` - "Nenhuma dessas"

**Processamento:**
- Remove `nenhuma` do array antes de usar
- Se apenas `nenhuma` selecionado → Array vazio

**Impacto na Classificação:**
- Comorbidades aumentam risco cardiometabólico
- IMC ≥ 27 + ≥1 comorbidade → Candidato a GLP-1
- Usado para personalizar orientações não medicamentosas

**Evidência:** Obesidade associada a comorbidades aumenta muito o risco cardiovascular e pode indicar necessidade de tratamento medicamentoso.

---

### **NÓ 4 – CONTRAINDICAÇÕES GLP-1**

#### **4.1 Card Informativo**

**Pergunta:** `info_contraindicacoes`

**Tipo:** `info` (apenas informativo)

**Conteúdo:**
- Explica que algumas condições podem tornar GLP-1 não recomendado
- Prepara o paciente para a próxima pergunta

#### **4.2 Contraindicações**

**Pergunta:** `contraindicacoes_glp1`

**Tipo:** `multiselect` (obrigatório)

**Opções:**
- `pancreatite` - "Pancreatite (inflamação do pâncreas)"
- `neoplasia_endocrina` - "Neoplasia endócrina múltipla tipo 2 (MEN2)"
- `cancer_tireoide` - "Câncer de tireoide medular ou histórico familiar"
- `doenca_renal_grave` - "Doença renal grave (insuficiência renal avançada)"
- `alergia_glp1` - "Alergia conhecida a medicações GLP-1"
- `nenhuma` - "Nenhuma dessas"

**Processamento:**
- Remove `nenhuma` do array antes de usar
- Se apenas `nenhuma` selecionado → Array vazio

**Comportamento:**
- ❌ Se QUALQUER contraindicação presente → `classification = 'contraindicado'`
- ✅ Se nenhuma contraindicação → Continua para avaliação de IMC/comorbidades

**Evidência:** Medicações GLP-1 são contraindicadas em casos de pancreatite prévia, MEN2 e câncer de tireoide medular.

---

### **NÓ 5 – HISTÓRICO TERAPÊUTICO PRÉVIO** 🆕

**Pergunta:** `historico_medicamentos`

**Tipo:** `multiselect` (obrigatório)

**Opções:**
- `injetaveis_semanais` - "Já usei medicações injetáveis semanais para emagrecer/diabetes"
- `orais_emagrecimento` - "Já usei remédios orais para emagrecer"
- `nunca_usei` - "Nunca usei medicações desse tipo"

**Uso:** Essencial para segurança e personalização do tratamento

**Pergunta Condicional:** `efeitos_colaterais_previos`

**Tipo:** `select` (obrigatório, condicional)

**Condição:** Aparece APENAS se `historico_medicamentos` inclui `injetaveis_semanais` OU `orais_emagrecimento`

**Opções:**
- `sim_parou` - "Sim, tive que parar"
- `teve_mas_continuou` - "Tive mas continuei"
- `nao_teve` - "Não tive efeitos colaterais importantes"
- `nao_aplicavel` - "Não se aplica (nunca usei)"

**Pergunta Opcional:** `descricao_historico_medicacao`

**Tipo:** `textarea` (opcional, condicional)

**Condição:** Aparece APENAS se `historico_medicamentos` inclui `injetaveis_semanais` OU `orais_emagrecimento`

**Uso:** Informação adicional valiosa para personalização do tratamento

**Impacto na Classificação:**
- Não altera classificação GLP-1 diretamente
- Gera alertas para o médico quando há histórico de efeitos colaterais importantes
- Alimenta o prompt da IA com contexto adicional

**Evidência:** Conhecer histórico de uso prévio ajuda a escolher a melhor medicação e esquema de tratamento, evitando reintrodução de medicação que causou problemas.

---

### **NÓ 6 – IMPACTO, OBJETIVO E PREFERÊNCIA**

#### **5.1 Impacto na Vida**

**Pergunta:** `impacto_vida`

**Tipo:** `select` (obrigatório)

**Opções:**
- `muito` - "Muito - dificulta bastante"
- `moderado` - "Moderado - dificulta um pouco"
- `pouco` - "Pouco - dificulta ocasionalmente"
- `nenhum` - "Nenhum - não dificulta"

**Uso:** Ajuda a individualizar o relatório e enfatizar benefícios funcionais

#### **5.2 Objetivo Principal**

**Pergunta:** `objetivo_principal`

**Tipo:** `select` (obrigatório)

**Opções:**
- `perder_peso` - "Perder peso"
- `melhorar_saude_metabolica` - "Melhorar saúde metabólica (glicemia, pressão, colesterol)"
- `ambos` - "Ambos - perder peso e melhorar saúde"
- `outro` - "Outro objetivo"

**Uso:** Foco do relatório e direcionamento de condutas

#### **5.3 Preferência de Princípio Ativo**

**Pergunta:** `preferencia_principio_ativo`

**Tipo:** `select_cards` (obrigatório)

**Opções:**
- `tirzepatida` - "Princípio ativo Tirzepatida" (Maior potência em estudos)
- `semaglutida` - "Princípio ativo Semaglutida" (Ótimo custo–benefício)
- `nao_sei` - "Prefiro que o médico escolha"

**Uso:** 
- Usada pela IA para personalizar recomendações
- Usada pelo checkout para ajustar precificação
- **IMPORTANTE:** É apenas preferência, não prescrição

---

## 🎯 CLASSIFICAÇÃO FINAL GLP-1

### **Lógica de Classificação (src/lib/report/derive.ts:266-304)**

```typescript
// 1. Verificar contraindicações
const temContraindicacao = contraindicacoes.length > 0 || gestacao;

// 2. Classificar
if (temContraindicacao) {
  classification = 'contraindicado';
} else if (imc && (imc >= 30 || (imc >= 27 && comorbidades.length > 0))) {
  classification = 'candidato_glp1';
} else {
  classification = 'nao_indicado';
}
```

### **Critérios Exatos**

#### **1. CONTRAINDICADO**
**Condições:**
- Qualquer contraindicação presente (`pancreatite`, `neoplasia_endocrina`, `cancer_tireoide`, `doenca_renal_grave`, `alergia_glp1`)
- OU gestação (`gestacao === 'sim'` ou `gestacao === 'planejando'`)

**Resultado:** Não há indicação segura de GLP-1

#### **2. CANDIDATO A GLP-1**
**Condições:**
- IMC ≥ 30
- OU (IMC ≥ 27 E ≥1 comorbidade presente)
- E sem contraindicações
- E sem gestação

**Comorbidades que contam:**
- Diabetes tipo 2
- Pré-diabetes
- Hipertensão
- Dislipidemia
- Apneia do sono
- Artrose/artrite
- Depressão/ansiedade

**Resultado:** Candidato potencial a tratamento com GLP-1

#### **3. NÃO INDICADO**
**Condições:**
- IMC < 27 E nenhuma comorbidade
- OU IMC < 30 E nenhuma comorbidade (mesmo que IMC ≥ 27)

**Resultado:** Foco em abordagem não medicamentosa, reavaliação em 3-6 meses

---

## 📊 FLUXO VISUAL SIMPLIFICADO

```
INÍCIO
  ↓
NÓ 0: Aceita termos? → NÃO → FIM
  ↓ SIM
NÓ 1: Idade, Sexo, Gestação?
  ↓
  Se Feminino → Gestante/Planejando? → SIM → CONTRAINDICADO
  ↓ NÃO
NÓ 2: Altura, Peso → Calcula IMC
  ↓
NÓ 3: Comorbidades?
  ↓
NÓ 4: Contraindicações GLP-1?
  ↓
  Se QUALQUER contraindicação → CONTRAINDICADO
  ↓ NENHUMA
NÓ 5: Impacto, Objetivo, Preferência
  ↓
CLASSIFICAÇÃO FINAL:
  ├─ IMC ≥ 30 OU (IMC ≥ 27 + comorbidade) → CANDIDATO_GLP1
  └─ Caso contrário → NÃO_INDICADO
```

---

## ✅ MELHORIAS IMPLEMENTADAS

### **1. Histórico Terapêutico Prévio** ✅ IMPLEMENTADO
- **Status:** Nó 5 adicionado ao formulário
- **Funcionalidades:**
  - Pergunta sobre uso prévio de medicações injetáveis/orais
  - Pergunta condicional sobre efeitos colaterais
  - Campo opcional de descrição do histórico
- **Impacto:** Melhora segurança e personalização do tratamento

### **2. Risco Cardiometabólico Estratificado** ✅ IMPLEMENTADO
- **Status:** Lógica implementada em `src/lib/report/derive.ts`
- **Funcionalidades:**
  - Cálculo automático de risco (baixo/moderado/alto)
  - Baseado em IMC + número/tipo de comorbidades
  - Incluído no contexto da IA e relatório
- **Impacto:** Classificação mais precisa e personalização melhor

---

## ⚠️ PONTOS DE MELHORIA PENDENTES

### **1. Validação de Idade Mínima**
- **Problema:** Não há validação explícita de idade ≥18 anos
- **Sugestão:** Adicionar validação no Nó 0 ou Nó 1
- **Comportamento sugerido:** Se menor de 18, encerrar triagem e sugerir consulta pediátrica

### **3. Amamentação**
- **Problema:** Não há pergunta específica sobre amamentação
- **Sugestão:** Adicionar opção "amamentando" na pergunta de gestação
- **Impacto:** GLP-1 também é contraindicado durante amamentação

### **4. Validação de Dados de Entrada**
- **Problema:** Não há validação de valores extremos (ex: altura 50cm, peso 500kg)
- **Sugestão:** Adicionar validação de ranges:
  - Altura: 100-250 cm
  - Peso: 30-300 kg
- **Impacto:** Evita cálculos de IMC incorretos

### **5. Tratamento de Casos Limítrofes**
- **Problema:** IMC exatamente 27 ou 30 sem comorbidades pode gerar inconsistência
- **Sugestão:** Documentar comportamento explícito para valores exatos
- **Impacto:** Maior previsibilidade do sistema

### **6. Amamentação**
- **Problema:** Não há pergunta específica sobre amamentação
- **Sugestão:** Adicionar opção "amamentando" na pergunta de gestação
- **Impacto:** GLP-1 também é contraindicado durante amamentação

---

## 📝 NOTAS TÉCNICAS

### **Armazenamento de Dados**
- Respostas são salvas em `sessionData.answers`
- Classificação é calculada em tempo de geração do relatório
- Classificação é armazenada em `vm.classification`

### **Integração com IA**
- Prompt específico em `src/lib/ai/index.ts` (linhas 271-350)
- Contexto completo é passado para a IA incluindo:
  - Dados do paciente (nome, sexo, idade, IMC)
  - Classificação GLP-1
  - Comorbidades e contraindicações
  - Impacto, objetivo e preferência

### **Componentes de Relatório**
- `ReportAnalysisEmagrecimento` - Renderiza análise baseada na classificação
- `ReportHeroEmagrecimentoEnhanced` - Hero com dados do paciente
- `ReportCtasEmagrecimento` - CTAs para checkout baseados na preferência

---

## ✅ VALIDAÇÃO DO FLUXOGRAMA

**Status:** ✅ Documentado conforme código atual

**Divergências Encontradas:**
1. ❌ Validação de idade mínima não implementada
2. ❌ Histórico terapêutico prévio não coletado
3. ⚠️ Amamentação não é perguntada separadamente

**Próximos Passos Recomendados:**
1. Implementar validação de idade mínima
2. Adicionar nó de histórico terapêutico prévio
3. Refinar classificação de risco cardiometabólico
4. Criar protocolo de posologia para tirzepatida (FASE 2)

---

**Documento criado em:** 2025-01-27  
**Última atualização:** 2025-01-27  
**Versão:** 1.0

