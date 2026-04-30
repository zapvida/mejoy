# CASOS DE TESTE CLÍNICOS - EMAGRECIMENTO

**Data de Criação:** 2025-01-27  
**Status:** ✅ Matriz Inicial (12 casos) - Expansível para 30-50  
**Objetivo:** Validar classificação GLP-1 e geração de pré-prescrição

---

## 📋 ESTRUTURA DOS CASOS

Para cada caso, documentamos:
- **Entradas principais:** Idade, sexo, IMC, comorbidades, contraindicações, histórico terapêutico
- **Classificação esperada:** `candidato_glp1` | `nao_indicado` | `contraindicado`
- **Pré-prescrição esperada:** Sim/Não (apenas para candidatos com preferência tirzepatida)
- **Comentário:** Justificativa da classificação

---

## 🧪 CASOS DE TESTE

### **CASO 1: Candidato Forte - Obesidade Grau II com DM2**
**Entradas:**
- Idade: 35 anos (faixa 31-45)
- Sexo: Masculino
- IMC: 36 (altura 170cm, peso 104kg)
- Comorbidades: `diabetes_tipo_2`
- Contraindicações: `nenhuma`
- Histórico: `nunca_usei`
- Preferência: `tirzepatida`

**Classificação esperada:** `candidato_glp1`  
**Pré-prescrição esperada:** Sim (tirzepatida 60mg)  
**Risco cardiometabólico:** Alto  
**Comentário:** IMC ≥30 + comorbidade relevante (DM2) = candidato forte. Múltiplas comorbidades indicam risco alto.

---

### **CASO 2: Contraindicado - Gestante**
**Entradas:**
- Idade: 29 anos (faixa 18-30)
- Sexo: Feminino
- Gestação: `sim` (grávida)
- IMC: 32 (altura 165cm, peso 87kg)
- Comorbidades: `nenhuma`
- Contraindicações: `nenhuma`
- Histórico: `nunca_usei`
- Preferência: `tirzepatida`

**Classificação esperada:** `contraindicado`  
**Pré-prescrição esperada:** Não  
**Comentário:** Gestação é contraindicação absoluta para GLP-1.

---

### **CASO 3: Não Indicado - Sobrepeso sem Comorbidades**
**Entradas:**
- Idade: 45 anos (faixa 31-45)
- Sexo: Masculino
- IMC: 26 (altura 180cm, peso 84kg)
- Comorbidades: `nenhuma`
- Contraindicações: `nenhuma`
- Histórico: `nunca_usei`
- Preferência: `nao_sei`

**Classificação esperada:** `nao_indicado`  
**Pré-prescrição esperada:** Não  
**Risco cardiometabólico:** Baixo  
**Comentário:** IMC <27 sem comorbidades não indica tratamento medicamentoso com GLP-1.

---

### **CASO 4: Candidato - Sobrepeso com Múltiplas Comorbidades**
**Entradas:**
- Idade: 40 anos (faixa 31-45)
- Sexo: Feminino
- Gestação: `nao`
- IMC: 28 (altura 160cm, peso 72kg)
- Comorbidades: `pre_diabetes`, `hipertensao`, `dislipidemia`
- Contraindicações: `nenhuma`
- Histórico: `nunca_usei`
- Preferência: `tirzepatida`

**Classificação esperada:** `candidato_glp1`  
**Pré-prescrição esperada:** Sim (tirzepatida 40mg)  
**Risco cardiometabólico:** Moderado-Alto  
**Comentário:** IMC ≥27 + múltiplas comorbidades = candidato. Múltiplas comorbidades aumentam risco.

---

### **CASO 5: Contraindicado - Pancreatite Prévia**
**Entradas:**
- Idade: 50 anos (faixa 46-60)
- Sexo: Masculino
- IMC: 38 (altura 175cm, peso 116kg)
- Comorbidades: `diabetes_tipo_2`
- Contraindicações: `pancreatite`
- Histórico: `nunca_usei`
- Preferência: `tirzepatida`

**Classificação esperada:** `contraindicado`  
**Pré-prescrição esperada:** Não  
**Comentário:** Pancreatite prévia é contraindicação absoluta para GLP-1.

---

### **CASO 6: Candidato - Obesidade Grau III sem Comorbidades**
**Entradas:**
- Idade: 38 anos (faixa 31-45)
- Sexo: Feminino
- Gestação: `nao`
- IMC: 42 (altura 165cm, peso 114kg)
- Comorbidades: `nenhuma`
- Contraindicações: `nenhuma`
- Histórico: `nunca_usei`
- Preferência: `tirzepatida`

**Classificação esperada:** `candidato_glp1`  
**Pré-prescrição esperada:** Sim (tirzepatida 60mg)  
**Risco cardiometabólico:** Alto  
**Comentário:** IMC ≥40 = candidato fortíssimo, mesmo sem comorbidades. IMC muito alto indica risco alto.

---

### **CASO 7: Candidato com Histórico de Efeitos Colaterais**
**Entradas:**
- Idade: 42 anos (faixa 31-45)
- Sexo: Masculino
- IMC: 33 (altura 175cm, peso 101kg)
- Comorbidades: `hipertensao`
- Contraindicações: `nenhuma`
- Histórico: `injetaveis_semanais`
- Efeitos colaterais: `sim_parou`
- Descrição: "Usei semaglutida por 2 meses, tive náusea intensa e vômitos, tive que parar"
- Preferência: `tirzepatida`

