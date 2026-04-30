// src/components/report/interactive/AchievementBadge.tsx
// Badge de conquista para o relatório

'use client';

import { useEffect, useState } from 'react';

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  points?: number;
  className?: string;
}

export function AchievementBadge({ 
  title, 
  description, 
  icon, 
  unlocked, 
  points,
  className = '' 
}: AchievementBadgeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (unlocked) {
      setIsVisible(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [unlocked]);

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border p-4
        transition-all duration-500 ease-out
        ${unlocked 
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/40 shadow-lg' 
          : 'bg-white/5 border-white/10 opacity-60'
        }
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        ${isAnimating ? 'animate-bounce' : ''}
        hover:scale-105 hover:shadow-xl
        ${className}
      `}
    >
      {/* Efeito de brilho quando desbloqueado */}
      {unlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
      )}

      <div className="relative flex items-start gap-3">
        {/* Ícone */}
        <div className={`
          flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl
          transition-all duration-300
          ${unlocked 
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg' 
            : 'bg-white/10'
          }
          ${isAnimating ? 'animate-spin' : ''}
        `}>
          {unlocked ? icon : '🔒'}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <h4 className={`
            font-semibold text-sm mb-1
            ${unlocked ? 'text-white' : 'text-white/60'}
          `}>
            {title}
          </h4>
          <p className="text-xs text-white/70 leading-relaxed">
            {description}
          </p>
          {points && unlocked && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30">
              <span className="text-xs font-bold text-yellow-400">+{points}</span>
              <span className="text-xs text-yellow-300">pontos</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

