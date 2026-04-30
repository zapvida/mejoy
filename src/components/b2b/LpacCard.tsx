import { cn } from '@/lib/utils';
import React from 'react';

type Variant =
  | 'emerald'
  | 'blue'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'indigo'
  | 'cyan'
  | 'orange';

type Size = 'stat' | 'tile' | 'panel';
// stat = cards de métricas do Hero (compactos, alinhados)
// tile = cards pequenos (benefits/integrations)
// panel = cards maiores (steps/cases)

const VAR_TO_CLASS: Record<Variant, string> = {
  emerald: 'lpac-gcard-emerald',
  blue: 'lpac-gcard-blue',
  violet: 'lpac-gcard-violet',
  rose: 'lpac-gcard-rose',
  amber: 'lpac-gcard-amber',
  indigo: 'lpac-gcard-indigo',
  cyan: 'lpac-gcard-cyan',
  orange: 'lpac-gcard-orange',
};

const SIZE_TO_CLASS: Record<Size, string> = {
  stat: 'min-h-[112px] sm:min-h-[120px] px-4 py-4 sm:px-5 sm:py-5',
  tile: 'min-h-[84px] sm:min-h-[96px] px-4 py-3 sm:px-5 sm:py-4',
  panel: 'min-h-[160px] sm:min-h-[176px] px-5 py-5 sm:px-6 sm:py-6',
};

type Props = {
  variant: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export default function LpacCard({ variant, size = 'tile', className, children }: Props) {
  return (
    <div
      className={cn(
        'lpac-gcard rounded-2xl shadow-lpac ring-1 ring-black/5 overflow-hidden relative isolate lpac-hover',
        VAR_TO_CLASS[variant],
        SIZE_TO_CLASS[size],
        'flex items-center', // baseline vertical
        className
      )}
      role="region"
      aria-label={`Card com gradiente ${variant}`}
    >
      {/* Brilho sutil */}
      <div className="pointer-events-none absolute inset-0 bg-white/6 mix-blend-soft-light" />
      {children}
    </div>
  );
}
