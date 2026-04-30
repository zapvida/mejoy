import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  children?: React.ReactNode;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, className, children }) => {
  return (
    <div className={`progress-bar ${className || ''}`}>
      <div 
        className="progress-fill" 
        style={{ width: `${(value / max) * 100}%` }}
      />
      {children}
    </div>
  );
};

export const CircularProgress: React.FC<{ value: number; max?: number; className?: string }> = ({ 
  value, 
  max = 100, 
  className 
}) => {
  return (
    <div className={`circular-progress ${className || ''}`}>
      <div className="circular-progress-fill" style={{ 
        transform: `rotate(${(value / max) * 360}deg)` 
      }} />
    </div>
  );
};

export const StepProgress: React.FC<{ 
  currentStep: number; 
  totalSteps: number; 
  className?: string 
}> = ({ currentStep, totalSteps, className }) => {
  return (
    <div className={`step-progress ${className || ''}`}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div 
          key={i}
          className={`step ${i < currentStep ? 'completed' : i === currentStep ? 'current' : 'pending'}`}
        />
      ))}
    </div>
  );
};
