'use client';

import { useEffect, useState } from 'react';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { track } from '@/lib/analytics';

export function EmagrecimentoStickyCta() {
  const page = useLandingPageKey();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector<HTMLElement>('[data-testid="emagrecimento-hero"]');
      const stopSections = Array.from(document.querySelectorAll<HTMLElement>('[data-sticky-cta-stop]'));
      const stopSection = stopSections.at(-1);
      const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 760;
      const stopTop = stopSection ? stopSection.offsetTop : Number.POSITIVE_INFINITY;
      const scrolledPastHero = window.scrollY > Math.max(heroBottom - window.innerHeight + 120, 460);
      const shouldStayVisible = window.scrollY < stopTop - 140;

      setIsVisible(scrolledPastHero && shouldStayVisible);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-x-4 bottom-3 z-40 mx-auto w-[calc(100%-2rem)] max-w-[22rem] md:hidden"
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
        className="block w-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-800 px-5 py-3 text-center text-[14px] font-bold text-white shadow-[0_18px_45px_rgba(5,150,105,0.32)] transition-transform duration-200 hover:scale-[1.01]"
      >
        Fazer minha triagem
      </a>
    </div>
  );
}
