// src/hooks/useGA4.ts
// Hook para inicializar e gerenciar GA4

import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { 
  persistInitialUTMs, 
  trackReportView,
  trackTriageStart,
  track
} from '@/lib/ga4';
import { env } from '@/lib/env';

export function useGA4() {
  const router = useRouter();

  useEffect(() => {
    // Inicializar GA4 apenas no cliente
    if (typeof window !== 'undefined') {
      persistInitialUTMs();
    }
  }, []);

  // Trackear mudanças de página
  useEffect(() => {
    if (env.NEXT_PUBLIC_GTM_ID) return undefined;

    const handleRouteChange = (url: string) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID, {
          page_path: url,
          page_title: document.title
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return {
    trackReportView,
    trackTriageEvent: trackTriageStart,
    trackEvent: track
  };
}

// Hook específico para triagens
export function useTriageTracking(triageType: string, _totalSteps: number) {
  const { trackTriageEvent } = useGA4();

  const trackStep = (_step: number, _additionalData?: Record<string, any>) => {
    trackTriageEvent(triageType);
  };

  return { trackStep };
}

// Hook específico para relatórios
export function useReportTracking(triageType: string, reportId: string) {
  const { trackReportView } = useGA4();

  useEffect(() => {
    trackReportView(reportId);
  }, [triageType, reportId, trackReportView]);

  return { trackReportView };
}
