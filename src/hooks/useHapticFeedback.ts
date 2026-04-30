import { useCallback } from 'react';

import { trackHapticFeedback } from '@/lib/analytics/nav';

// Tipos de feedback háptico
export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

// Padrões de vibração para diferentes tipos
const HAPTIC_PATTERNS: Record<HapticType, number[]> = {
  light: [10],
  medium: [50],
  heavy: [100],
  success: [50, 50, 50],
  warning: [100, 50, 100],
  error: [200, 100, 200]
};

export function useHapticFeedback() {
  const trigger = useCallback((type: HapticType = 'medium') => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const pattern = HAPTIC_PATTERNS[type];
      navigator.vibrate(pattern);
      trackHapticFeedback();
      return true;
    }
    return false;
  }, []);

  return { trigger };
}

// Hook para detectar capacidades do dispositivo
export function useDeviceCapabilities() {
  const capabilities = {
    haptic: typeof navigator !== 'undefined' && 'vibrate' in navigator,
    touch: typeof window !== 'undefined' && 'ontouchstart' in window,
    pwa: typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches,
    ios: typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent),
    android: typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent)
  };

  return capabilities;
}

// Hook para melhorar a experiência de scroll em mobile
export function useSmoothScroll() {
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({ top: 0, behavior });
  }, []);

  const scrollToElement = useCallback((elementId: string, behavior: ScrollBehavior = 'smooth') => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior, block: 'start' });
    }
  }, []);

  return { scrollToTop, scrollToElement };
}
