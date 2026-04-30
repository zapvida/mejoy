/**
 * Skeleton Loader - Design System
 * 
 * Componente de loading elegante usando design tokens
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({
  variant = 'rectangular',
  width,
  height,
  className,
  ...props
}: SkeletonProps) {
  const baseClasses = 'skeleton bg-zinc-200 animate-pulse';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      {...props}
    />
  );
}

// Skeleton específicos para componentes comuns
export function SkeletonCard() {
  return (
    <div className="card-refined p-6 space-y-4">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
    </div>
  );
}

export function SkeletonButton() {
  return <Skeleton variant="rectangular" width={120} height={44} className="rounded-lg" />;
}

export function SkeletonInput() {
  return (
    <div className="space-y-2">
      <Skeleton variant="text" width="30%" height={16} />
      <Skeleton variant="rectangular" width="100%" height={44} className="rounded-lg" />
    </div>
  );
}

