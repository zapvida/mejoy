/**
 * Empty State Refinado - Design System
 * 
 * Componente de estado vazio elegante usando design tokens
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { RefinedButton } from './RefinedButton';

export interface RefinedEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function RefinedEmptyState({
  title = 'Nenhum resultado encontrado',
  description = 'Não encontramos o que você está procurando. Tente ajustar seus filtros ou buscar novamente.',
  actionLabel,
  actionHref,
  actionOnClick,
  icon,
  className,
}: RefinedEmptyStateProps) {
  const defaultIcon = (
    <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-zinc-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4',
        className
      )}
    >
      {icon || defaultIcon}

      <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
      )}

      {(actionLabel && (actionHref || actionOnClick)) && (
        <RefinedButton
          variant="primary"
          size="md"
          onClick={actionOnClick}
          {...(actionHref ? { asChild: true } : {})}
        >
          {actionHref ? (
            <a href={actionHref}>{actionLabel}</a>
          ) : (
            actionLabel
          )}
        </RefinedButton>
      )}
    </div>
  );
}

