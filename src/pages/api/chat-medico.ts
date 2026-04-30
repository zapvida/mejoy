// src/pages/api/chat-medico.ts
import OpenAI from 'openai'

export const config = {
  runtime: 'edge',
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export default async function handler(req: Request) {
  try {
    // Verificar se é POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Verificar se OPENAI_API_KEY está definida
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // BEGIN patch chat-medico JSON consistente
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Malformed JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { messages } = body;

    // Validar mensagens
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Para produção, retornar JSON em vez de stream
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Você é um assistente médico.' },
        ...messages
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';

    return new Response(JSON.stringify({ 
      text: response,
      model: 'gpt-4o',
      usage: completion.usage 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro na API chat-medico:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}