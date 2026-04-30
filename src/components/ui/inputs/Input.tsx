'use client';

import { clsx } from 'clsx';
import React, { forwardRef } from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    const isDate = props.type === 'date';

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm sm:text-base font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          aria-label={label}
          aria-invalid={!!error}
          {...props}
          className={clsx(
            isDate
              ? 'bg-white text-gray-900 placeholder-gray-500 font-semibold'
              : 'bg-white text-gray-900 placeholder-gray-500',
            'w-full px-5 py-3.5 sm:py-4 rounded-2xl border shadow-md',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:text-gray-900 focus:scale-[1.02]',
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-200 hover:border-green-500',
            'transition-all duration-200',
            className
          )}
          style={{
            WebkitAppearance: isDate ? 'textfield' : undefined,
            appearance: isDate ? 'textfield' : undefined,
            colorScheme: 'light dark',
          }}
        />
        {error ? (
          <p className="text-xs sm:text-sm text-red-600">{error}</p>
        ) : (
          helperText && (
            <p className="text-xs sm:text-sm text-gray-500">{helperText}</p>
          )
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;