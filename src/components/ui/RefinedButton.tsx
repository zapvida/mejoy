/**
 * Button Refinado - Design System
 * Inspirado em: Linear, Vercel, Stripe
 * 
 * Botão moderno usando design tokens para consistência visual
 */

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface RefinedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-brand-500 text-white shadow-brand-sm hover:bg-brand-600 hover:shadow-brand-md active:bg-brand-700',
  secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300',
  outline: 'bg-transparent border-2 border-brand-500 text-brand-600 hover:bg-brand-50 active:bg-brand-100',
  ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
};

const sizeClasses = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-12 px-8 text-lg',
};

export const RefinedButton = React.forwardRef<HTMLButtonElement, RefinedButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 font-semibold',
          'rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Variants
          variantClasses[variant],
          // Sizes
          sizeClasses[size],
          // States
          !disabled && !loading && 'hover:-translate-y-0.5 active:translate-y-0',
          // Full width
          fullWidth && 'w-full',
          // Loading state
          loading && 'cursor-wait',
          // Custom className
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Carregando...
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

RefinedButton.displayName = 'RefinedButton';

