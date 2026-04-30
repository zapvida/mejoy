# 🗺️ MAPAS VISUAIS - TRIAGEM DE EMAGRECIMENTO
## Diagramas para Apresentação aos Investidores

**Data:** Janeiro 2025  
**Versão:** 1.0

---

## 📊 MAPA 1: FLUXO COMPLETO DO SISTEMA

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE (LPAC)                             │
│                    zapfarm.com.br → /obesidade                          │
│                                                                         │
│  • Hero Section: "Emagreça com acompanhamento médico especializado"    │
│  • Benefícios: Médicos especialistas, IA personalizada, Acompanhamento  │
│  • Depoimentos e resultados                                             │
│  • CTA Principal: "Começar minha avaliação" → /triagem/emagrecimento   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    TRIAGEM INTELIGENTE                                  │
│              /triagem/emagrecimento                                     │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ NÓ 0: CONSENTIMENTO                                              │ │
│  │ • Aceita termos LGPD + Telemedicina + IA                         │ │
│  │ • Links para documentos legais                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                     │                                   │
│                                     ▼                                   │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ NÓ 1: DADOS BÁSICOS                                              │ │
│  │ • Idade (faixa)                                                  │ │
│  │ • Sexo                                                           │ │
│  │ • Gestação? (se Feminino) → ⚠️ DECISÃO CRÍTICA                  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                     │                                   │
│                                     ▼                                   │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ NÓ 2: ANTROPOMETRIA                                              │ │
│  │ • Altura (cm)                                                    │ │
│  │ • Peso (kg)                                                      │ │
│  │ • → Calcula IMC automaticamente                                  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                     │                                   │
│                                     ▼                                   │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ NÓ 3: COMORBIDADES                                               │ │
│  │ • Diabetes tipo 2, Pré-diabetes, Hipertensão, etc.               │ │
│  │ • Múltipla escolha                                              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                     │                                   │
│                                     ▼                                   │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ NÓ 4: CONTRAINDICAÇÕES GLP-1                                     │ │
│  │ • Pancreatite, MEN2, Câncer tireoide, etc.                      │ │
│  │ • → ⚠️ DECISÃO CRÍTICA                                           │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                     │                                   │
│                                     ▼                                   │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ NÓ 5: HISTÓRICO TERAPÊUTICO                                      │ │
│  │ • Já usou medicações?                                            │ │
│  │ • Efeitos colaterais? (condicional)                              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                     │                                   │
│                                     ▼                                   │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ NÓ 6: IMPACTO, OBJETIVO, PREFERÊNCIA                             │ │
│  │ • Impacto do peso na vida                                        │ │
│  │ • Objetivo principal                                            │ │
│  │ • Preferência de princípio ativo                                │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                     │                                   │
│                                     ▼                                   │
│                          FINALIZAÇÃO DA TRIAGEM                         │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PROCESSAMENTO E CLASSIFICAÇÃO                       │
│                                                                         │
│  • Cálculo de IMC                                                      │
│  • Análise de comorbidades                                             │
│  • Verificação de contraindicações                                     │
│  • Cálculo de risco cardiometabólico                                   │
│  • Classificação GLP-1                                                 │
│                                                                         │
│  ⚡ Retorno imediato (<1s)                                             │
│  🔄 Geração de relatório em background                                 │
│  📊 Polling automático até relatório ficar pronto                      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    RELATÓRIO PERSONALIZADO                              │
│         /emagrecimento/relatorio?id={triageId}                          │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ SEÇÃO 1: RESUMO CLÍNICO                                          │ │
│  │ • IMC e classificação                                            │ │
│  │ • Risco cardiometabólico                                         │ │
│  │ • Classificação GLP-1                                            │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ SEÇÃO 2: ACHADOS PRINCIPAIS                                      │ │
│  │ • Análise individualizada das comorbidades                        │ │
│  │ • Impacto do peso na saúde                                       │ │
│  │ • Mecanismos de ação (se candidato)                              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ SEÇÃO 3: RECOMENDAÇÕES NÃO-MEDICAMENTOSAS                        │ │
│  │ • Alimentação                                                    │ │
│  │ • Atividade física                                               │ │
│  │ • Sono                                                           │ │
│  │ • Manejo de estresse                                             │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ SEÇÃO 4: PRÉ-PRESCRIÇÃO (se candidato)                           │ │
│  │ • Medicação sugerida                                             │ │
│  │ • Esquema de titulação                                           │ │
│  │ • Orientações de uso                                             │ │
│  │ • ⚠️ Aviso de validação médica obrigatória                       │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  🤖 Gerado por IA especializada em endocrinologia                      │
│  📊 Baseado em diretrizes atuais de obesidade                          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         CHECKOUT                                        │
│         /emagrecimento/checkout?triageId={id}                           │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ PASSO 1: DADOS PESSOAIS                                           │ │
│  │ • Nome, Email, Telefone, CPF                                     │ │
│  │ • Autopreenchimento da triagem                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ PASSO 2: ENDEREÇO                                                 │ │
│  │ • CEP (busca automática)                                         │ │
│  │ • Endereço completo                                              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ PASSO 3: ESCOLHA DO PLANO                                         │ │
│  │ • Básico (R$ 2.949 - único)                                      │ │
│  │ • Completo (R$ 4.423/mês) ⭐ RECOMENDADO                         │ │
│  │ • Premium (R$ 5.898/mês)                                         │ │
│  │ • Plano recomendado destacado                                    │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ PASSO 4: PAGAMENTO                                                │ │
│  │ • PIX (QR Code)                                                  │ │
│  │ • Cartão de Crédito (via Asaas)                                 │ │
│  │ • Processamento seguro                                           │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CONFIRMAÇÃO E VALIDAÇÃO MÉDICA                       │
│                                                                         │
│  1. Webhook Asaas processa pagamento                                    │
│  2. Sistema notifica médico                                            │
│  3. Médico recebe relatório e dados da triagem                         │
│  4. Contato via WhatsApp para validação                                │
│  5. Prescrição final após avaliação médica completa                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 MAPA 2: ÁRVORE DE DECISÃO - CLASSIFICAÇÃO GLP-1

