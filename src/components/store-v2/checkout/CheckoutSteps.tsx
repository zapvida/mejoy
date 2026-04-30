'use client';

import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
  steps: { label: string }[];
}

export default function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto">
      {steps.map((s, i) => {
        const stepNum = i + 1;
        const isActive = currentStep === stepNum;
        const isCompleted = currentStep > stepNum;
        const isPending = currentStep < stepNum;

        return (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors
                  ${isActive ? 'bg-orange-500 text-white' : ''}
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isPending ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium hidden sm:block ${
                  isActive ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 border-t-2 border-dashed border-gray-300 mx-1 -mt-5"
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
