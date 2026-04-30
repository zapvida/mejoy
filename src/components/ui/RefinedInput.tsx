/**
 * Input Refinado - Design System
 * Inspirado em: Linear, Vercel, Stripe
 * 
 * Input moderno usando design tokens para consistência visual
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface RefinedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const RefinedInput = forwardRef<HTMLInputElement, RefinedInputProps>(
  (
    {
      className = '',
      label,
      error,
      helperText,
      icon,
      iconPosition = 'left',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-label={label}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              // Base styles usando design tokens
              'w-full h-11 px-4',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              'bg-zinc-50 border-2 rounded-lg',
              'text-foreground placeholder:text-muted-foreground',
              'transition-all duration-200',
              // Focus states
              'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
              // Error states
              error
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                : 'border-zinc-200 hover:border-zinc-300',
              // Custom className
              className
            )}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              {icon}
            </div>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        ) : (
          helperText && (
            <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
              {helperText}
            </p>
          )
        )}
      </div>
    );
  }
);

RefinedInput.displayName = 'RefinedInput';

export default RefinedInput;
