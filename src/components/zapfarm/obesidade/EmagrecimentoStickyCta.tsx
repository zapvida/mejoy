'use client';

import { useEffect, useRef, useState } from 'react';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { track } from '@/lib/analytics';

/** Abaixo do header fixo (~h-14 / 60px): sentinela só conta como “passou” quando entra nessa margem. */
const HERO_IO_ROOT_MARGIN = '-72px 0px 0px 0px';

/** Evita “tremor”: não alterna visibilidade mais de uma vez neste intervalo. */
const VISIBILITY_DEBOUNCE_MS = 180;

/**
 * CTA fixo no mobile: visível depois do hero, oculto perto do fim da página.
 * IntersectionObserver na sentinela do hero (evita loop quando altura muda com fonte/imagem).
 * Zona final via último [data-sticky-cta-stop] + histerese em getBoundingClientRect.
 */
export function EmagrecimentoStickyCta() {
  const page = useLandingPageKey();
  const [isVisible, setIsVisible] = useState(false);
  const visibleRef = useRef(false);
  const pastHeroRef = useRef(false);
  const rafStop = useRef(0);
  const pendingVisibleRef = useRef<boolean | null>(null);

  useEffect(() => {
    let debounceTimer: number | undefined;
    const sentinel = document.querySelector<HTMLElement>('[data-sticky-hero-sentinel]');
    if (!sentinel) return undefined;

    const readBeforeStop = (): boolean => {
      const stops = document.querySelectorAll<HTMLElement>('[data-sticky-cta-stop]');
      const last = stops[stops.length - 1];
      if (!last) return true;
      const top = last.getBoundingClientRect().top;
      const h = window.innerHeight;
      /** Faixa fixa (sem alternar limiar com visibleRef) reduz oscilação no scroll. */
      const hideWhenTopAbove = h - 88;
      return top > hideWhenTopAbove;
    };

    function applyVisibility(next: boolean) {
      if (next === visibleRef.current) return;
      if (pendingVisibleRef.current === next) return;
      pendingVisibleRef.current = next;
      if (debounceTimer !== undefined) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = window.setTimeout(() => {
        debounceTimer = undefined;
        pendingVisibleRef.current = null;
        const latest = next;
        if (latest === visibleRef.current) return;
        visibleRef.current = latest;
        setIsVisible(latest);
      }, VISIBILITY_DEBOUNCE_MS);
    }

    function syncVisibility() {
      if (window.innerWidth >= 768) {
        if (visibleRef.current) {
          visibleRef.current = false;
          setIsVisible(false);
        }
        return;
      }
      const beforeStop = readBeforeStop();
      const next = pastHeroRef.current && beforeStop;
      applyVisibility(next);
    }

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHeroRef.current = !entry.isIntersecting;
        syncVisibility();
      },
      { root: null, rootMargin: HERO_IO_ROOT_MARGIN, threshold: 0 }
    );
    heroObserver.observe(sentinel);

    const scheduleStopCheck = () => {
      if (rafStop.current !== 0) return;
      rafStop.current = requestAnimationFrame(() => {
        rafStop.current = 0;
        syncVisibility();
      });
    };

    let resizeTimer: number | undefined;
    const onResizeDebounced = () => {
      if (resizeTimer !== undefined) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeTimer = undefined;
        syncVisibility();
      }, 280);
    };

    syncVisibility();
    window.addEventListener('scroll', scheduleStopCheck, { passive: true });
    window.addEventListener('resize', onResizeDebounced, { passive: true });

    return () => {
      if (resizeTimer !== undefined) clearTimeout(resizeTimer);
      if (debounceTimer !== undefined) clearTimeout(debounceTimer);
      heroObserver.disconnect();
      window.removeEventListener('scroll', scheduleStopCheck);
      window.removeEventListener('resize', onResizeDebounced);
      if (rafStop.current !== 0) cancelAnimationFrame(rafStop.current);
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
