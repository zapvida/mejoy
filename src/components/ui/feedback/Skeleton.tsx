'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  delay?: number;
}

export default function Skeleton({
  className = '',
  width = '100%',
  height = '1rem',
  radius = '0.75rem',
  delay = 0,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-muted via-muted to-muted',
        'animate-pulse rounded-xl',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
        animationDelay: `${delay}ms`,
      }}
    />
  );
}