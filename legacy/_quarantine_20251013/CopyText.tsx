// src/components/ui/CopyText.tsx
// Componente para textos padronizados e consistentes

import React from 'react';
import { 
  getCopyByContext, 
  formatCopy, 
  getErrorCopy, 
  getValidationCopy,
  getFeedbackCopy,
  getLoadingCopy 
} from '@/lib/copy';

interface CopyTextProps {
  context: string;
  key: string;
  variables?: Record<string, any>;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children?: React.ReactNode;
}

export function CopyText({ 
  context, 
  key, 
  variables, 
  className = '',
  as: Component = 'span',
  children 
}: CopyTextProps) {
  const text = getCopyByContext(context, key);
  const formattedText = variables ? formatCopy(text, variables) : text;
  
  return (
    <Component className={className}>
      {children || formattedText}
    </Component>
  );
}

// Componentes específicos para diferentes contextos
export function HeroText({ className }: { className?: string }) {
  return (
    <div className={className}>
      <CopyText context="hero" key="title" as="h1" className="text-4xl font-bold mb-4" />
      <CopyText context="hero" key="subtitle" as="p" className="text-xl text-muted-foreground mb-6" />
    </div>
  );
}

export function CTAText({ ctaId, className }: { ctaId: string; className?: string }) {
  return (
    <CopyText 
      context="cta" 
      key={ctaId} 
      className={className}
    />
  );
}

export function LegalDisclaimer({ className }: { className?: string }) {
  return (
    <CopyText 
      context="legal" 
      key="disclaimer" 
      as="p" 
      className={`text-sm text-brand ${className}`}
    />
  );
}

export function FooterText({ className }: { className?: string }) {
  return (
    <CopyText 
      context="legal" 
      key="footer" 
      as="p" 
      className={`text-xs text-muted-foreground ${className}`}
    />
  );
}

export function ErrorText({ 
  errorType, 
  className 
}: { 
  errorType: string; 
  className?: string; 
}) {
  const text = getErrorCopy(errorType);
  return (
    <span className={`text-fg ${className}`}>
      {text}
    </span>
  );
}

export function ValidationText({ 
  validationType, 
  variables, 
  className 
}: { 
  validationType: string; 
  variables?: Record<string, any>; 
  className?: string; 
}) {
  const text = getValidationCopy(validationType, variables);
  return (
    <span className={`text-fg text-sm ${className}`}>
      {text}
    </span>
  );
}

export function FeedbackText({ 
  feedbackType, 
  className 
}: { 
  feedbackType: string; 
  className?: string; 
}) {
  const text = getFeedbackCopy(feedbackType);
  return (
    <span className={`text-sm ${className}`}>
      {text}
    </span>
  );
}

export function LoadingText({ 
  loadingType, 
  className 
}: { 
  loadingType: string; 
  className?: string; 
}) {
  const text = getLoadingCopy(loadingType);
  return (
    <span className={`text-sm text-muted-foreground ${className}`}>
      {text}
    </span>
  );
}

// Componente para progresso de triagem
export function TriageProgress({ 
  current, 
  total, 
  className 
}: { 
  current: number; 
  total: number; 
  className?: string; 
}) {
  const percentage = Math.round((current / total) * 100);
  const text = formatCopy(getCopyByContext('triage', 'progress'), {
    current,
    total,
    percentage
  });
  
  return (
    <span className={`text-sm text-muted-foreground ${className}`}>
      {text}
    </span>
  );
}

// Componente para mensagens de sucesso
export function SuccessText({ 
  successType, 
  className 
}: { 
  successType: string; 
  className?: string; 
}) {
  const text = getCopyByContext('success', successType);
  return (
    <span className={`text-brand text-sm ${className}`}>
      {text}
    </span>
  );
}

// Hook para usar cópias em componentes
export function useCopy() {
  return {
    getCopy: getCopyByContext,
    formatCopy,
    getErrorCopy,
    getValidationCopy,
    getFeedbackCopy,
    getLoadingCopy
  };
}
