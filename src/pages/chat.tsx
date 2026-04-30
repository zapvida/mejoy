'use client';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import LoggedLayout from '@/components/layout/LoggedLayout';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '554797789479';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá!%20Tenho%20uma%20dúvida%20sobre%20minha%20saúde.`;

type Mensagem = {
  id: string;
  tipo: 'usuario' | 'ia';
  texto: string;
};

function genId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function ChatPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [enviando, setEnviando] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/chat');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const enviarMensagem = async (texto?: string) => {
    const conteudo = (texto || mensagem).trim();
    if (!conteudo) return;

    const novaMensagem: Mensagem = {
      id: genId(),
      tipo: 'usuario',
      texto: conteudo,
    };
    setMensagens((msgs) => [...msgs, novaMensagem]);
    setMensagem('');
    setEnviando(true);

    try {
      const history = mensagens
        .filter((m) => m.tipo === 'usuario' || m.tipo === 'ia')
        .slice(-10) // Últimas 10 trocas para evitar limite de tokens
        .map((m) => ({
          role: (m.tipo === 'usuario' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.texto,
        }));

      const res = await fetch('/api/chat-medico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { role: 'user' as const, content: conteudo }],
        }),
      });

      const data = await res.json();
      const resposta =
        data?.text ||
        data?.resposta ||
        (data?.choices?.[0]?.message?.content as string | undefined);

      if (resposta) {
        setMensagens((msgs) => [
          ...msgs,
          { id: genId(), tipo: 'ia', texto: resposta },
        ]);
      } else {
        setMensagens((msgs) => [
          ...msgs,
          {
            id: genId(),
            tipo: 'ia',
            texto: 'Desculpe, não consegui processar sua pergunta. Você pode tentar novamente ou falar diretamente com nossa equipe pelo WhatsApp.',
          },
        ]);
      }
    } catch {
      setMensagens((msgs) => [
        ...msgs,
        {
          id: genId(),
          tipo: 'ia',
          texto: 'Ocorreu um erro. Tente novamente ou fale conosco pelo WhatsApp.',
        },
      ]);
    } finally {
      setEnviando(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Conversa com Médico | Me Joy</title>
        <meta
          name="description"
          content="Tire suas dúvidas de saúde com nosso assistente médico virtual"
        />
      </Head>

      <LoggedLayout>
        <main className="min-h-screen bg-gray-50 text-gray-900">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Conversa com Médico
              </h1>
              <p className="text-gray-600">
                Tire dúvidas sobre sua saúde. Este assistente é informativo e não
                substitui consulta médica.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col min-h-[400px] max-h-[calc(100vh-20rem)]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mensagens.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-2">👋 Olá{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!</p>
                    <p className="text-sm">
                      Digite sua pergunta abaixo. Para atendimento humano, use o
                      WhatsApp.
                    </p>
                  </div>
                )}
                {mensagens.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2 rounded-2xl whitespace-pre-wrap ${
                        msg.tipo === 'usuario'
                          ? 'bg-brand-600 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      {msg.texto}
                    </div>
                  </div>
                ))}
                {enviando && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl rounded-bl-md animate-pulse">
                      Pensando...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  placeholder="Digite sua pergunta..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && enviarMensagem()}
                  disabled={enviando}
                />
                <button
                  type="button"
                  onClick={() => enviarMensagem()}
                  disabled={enviando || !mensagem.trim()}
                  className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Enviar
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#20BA5A] transition"
              >
                <span>💬</span>
                Falar com médico pelo WhatsApp
              </a>
            </div>
          </div>
        </main>
      </LoggedLayout>
    </>
  );
}
