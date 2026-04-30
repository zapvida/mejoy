import { useEffect, useState } from "react";

export function useIsMobile(bp = 768) {
  const [isMobile, set] = useState(false);
  
  useEffect(() => {
    const fn = () => set(window.innerWidth < bp);
    fn(); 
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  
  return isMobile;
}

// Hook para detectar se está em modo PWA
export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);
  
  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
      
      setIsPWA(isStandalone || (isIOS && isInStandaloneMode));
    };
    
    checkPWA();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkPWA);
    
    return () => {
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkPWA);
    };
  }, []);
  
  return isPWA;
}

// Hook para detectar preferência de movimento reduzido
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
}