```
                    INÍCIO DA TRIAGEM
                            │
                            ▼
                    ┌───────────────┐
                    │  NÓ 0: Termos │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │  Aceita? SIM  │
                    └───────┬───────┘
                            │
                    ┌───────▼───────────────┐
                    │  NÓ 1: Dados Básicos  │
                    └───────┬───────────────┘
                            │
                    ┌───────▼───────────────┐
                    │  Sexo = Feminino?    │
                    └───────┬───────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
        ┌───▼───┐                      ┌───▼───┐
        │  SIM  │                      │  NÃO  │
        └───┬───┘                      └───┬───┘
            │                               │
    ┌───────▼───────────────┐              │
    │  Gestação?            │              │
    └───────┬───────────────┘              │
            │                               │
    ┌───────▼───────────────┐              │
    │  SIM → ❌ CONTRAINDICADO             │
    │  NÃO → Continua                      │
    └───────┬───────────────┘              │
            │                               │
            └───────────────┬───────────────┘
                            │
                    ┌───────▼───────────────┐
                    │  NÓ 2: Calcula IMC   │
                    └───────┬───────────────┘
                            │
                    ┌───────▼───────────────┐
                    │  NÓ 3: Comorbidades  │
                    └───────┬───────────────┘
                            │
                    ┌───────▼───────────────────────┐
                    │  NÓ 4: Contraindicações?      │
                    └───────┬────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
        ┌───▼───┐                      ┌───▼───┐
        │  SIM  │                      │  NÃO  │
        └───┬───┘                      └───┬───┘
            │                               │
    ┌───────▼───────────────┐              │
    │ ❌ CONTRAINDICADO     │              │
    └───────────────────────┘              │
                                            │
                                    ┌───────▼───────────────┐
                                    │  NÓ 5: Histórico      │
                                    └───────┬───────────────┘
                                            │
                                    ┌───────▼───────────────┐
                                    │  NÓ 6: Impacto, etc.  │
                                    └───────┬───────────────┘
                                            │
                                    ┌───────▼───────────────────────────┐
                                    │  CLASSIFICAÇÃO FINAL              │
                                    └───────┬───────────────────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
            ┌───────▼───────┐       ┌───────▼───────┐     ┌───────▼───────┐
            │ IMC ≥ 30?    │       │ IMC ≥ 27       │     │ Caso          │
            │   OU         │       │ E Comorbidade? │     │ contrário     │
            │ (IMC ≥ 27    │       │                │     │               │
            │  + Comorb.)  │       │                │     │               │
            └───────┬───────┘       └───────┬───────┘     └───────┬───────┘
                    │                       │                       │
            ┌───────▼───────┐       ┌───────▼───────┐     ┌───────▼───────┐
            │ ✅ CANDIDATO  │       │ ✅ CANDIDATO   │     │ ⚠️ NÃO        │
            │    GLP1       │       │    GLP1        │     │ INDICADO      │
            └───────────────┘       └───────────────┘     └───────────────┘
```

