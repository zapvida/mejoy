'use client';

import classNames from 'classnames';
import { ButtonHTMLAttributes, ReactNode } from 'react';

import { useResponsive } from '@/hooks/useResponsive';

interface ResponsiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function ResponsiveButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ResponsiveButtonProps) {
  const { isMobile, isTablet } = useResponsive();

  const variantClasses = {
    primary: 'bg-brand text-white hover:bg-brand-600 focus:ring-brand',
    secondary: 'bg-muted text-muted-foreground hover:bg-muted/80 focus:ring-muted',
    outline: 'border border-border bg-transparent hover:bg-muted focus:ring-border',
    ghost: 'bg-transparent hover:bg-muted focus:ring-muted',
    destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base min-h-[44px]',
    lg: 'px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg min-h-[52px]',
    xl: 'px-8 py-4 sm:px-12 sm:py-6 text-lg sm:text-xl min-h-[60px]',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4 sm:w-5 sm:h-5',
    lg: 'w-5 h-5 sm:w-6 sm:h-6',
    xl: 'w-6 h-6 sm:w-7 sm:h-7',
  };

  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      data-device-type={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
      {...props}
    >
      {loading && (
        <div className={classNames('animate-spin rounded-full border-2 border-current border-t-transparent', iconSizeClasses[size])} />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className={iconSizeClasses[size]}>{icon}</span>
      )}
      
      <span className={isMobile ? 'text-sm' : 'text-base'}>{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className={iconSizeClasses[size]}>{icon}</span>
      )}
    </button>
  );
}
