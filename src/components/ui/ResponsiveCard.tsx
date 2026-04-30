'use client';

import classNames from 'classnames';
import { ReactNode } from 'react';

import { useResponsive } from '@/hooks/useResponsive';

interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export default function ResponsiveCard({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = true,
  clickable = false,
  onClick,
}: ResponsiveCardProps) {
  const { isMobile, isTablet } = useResponsive();

  const variantClasses = {
    default: 'bg-background border border-border',
    elevated: 'bg-background shadow-lg border border-border/50',
    outlined: 'bg-transparent border-2 border-border',
    filled: 'bg-muted border border-border',
  };

  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-12',
  };

  const hoverClasses = hover
    ? 'transition-all duration-300 hover:shadow-lg hover:border-brand/50 hover:-translate-y-1'
    : '';

  const clickableClasses = clickable
    ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2'
    : '';

  return (
    <div
      className={classNames(
        'rounded-xl',
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        clickableClasses,
        className
      )}
      onClick={onClick}
      data-device-type={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
    >
      {children}
    </div>
  );
}
