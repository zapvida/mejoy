'use client';

import { useEffect, useRef, useState } from 'react';
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
  const visibleRef = useRef(false);

  useEffect(() => {
    const HYST = 110;
    let raf = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

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
      const next =
        (visibleRef.current ? y > revealBase - HYST : y > revealBase + HYST) &&
        (visibleRef.current ? y < stopGate + HYST : y < stopGate);

      if (next !== visibleRef.current) {
        visibleRef.current = next;
        setIsVisible(next);
      }
    };

    const scheduleUpdate = () => {
      if (raf !== 0) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        updateVisibility();
      });
    };

    const scheduleResize = () => {
      if (resizeTimer !== undefined) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeTimer = undefined;
        scheduleUpdate();
      }, 120);
    };

    updateVisibility();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleResize, { passive: true });
    const vv = window.visualViewport;
    /* Não escutar visualViewport "scroll": no iOS/Android isso dispara em paralelo ao scroll da página e
       altera getViewportHeight() a cada frame — pode alternar visibilidade do CTA e “brigar” com scroll anchoring. */
    vv?.addEventListener('resize', scheduleResize, { passive: true } as AddEventListenerOptions);
    return () => {
      if (resizeTimer !== undefined) clearTimeout(resizeTimer);
      if (raf !== 0) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleResize);
      vv?.removeEventListener('resize', scheduleResize);
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
