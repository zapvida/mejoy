// src/components/ui/LoadingSpinner.tsx
// Componente de loading elegante e moderno

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12'
};

const colorClasses = {
  primary: 'text-green-500',
  secondary: 'text-gray-500',
  white: 'text-white'
};

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-200 ${sizeClasses[size]} ${colorClasses[color]} border-t-transparent`}></div>
      {text && (
        <p className={`mt-2 text-sm ${colorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Componente de loading para páginas inteiras
export function PageLoader({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" text={text} />
        <p className="mt-4 text-gray-600">Por favor, aguarde...</p>
      </div>
    </div>
  );
}

// Componente de loading para botões
export function ButtonLoader({ 
  loading, 
  children, 
  className = '' 
}: { 
  loading: boolean; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" />
        </div>
      )}
      <div className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </div>
    </div>
  );
}
