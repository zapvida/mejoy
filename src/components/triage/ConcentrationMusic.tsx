"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const VOLUME = 0.05; // 5%
const PLAYBACK_RATE = 0.85; // mais lenta

/** Beethoven Moonlight Sonata - música de concentração, ativada por padrão */
export function ConcentrationMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    const nextMuted = !muted;
    a.muted = nextMuted;
    setMuted(nextMuted);
    if (!nextMuted) {
      a.volume = VOLUME;
      a.playbackRate = PLAYBACK_RATE;
      a.play().catch(() => setMuted(true));
    }
  }, [muted]);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    const a = audioRef.current;
    if (!a) return;
    a.volume = VOLUME;
    a.playbackRate = PLAYBACK_RATE;
    a.muted = false;
    a.play()
      .then(() => setMuted(false))
      .catch(() => setMuted(true));
  }, [ready]);

  if (!ready || typeof window === "undefined") return null;

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/concentration-music.ogg"
        loop
        muted={muted}
        preload="auto"
        playsInline
      />
      <button
        type="button"
        onClick={toggle}
        title={muted ? "Ativar música" : "Desativar música"}
        className={cn(
          "fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full",
          "bg-white/80 backdrop-blur-md border border-white/40 shadow-lg",
          "hover:bg-white hover:scale-110 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-purple-400/50"
        )}
        aria-label={muted ? "Ativar música" : "Desativar música"}
      >
        <span className="text-lg" role="img" aria-hidden>
          {muted ? "🔇" : "🎵"}
        </span>
      </button>
    </>
  );
}
