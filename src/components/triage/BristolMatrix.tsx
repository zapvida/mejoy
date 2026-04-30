import React from 'react';

import { cn } from '@/lib/utils';

interface BristolMatrixProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const bristolOptions = [
  { value: '1', icon: '💩', label: 'Muito duras', description: 'Constipação grave' },
  { value: '2', icon: '💩', label: 'Duras', description: 'Com rachaduras' },
  { value: '3', icon: '💩', label: 'Salsicha com rachaduras', description: 'Forma irregular' },
  { value: '4', icon: '💩', label: 'Liso, macio', description: 'Ideal' },
  { value: '5', icon: '💩', label: 'Moles/irregulares', description: 'Diarreia leve' },
];

export default function BristolMatrix({ value, onChange, disabled = false }: BristolMatrixProps) {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
        {bristolOptions.map((option) => {
          const isSelected = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => !disabled && onChange(option.value)}
              disabled={disabled}
              className={cn(
                "group relative rounded-2xl border-2 p-4 text-center transition-all duration-300 transform hover:scale-105",
                "flex flex-col items-center gap-2 min-h-[120px]",
                isSelected
                  ? "border-green-400 bg-gradient-to-br from-green-100 to-emerald-100 text-green-800 shadow-xl ring-4 ring-green-200"
                  : "border-green-200 bg-gradient-to-br from-white to-green-50/50 text-gray-700 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50",
                disabled && "opacity-50 cursor-not-allowed hover:scale-100"
              )}
              aria-label={`Escala de Bristol ${option.value}: ${option.label}`}
            >
              <span className="text-3xl">{option.icon}</span>
              <div className="space-y-1">
                <div className="text-lg font-bold">{option.value}</div>
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
              </div>
              
              {isSelected && (
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-sm font-bold shadow-lg">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          💡 <strong>Dica:</strong> Escolha o número que melhor representa suas fezes normalmente
        </p>
      </div>
    </div>
  );
}
