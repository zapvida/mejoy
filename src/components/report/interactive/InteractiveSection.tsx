// src/components/report/interactive/InteractiveSection.tsx
// Seção interativa com animações e efeitos visuais

'use client';

import { useEffect, useState, ReactNode } from 'react';

interface InteractiveSectionProps {
  title: string;
  icon?: string;
  description?: string;
  eyebrow?: string;
  children: ReactNode;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const variantConfigs = {
  default: {
    bg: 'from-slate-900/60 via-slate-900/40 to-slate-900/70',
    border: 'border-white/10',
  },
  highlight: {
    bg: 'from-purple-900/60 via-purple-900/40 to-purple-900/70',
    border: 'border-purple-500/30',
  },
  warning: {
    bg: 'from-orange-900/60 via-orange-900/40 to-orange-900/70',
    border: 'border-orange-500/30',
  },
  success: {
    bg: 'from-green-900/60 via-green-900/40 to-green-900/70',
    border: 'border-green-500/30',
  },
};

export function InteractiveSection({
  title,
  icon,
  description,
  eyebrow,
  children,
  variant = 'default',
  className = '',
  collapsible = false,
  defaultExpanded = true,
}: InteractiveSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const config = variantConfigs[variant];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      className={`
        relative overflow-hidden rounded-3xl border backdrop-blur-xl
        bg-gradient-to-br ${config.bg} ${config.border}
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        hover:shadow-2xl hover:scale-[1.01]
        ${className}
      `}
    >
      {/* Efeito de brilho sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header */}
      <header 
        className={`
          relative p-6 border-b ${config.border}
          ${collapsible ? 'cursor-pointer' : ''}
        `}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40 mb-2">
                {eyebrow}
              </p>
            )}
            <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-3">
              {icon && <span className="text-2xl sm:text-3xl">{icon}</span>}
              <span>{title}</span>
            </h2>
            {description && (
              <p className="text-sm text-white/70 mt-2 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {collapsible && (
            <button
              className={`
                flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                bg-white/10 hover:bg-white/20 transition-all duration-200
                ${isExpanded ? 'rotate-180' : ''}
              `}
            >
              <span className="text-white/80">▼</span>
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <div
        className={`
          transition-all duration-500 ease-out overflow-hidden
          ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="p-6">
          {children}
        </div>
      </div>
    </section>
  );
}

