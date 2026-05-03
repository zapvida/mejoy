// src/lib/ai/index.ts
// Sistema de IA unificado para geração de relatórios personalizados

import OpenAI from 'openai';
import { z } from 'zod';

import { serverEnv } from '@/lib/env';
import { getPatientBasics } from '@/lib/triage/patientData';

export interface TriagePayload {
  sessionData: {
    answers: Record<string, any>;
    profile: {
      name: string;
      sex?: string;
      age?: number;
      weightKg?: number;
      heightCm?: number;
      whatsapp?: string;
      email?: string;
    };
    triageSlug: string;
  };
}

export interface GeneratedReport {
  markdown: string;
  audioScript: string;
  summaryBullets: string[];
  redFlags: string[];
  icd10Candidates: string[];
}

const responseSchema = z.object({
  report_markdown: z.string().min(1),
  audio_script_120s_pt: z.string().min(1),
  summary_bullets: z.array(z.string().min(1)).min(1),
  red_flags: z.array(z.string().min(1)).optional().default([]),
  icd10_candidates: z.array(z.string().min(1)).optional().default([]),
});

let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!serverEnv.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada.');
  }
  if (!openai) {
    openai = new OpenAI({ apiKey: serverEnv.OPENAI_API_KEY });
  }
  return openai;
}

