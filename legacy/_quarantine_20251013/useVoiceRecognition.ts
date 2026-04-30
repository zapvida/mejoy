import { useEffect, useState, useRef } from "react";

export function useVoiceRecognition() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "pt-BR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        setTranscript(event.results[0][0].transcript);
      };

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (recognition && !listening) {
      try {
        recognition.start();
      } catch (err) {
        console.warn("Erro ao iniciar reconhecimento:", err);
      }
    }
  };

  const stopListening = () => {
    const recognition = recognitionRef.current;
    if (recognition && listening) {
      try {
        recognition.stop();
      } catch (err) {
        console.warn("Erro ao parar reconhecimento:", err);
      }
    }
  };

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    toggleListening,
  };
}