'use client';

import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { track } from '@/lib/analytics';

export function EmagrecimentoStickyCta() {
  const page = useLandingPageKey();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-emerald-700 to-emerald-800 p-3.5 sm:p-4 shadow-2xl md:hidden">
      <a
        href="/triagem/emagrecimento"
        onClick={() =>
          track('sticky_cta_click', {
            page,
            position: 'sticky_mobile',
            section: 'sticky_bar',
          })
        }
        className="block w-full text-center rounded-full bg-white text-emerald-700 font-bold py-2.5 sm:py-3 px-4 sm:px-6 hover:bg-emerald-50 transition-colors text-sm sm:text-base"
      >
        Começar minha triagem agora →
      </a>
    </div>
  );
}
