// src/components/ui/EnhancedInput.tsx
// Inputs otimizados para triagens com teclado numérico e validação
// Refinado com design system

import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  inputMode?: 'numeric' | 'decimal' | 'tel' | 'email' | 'text';
  showNumericKeypad?: boolean;
  placeholder?: string;
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    inputMode = 'text',
    showNumericKeypad = false,
    placeholder,
    className,
    id,
    ...props 
  }, ref) => {
    const inputModeValue = showNumericKeypad ? 'numeric' : inputMode;
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
        
        <input
          ref={ref}
          id={inputId}
          inputMode={inputModeValue}
          placeholder={placeholder}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={cn(
            // Base styles usando design tokens
            "w-full h-11 px-4",
            "bg-zinc-50 border-2 rounded-lg",
            "text-foreground placeholder:text-muted-foreground",
            "transition-all duration-200",
            "text-base", // Evita zoom no iOS
            // Focus states
            "focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
            // Error states
            error
              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
              : "border-zinc-200 hover:border-zinc-300",
            className
          )}
          {...props}
        />
        
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
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

EnhancedInput.displayName = 'EnhancedInput';

// Componente específico para peso/altura/idade
interface NumericInputProps extends Omit<EnhancedInputProps, 'inputMode' | 'showNumericKeypad'> {
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ unit, min, max, step, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <EnhancedInput
          ref={ref}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          className={cn(unit && "pr-12", className)}
          {...props}
        />
        {unit && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium pointer-events-none">
            {unit}
          </div>
        )}
      </div>
    );
  }
);

NumericInput.displayName = 'NumericInput';

// Componente para escalas (PHQ-9, GAD-7, etc.)
interface ScaleButtonProps {
  value: number;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export function ScaleButton({ value, label, isSelected, onClick, className }: ScaleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200",
        "hover:scale-105 active:scale-95",
        isSelected 
          ? "border-brand-500 bg-brand-50 text-brand-600 shadow-sm" 
          : "border-zinc-200 bg-white text-foreground hover:border-zinc-300 hover:bg-zinc-50",
        className
      )}
    >
      <span className="text-2xl font-bold mb-1">{value}</span>
      <span className="text-xs text-center leading-tight">{label}</span>
    </button>
  );
}

// Componente para escalas completas
interface ScaleSelectorProps {
  scale: Array<{ value: number; label: string }>;
  selectedValue?: number;
  // eslint-disable-next-line no-unused-vars
  onSelect: (_value: number) => void;
  title?: string;
  description?: string;
}

export function ScaleSelector({ 
  scale, 
  selectedValue, 
  onSelect, 
  title,
  description 
}: ScaleSelectorProps) {
  return (
    <div className="space-y-4">
      {title && (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {scale.map((item) => (
          <ScaleButton
            key={item.value}
            value={item.value}
            label={item.label}
            isSelected={selectedValue === item.value}
            onClick={() => onSelect(item.value)}
          />
        ))}
      </div>
    </div>
  );
}
