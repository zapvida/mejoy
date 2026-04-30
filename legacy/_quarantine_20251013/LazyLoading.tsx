'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { Loading } from '@/components/ui/feedback';

export function withLazyLoading<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <Loading />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Componentes lazy específicos
export const LazyMedicalChat = withLazyLoading(
  () => import('@/components/relatorio/MedicalChat'),
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-alloe-500"></div>
    <span className="ml-2 text-white/70">Carregando chat médico...</span>
  </div>
);
