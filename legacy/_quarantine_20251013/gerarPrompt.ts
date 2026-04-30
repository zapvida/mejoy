// 🔥 /src/pages/api/gerarPrompt.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  gerarPromptPersonalizado,
  gerarPromptPreditiva,
  gerarPromptTriagem
} from '@/ai/prompt';

import OpenAI from 'openai';

let openai: OpenAI;

try {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('❌ OPENAI_API_KEY não definida no .env.local');
  }

  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} catch (err) {
  console.error(err);
  throw err;
}

const tiposEspeciais = ['mental', 'cancer', 'enxaqueca', 'tabagismo', 'obesidade', 'quimica', 'gestante', 'sono'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    const { cpf, formData, tipo } = req.body;

    if (!cpf || typeof formData !== 'object' || !tipo) {
      return res.status(400).json({
        error: 'Parâmetros inválidos. Envie cpf (string), tipo (string) e formData (objeto).',
      });
    }

    const prompt =
      tipo === 'geral' || tipo === 'preditiva'
        ? gerarPromptPreditiva(formData)
        : tiposEspeciais.includes(tipo)
        ? gerarPromptTriagem(tipo, formData)
        : gerarPromptPersonalizado(formData);

    if (!prompt) {
      return res.status(400).json({ error: 'Tipo de triagem inválido.' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const resultado = completion.choices[0]?.message?.content || 'Erro ao gerar resposta';

    return res.status(200).json({ relatorio: resultado });
  } catch (error: any) {
    console.error('❌ Erro na geração do prompt:', error);
    return res.status(500).json({
      error: error?.message || 'Erro interno ao gerar relatório',
    });
  }
}