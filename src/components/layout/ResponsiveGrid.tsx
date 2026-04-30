'use client';

import classNames from 'classnames';
import { ReactNode } from 'react';

import { useResponsive } from '@/hooks/useResponsive';

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  autoFit?: boolean;
  minWidth?: string;
}

export default function ResponsiveGrid({
  children,
  className = '',
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
  autoFit = false,
  minWidth = '280px',
}: ResponsiveGridProps) {
  const { breakpoint } = useResponsive();

  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-12',
  };

  const getGridCols = () => {
    if (autoFit) {
      return `grid-cols-[repeat(auto-fit,minmax(${minWidth},1fr))]`;
    }

    const colClasses = [];
    if (cols.xs) colClasses.push(`grid-cols-${cols.xs}`);
    if (cols.sm) colClasses.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) colClasses.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) colClasses.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) colClasses.push(`xl:grid-cols-${cols.xl}`);
    if (cols['2xl']) colClasses.push(`2xl:grid-cols-${cols['2xl']}`);

    return colClasses.join(' ');
  };

  return (
    <div
      className={classNames(
        'grid',
        getGridCols(),
        gapClasses[gap],
        className
      )}
      data-breakpoint={breakpoint}
    >
      {children}
    </div>
  );
}
