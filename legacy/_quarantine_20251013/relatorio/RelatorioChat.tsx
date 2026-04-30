// ✅ src/components/relatorio/RelatorioChat.tsx

import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface Mensagem {
  id: string;
  tipo: 'usuario' | 'ia';
  texto: string;
}

export const RelatorioChat = () => {
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const enviarMensagem = async (texto?: string) => {
    const conteudo = texto || mensagem;
    if (!conteudo.trim()) return;

    const novaMensagem: Mensagem = {
      id: uuidv4(),
      tipo: 'usuario',
      texto: conteudo,
    };

    setMensagens((msgs) => [...msgs, novaMensagem]);
    setMensagem('');

    try {
      const res = await fetch('/api/chat-medico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: conteudo }
          ],
          context: {
            nome: 'Paciente',
            idade: '45',
            sintomas: 'dores de cabeça, ansiedade',
            medicamentos: 'nenhum',
            historico: 'nenhum histórico relevante'
          }
        }),
      });

      const data = await res.json();
      const resposta = data?.resposta || data?.choices?.[0]?.message?.content;

      if (resposta) {
        setMensagens((msgs) => [
          ...msgs,
          { id: uuidv4(), tipo: 'ia', texto: resposta },
        ]);
      }
    } catch (err) {
      setMensagens((msgs) => [
        ...msgs,
        { id: uuidv4(), tipo: 'ia', texto: '❌ Erro ao responder. Tente novamente.' },
      ]);
    }
  };

  const handleGravacao = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      enviarMensagem(transcript);
      resetTranscript();
    } else {
      SpeechRecognition.startListening();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6 bg-white shadow rounded-xl p-4 h-[480px] flex flex-col">
      <div className="text-lg font-semibold mb-2">💬 Converse com o agente médico</div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={`px-3 py-2 rounded-lg max-w-[85%] whitespace-pre-line ${
              msg.tipo === 'usuario' ? 'bg-brand-100 self-end' : 'bg-muted self-start'
            }`}
          >
            {msg.texto}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-3 flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Digite sua pergunta..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
        />
        <button
          className="bg-brand text-white rounded px-4 py-2 hover:bg-brand"
          onClick={() => enviarMensagem()}
        >
          Enviar
        </button>
        <button
          className={`text-sm px-2 py-2 border rounded ${listening ? 'bg-muted' : 'bg-muted'}`}
          onClick={handleGravacao}
        >
          🎤
        </button>
      </div>
    </div>
  );
};