export async function generateReportArtifacts(kind: string, payload: TriagePayload): Promise<GeneratedReport> {
  // Se não há API key ou está em modo mock, usar fallback
  if (!serverEnv.OPENAI_API_KEY) {
    return buildMockReport(kind, payload);
  }

  const prompt = await buildPrompt(kind, payload);

  try {
    // TODO(backcompat-2025-10-23) - OPENAI_MODEL opcional
    const model = (serverEnv as any).OPENAI_MODEL || 'gpt-4o-mini';
    
    const response = await getOpenAI().chat.completions.create({
      model,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(kind),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const rawContent = response.choices[0]?.message?.content?.trim();
    if (!rawContent) {
      throw new Error('Resposta vazia da IA.');
    }

    const parsed = responseSchema.parse(JSON.parse(sanitizeJson(rawContent)));

    return {
      markdown: parsed.report_markdown,
      audioScript: parsed.audio_script_120s_pt,
      summaryBullets: parsed.summary_bullets,
      redFlags: parsed.red_flags,
      icd10Candidates: parsed.icd10_candidates,
    };
  } catch (error) {
    console.error('❌ Erro na geração de IA, usando fallback:', error);
    return buildMockReport(kind, payload);
  }
}

function getSystemPrompt(kind: string): string {
  // Prompts específicos para produtos ZapFarm
  const zapfarmPrompts: Record<string, string> = {
    emagrecimento: `Você é endocrinologista especializado em obesidade e emagrecimento. 
Sua especialidade é Endocrinologia e Medicina do Emagrecimento.
Você trabalha com tratamentos baseados em evidências científicas, incluindo medicações como tirzepatida e semaglutida.
Sempre reforçar que todo uso de medicação é feito somente após avaliação individual e prescrição médica, seguindo as normas da ANVISA.
Use tom empático, motivador e responsável.`,
    
    calvicie: `Você é dermatologista/tricologista especializado em saúde capilar e queda de cabelo.
Sua especialidade é Tricologia e Dermatologia Capilar.
Você trabalha com tratamentos baseados em evidências científicas para calvície, alopécia e saúde capilar.
Sempre reforçar que todo tratamento é feito somente após avaliação individual e prescrição médica.
Use tom empático, motivador e responsável.`,
    
    sono: `Você é neurologista/psiquiatra especializado em medicina do sono.
Sua especialidade é Medicina do Sono e Neurologia.
Você trabalha com tratamentos baseados em evidências científicas para insônia e distúrbios do sono.
Sempre reforçar que todo tratamento é feito somente após avaliação individual e prescrição médica.
Use tom empático, motivador e responsável.`,
    
    ansiedade: `Você é psiquiatra especializado em ansiedade e saúde mental.
Sua especialidade é Psiquiatria e Saúde Mental.
Você trabalha com tratamentos baseados em evidências científicas para ansiedade e estresse.
Sempre reforçar que todo tratamento é feito somente após avaliação individual e prescrição médica.
Use tom empático, motivador e responsável.`,
    
    intestino: `Você é gastroenterologista especializado em saúde intestinal e microbiota.
Sua especialidade é Gastroenterologia e Medicina Integrativa.
Você trabalha com tratamentos baseados em evidências científicas para saúde intestinal, probióticos e fibras.
Sempre reforçar que todo tratamento é feito somente após avaliação individual e prescrição médica.
Use tom empático, motivador e responsável.`,
    
    figado: `Você é hepatologista/gastroenterologista especializado em saúde hepática.
Sua especialidade é Hepatologia e Gastroenterologia.
Você trabalha com tratamentos baseados em evidências científicas para fígado gorduroso e saúde hepática.
Sempre reforçar que todo tratamento é feito somente após avaliação individual e prescrição médica.
Use tom empático, motivador e responsável.`,
    
    'libido-masculina': `Você é urologista/endocrinologista especializado em saúde masculina e testosterona.
Sua especialidade é Urologia e Endocrinologia Masculina.
Você trabalha com tratamentos baseados em evidências científicas para libido e saúde masculina.
Sempre reforçar que todo tratamento é feito somente após avaliação individual e prescrição médica.
Use tom empático, motivador e responsável.`,
    
    menopausa: `Você é ginecologista especializado em menopausa e saúde feminina.
Sua especialidade é Ginecologia e Medicina da Mulher.
Você trabalha com tratamentos baseados em evidências científicas para menopausa e TPM.
Sempre reforçar que todo tratamento é feito somente após avaliação individual e prescrição médica.
Use tom empático, motivador e responsável.`,
    
    articulacoes: `Você é ortopedista/reumatologista especializado em saúde articular e coluna.
Sua especialidade é Ortopedia e Reumatologia.
Você trabalha com tratamentos baseados em evidências científicas para dor articular e problemas de coluna.
Sempre reforçar que todo tratamento é feito somente após avaliação individual e prescrição médica.
Use tom empático, motivador e responsável.`,
    
    imunidade: `Você é imunologista/clínico geral especializado em imunidade e fadiga.
Sua especialidade é Imunologia e Medicina Preventiva.
Você trabalha com tratamentos baseados em evidências científicas para fortalecer imunidade.
Sempre reforçar que todo tratamento é feito somente após avaliação individual e prescrição médica.
Use tom empático, motivador e responsável.`,
  };
  
  if (zapfarmPrompts[kind]) {
    return zapfarmPrompts[kind];
  }
  
  const specializations: Record<string, string> = {
    gastro: 'Gastroenterologia e Medicina Integrativa',
    mental: 'Psiquiatria e Saúde Mental',
    gestante: 'Obstetrícia e Medicina Materno-Fetal',
    cancer: 'Oncologia e Medicina Preventiva',
    coluna: 'Ortopedia e Medicina do Esporte',
    bucal: 'Odontologia e Saúde Bucal',
    crianca: 'Pediatria e Medicina da Criança',
    idoso: 'Geriatria e Medicina do Idoso',
    sexual: 'Sexologia e Medicina Sexual',
    biohacking: 'Medicina Funcional e Biohacking',
    tireoide: 'Endocrinologia e Medicina da Tireoide',
    microbioma: 'Medicina Integrativa e Microbioma',
    respiratoria: 'Pneumologia e Medicina Respiratória',
    auditiva: 'Otorrinolaringologia e Audiologia',
    ocular: 'Oftalmologia e Medicina Ocular',
    pele: 'Dermatologia e Medicina da Pele',
    mama: 'Mastologia e Medicina da Mama',
    geral: 'Medicina Geral e Preventiva',
  };

  const specialty = specializations[kind] || 'Medicina Geral e Preventiva';
  
  return `Você é um médico assistente especialista em ${specialty}. 
Retorne apenas JSON válido seguindo o schema exato.
Use linguagem clara, respeitosa e prática. Evite jargões médicos desnecessários.
Sempre inclua justificativas baseadas em evidências científicas.`;
}

async function buildPrompt(kind: string, payload: TriagePayload): Promise<string> {
  const patientBasics = getPatientBasics(payload);
  const answers = payload.sessionData.answers;
  
  // Prompt específico para emagrecimento
  if (kind === 'emagrecimento') {
    // Extrair dados das respostas
    const altura = parseFloat(answers.altura) || payload.sessionData.profile.heightCm;
    const peso = parseFloat(answers.peso) || payload.sessionData.profile.weightKg;
    
    // Calcular IMC
    let imc: number | null = null;
    if (altura && peso && altura > 0) {
      const alturaM = altura / 100;
      imc = Math.round((peso / (alturaM * alturaM)) * 10) / 10;
    } else if (patientBasics?.bmi) {
      imc = patientBasics.bmi;
    }
    
    // Extrair arrays de comorbidades e contraindicações
    const comorbidades = Array.isArray(answers.comorbidades) 
      ? answers.comorbidades.filter((c: string) => c !== 'nenhuma')
      : answers.comorbidades && answers.comorbidades !== 'nenhuma'
      ? [answers.comorbidades]
      : [];
    
    const contraindicacoes = Array.isArray(answers.contraindicacoes_glp1)
      ? answers.contraindicacoes_glp1.filter((c: string) => c !== 'nenhuma')
      : answers.contraindicacoes_glp1 && answers.contraindicacoes_glp1 !== 'nenhuma'
      ? [answers.contraindicacoes_glp1]
      : [];
    
    // Verificar gestação (apenas se existir - só aparece para sexo feminino)
    const gestacao = answers.gestacao ? (answers.gestacao === 'sim' || answers.gestacao === 'planejando') : false;
    
    // Classificação GLP-1
    let classificacao: 'contraindicado' | 'candidato_glp1' | 'nao_indicado';
    const temContraindicacao = contraindicacoes.length > 0 || gestacao;
    
    if (temContraindicacao) {
      classificacao = 'contraindicado';
    } else if (imc && (imc >= 30 || (imc >= 27 && comorbidades.length > 0))) {
      classificacao = 'candidato_glp1';
    } else {
      classificacao = 'nao_indicado';
    }
    
    // Extrair outros dados
    const idadeFaixa = answers.idade_faixa || 'não informado';
    const sexo = answers.sexo || patientBasics?.sex || payload.sessionData.profile.sex || 'não informado';
    const impactoVida = answers.impacto_vida || 'não informado';
    const objetivoPrincipal = answers.objetivo_principal || 'não informado';
    
    const preferenciaPrincipioAtivo = answers.preferencia_principio_ativo || 'nao_sei';
    const preferenciaTexto = preferenciaPrincipioAtivo === 'tirzepatida' 
      ? 'Tirzepatida'
      : preferenciaPrincipioAtivo === 'semaglutida'
      ? 'Semaglutida'
      : 'Prefere que o médico escolha';
    
    // Categoria IMC
    let categoriaIMC = 'Não calculado';
    if (imc) {
      if (imc < 18.5) categoriaIMC = 'Abaixo do peso';
      else if (imc < 25) categoriaIMC = 'Peso normal';
      else if (imc < 30) categoriaIMC = 'Sobrepeso';
      else if (imc < 35) categoriaIMC = 'Obesidade grau I';
      else if (imc < 40) categoriaIMC = 'Obesidade grau II';
      else categoriaIMC = 'Obesidade grau III';
    }
    
    // Calcular posologia se candidato (apenas para tirzepatida e se feature flag habilitada)
    let posologiaData: any = null;
    if (classificacao === 'candidato_glp1' && preferenciaPrincipioAtivo === 'tirzepatida') {
      try {
        const { isAutoPosologiaEnabled } = await import('@/lib/emagrecimento/config');
        if (isAutoPosologiaEnabled()) {
          const { calcularPosologiaTirzepatida } = await import('@/lib/emagrecimento/posologia');
          const idade = patientBasics?.age || payload.sessionData.profile.age;
          const posologia = calcularPosologiaTirzepatida(imc || 30, comorbidades, idade);
          posologiaData = {
            apresentacao: posologia.apresentacao,
            doseInicial: `${posologia.doseInicialMg}mg`,
            volumeInicial: `${posologia.volumeInicialMl}mL`,
            titulacao: {
              semanas1_4: `${posologia.titulacao[0].doseMg}mg (${posologia.titulacao[0].volumeMl}mL)`,
              semanas5_8: `${posologia.titulacao[4].doseMg}mg (${posologia.titulacao[4].volumeMl}mL)`,
              semanas9_12: `${posologia.titulacao[8].doseMg}mg (${posologia.titulacao[8].volumeMl}mL)`,
              semanas13_24: `${posologia.titulacao[12].doseMg}mg (${posologia.titulacao[12].volumeMl}mL)`,
            },
            duracaoMeses: Math.floor(posologia.duracaoEstimadaSemanas / 4),
            orientacoesDilucao: posologia.orientacoesDilucao,
            resultadosEsperados: posologia.resultadosEsperados,
          };
        }
      } catch (error) {
        console.warn('[emagrecimento] Erro ao calcular posologia:', error);
      }
    }
    
    // Prompt em 6 blocos (incluindo pré-prescrição completa)
    const EMAGRECIMENTO_PROMPT = `
Você é endocrinologista especializado em obesidade e emagrecimento. Gere um relatório completamente individualizado baseado nos dados específicos do paciente.

IMPORTANTE: Use SEMPRE os dados específicos do contexto fornecido. NUNCA use texto genérico ou genérico. Cada relatório deve soar como uma carta única escrita especificamente para este paciente.

REGRAS ABSOLUTAS DE INDIVIDUALIZAÇÃO:
1. Sempre mencione dados específicos do contexto:
   - Faixa etária específica (ex: "na sua faixa de 31-45 anos...")
   - Comorbidades específicas mencionadas (ex: "no seu caso, com diabetes tipo 2 e hipertensão...")
   - Impacto na vida relatado (ex: "como você relatou que o peso limita muito suas atividades do dia a dia...")
   - Objetivo principal (ex: "como seu foco principal é melhorar saúde metabólica, vamos focar em...")
   - Classificação obtida (ex: "você se encaixa hoje no grupo de candidato a GLP-1, o que significa que...")
   - Preferência de princípio ativo quando relevante (ex: "você demonstrou preferência inicial por tirzepatida..." ou "preferiu deixar a escolha para o médico...")

2. NUNCA use frases genéricas sem contexto:
   ❌ ERRADO: "Mudanças de estilo de vida são importantes"
   ✅ CERTO: "Como você relatou que o peso limita muito suas atividades, vamos focar em estratégias práticas que você pode implementar hoje mesmo, como..."

3. Orientações não medicamentosas devem ser ESPECÍFICAS:
   - Se tem apneia do sono → falar sobre sono, CPAP, posição de dormir
   - Se tem dislipidemia → falar sobre colesterol, gorduras, exames específicos
   - Se impacto_vida = "muito" → enfatizar melhorias funcionais esperadas com exemplos concretos
   - Se objetivo = "melhorar saúde metabólica" → focar em glicemia, gordura visceral, colesterol com números e metas

4. Tom deve ser empático, motivador e individualizado:
   - Use o nome do paciente quando disponível
   - Referencie respostas específicas que ele deu
   - Faça o paciente sentir que o relatório foi feito especialmente para ele

Gere o relatório em 6 blocos obrigatórios:

1) "Seu quadro hoje"
- Explique o IMC específico (${imc || 'não calculado'}) e a categoria (${categoriaIMC})
- Mencione os principais riscos do perfil específico do paciente
- Se houver comorbidades, explique como elas se relacionam com o peso
- Use a faixa etária para contextualizar riscos (ex: "na sua faixa de ${idadeFaixa}, obesidade aumenta risco cardiovascular...")
- Se houver histórico de uso prévio de medicações para emagrecimento/diabetes, mencione brevemente e explique como isso pode influenciar o tratamento atual

2) "Classificação de indicação"
- Explique explicitamente a classificação obtida: ${classificacao}
- Se candidato_glp1: explique por que se encaixa nos critérios (IMC ≥30 ou IMC ≥27 + comorbidades)
- Se não_indicado: explique que IMC <27 sem comorbidades não indica tratamento medicamentoso hoje, mas pode reavaliar em 3-6 meses
- Se contraindicado: explique claramente por que não há indicação segura de GLP-1 (gestação ou contraindicações específicas)

3) "Orientações de promoção de saúde"
- Dê recomendações práticas ligadas ao contexto específico
- Se impacto_vida = "muito": enfatize melhorias funcionais esperadas
- Se objetivo = "melhorar saúde metabólica": foque em glicemia, gordura visceral, colesterol
- Se objetivo = "perder peso": foque em estratégias de perda de peso
- Mencione comorbidades específicas quando relevante (ex: se tem apneia do sono, fale sobre sono; se tem dislipidemia, fale sobre colesterol)

4) "Pré-prescrição medicamentosa - Plano de Tratamento Sugerido"
${classificacao === 'candidato_glp1' && posologiaData ? `
- SOMENTE para candidatos a GLP-1 (você está neste grupo):
  
  **Medicamento:** Tirzepatida
  
  **Apresentação sugerida:** ${posologiaData.apresentacao} em pó
  
  **Posologia inicial:** ${posologiaData.doseInicial} semanalmente (${posologiaData.volumeInicial} após diluição)
  
  **Esquema de titulação (${posologiaData.duracaoMeses} meses):**
  - Semanas 1-4: ${posologiaData.titulacao.semanas1_4}
  - Semanas 5-8: ${posologiaData.titulacao.semanas5_8}
  - Semanas 9-12: ${posologiaData.titulacao.semanas9_12}
  - Semanas 13-24: ${posologiaData.titulacao.semanas13_24}
  
  **Duração do tratamento:** ${posologiaData.duracaoMeses} meses (24 semanas) com reavaliações mensais
  
  **Preparo e aplicação:** ${posologiaData.orientacoesDilucao}. Aplicação subcutânea, 1x por semana, sempre no mesmo dia. Rotacionar locais (abdome, coxa ou braço).
  
  **Resultados esperados:**
  - 3 meses: ${posologiaData.resultadosEsperados.tresMeses}
  - 6 meses: ${posologiaData.resultadosEsperados.seisMeses}
  
  **Orientações importantes:**
  - Monitorar peso semanalmente (mesmo horário, mesma balança)
  - Medir circunferência abdominal mensalmente
  - Comunicar ao médico qualquer efeito colateral persistente
  - Não interromper tratamento sem orientação médica
  
  **AVISO OBRIGATÓRIO:** Esta pré-prescrição é um RASCUNHO gerado pela IA da Me Joy com base nas suas respostas. Ela será SEMPRE revisada, validada e ajustada por um médico endocrinologista da equipe após a confirmação do pagamento, antes de qualquer prescrição oficial. O médico pode confirmar, ajustar ou modificar este plano conforme sua avaliação individual completa.
` : classificacao === 'contraindicado' ? `
- Você NÃO é candidato a tratamento com GLP-1 no momento devido a:
  ${gestacao ? '- Gestação ou planejamento de gestação\n' : ''}${contraindicacoes.length > 0 ? contraindicacoes.map((c: string) => `- ${c}`).join('\n') : ''}
  
  **Alternativas recomendadas:**
  - Acompanhamento médico e nutricional intensivo
  - Modificações de estilo de vida estruturadas
  - Avaliação de outras classes medicamentosas (a critério médico)
  - Consulta presencial para avaliação completa e discussão de opções seguras
` : `
- No momento, seu perfil não indica tratamento medicamentoso com GLP-1, pois:
  ${imc && imc < 27 ? '- Seu IMC está abaixo de 27 e você não apresenta comorbidades relevantes\n' : ''}
  
  **Recomendações:**
  - Foco em abordagem não medicamentosa (dieta, exercício, mudanças de estilo de vida)
  - Acompanhamento médico e nutricional regular
  - Reavaliação em 3-6 meses ou se IMC aumentar ou comorbidades surgirem
`}

5) "Orientações de estilo de vida e acompanhamento"
- Dê orientações específicas baseadas no perfil do paciente
- Mencione importância de dieta balanceada, atividade física regular, sono adequado
- Enfatize que medicação (quando indicada) deve ser sempre associada a mudanças de estilo de vida
- Se tem comorbidades específicas, dê orientações direcionadas

6) "Próximos passos"
${classificacao === 'candidato_glp1' ? `
- Após confirmar sua compra, um médico endocrinologista da equipe Me Joy entrará em contato via WhatsApp para:
  - Revisar este plano de tratamento
  - Validar ou ajustar a prescrição conforme sua avaliação individual
  - Orientar sobre o uso correto da medicação
  - Estabelecer cronograma de acompanhamento e reavaliações
  
- Enquanto isso, você pode iniciar as mudanças de estilo de vida recomendadas
- Prepare-se para o acompanhamento médico e nutricional contínuo
` : classificacao === 'contraindicado' ? `
- Procure um médico endocrinologista para avaliação presencial completa
- Discuta alternativas seguras de tratamento para seu caso específico
- Mantenha acompanhamento médico regular para monitoramento de saúde
` : `
- Mantenha acompanhamento médico e nutricional regular
- Reavalie em 3-6 meses ou se houver mudanças no seu perfil de saúde
- Continue com as mudanças de estilo de vida recomendadas
`}

FRASES OBRIGATÓRIAS (copie e garanta que apareçam SEMPRE):
- "As condutas medicamentosas aqui sugeridas são um RASCUNHO gerado pela IA da Me Joy com base nas suas respostas e serão sempre revisadas e validadas por um médico endocrinologista da equipe antes de qualquer prescrição oficial."
- "Todo uso de medicação é feito somente após avaliação individual e prescrição médica, seguindo as normas da ANVISA."
- "Após confirmar sua compra, um médico da equipe entrará em contato para validar este plano antes de qualquer prescrição final."

REGRAS ABSOLUTAS:
- NUNCA use nomes comerciais (Ozempic, Mounjaro, Wegovy etc.). Só classe ou princípio ativo.
- SEMPRE individualize baseado no contexto fornecido
- SEMPRE mencione dados específicos (idade, comorbidades, impacto, objetivo)
- NUNCA use texto genérico tipo "mudanças de estilo de vida são importantes" sem amarrar com o caso concreto
`;
    
    // Contexto completo e individualizado
    const context = {
      paciente: {
        nome: patientBasics?.name || payload.sessionData.profile.name,
        sexo,
        idade: patientBasics?.age || payload.sessionData.profile.age,
        idadeFaixa,
        imc,
        categoriaIMC,
        pesoKg: peso,
        alturaCm: altura,
        gestacao,
      },
      triagem: {
        tipo: kind,
        classificacao,
        respostas: answers,
        comorbidades,
        contraindicacoes_glp1: contraindicacoes,
        temContraindicacao,
        impacto_vida: impactoVida,
        objetivo_principal: objetivoPrincipal,
        preferenciaPrincipioAtivo: preferenciaTexto,
      },
    };

    return [
      'Gere APENAS um JSON no formato:',
      '{',
      ' "report_markdown": "...",',
      ' "audio_script_120s_pt": "...",',
      ' "summary_bullets": ["...","...","..."],',
      ' "red_flags": ["..."],',
      ' "icd10_candidates": ["..."]',
      '}',
      '',
      EMAGRECIMENTO_PROMPT,
      '',
      'CONTEXTO PERSONALIZADO:',
      JSON.stringify(context, null, 2),
    ].join('\n');
  }
  
  // Prompts específicos para produtos ZapFarm
  const zapfarmProductPrompts: Record<string, string> = {
    calvicie: `Gere um relatório em linguagem simples para o paciente sobre saúde capilar e queda de cabelo.

Estrutura do relatório:
1) "Seu quadro hoje": explique o padrão de queda identificado (calvície androgenética, eflúvio telógeno, etc.), fatores contribuintes (genética, nutrição, estresse) e impacto na qualidade de vida.

2) "Por que este protocolo pode ajudar": explique como suplementação específica (vitaminas, minerais, aminoácidos) nutre o folículo piloso e como acompanhamento médico identifica causas específicas.

3) "Plano recomendado Me Joy": indique de forma argumentada se o plano ideal é mensal, trimestral ou semestral, com base na gravidade, histórico familiar e fatores modificáveis.

4) "Próximos passos": convide o paciente a iniciar o tratamento, reforçando que haverá acompanhamento médico e ajustes conforme necessário.

IMPORTANTE:
- Sempre incluir: "Todo tratamento é feito somente após avaliação individual e prescrição médica."
- Use tom empático, motivador e responsável.
- Mencione evidências científicas quando relevante.`,

    sono: `Gere um relatório em linguagem simples para o paciente sobre qualidade do sono e insônia.

Estrutura do relatório:
1) "Seu quadro hoje": explique o padrão de sono identificado (insônia de início, manutenção, despertar precoce), fatores contribuintes (higiene do sono, cafeína, telas, estresse) e impacto na qualidade de vida.

2) "Por que este protocolo pode ajudar": explique como melatonina e fitoterápicos regulam o ciclo circadiano e como higiene do sono potencializa os efeitos.

3) "Plano recomendado Me Joy": indique de forma argumentada se o plano ideal é mensal, trimestral ou semestral, com base na gravidade e duração dos sintomas.

4) "Próximos passos": convide o paciente a iniciar o tratamento, reforçando que haverá acompanhamento médico e ajustes conforme necessário.

IMPORTANTE:
- Sempre incluir: "Todo tratamento é feito somente após avaliação individual e prescrição médica."
- Use tom empático, motivador e responsável.
- Mencione evidências científicas quando relevante.`,

    ansiedade: `Gere um relatório em linguagem simples para o paciente sobre ansiedade e estresse.

Estrutura do relatório:
1) "Seu quadro hoje": explique o padrão de ansiedade identificado (frequência, sintomas físicos, impacto funcional), fatores contribuintes (estresse, sono, estilo de vida) e impacto na qualidade de vida.

2) "Por que este protocolo pode ajudar": explique como fitoterápicos ansiolíticos (passiflora, valeriana) ajudam a regular neurotransmissores e como acompanhamento médico e psicológico potencializam resultados.

3) "Plano recomendado Me Joy": indique de forma argumentada se o plano ideal é mensal, trimestral ou semestral, com base na gravidade e impacto funcional.

4) "Próximos passos": convide o paciente a iniciar o tratamento, reforçando que haverá acompanhamento médico e psicológico.

IMPORTANTE:
- Sempre incluir: "Todo tratamento é feito somente após avaliação individual e prescrição médica."
- Use tom empático, motivador e responsável.
- Mencione evidências científicas quando relevante.`,

    intestino: `Gere um relatório em linguagem simples para o paciente sobre saúde intestinal e microbiota.

Estrutura do relatório:
1) "Seu quadro hoje": explique o padrão intestinal identificado (constipação, inchaço, irregularidade), fatores contribuintes (microbiota, alimentação, estresse) e impacto na qualidade de vida.

2) "Por que este protocolo pode ajudar": explique como probióticos repovoam bactérias benéficas, fibras alimentam a microbiota e como acompanhamento médico identifica causas específicas.

3) "Plano recomendado Me Joy": indique de forma argumentada se o plano ideal é mensal, trimestral ou semestral, com base na gravidade e duração dos sintomas.

4) "Próximos passos": convide o paciente a iniciar o tratamento, reforçando que haverá acompanhamento médico e nutricional.

IMPORTANTE:
- Sempre incluir: "Todo tratamento é feito somente após avaliação individual e prescrição médica."
- Use tom empático, motivador e responsável.
- Mencione evidências científicas quando relevante.`,

    figado: `Gere um relatório em linguagem simples para o paciente sobre saúde hepática e fígado gorduroso.

Estrutura do relatório:
1) "Seu quadro hoje": explique o perfil hepático identificado (esteatose, sobrecarga metabólica), fatores contribuintes (alimentação, medicamentos, estilo de vida) e impacto na saúde geral.

2) "Por que este protocolo pode ajudar": explique como fitoterápicos hepáticos (silimarina, alcachofra) protegem e regeneram células hepáticas e como acompanhamento médico monitora função hepática.

3) "Plano recomendado Me Joy": indique de forma argumentada se o plano ideal é mensal, trimestral ou semestral, com base na gravidade e fatores de risco.

4) "Próximos passos": convide o paciente a iniciar o tratamento, reforçando que haverá acompanhamento médico e exames de monitoramento.

IMPORTANTE:
- Sempre incluir: "Todo tratamento é feito somente após avaliação individual e prescrição médica."
- Use tom empático, motivador e responsável.
- Mencione evidências científicas quando relevante.`,

    'libido-masculina': `Gere um relatório em linguagem simples para o paciente sobre libido e saúde masculina.

Estrutura do relatório:
1) "Seu quadro hoje": explique o perfil de saúde masculina identificado (libido, energia, disposição), fatores contribuintes (hormonais, estilo de vida, sono) e impacto na qualidade de vida.

2) "Por que este protocolo pode ajudar": explique como suplementos (maca, tribulus, zinco) ajudam a regular testosterona e como acompanhamento médico identifica causas hormonais.

3) "Plano recomendado Me Joy": indique de forma argumentada se o plano ideal é mensal, trimestral ou semestral, com base na gravidade e fatores relacionados.

4) "Próximos passos": convide o paciente a iniciar o tratamento, reforçando que haverá acompanhamento médico e exames hormonais.

IMPORTANTE:
- Sempre incluir: "Todo tratamento é feito somente após avaliação individual e prescrição médica."
- Use tom empático, motivador e responsável.
- Mencione evidências científicas quando relevante.`,

    menopausa: `Gere um relatório em linguagem simples para o paciente sobre menopausa e TPM.

Estrutura do relatório:
1) "Seu quadro hoje": explique o perfil hormonal identificado (menopausa, perimenopausa, TPM), sintomas (fogachos, insônia, alterações de humor) e impacto na qualidade de vida.

2) "Por que este protocolo pode ajudar": explique como fitormônios (isoflavonas, cimicífuga) ajudam a aliviar sintomas e como acompanhamento médico garante segurança.

3) "Plano recomendado Me Joy": indique de forma argumentada se o plano ideal é mensal, trimestral ou semestral, com base na gravidade dos sintomas e histórico médico.

4) "Próximos passos": convide o paciente a iniciar o tratamento, reforçando que haverá acompanhamento ginecológico e exames de monitoramento.

IMPORTANTE:
- Sempre incluir: "Todo tratamento é feito somente após avaliação individual e prescrição médica."
- Use tom empático, motivador e responsável.
- Mencione evidências científicas quando relevante.`,

    articulacoes: `Gere um relatório em linguagem simples para o paciente sobre saúde articular e coluna.

Estrutura do relatório:
1) "Seu quadro hoje": explique o padrão de dor identificado (localização, intensidade, rigidez), fatores contribuintes (artrose, sobrecarga, traumas) e impacto funcional.

2) "Por que este protocolo pode ajudar": explique como colágeno tipo II mantém integridade articular, anti-inflamatórios naturais reduzem dor e como acompanhamento médico identifica causas específicas.

3) "Plano recomendado Me Joy": indique de forma argumentada se o plano ideal é mensal, trimestral ou semestral, com base na gravidade e impacto funcional.

4) "Próximos passos": convide o paciente a iniciar o tratamento, reforçando que haverá acompanhamento médico e plano de exercícios.

IMPORTANTE:
- Sempre incluir: "Todo tratamento é feito somente após avaliação individual e prescrição médica."
- Use tom empático, motivador e responsável.
- Mencione evidências científicas quando relevante.`,

    imunidade: `Gere um relatório em linguagem simples para o paciente sobre imunidade e fadiga.

Estrutura do relatório:
1) "Seu quadro hoje": explique o perfil de imunidade identificado (infecções recorrentes, fadiga), fatores contribuintes (deficiências nutricionais, sono, estresse) e impacto na qualidade de vida.

2) "Por que este protocolo pode ajudar": explique como vitaminas (C, D, Zinco) e probióticos fortalecem sistema imune e como acompanhamento médico identifica deficiências específicas.

3) "Plano recomendado Me Joy": indique de forma argumentada se o plano ideal é mensal, trimestral ou semestral, com base na frequência de infecções e deficiências identificadas.

4) "Próximos passos": convide o paciente a iniciar o tratamento, reforçando que haverá acompanhamento médico e exames de monitoramento.

IMPORTANTE:
- Sempre incluir: "Todo tratamento é feito somente após avaliação individual e prescrição médica."
- Use tom empático, motivador e responsável.
- Mencione evidências científicas quando relevante.`,
  };

  // Se houver prompt específico para este produto ZapFarm, usar
  if (zapfarmProductPrompts[kind]) {
    const contraindicacoes = Object.entries(answers)
      .filter(([k]) => k.startsWith('contraindicacoes_'))
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as Record<string, unknown>);
    const preferencias = Object.entries(answers)
      .filter(([k]) => k.startsWith('preferencia_'))
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as Record<string, unknown>);

    const context = {
      paciente: {
        nome: patientBasics?.name || payload.sessionData.profile.name,
        sexo: patientBasics?.sex || payload.sessionData.profile.sex,
        idade: patientBasics?.age || payload.sessionData.profile.age,
        imc: patientBasics?.bmi,
        categoriaIMC: patientBasics?.bmiCategory,
      },
      triagem: {
        tipo: kind,
        respostas: answers,
        contraindicacoes: Object.keys(contraindicacoes).length ? contraindicacoes : undefined,
        preferencias: Object.keys(preferencias).length ? preferencias : undefined,
      },
    };

    const contraindicationInstruction =
      Object.keys(contraindicacoes).length > 0
        ? '\nCONTRAINDICAÇÕES: O paciente informou condições que exigem cuidado. No relatório, mencione explicitamente que essas condições serão reavaliadas na consulta e podem exigir ajustes no tratamento.'
        : '';

    return [
      'Gere APENAS um JSON no formato:',
      '{',
      ' "report_markdown": "...",',
      ' "audio_script_120s_pt": "...",',
      ' "summary_bullets": ["...","...","..."],',
      ' "red_flags": ["..."],',
      ' "icd10_candidates": ["..."]',
      '}',
      '',
      zapfarmProductPrompts[kind],
      contraindicationInstruction,
      '',
      'CONTEXTO PERSONALIZADO:',
      JSON.stringify(context, null, 2),
    ].join('\n');
  }
  
  // Montar contexto personalizado para outros tipos
  const context = {
    paciente: {
      nome: patientBasics?.name || payload.sessionData.profile.name,
      sexo: patientBasics?.sex || payload.sessionData.profile.sex,
      idade: patientBasics?.age || payload.sessionData.profile.age,
      imc: patientBasics?.bmi,
      categoriaIMC: patientBasics?.bmiCategory,
    },
    triagem: {
      tipo: kind,
      respostas: answers,
    },
    personalizacao: {
      temDadosBasicos: !!patientBasics,
      temIMC: !!patientBasics?.bmi,
      temIdade: !!patientBasics?.age,
    }
  };

  return [
    'Gere APENAS um JSON no formato:',
    '{',
    ' "report_markdown": "...",',
    ' "audio_script_120s_pt": "...",',
    ' "summary_bullets": ["...","...","..."],',
    ' "red_flags": ["..."],',
    ' "icd10_candidates": ["..."]',
    '}',
    '',
    'Use os dados abaixo para produzir um relatório personalizado:',
    '- Hipóteses diagnósticas com nível de confiança e justificativas',
    '- Fisiopatologia resumida e didática',
    '- Principais causas/agravantes',
    '- Red flags (objetivas)',
    '- Condutas medicamentosas e não medicamentosas',
    '- Plano de acompanhamento',
    '',
    'Personalize baseado nos dados demográficos fornecidos.',
    'Tom: claro, respeitoso, prático. Evite jargões.',
    '',
    'CONTEXTO PERSONALIZADO:',
    JSON.stringify(context, null, 2),
  ].join('\n');
}

