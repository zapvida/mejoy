'use client';

import { clsx } from 'clsx';
import React, { forwardRef } from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, helperText, children, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm sm:text-base font-medium text-white"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          aria-label={label}
          aria-invalid={!!error}
          className={clsx(
            'w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-white/10 border backdrop-blur-md',
            'text-white placeholder-white/50 text-sm sm:text-base',
            'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
            error
              ? 'border-fg focus:ring-fg focus:border-fg'
              : 'border-white/20 hover:border-white/50',
            'transition-all duration-200',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <p className="text-xs sm:text-sm text-fg">{error}</p>
        ) : (
          helperText && (
            <p className="text-xs sm:text-sm text-white/50">{helperText}</p>
          )
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;