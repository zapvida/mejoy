// src/components/ui/Card.tsx
// Componentes de card elegantes e modernos

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

const shadowClasses = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
};

const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl'
};

export function Card({ 
  children, 
  className = '',
  hover = false,
  padding = 'md',
  shadow = 'md',
  border = true,
  rounded = 'lg',
  onClick
}: CardProps) {
  return (
    <div 
      className={`
        bg-white
        ${border ? 'border border-gray-200' : ''}
        ${roundedClasses[rounded]}
        ${shadowClasses[shadow]}
        ${paddingClasses[padding]}
        ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Card específico para triagens
interface TriageCardProps {
  title: string;
  description: string;
  emoji?: string;
  onClick?: () => void;
  isFree?: boolean; // Nova prop para badge GRATUITA
  isSelected?: boolean;
  isCompleted?: boolean;
  className?: string;
}

export function TriageCard({
  title,
  description,
  emoji,
  onClick,
  isFree = false, // Nova prop para badge GRATUITA
  isSelected = false,
  isCompleted = false,
  className = ''
}: TriageCardProps) {
  return (
    <Card
      className={`
        cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-2 ring-green-500 bg-green-50' : ''}
        ${isCompleted ? 'bg-green-50 border-green-200' : ''}
        hover:shadow-lg hover:scale-105
        ${className}
      `}
      {...(onClick ? { onClick } : {})}
      hover
    >
      <div className="flex items-start space-x-4">
        {emoji && (
          <div className="text-2xl flex-shrink-0">
            {emoji}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            {isFree && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full ml-2 flex-shrink-0">
                GRATUITA
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
          {isCompleted && (
            <div className="mt-3 flex items-center text-green-600">
              <span className="text-sm font-medium">✓ Concluída</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Card para resultados de triagem
interface ResultCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: 'green' | 'yellow' | 'red' | 'blue';
  className?: string;
}

export function ResultCard({
  title,
  value,
  unit,
  description,
  trend,
  color = 'blue',
  className = ''
}: ResultCardProps) {
  const colorClasses = {
    green: 'text-green-600 bg-green-50 border-green-200',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    blue: 'text-blue-600 bg-blue-50 border-blue-200'
  };

  const trendIcons = {
    up: '↗️',
    down: '↘️',
    stable: '→'
  };

  return (
    <Card className={`${colorClasses[color]} ${className}`}>
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-600 mb-2">
          {title}
        </h4>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl font-bold">
            {value}
          </span>
          {unit && (
            <span className="text-sm text-gray-500">
              {unit}
            </span>
          )}
          {trend && (
            <span className="text-lg">
              {trendIcons[trend]}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-2">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}

// Card para estatísticas
interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export function StatCard({
  icon,
  title,
  value,
  change,
  changeType = 'neutral',
  className = ''
}: StatCardProps) {
  const changeClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <Card className={className}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">{icon}</span>
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">
            {title}
          </p>
          <div className="flex items-center">
            <p className="text-lg font-semibold text-gray-900">
              {value}
            </p>
            {change && (
              <span className={`ml-2 text-sm ${changeClasses[changeType]}`}>
                {change}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}