import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// 🔒 Proteção: usa a variável de ambiente da sua chave da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido. Use POST.' });
  }

  const { pergunta, contextoExtra } = req.body;

  if (!pergunta || typeof pergunta !== 'string') {
    return res.status(400).json({ erro: 'Pergunta inválida ou ausente.' });
  }

  try {
    const prompt = `
👩‍⚕️ Você é um(a) médico(a) assistente virtual. Responda de forma clara, objetiva, acolhedora e com linguagem acessível ao paciente.

📥 Pergunta do usuário: ${pergunta}

${contextoExtra ? `📎 Contexto adicional: ${contextoExtra}` : ''}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const resposta = completion.choices[0]?.message?.content?.trim() || 'Desculpe, não consegui gerar uma resposta clara.';
    return res.status(200).json({ resposta });
  } catch (error: any) {
    console.error('❌ Erro ao gerar resposta da IA médica:', error);
    return res.status(500).json({
      erro: 'Erro ao gerar resposta da IA médica.',
      detalhes: error?.message || 'Erro desconhecido.',
    });
  }
}