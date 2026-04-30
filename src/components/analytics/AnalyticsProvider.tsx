// src/components/analytics/AnalyticsProvider.tsx
// Componente unificado para todos os analytics

import { Analytics } from '@vercel/analytics/react';

import { GA } from './GA';

export function AnalyticsProvider() {
  const shouldEnableVercelAnalytics =
    process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === '1' ||
    Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV);

  return (
    <>
      <GA />
      {shouldEnableVercelAnalytics && <Analytics />}
    </>
  );
}