---

## 🔄 MAPA 3: FLUXOS POSSÍVEIS - CENÁRIOS DETALHADOS

### **CENÁRIO A: CANDIDATO IDEAL** ✅

```
┌─────────────────────────────────────────────────────────────┐
│ PACIENTE:                                                    │
│ • Idade: 35 anos                                            │
│ • Sexo: Masculino                                           │
│ • Altura: 170 cm                                            │
│ • Peso: 95 kg                                                │
│ • IMC: 32,9 (Obesidade Grau I)                              │
│ • Comorbidades: Diabetes tipo 2, Hipertensão               │
│ • Contraindicações: Nenhuma                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ TRIAGEM COMPLETA                                            │
│ • Todos os nós respondidos                                  │
│ • Tempo: ~4 minutos                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ CLASSIFICAÇÃO: ✅ CANDIDATO_GLP1                            │
│ RISCO: 🟡 MODERADO                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ RELATÓRIO GERADO                                             │
│ • Resumo clínico completo                                   │
│ • Pré-prescrição: Tirzepatida ou Semaglutida                │
│ • Esquema de titulação detalhado                            │
│ • Recomendações não-medicamentosas                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ CHECKOUT                                                     │
│ • Plano Recomendado: COMPLETO (R$ 4.423/mês)               │
│ • Dados autopreenchidos                                     │
│ • Pagamento processado                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ VALIDAÇÃO MÉDICA                                             │
│ • Médico recebe notificação                                 │
│ • Contato via WhatsApp                                      │
│ • Prescrição final após avaliação                           │
└─────────────────────────────────────────────────────────────┘
```

---

### **CENÁRIO B: CONTRAINDICADO POR GESTAÇÃO** ❌

```
┌─────────────────────────────────────────────────────────────┐
│ PACIENTE:                                                    │
│ • Idade: 28 anos                                            │
│ • Sexo: Feminino                                            │
│ • Gestação: Sim (ou Planejando)                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ TRIAGEM PARCIAL                                             │
│ • Nó 0: ✅ Aceita termos                                     │
│ • Nó 1: ✅ Dados básicos                                    │
│ • Nó 1.3: ⚠️ Gestação detectada                             │
│ • Triagem encerrada antes de coletar todos os dados         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ CLASSIFICAÇÃO: ❌ CONTRAINDICADO                            │
│ MOTIVO: Gestação                                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ RELATÓRIO GERADO                                             │
│ • Resumo clínico (dados disponíveis)                        │
│ • ⚠️ Alerta sobre contraindicação por gestação              │
│ • Recomendações seguras para gestantes                      │
│ • ❌ Sem pré-prescrição                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ CHECKOUT (OPCIONAL)                                          │
│ • Pode não mostrar planos medicamentosos                    │
│ • Foco em acompanhamento preventivo                          │
└─────────────────────────────────────────────────────────────┘
```

---

### **CENÁRIO C: NÃO INDICADO - SOBREPESO SEM COMORBIDADE** ⚠️

```
┌─────────────────────────────────────────────────────────────┐
│ PACIENTE:                                                    │
│ • Idade: 30 anos                                            │
│ • Sexo: Masculino                                           │
│ • Altura: 180 cm                                            │
│ • Peso: 90 kg                                                │
│ • IMC: 27,8 (Sobrepeso)                                      │
│ • Comorbidades: Nenhuma                                      │
│ • Contraindicações: Nenhuma                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ TRIAGEM COMPLETA                                            │
│ • Todos os nós respondidos                                  │
│ • Tempo: ~3 minutos                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ CLASSIFICAÇÃO: ⚠️ NÃO_INDICADO                              │
│ RISCO: 🟢 BAIXO                                              │
│ MOTIVO: IMC < 30 E nenhuma comorbidade                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ RELATÓRIO GERADO                                             │
│ • Resumo clínico completo                                   │
│ • Foco em prevenção e estilo de vida                         │
│ • Recomendações não-medicamentosas detalhadas                │
│ • Sugestão de reavaliação em 3-6 meses                      │
│ • ❌ Sem pré-prescrição                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ CHECKOUT (OPCIONAL)                                          │
│ • Pode mostrar planos preventivos                           │
│ • Foco em acompanhamento de estilo de vida                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 MAPA 4: DISTRIBUIÇÃO DE CLASSIFICAÇÕES

```
                    TODOS OS PACIENTES
                            │
                            ▼
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼────┐         ┌───▼────┐         ┌───▼────┐
    │  60-70%│         │  20-30%│         │  5-10% │
    │        │         │        │         │        │
    │CANDIDATO│         │NÃO     │         │CONTRA  │
    │  GLP1   │         │INDICADO│         │INDICADO│
    └─────────┘         └─────────┘         └─────────┘
        │                   │                   │
        │                   │                   │
    ┌───▼───────────────┐   │                   │
    │ Relatório com     │   │                   │
    │ Pré-prescrição    │   │                   │
    │ Checkout completo │   │                   │
    │ Conversão: 15-25% │   │                   │
    └───────────────────┘   │                   │
                            │                   │
                    ┌───────▼───────────────┐   │
                    │ Relatório focado em   │   │
                    │ Prevenção             │   │
                    │ Conversão: 3-8%       │   │
                    └───────────────────────┘   │
                                                │
                                    ┌───────────▼───────────┐
                                    │ Relatório com alertas  │
                                    │ Conversão: 5-10%       │
                                    └───────────────────────┘
