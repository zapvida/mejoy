// src/components/analytics/GoogleAnalytics.tsx
// Componente para inicializar GA4

import { useEffect } from 'react';
import { initGA4 } from '@/lib/ga4';

export default function GoogleAnalytics() {
  useEffect(() => {
    initGA4();
  }, []);

  return null;
}
