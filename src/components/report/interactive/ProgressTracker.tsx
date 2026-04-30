// src/components/report/interactive/ProgressTracker.tsx
// Rastreador de progresso com gamificação

'use client';

import { useEffect, useState } from 'react';
import { AnimatedProgress } from '@/components/interactions/MicroInteractions';

interface ProgressTrackerProps {
  completed: number;
  total: number;
  label: string;
  color?: 'green' | 'blue' | 'purple' | 'orange';
  showBadge?: boolean;
  className?: string;
}

export function ProgressTracker({ 
  completed, 
  total, 
  label, 
  color = 'green',
  showBadge = true,
  className = '' 
}: ProgressTrackerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const percentage = Math.round((completed / total) * 100);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getBadgeText = () => {
    if (percentage === 100) return '🎉 Completo!';
    if (percentage >= 75) return '🔥 Quase lá!';
    if (percentage >= 50) return '💪 Continue!';
    if (percentage >= 25) return '🚀 Começando!';
    return '📋 Em progresso';
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border border-white/10 
        bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/70 
        backdrop-blur-xl p-5
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        hover:shadow-2xl hover:scale-[1.02]
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
          {label}
        </h3>
        {showBadge && (
          <span className="text-xs font-bold text-white/80 bg-white/10 px-2 py-1 rounded-full">
            {completed}/{total}
          </span>
        )}
      </div>

      {/* Barra de progresso */}
      <div className="space-y-2">
        <AnimatedProgress 
          progress={percentage} 
          color={color}
          className="h-3"
        />
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>{percentage}% concluído</span>
          {showBadge && (
            <span className="font-semibold text-white/90">
              {getBadgeText()}
            </span>
          )}
        </div>
      </div>

      {/* Efeito de brilho quando completo */}
      {percentage === 100 && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-transparent to-green-500/20 animate-shimmer pointer-events-none" />
      )}
    </div>
  );
}

