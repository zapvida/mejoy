'use client';

import { useEffect, useState } from 'react';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { track } from '@/lib/analytics';

export function EmagrecimentoStickyCta() {
  const page = useLandingPageKey();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const resultsSection = document.querySelector<HTMLElement>('[data-testid="emagrecimento-results"]');
      const resultsTop = resultsSection ? resultsSection.offsetTop : Number.POSITIVE_INFINITY;
      const shouldStayVisible = window.scrollY < resultsTop - 120;

      setIsVisible(window.scrollY > 720 && shouldStayVisible);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-x-4 bottom-3 z-40 mx-auto w-[calc(100%-2rem)] max-w-sm md:hidden"
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
        className="block w-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-800 px-5 py-3.5 text-center text-[15px] font-bold text-white shadow-[0_18px_45px_rgba(5,150,105,0.32)] transition-transform duration-200 hover:scale-[1.01]"
      >
        Fazer minha triagem agora
      </a>
    </div>
  );
}
