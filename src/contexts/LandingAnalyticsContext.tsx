'use client';

import { createContext, useContext, type ReactNode } from 'react';

export type LandingPageKey = 'home' | 'obesidade' | 'emagrecimento';

const LandingAnalyticsContext = createContext<LandingPageKey>('home');

export function LandingAnalyticsProvider({
  page,
  children,
}: {
  page: LandingPageKey;
  children: ReactNode;
}) {
  return (
    <LandingAnalyticsContext.Provider value={page}>{children}</LandingAnalyticsContext.Provider>
  );
}

export function useLandingPageKey(): LandingPageKey {
  return useContext(LandingAnalyticsContext);
}
