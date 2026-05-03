'use client';

import { useEffect, useState } from 'react';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { track } from '@/lib/analytics';

export function EmagrecimentoStickyCta() {
  const page = useLandingPageKey();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 560);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-3 left-3 right-3 z-40 rounded-[28px] bg-gradient-to-r from-emerald-700 to-emerald-800 p-3 shadow-2xl md:hidden"
      data-testid="home-medvi-sticky-cta"
    >
      <a
        href="/triagem/emagrecimento"
        onClick={() =>
          track('sticky_cta_click', {
            page,
            position: 'sticky_mobile',
            section: 'sticky_bar',
          })
        }
        data-testid="home-sticky-cta-link"
        className="block w-full rounded-full bg-white px-4 py-3 text-center text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
      >
        Fazer minha triagem agora
      </a>
    </div>
  );
}
