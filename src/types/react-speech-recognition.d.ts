declare module 'react-speech-recognition' {
  export const useSpeechRecognition: () => {
    transcript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
  };

  export const SpeechRecognition: {
    startListening: () => void;
    stopListening: () => void;
  };

  export default SpeechRecognition;
}