```

---

## 🔄 MAPA 5: PROCESSAMENTO ASSÍNCRONO

```
                    FINALIZAÇÃO DA TRIAGEM
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  API: /api/triage/finalize            │
        │  • Marca como "running"               │
        │  • Retorna imediatamente (<1s)        │
        │  • Status: "running"                   │
        └───────────────┬───────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
    ┌───▼────┐                    ┌───▼────┐
    │FRONTEND│                    │BACKEND │
    │        │                    │        │
    │Recebe  │                    │Inicia  │
    │status │                    │geração │
    │running│                    │em      │
    │        │                    │background│
    └───┬────┘                    └────────┘
        │
        │
    ┌───▼───────────────────────────────────┐
    │  POLLING AUTOMÁTICO                    │
    │  • A cada 5 segundos                   │
    │  • Máximo 60 tentativas (5 minutos)   │
    │  • Verifica status do relatório        │
    └───────────────┬───────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
    ┌───▼────┐            ┌───▼────┐
    │Ainda   │            │Pronto! │
    │running │            │        │
    └───┬────┘            └───┬────┘
        │                     │
        │                     │
    ┌───▼────┐            ┌───▼──────────────┐
    │Continua│            │Redireciona para   │
    │polling │            │/emagrecimento/   │
    │        │            │relatorio?id=...   │
    └────────┘            └──────────────────┘
```

---

## 📊 MAPA 6: INTEGRAÇÃO COM SISTEMAS EXTERNOS

```
┌─────────────────────────────────────────────────────────────┐
│                    ZAPFARM                                  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Frontend    │  │   Backend    │  │   Database   │    │
│  │  (Next.js)   │  │   (API)      │  │  (Supabase)  │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                  │             │
└─────────┼─────────────────┼──────────────────┼─────────────┘
          │                 │                  │
          │                 │                  │
    ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
    │  OpenAI   │    │   Asaas   │    │ Supabase  │
    │   (IA)    │    │ (Pagamento)│    │  (Dados)  │
    └───────────┘    └────────────┘    └───────────┘
          │                 │                  │
          │                 │                  │
    ┌─────▼─────────────────▼──────────────────▼─────┐
    │         SISTEMAS EXTERNOS                      │
    │  • OpenAI: Geração de relatórios              │
    │  • Asaas: Processamento de pagamentos         │
    │  • Supabase: Armazenamento de dados           │
    └───────────────────────────────────────────────┘
```

---

## ✅ MAPA 7: VALIDAÇÕES E SEGURANÇA

```
                    ENTRADA DE DADOS
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  VALIDAÇÃO DE DADOS                   │
        │  • Campos obrigatórios                │
        │  • Formato (altura, peso)             │
        │  • Faixas válidas                     │
        └───────────────┬───────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────┐
        │  VALIDAÇÃO CLÍNICA                     │
        │  • Contraindicações verificadas        │
        │  • Gestação verificada                  │
        │  • Critérios de IMC validados          │
        └───────────────┬───────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────┐
        │  VALIDAÇÃO DE SEGURANÇA                │
        │  • Dados criptografados                │
        │  • Armazenamento seguro                │
        │  • Conformidade LGPD                   │
        └───────────────┬───────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────┐
        │  VALIDAÇÃO MÉDICA (OBRIGATÓRIA)        │
        │  • Relatório é rascunho               │
        │  • Prescrição só após pagamento        │
        │  • Médico valida antes de prescrever   │
        └───────────────────────────────────────┘
```

---

**Documento gerado em:** Janeiro 2025  
**Versão:** 1.0  
**Status:** ✅ Completo e Validado

