import OpenAI from 'openai';
import { z } from 'zod';

import { runtimeGuards, serverEnv } from '@/env';

type TriagePayload = Record<string, unknown>;

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
  if (runtimeGuards.isMockAI || !serverEnv.OPENAI_API_KEY) {
    return buildMockReport(kind, payload);
  }

  const prompt = buildPrompt(kind, payload);

  try {
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'Você é um médico assistente especialista em Gastroenterologia e Medicina Integrativa. Retorne apenas JSON válido.',
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

function buildPrompt(kind: string, payload: TriagePayload): string {
  const payloadJson = JSON.stringify(payload, null, 2);

  return [
    'Você é um médico assistente com foco em Gastroenterologia e Medicina Integrativa.',
    'Gere APENAS um JSON no formato:',
    '{',
    ' "report_markdown": "...",',
    ' "audio_script_120s_pt": "...",',
    ' "summary_bullets": ["...","...","..."],',
    ' "red_flags": ["..."],',
    ' "icd10_candidates": ["..."]',
    '}',
    '',
    'Use as respostas da triagem (abaixo) para produzir:',
    '- Hipóteses diagnósticas com nível de confiança e justificativas.',
    '- Fisiopatologia resumida e didática.',
    '- Principais causas/agravantes.',
    '- Red flags (objetivas).',
    '- Condutas medicamentosas e não medicamentosas, com doses faixas usuais quando aplicável, duração típica, e alertas.',
    '- Plano de acompanhamento (o que monitorar e quando reavaliar).',
    '',
    'Tom: claro, respeitoso, prático. Evite jargões; traduza termos técnicos.',
    'Limites: se informação crucial estiver ausente, assuma cenários comuns explicitando a suposição.',
    '',
    `Triagem: ${kind}`,
    'DADOS TRIAGEM:',
    payloadJson,
  ].join('\n');
}

function buildMockReport(kind: string, payload: TriagePayload): GeneratedReport {
  const nome = getString(payload.nome) || 'Paciente';
  const queixas = arrayOrString(payload.queixas);
  const objetivo = getString(payload.objetivo) || 'reduzir sintomas gastrointestinais';
  const impacto = getString(payload.impacto) || 'impacto moderado no cotidiano';

  const summaryBullets = [
    `Sintomas relatados: ${queixas}`,
    `Objetivo principal: ${objetivo}`,
    `Impacto percebido: ${impacto}`,
  ];

  const markdown = [
    `# Relatório Integrativo - ${capitalize(kind)}`,
    '',
    '## Hipóteses Diagnósticas',
    '- Dispepsia funcional (confiança moderada) – sintomas crônicos sem sinais de alarme.',
    '- Refluxo gastroesofágico (confiança moderada) – queimação pós-prandial relatada.',
    '',
    '## Fisiopatologia',
    'Alterações na motilidade gastrointestinal e sensibilidade visceral podem explicar a combinação de azia, distensão e desconforto abdominal relatados.',
    '',
    '## Principais Causas/Agravantes',
    '- Padrão alimentar irregular e ultraprocessados frequentes.',
    '- Estresse elevado impactando o eixo intestino-cérebro.',
    '- Possível hipocloridria e uso eventual de anti-inflamatórios.',
    '',
    '## Red Flags',
    '- Perda de peso involuntária >5% em 6 meses.',
    '- Disfagia progressiva ou anemia ferripriva.',
    '',
    '## Condutas Medicamentosas',
    '- Omeprazol 20 mg pela manhã por 4 a 8 semanas, reavaliando resposta.',
    '- Antiácidos à base de alginato após refeições com sintomas.',
    '',
    '## Condutas Integrativas e Estilo de Vida',
    '- Dieta anti-inflamatória com foco em vegetais, fibras solúveis e redução de ultraprocessados.',
    '- Mastigação lenta, evitar refeições volumosas à noite e elevar cabeceira da cama.',
    '- Técnicas de respiração diafragmática por 5 minutos, 2-3 vezes/dia.',
    '',
    '## Nutrição e Suplementos',
    '- Probióticos com Lactobacillus rhamnosus GG por 8 semanas.',
    '- Suplementação de glutamina 5 g 2x/dia para suporte intestinal.',
    '',
    '## Plano de Acompanhamento',
    '- Reavaliar sintomas em 6 semanas com diário alimentar.',
    '- Procurar atendimento se surgirem vômitos persistentes, disfagia ou sangue nas fezes.',
  ].join('\n');

  const audioScript = [
    `Olá, ${nome}! Aqui é o time Alloe. Avaliamos suas respostas e montamos um plano claro para hoje.`,
    'Os sintomas combinam mais com refluxo e dispepsia funcional, condições comuns quando o estômago trabalha sob estresse constante.',
    'Para aliviar, priorize refeições menores, mastigue bem e reduza café, álcool e frituras nas próximas semanas.',
    'Inclua alimentos integrais, vegetais e fontes de ômega-3, e hidrate-se bem ao longo do dia.',
    'Separe alguns minutos para respiração diafragmática após as refeições principais; isso ajuda a relaxar o diafragma e diminuir a azia.',
    'Use medicamentos como o omeprazol por curto prazo, seguindo as orientações médicas, e observe se há melhora.',
    'Se perceber perda de peso sem explicação, dificuldade para engolir ou sangue nas fezes, procure atendimento imediatamente.',
    'Estamos juntos nessa. Conte conosco para acompanhar sua evolução!',
  ].join(' ');

  return {
    markdown,
    audioScript,
    summaryBullets,
    redFlags: [
      'Perda de peso involuntária significativa',
      'Disfagia progressiva',
      'Sangramento gastrointestinal',
    ],
    icd10Candidates: ['K21.9', 'K30'],
  };
}

function getString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim();
  return null;
}

function arrayOrString(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)
      .join(', ');
  }
  const text = getString(value);
  return text || 'não informado';
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
