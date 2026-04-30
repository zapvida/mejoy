'use client';

import React, { useState, useEffect } from 'react';

type ProgressDonutProps = {
  percentage: number; // valor entre 0 e 100
  label?: string;
  size?: number; // tamanho opcional em pixels (padrão 120)
  strokeWidth?: number; // espessura da linha (padrão 8)
};

export default function ProgressDonut({
  percentage,
  label,
  size = 120,
  strokeWidth = 8,
}: ProgressDonutProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Valores fixos para evitar diferenças entre servidor e cliente
  const circumference = 326.73; // 2 * Math.PI * 52
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {mounted ? (
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx="60"
            cy="60"
            r="52"
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            stroke="#00D084"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray="326.73"
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
      ) : (
        <div 
          className="rotate-[-90deg] rounded-full border-2 border-white/20" 
          style={{ width: size, height: size }}
        />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{percentage}%</span>
        {label && (
          <span className="text-xs text-white/70 mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}