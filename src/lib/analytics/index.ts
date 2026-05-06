import { env } from '../env';

/** Inicializa Facebook Pixel sem violar TS */
export function ensureFacebookPixel() {
  if (typeof window === "undefined") return;
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      (n as any).callMethod
        ? (n as any).callMethod.apply(n, arguments)
        : (n as any).queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    (n as any).push = (n as any);
    (n as any).loaded = true;
    (n as any).version = "2.0";
    (n as any).queue = [];
    t = b.createElement(e);
    t.async = true;
    (t as any).src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
}

/** Inicializa TikTok Pixel sem violar TS */
export function ensureTikTokPixel() {
  if (typeof window === "undefined") return;
  (function (w: any, d: any, t: any) {
    w.ttq =
      w.ttq || {
        load() {},
        track() {},
        debug() {},
        identify() {},
        distinct_id() {}
      };
    const s = d.createElement(t);
    s.async = true;
    (s as HTMLScriptElement).src = "https://analytics.tiktok.com/i18n/pixel/events.js";
    const x = d.getElementsByTagName("script")[0];
    x.parentNode!.insertBefore(s, x);
  })(window, document, "script");
}

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    ttq?: any;
    _alloe_pixels_initialized?: boolean;
  }
}

export type TrackEvent =
  | 'page_view'
  | 'view_item'
  | 'add_to_cart'
  | 'begin_checkout'
  | 'lead'
  | 'cta_click'
  | 'triage_start'
  | 'triage_complete'
  | 'pdf_generated'
  | 'start_checkout'
  | 'purchase'
  | 'hero_primary_cta_click'
  | 'hero_secondary_cta_click'
  | 'pricing_checkout_click'
  | 'sticky_cta_click'
  | 'whatsapp_cta_click'
  | 'whatsapp_floating_cta_click'
  | 'runner_start'
  | 'runner_save_start'
  | 'runner_complete'
  | 'sandbox_view'
  | 'checkout_start'
  | 'checkout_complete'
  | 'provisional_copy'
  | 'provisional_open'
  | 'product_card_click'
  | 'protocolo_start'
  | 'checkup_section_cta_click'
  | 'produtos_page_cta'
  | 'produtos_page_checkup_cta';

export function initPixels() {
  if (typeof window === 'undefined' || window._alloe_pixels_initialized) return;
  window._alloe_pixels_initialized = true;

  // dataLayer base
  window.dataLayer = window.dataLayer || [];
  const pushDL = (e:any) => window.dataLayer!.push(e);

  // GA4 fallback (se sem GTM)
  if (!env.NEXT_PUBLIC_GTM_ID && env.NEXT_PUBLIC_GA4_ID) {
    // @ts-ignore
    window.gtag = function(){ window.dataLayer!.push(arguments); };
    pushDL({ 'js': new Date() });
    pushDL({ 'config': env.NEXT_PUBLIC_GA4_ID });
  }

  // Meta Pixel (fbq) fallback
  if (!env.NEXT_PUBLIC_GTM_ID && env.NEXT_PUBLIC_META_PIXEL_ID) {
    ensureFacebookPixel();
    window.fbq!('init', env.NEXT_PUBLIC_META_PIXEL_ID);
  }

  // TikTok Pixel (ttq) fallback
  if (!env.NEXT_PUBLIC_GTM_ID && env.NEXT_PUBLIC_TIKTOK_PIXEL_ID) {
    ensureTikTokPixel();
    window.ttq?.load?.(env.NEXT_PUBLIC_TIKTOK_PIXEL_ID);
  }
}

export function track(event: TrackEvent, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  /**
   * Em produção Me Joy o GTM já dispara GA4 (config + History Change). Empurrar `page_view` no
   * dataLayer a partir do app dispara de novo a tag GA4 e explodiu requisições a /g/collect.
   */
  if (event === 'page_view' && env.NEXT_PUBLIC_GTM_ID) {
    return;
  }

  const payload = { event, ...params };

  // dataLayer
  window.dataLayer?.push(payload);

  // GA4 direct
  if (!env.NEXT_PUBLIC_GTM_ID && window.gtag) {
    window.gtag('event', event, params);
  }

  // Meta
  if (!env.NEXT_PUBLIC_GTM_ID && window.fbq) {
    const metaMap: Partial<Record<TrackEvent,string>> = {
      page_view: 'PageView',
      view_item: 'ViewContent',
      add_to_cart: 'AddToCart',
      begin_checkout: 'InitiateCheckout',
      lead: 'Lead',
      cta_click: 'ViewContent',
      triage_start: 'InitiateCheckout',
      triage_complete: 'CompleteRegistration',
      pdf_generated: 'ViewContent',
      start_checkout: 'InitiateCheckout',
      purchase: 'Purchase',
      hero_primary_cta_click: 'ViewContent',
      hero_secondary_cta_click: 'ViewContent',
      pricing_checkout_click: 'InitiateCheckout',
      sticky_cta_click: 'ViewContent',
      whatsapp_cta_click: 'ViewContent',
      runner_start: 'ViewContent',
      runner_save_start: 'Lead',
      runner_complete: 'CompleteRegistration',
      sandbox_view: 'PageView',
      checkout_start: 'InitiateCheckout',
      checkout_complete: 'Purchase',
      provisional_copy: 'ViewContent',
      provisional_open: 'ViewContent',
    };
    const name = metaMap[event] || 'CustomEvent';
    window.fbq('track', name, params);
  }

  // TikTok
  if (!env.NEXT_PUBLIC_GTM_ID && window.ttq?.track) {
    const ttMap: Partial<Record<TrackEvent,string>> = {
      page_view: 'PageView',
      view_item: 'ViewContent',
      add_to_cart: 'AddToCart',
      begin_checkout: 'InitiateCheckout',
      lead: 'SubmitForm',
      cta_click: 'ClickButton',
      triage_start: 'InitiateCheckout',
      triage_complete: 'CompleteRegistration',
      pdf_generated: 'Download',
      start_checkout: 'StartCheckout',
      purchase: 'CompletePayment',
      hero_primary_cta_click: 'ClickButton',
      hero_secondary_cta_click: 'ClickButton',
      pricing_checkout_click: 'StartCheckout',
      sticky_cta_click: 'ClickButton',
      whatsapp_cta_click: 'ClickButton',
      runner_start: 'ViewContent',
      runner_save_start: 'SubmitForm',
      runner_complete: 'CompleteRegistration',
      sandbox_view: 'PageView',
      checkout_start: 'StartCheckout',
      checkout_complete: 'CompletePayment',
      provisional_copy: 'ViewContent',
      provisional_open: 'ViewContent',
    };
    const name = ttMap[event] || event;
    window.ttq.track(name, params);
  }
}
