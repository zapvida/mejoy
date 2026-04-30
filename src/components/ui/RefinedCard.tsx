/**
 * Card Refinado - Design System
 * Inspirado em: Linear, Vercel, Stripe
 * 
 * Card moderno usando design tokens para consistência visual
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface RefinedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'subtle';
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const roundedClasses = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-[2rem]',
};

const variantClasses = {
  default: 'bg-white border border-zinc-200',
  elevated: 'bg-white border border-zinc-200 shadow-md',
  outlined: 'bg-transparent border-2 border-zinc-200',
  subtle: 'bg-zinc-50 border border-zinc-100',
};

export function RefinedCard({
  children,
  className = '',
  hover = false,
  padding = 'md',
  shadow = 'sm',
  border = true,
  rounded = 'xl',
  onClick,
  variant = 'default',
}: RefinedCardProps) {
  return (
    <div
      className={cn(
        // Base styles usando design tokens
        variantClasses[variant],
        roundedClasses[rounded],
        paddingClasses[padding],
        shadow !== 'none' && shadowClasses[shadow],
        // Hover effects
        hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-brand-300',
        onClick && 'cursor-pointer',
        // Custom className
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