function sanitizeJson(content: string): string {
  const fenced = content.match(/```json([\s\S]*?)```/i);
  if (fenced) {
    return fenced[1].trim();
  }
  const genericFence = content.match(/```([\s\S]*?)```/);
  if (genericFence) {
    return genericFence[1].trim();
  }
  return content;
}

function buildMockReport(kind: string, payload: TriagePayload): GeneratedReport {
  const patientBasics = getPatientBasics(payload);
  const nome = patientBasics?.name || payload.sessionData.profile.name || 'Paciente';
  const idade = patientBasics?.age || payload.sessionData.profile.age;
  const sexo = patientBasics?.sex || payload.sessionData.profile.sex;
  const imc = patientBasics?.bmi;
  
  const answers = payload.sessionData.answers;
  const queixas = Object.values(answers).filter(v => typeof v === 'string').join(', ') || 'sintomas gerais';
  const objetivo = answers.objetivo_principal || answers.objetivo || 'melhorar qualidade de vida';

  const summaryBullets = [
    `Paciente: ${nome}${idade ? `, ${idade} anos` : ''}${sexo ? `, sexo ${sexo}` : ''}`,
    `IMC: ${imc ? `${imc} kg/m²` : 'não calculado'}`,
    `Sintomas relatados: ${queixas}`,
    `Objetivo principal: ${objetivo}`,
  ];

  const markdown = [
    `# Relatório Integrativo - ${capitalize(kind)}`,
    '',
    `## Avaliação Personalizada`,
    `Paciente: ${nome}${idade ? `, ${idade} anos` : ''}${sexo ? `, sexo ${sexo}` : ''}`,
    imc ? `IMC: ${imc} kg/m² (${patientBasics?.bmiCategory || 'categoria não definida'})` : '',
    '',
    '## Hipóteses Diagnósticas',
    '- Avaliação clínica baseada nos sintomas relatados',
    '- Necessário acompanhamento médico para confirmação diagnóstica',
    '',
    '## Recomendações Gerais',
    '- Manter hábitos de vida saudáveis',
    '- Alimentação equilibrada e hidratação adequada',
    '- Atividade física regular conforme orientação médica',
    '- Controle do estresse e qualidade do sono',
    '',
    '## Próximos Passos',
    '- Consultar médico para avaliação completa',
    '- Seguir orientações específicas do especialista',
    '- Manter acompanhamento regular',
  ].filter(Boolean).join('\n');

  const audioScript = [
    `Olá, ${nome}! Aqui é o time Me Joy.`,
    'Avaliamos suas respostas e montamos um plano personalizado para você.',
    'Recomendamos consultar um médico para uma avaliação completa dos seus sintomas.',
    'Enquanto isso, mantenha hábitos saudáveis de alimentação, exercícios e sono.',
    'Estamos aqui para apoiar sua jornada de saúde!',
  ].join(' ');

  return {
    markdown,
    audioScript,
    summaryBullets,
    redFlags: [
      'Procure atendimento médico se sintomas persistirem',
      'Consulte especialista para avaliação completa',
    ],
    icd10Candidates: [],
  };
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
