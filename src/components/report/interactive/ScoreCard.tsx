// src/components/report/interactive/ScoreCard.tsx
// Card interativo de score com animações e gamificação

'use client';

import { useEffect, useState } from 'react';
import { AnimatedProgress } from '@/components/interactions/MicroInteractions';

interface ScoreCardProps {
  score: number;
  label: string;
  icon: string;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'red';
  interpretation: string;
  className?: string;
}

const colorConfigs = {
  green: {
    gradient: 'from-green-500 to-emerald-600',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    bar: 'bg-green-500',
    accent: 'text-green-300',
  },
  blue: {
    gradient: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    bar: 'bg-blue-500',
    accent: 'text-blue-300',
  },
  purple: {
    gradient: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    bar: 'bg-purple-500',
    accent: 'text-purple-300',
  },
  orange: {
    gradient: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    bar: 'bg-orange-500',
    accent: 'text-orange-300',
  },
  red: {
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    bar: 'bg-red-500',
    accent: 'text-red-300',
  },
};

export function ScoreCard({ score, label, icon, color, interpretation, className = '' }: ScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const config = colorConfigs[color];

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Excelente';
    if (s >= 60) return 'Bom';
    if (s >= 40) return 'Regular';
    if (s >= 20) return 'Atenção';
    return 'Crítico';
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border backdrop-blur-xl
        ${config.bg} ${config.border}
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        hover:scale-[1.02] hover:shadow-2xl
        ${className}
      `}
    >
      {/* Gradiente de fundo animado */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5 animate-pulse`} />
      
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">{icon}</span>
            <div>
              <h3 className={`text-sm font-semibold uppercase tracking-wider ${config.text}`}>
                {label}
              </h3>
              <p className="text-xs text-white/60 mt-0.5">{getScoreLabel(score)}</p>
            </div>
          </div>
          <div className={`text-right ${config.accent}`}>
            <div className="text-4xl font-bold tabular-nums">
              {Math.round(animatedScore)}
            </div>
            <div className="text-sm text-white/60">/100</div>
          </div>
        </div>

        {/* Barra de progresso animada */}
        <div className="space-y-2">
          <AnimatedProgress 
            progress={score} 
            color={color === 'green' ? 'green' : color === 'blue' ? 'blue' : color === 'purple' ? 'purple' : 'orange'}
            className="h-3"
          />
        </div>

        {/* Interpretação */}
        <p className={`text-sm leading-relaxed ${config.text} font-medium`}>
          {interpretation}
        </p>

        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer`} />
        </div>
      </div>
    </div>
  );
}

