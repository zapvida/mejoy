// GA4 Analytics helpers para navegação mobile
export function trackNavClick(location: "top" | "bottom", item: string) {
  if (typeof window === "undefined" || !("gtag" in window)) return;
  
  // @ts-ignore
  window.gtag("event", "nav_click", { 
    location, 
    item,
    page_title: document.title,
    page_location: window.location.href
  });
}

export function trackBottomTabImpressionOnce() {
  if (typeof window === "undefined") return;
  
  const sessionKey = "__bt_imp";
  if (sessionStorage.getItem(sessionKey)) return;
  
  sessionStorage.setItem(sessionKey, "1");
  
  // @ts-ignore
  window.gtag?.("event", "bottom_tab_impression", {
    page_title: document.title,
    page_location: window.location.href
  });
}

export function trackMobileMenuOpen() {
  if (typeof window === "undefined" || !("gtag" in window)) return;
  
  // @ts-ignore
  window.gtag("event", "mobile_menu_open", {
    page_title: document.title,
    page_location: window.location.href
  });
}

export function trackHapticFeedback() {
  if (typeof window === "undefined" || !("gtag" in window)) return;
  
  // @ts-ignore
  window.gtag("event", "haptic_feedback", {
    page_title: document.title,
    page_location: window.location.href
  });
}

// Helper para vibrar com fallback
export function triggerHapticFeedback(pattern: number[] = [50]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
    trackHapticFeedback();
    return true;
  }
  return false;
}