**Classificação esperada:** `candidato_glp1`  
**Pré-prescrição esperada:** Sim (com alerta médico)  
**Risco cardiometabólico:** Moderado  
**Comentário:** Candidato, mas deve ter alerta médico sobre histórico de efeitos colaterais importantes com GLP-1 prévio.

---

### **CASO 8: Candidato - Obesidade Grau I com Apneia do Sono**
**Entradas:**
- Idade: 48 anos (faixa 46-60)
- Sexo: Masculino
- IMC: 32 (altura 170cm, peso 92kg)
- Comorbidades: `apneia_sono`, `dislipidemia`
- Contraindicações: `nenhuma`
- Histórico: `nunca_usei`
- Preferência: `semaglutida`

**Classificação esperada:** `candidato_glp1`  
**Pré-prescrição esperada:** Não (preferência semaglutida, não tirzepatida)  
**Risco cardiometabólico:** Moderado-Alto  
**Comentário:** Candidato, mas preferência por semaglutida = não mostra pré-prescrição detalhada de tirzepatida.

---

### **CASO 9: Não Indicado - IMC Limítrofe**
**Entradas:**
- Idade: 30 anos (faixa 18-30)
- Sexo: Feminino
- Gestação: `nao`
- IMC: 26.5 (altura 160cm, peso 68kg)
- Comorbidades: `nenhuma`
- Contraindicações: `nenhuma`
- Histórico: `nunca_usei`
- Preferência: `nao_sei`

**Classificação esperada:** `nao_indicado`  
**Pré-prescrição esperada:** Não  
**Risco cardiometabólico:** Baixo  
**Comentário:** IMC <27 sem comorbidades = não indicado, mesmo próximo do limiar.

---

### **CASO 10: Contraindicado - Planejando Gestação**
**Entradas:**
- Idade: 32 anos (faixa 31-45)
- Sexo: Feminino
- Gestação: `planejando` (planejando engravidar)
- IMC: 35 (altura 165cm, peso 95kg)
- Comorbidades: `pre_diabetes`
- Contraindicações: `nenhuma`
- Histórico: `nunca_usei`
- Preferência: `tirzepatida`

**Classificação esperada:** `contraindicado`  
**Pré-prescrição esperada:** Não  
**Comentário:** Planejamento de gestação é contraindicação absoluta para GLP-1.

---

### **CASO 11: Candidato - Múltiplas Comorbidades de Alto Risco**
**Entradas:**
- Idade: 55 anos (faixa 46-60)
- Sexo: Masculino
- IMC: 34 (altura 175cm, peso 104kg)
- Comorbidades: `diabetes_tipo_2`, `hipertensao`, `apneia_sono`, `dislipidemia`
- Contraindicações: `nenhuma`
- Histórico: `orais_emagrecimento` (efeitos colaterais: `teve_mas_continuou`)
- Preferência: `tirzepatida`

**Classificação esperada:** `candidato_glp1`  
**Pré-prescrição esperada:** Sim (tirzepatida 60mg)  
**Risco cardiometabólico:** Alto  
**Comentário:** IMC ≥30 + múltiplas comorbidades de alto risco = candidato fortíssimo. Risco alto.

---

### **CASO 12: Candidato Idoso - Titulação Mais Lenta**
**Entradas:**
- Idade: 68 anos (faixa 61+)
- Sexo: Feminino
- Gestação: `nao`
- IMC: 31 (altura 160cm, peso 79kg)
- Comorbidades: `hipertensao`, `dislipidemia`
- Contraindicações: `nenhuma`
- Histórico: `nunca_usei`
- Preferência: `tirzepatida`

**Classificação esperada:** `candidato_glp1`  
**Pré-prescrição esperada:** Sim (tirzepatida 40mg, titulação mais lenta)  
**Risco cardiometabólico:** Moderado  
**Comentário:** Candidato idoso deve ter titulação mais lenta (6 semanas por fase ao invés de 4).

---

## 📊 RESUMO ESTATÍSTICO

| Classificação | Quantidade | % |
|---------------|------------|---|
| `candidato_glp1` | 7 | 58% |
| `contraindicado` | 3 | 25% |
| `nao_indicado` | 2 | 17% |

**Pré-prescrições esperadas:** 5 (apenas candidatos com preferência tirzepatida)

---

## 🔄 EXPANSÃO FUTURA

Para chegar a 30-50 casos, adicionar:
- Variações de idade (adolescentes, jovens adultos, idosos)
- Combinações diferentes de comorbidades
- Histórico terapêutico variado (uso prévio sem efeitos, uso oral, etc.)
- Casos limítrofes (IMC exatamente 27, 30, etc.)
- Variações de preferência (semaglutida, não sei)
- Casos com múltiplas contraindicações

---

## 🧪 SCRIPT DE VALIDAÇÃO

Ver `scripts/validar-casos-teste-emagrecimento.ts` para validação automatizada.

---

**Documento criado em:** 2025-01-27  
**Última atualização:** 2025-01-27  
**Versão:** 1.0

