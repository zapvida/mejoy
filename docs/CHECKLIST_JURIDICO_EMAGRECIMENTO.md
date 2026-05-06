# CHECKLIST JURÍDICO E ÉTICO - EMAGRECIMENTO

**Data de Criação:** 2025-01-27  
**Status:** ⚠️ Esqueleto - Requer Validação Jurídica  
**Objetivo:** Garantir conformidade legal antes do lançamento

---

## ⚠️ DISCLAIMER IMPORTANTE

Este checklist é um **esqueleto inicial** para orientar a validação jurídica completa.  
**TODOS os itens devem ser validados com advogado especializado** antes do lançamento.

---

## 📋 TELEMEDICINA E CRM

### **Registro e Credenciamento**
- [ ] **TODO:** Validar com jurídico se todos os médicos têm CRM ativo na jurisdição do paciente
- [ ] **TODO:** Verificar necessidade de registro CNES da clínica MeJoy
- [ ] **TODO:** Validar se há necessidade de credenciamento específico por estado

### **Prontuário Eletrônico**
- [ ] **TODO:** Garantir que prontuário registra:
  - Data/hora da consulta
  - Canal utilizado (vídeo/áudio)
  - Conteúdo clínico relevante
  - Conduta definida
  - Assinatura digital do médico
- [ ] **TODO:** Validar período de retenção de prontuários (mínimo 20 anos)

### **Termo de Consentimento para Telemedicina**
- [ ] **TODO:** Criar termo específico de consentimento para telemedicina
- [ ] **TODO:** Validar com jurídico se termo atual atende às recomendações do CFM/CRM local
- [ ] **TODO:** Garantir que paciente assina termo antes da primeira consulta

### **Consulta Síncrona**
- [ ] **TODO:** Validar com jurídico se consulta síncrona (vídeo/áudio) é obrigatória antes de iniciar GLP-1
- [ ] **TODO:** Definir protocolo de quando consulta presencial é necessária

---

## 🤖 PAPEL DA IA E RESPONSABILIDADE MÉDICA

### **Termos de Uso e Consentimento**
- [ ] **TODO:** Validar texto atual: "IA como apoio, não substitui médico"
- [ ] **TODO:** Criar termo específico de consentimento para uso de IA
- [ ] **TODO:** Garantir que paciente consente explicitamente com uso de IA

### **Disclaimers no Relatório**
- [ ] ✅ **IMPLEMENTADO:** Texto padrão: "RASCUNHO gerado pela IA"
- [ ] ✅ **IMPLEMENTADO:** Texto: "Será sempre revisado e validado por médico"
- [ ] **TODO:** Validar com jurídico se disclaimers atuais são suficientes
- [ ] **TODO:** Verificar necessidade de disclaimer adicional em outros pontos do fluxo

### **Prescrição Final**
- [ ] ✅ **IMPLEMENTADO:** Garantir que nenhuma automação envia prescrição final sem médico
- [ ] **TODO:** Validar com jurídico se fluxo atual (médico após pagamento) atende requisitos legais
- [ ] **TODO:** Documentar processo de validação médica da pré-prescrição

### **Logs e Auditoria**
- [ ] **TODO:** Implementar logs de todas as decisões da IA
- [ ] **TODO:** Garantir rastreabilidade de quem validou cada prescrição
- [ ] **TODO:** Definir período de retenção de logs

---

## 🔒 LGPD E PROTEÇÃO DE DADOS

### **Dados Sensíveis de Saúde**
- [ ] **TODO:** Validar com jurídico se tratamento de dados de saúde está conforme LGPD
- [ ] **TODO:** Garantir base legal clara para processamento (consentimento, execução de contrato, etc.)
- [ ] **TODO:** Verificar necessidade de consentimento específico para dados sensíveis

### **Política de Privacidade**
- [ ] **TODO:** Atualizar política de privacidade mencionando dados sensíveis de saúde
- [ ] **TODO:** Explicar finalidades claras (triagem, atendimento médico, melhoria do serviço)
- [ ] **TODO:** Listar terceiros com quem dados são compartilhados (se houver)

