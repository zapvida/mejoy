// src/components/ui/ProgressBar.tsx
// Barra de progresso elegante e animada

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
};

const colorClasses = {
  primary: 'bg-green-500',
  secondary: 'bg-gray-500',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500'
};

export function ProgressBar({ 
  progress, 
  size = 'md', 
  color = 'primary',
  showPercentage = false,
  animated = true,
  className = ''
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`
            ${sizeClasses[size]} ${colorClasses[color]} rounded-full
            transition-all duration-500 ease-out
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ 
            width: `${clampedProgress}%`,
            transition: animated ? 'width 0.5s ease-out' : 'none'
          }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-right">
          <span className="text-sm text-gray-600 font-medium">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}

// Componente de progresso circular
interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  showPercentage?: boolean;
  className?: string;
}

export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#00D084',
  showPercentage = true,
  className = ''
}: CircularProgressProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-700">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}

// Componente de progresso com etapas
interface StepProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function StepProgress({ steps, currentStep, className = '' }: StepProgressProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Circle */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${isCurrent ? 'bg-blue-500 text-white' : ''}
                ${isUpcoming ? 'bg-gray-200 text-gray-500' : ''}
              `}>
                {isCompleted ? '✓' : index + 1}
              </div>
              
              {/* Label */}
              <div className="mt-2 text-center">
                <p className={`
                  text-xs font-medium
                  ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'}
                `}>
                  {step}
                </p>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`
                  absolute top-4 left-1/2 w-full h-0.5 -z-10
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                `} style={{ marginLeft: '1rem' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
