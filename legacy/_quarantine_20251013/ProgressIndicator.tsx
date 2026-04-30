// src/components/ui/ProgressIndicator.tsx
// Componente de progresso visível para triagens

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  title?: string;
  className?: string;
}

export function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  title,
  className 
}: ProgressIndicatorProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className={cn("w-full", className)}>
      {title && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <span className="text-sm text-muted-foreground">
            Etapa {currentStep}/{totalSteps} · {percentage}%
          </span>
        </div>
      )}
      
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-brand h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">Início</span>
        <span className="text-xs text-muted-foreground">Concluído</span>
      </div>
    </div>
  );
}

// Componente de progresso circular para mobile
interface CircularProgressProps {
  currentStep: number;
  totalSteps: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CircularProgress({ 
  currentStep, 
  totalSteps, 
  size = 'md',
  className 
}: CircularProgressProps) {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const percentage = Math.round((currentStep / totalSteps) * 100);
  
  // Valores fixos para evitar diferenças entre servidor e cliente
  const radius = size === 'sm' ? 20 : size === 'md' ? 30 : 40;
  const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 5;
  const circumference = size === 'sm' ? 125.66 : size === 'md' ? 188.5 : 251.33;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };
  
  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {mounted ? (
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-muted-foreground"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-brand transition-all duration-300 ease-out"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <div className="w-full h-full transform -rotate-90 rounded-full border-2 border-muted-foreground" />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          "font-semibold text-brand",
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        )}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}
