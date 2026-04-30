// src/components/report/interactive/ActionItem.tsx
// Item de ação interativo com checkbox e progresso

'use client';

import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface ActionItemProps {
  text: string;
  completed?: boolean;
  onToggle?: (completed: boolean) => void;
  priority?: 'high' | 'medium' | 'low';
  timeframe?: string;
  className?: string;
}

const priorityConfigs = {
  high: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
  },
  medium: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    dot: 'bg-yellow-400',
  },
  low: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
  },
};

export function ActionItem({ 
  text, 
  completed = false, 
  onToggle,
  priority = 'medium',
  timeframe,
  className = '' 
}: ActionItemProps) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isAnimating, setIsAnimating] = useState(false);
  const config = priorityConfigs[priority];

  const handleClick = () => {
    if (onToggle) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsCompleted(!isCompleted);
        onToggle(!isCompleted);
        setIsAnimating(false);
      }, 200);
    }
  };

  return (
    <div
      className={`
        group relative flex items-start gap-4 p-4 rounded-xl border
        transition-all duration-300 ease-out
        ${isCompleted 
          ? 'bg-green-500/10 border-green-500/30 opacity-75' 
          : `${config.bg} ${config.border} hover:bg-white/5`
        }
        ${onToggle ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${isAnimating ? 'scale-95' : ''}
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0 mt-0.5">
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-400 animate-scale-in" />
        ) : (
          <Circle className={`w-5 h-5 ${config.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0 space-y-1">
        <p 
          className={`
            text-sm leading-relaxed transition-all duration-300
            ${isCompleted 
              ? 'text-white/60 line-through' 
              : 'text-white/90'
            }
          `}
        >
          {text}
        </p>
        {timeframe && (
          <p className="text-xs text-white/50 font-medium">
            {timeframe}
          </p>
        )}
      </div>

      {/* Indicador de prioridade */}
      {!isCompleted && (
        <div className={`flex-shrink-0 w-2 h-2 rounded-full ${config.dot} mt-2 animate-pulse`} />
      )}

      {/* Efeito de brilho ao completar */}
      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent animate-fade-out pointer-events-none" />
      )}
    </div>
  );
}

