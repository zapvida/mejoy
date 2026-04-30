'use client';

import { useEffect, useState } from 'react';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';

/**
 * Dispara zapfarm_lp_view no gtag com o tipo de LP alinhado à URL (/emagrecimento vs /obesidade).
 */
export function LandingPageViewTracker() {
  const page = useLandingPageKey();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (gtag) {
      gtag('event', 'zapfarm_lp_view', {
        page,
        lp_type: page,
        is_homepage: false,
      });
    }
  }, [mounted, page]);

  return null;
}
