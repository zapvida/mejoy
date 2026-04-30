// src/components/relatorio/MedicalChat.tsx

import React, { useState, useEffect, useRef, useMemo } from "react";
import clsx from "clsx";

type ChatInteraction = "open" | "message" | "audio";
// eslint-disable-next-line no-unused-vars
type InteractionHandler = (_interaction: ChatInteraction) => void;

interface MedicalChatProps {
  context: {
    nome?: string;
    idade?: number;
    sexo?: string;
    sintomas?: string[] | string;
    planoAcao?: string;
    score?: number | string;
    scoreFuturo?: number | string;
  };
  mensagens?: { role: 'user' | 'assistant'; content: string }[];
  pensando?: boolean;
  // eslint-disable-next-line no-unused-vars
  onSendMessage?: (_question: string) => Promise<void>;
  onOpen?: () => void;
  onInteraction?: InteractionHandler;
  className?: string;
}

const MedicalChat = ({
  context,
  mensagens = [],
  pensando = false,
  onSendMessage = async () => {},
  onOpen,
  onInteraction,
  className,
}: MedicalChatProps) => {
  const [inputQuestion, setInputQuestion] = useState("");
  const [hasOpened, setHasOpened] = useState(false);

  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // @ts-ignore
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputQuestion((prev) => `${prev} ${transcript}`.trim());
      };

      recognition.onerror = (event: any) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setRecording(false);
      };

      recognition.onend = () => {
        setRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleOpen = () => {
    if (!hasOpened) {
      onOpen?.();
      onInteraction?.("open");
      setHasOpened(true);
    }
  };

  const toggleRecording = () => {
    handleOpen();
    if (!recognitionRef.current) return;
    if (recording) {
      recognitionRef.current.stop();
      setRecording(false);
    } else {
      recognitionRef.current.start();
      setRecording(true);
      onInteraction?.("audio");
    }
  };


  const handleSend = async () => {
    if (!inputQuestion.trim()) return;
    handleOpen();
    await onSendMessage(inputQuestion);
    onInteraction?.("message");
    setInputQuestion("");
  };

  const placeholder = useMemo(
    () =>
      `Ex.: "Como faço para começar hoje?" ou "Quais exames são prioridade?"`,
    [],
  );

  return (
    <div
      className={clsx(
        "flex h-full flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-[0_18px_40px_rgba(11,15,35,0.15)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-white",
        className,
      )}
    >
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-white/50">
            IA médica
          </p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Pergunte sobre seu plano e próximos passos
          </h3>
          <p className="text-sm text-slate-500 dark:text-white/60">
            Nosso assistente usa o relatório como contexto para responder rápido e com clareza.
          </p>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
        <div className="custom-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {mensagens.length === 0 ? (
            <div className="rounded-2xl bg-slate-100/70 px-4 py-3 text-sm text-slate-600 dark:bg-white/10 dark:text-white/70">
              <p className="font-semibold">
                Sugestões do que você pode perguntar:
              </p>
              <ul className="mt-2 space-y-1">
                <li>• Como encaixar as ações no meu dia?</li>
                <li>• O que significa o alerta principal?</li>
                <li>• Como preparar os exames indicados?</li>
              </ul>
            </div>
          ) : (
            mensagens.map((msg, idx) => (
              <div
                key={idx}
                className={clsx(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                  msg.role === "user"
                    ? "self-end rounded-br-md bg-emerald-500 text-emerald-950"
                    : "self-start rounded-bl-md bg-slate-900/90 text-white dark:bg-white/15",
                )}
              >
                <span className="block text-xs font-semibold uppercase tracking-[0.25em] opacity-70">
                  {msg.role === "user" ? "Você" : "IA Médica"}
                </span>
                <span className="mt-1 block whitespace-pre-line">{msg.content}</span>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/60 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-white/10">
          <label htmlFor="medical-chat-input" className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400 dark:text-white/50">
            Conversar
          </label>
          <div className="flex items-center gap-2">
            <input
              id="medical-chat-input"
              type="text"
              className="flex-1 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus:border-emerald-400"
              value={inputQuestion}
              onChange={event => setInputQuestion(event.target.value)}
              onFocus={handleOpen}
              placeholder={placeholder}
            />
            <button
              type="button"
              className={clsx(
                "rounded-full border px-3 py-2 text-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
                recording
                  ? "border-rose-400 bg-rose-50 text-rose-600 dark:border-rose-300 dark:bg-rose-400/10 dark:text-rose-200"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-500 dark:border-white/10 dark:bg-white/10 dark:text-white/70",
              )}
              title="Falar com voz"
              onClick={toggleRecording}
            >
              🎤
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={pensando || !inputQuestion.trim()}
              className="inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/50 dark:bg-emerald-400 dark:text-slate-900"
            >
              {pensando ? "Enviando..." : "Enviar"}
            </button>
          </div>
          {pensando && (
            <p className="text-xs text-slate-400 dark:text-white/60">A IA está pensando...</p>
          )}
        </div>
      </div>
      <footer className="rounded-2xl bg-slate-100/70 px-4 py-3 text-xs text-slate-500 dark:bg-white/5 dark:text-white/60">
        Contexto usado: <strong>{context.nome || "Paciente"}</strong>, {context.idade || "idade não informada"},{" "}
        plano atual com score {context.score ?? "—"} / potencial {context.scoreFuturo ?? "—"}.
      </footer>
    </div>
  );
};

export default MedicalChat;
