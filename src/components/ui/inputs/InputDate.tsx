'use client';

import { clsx } from 'clsx';
import React from 'react';

type Props = {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (_value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  id: string;
};

function formatarData(valor: string): string {
  const apenasNumeros = valor.replace(/\D/g, '').slice(0, 8);
  if (apenasNumeros.length <= 2) return apenasNumeros;
  if (apenasNumeros.length <= 4)
    return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
  return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4)}`;
}

export default function InputDate({
  value,
  onChange,
  label,
  error,
  placeholder = 'dd/mm/aaaa',
  required,
  className = '',
  id,
}: Props) {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm sm:text-base font-medium text-white">
          {label}
        </label>
      )}
      <input
        id={id}
        name={id}
        value={value}
        onChange={event => onChange(formatarData(event.target.value))}
        required={required}
        placeholder={placeholder}
        inputMode="numeric"
        type="text"
        maxLength={10}
        className={clsx(
          'bg-white/10 text-white placeholder-white/50',
          'w-full px-4 py-3 sm:py-3.5 rounded-2xl border backdrop-blur-md',
          'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
          error
            ? 'border-fg focus:ring-fg focus:border-fg'
            : 'border-white/20 hover:border-white/50',
          'transition-all duration-200',
          className
        )}
      />
      {error && <p className="text-xs text-fg">{error}</p>}
    </div>
  );
}