### **Cookie Banner**
- [ ] **TODO:** Validar se cookie banner atual está funcional e conforme LGPD
- [ ] **TODO:** Garantir que cookies de analytics requerem consentimento
- [ ] **TODO:** Verificar necessidade de consentimento específico para cookies de saúde

### **DPO/Encarregado de Dados**
- [ ] **TODO:** Definir e publicar contato do DPO/encarregado de dados
- [ ] **TODO:** Garantir canal de contato para exercício de direitos LGPD
- [ ] **TODO:** Criar processo para atender solicitações de acesso, retificação, exclusão

---

## 📢 COMUNICAÇÃO E MARKETING

### **Promessas de Resultado**
- [ ] ✅ **IMPLEMENTADO:** Não promete resultado garantido ("X kg em Y dias")
- [ ] **TODO:** Revisar todos os textos de marketing para garantir ausência de promessas
- [ ] **TODO:** Validar com jurídico se textos atuais estão seguros

### **Evidência Científica**
- [ ] ✅ **IMPLEMENTADO:** Foco em evidência científica e acompanhamento contínuo
- [ ] **TODO:** Validar se citações de estudos estão corretas e não exageradas
- [ ] **TODO:** Garantir que resultados esperados são apresentados como "estudos mostram" e não como garantia

### **Disclaimers ANVISA/CFM**
- [ ] ✅ **IMPLEMENTADO:** Disclaimers ANVISA/CFM em páginas sensíveis
- [ ] **TODO:** Validar com jurídico se disclaimers estão completos e corretos
- [ ] **TODO:** Verificar necessidade de disclaimers adicionais

---

## ⚖️ RISCOS E MITIGAÇÃO

### **Feature Flag de Posologia Automática**
- [ ] ✅ **IMPLEMENTADO:** Feature flag `ENABLE_TIRZEPATIDA_AUTOPOSOLOGIA`
- [ ] **TODO:** Documentar processo de ativação/desativação
- [ ] **TODO:** Definir quem tem autoridade para alterar feature flags

### **Auditoria Médica**
- [ ] **TODO:** Criar processo de auditoria médica periódica
- [ ] **TODO:** Definir métricas de qualidade (taxa de discordância IA × médico)
- [ ] **TODO:** Estabelecer processo de melhoria contínua baseado em auditoria

### **Gestão de Incidentes**
- [ ] **TODO:** Criar protocolo de gestão de incidentes relacionados a prescrições
- [ ] **TODO:** Definir processo de comunicação com pacientes em caso de erro
- [ ] **TODO:** Estabelecer processo de correção e prevenção

---

## 📝 PRÓXIMOS PASSOS

1. **Revisão Jurídica Completa:**
   - [ ] Agendar reunião com advogado especializado em saúde digital
   - [ ] Apresentar este checklist e validar cada item
   - [ ] Documentar decisões e ajustes necessários

2. **Implementação de Ajustes:**
   - [ ] Implementar mudanças recomendadas pelo jurídico
   - [ ] Validar novamente após implementação

3. **Documentação Final:**
   - [ ] Criar documento final aprovado pelo jurídico
   - [ ] Treinar equipe nos processos aprovados
   - [ ] Estabelecer revisão periódica (trimestral/semestral)

---

## ✅ ITENS JÁ IMPLEMENTADOS

- ✅ Feature flag para posologia automática
- ✅ Disclaimers obrigatórios no relatório
- ✅ Texto claro de que é rascunho
- ✅ Menciona validação médica obrigatória
- ✅ Cita normas ANVISA
- ✅ Não promete resultado garantido
- ✅ Foco em evidência científica

---

**Documento criado em:** 2025-01-27  
**Última atualização:** 2025-01-27  
**Versão:** 1.0  
**Status:** ⚠️ Requer Validação Jurídica Completa

