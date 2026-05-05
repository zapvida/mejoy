'use client';

import { useEffect, useState } from 'react';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { track } from '@/lib/analytics';

/** Altura estável ao rolar mobile (Safari/Chrome escondendo barra altera innerHeight sem “scroll” perceptível). */
function getViewportHeight(): number {
  if (typeof window === 'undefined') return 0;
  const vv = window.visualViewport;
  return Math.round(vv?.height ?? window.innerHeight ?? 0);
}

export function EmagrecimentoStickyCta() {
  const page = useLandingPageKey();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const HYST = 80;
    let raf = 0;

    const updateVisibility = () => {
      const heroSection = document.querySelector<HTMLElement>('[data-testid="emagrecimento-hero"]');
      const stopSections = Array.from(document.querySelectorAll<HTMLElement>('[data-sticky-cta-stop]'));
      const stopSection = stopSections.at(-1);
      const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 760;
      const stopTop = stopSection ? stopSection.offsetTop : Number.POSITIVE_INFINITY;
      const viewportH = getViewportHeight() || window.innerHeight;
      const mobileRevealOffset = window.innerWidth < 768 ? 260 : -120;
      const revealBase = Math.max(heroBottom - viewportH - mobileRevealOffset, 460);
      const y = window.scrollY;

      const stopGate = stopTop - 140;
      setIsVisible((prev) => {
        const scrolledPastHero = prev ? y > revealBase - HYST : y > revealBase + HYST;
        const stillInRange = prev ? y < stopGate + HYST : y < stopGate;
        return scrolledPastHero && stillInRange;
      });
    };

    const scheduleUpdate = () => {
      if (raf !== 0) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        updateVisibility();
      });
    };

    updateVisibility();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    const vv = window.visualViewport;
    vv?.addEventListener('resize', scheduleUpdate, { passive: true } as AddEventListenerOptions);
    vv?.addEventListener('scroll', scheduleUpdate, { passive: true } as AddEventListenerOptions);
    return () => {
      if (raf !== 0) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      vv?.removeEventListener('resize', scheduleUpdate);
      vv?.removeEventListener('scroll', scheduleUpdate);
    };
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
