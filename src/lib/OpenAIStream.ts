// src/lib/OpenAIStream.ts

export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function OpenAIStream(messages: Message[], p0: { model: string; temperature: number; }) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY || ''}`,
    },
    body: JSON.stringify({
      model: p0.model,
      messages,
      temperature: p0.temperature,
      stream: true,
    }),
  });

  const reader = response.body?.getReader();
  const stream = new ReadableStream({
    async start(controller) {
      if (!reader) return controller.close();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          const json = line.replace(/^data: /, '');
          if (json === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          } catch (err) {
            console.error('Erro ao analisar stream:', err);
          }
        }
      }

      controller.close();
    },
  });

  return stream;
}