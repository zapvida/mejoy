import type { NextWebVitalsMetric } from 'next/app';

const CLS_DEBOUNCE_MS = 2000;

let clsTimeout: ReturnType<typeof setTimeout> | undefined;
let pendingCls: NextWebVitalsMetric | undefined;
let lifecycleBound = false;

function sendToApi(metric: NextWebVitalsMetric) {
  try {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      keepalive: true,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(metric),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

function flushPendingCls() {
  if (clsTimeout) {
    clearTimeout(clsTimeout);
    clsTimeout = undefined;
  }
  if (pendingCls) {
    sendToApi(pendingCls);
    pendingCls = undefined;
  }
}

function bindLifecycleOnce() {
  if (typeof window === 'undefined' || lifecycleBound) return;
  lifecycleBound = true;
  const onHidden = () => {
    if (document.visibilityState === 'hidden') flushPendingCls();
  };
  window.addEventListener('pagehide', flushPendingCls, { capture: true });
  document.addEventListener('visibilitychange', onHidden, { capture: true });
}

/**
 * Debounce CLS (pode disparar dezenas de vezes) e envia as demais métricas na hora.
 * Reduz 429 no /api/analytics/vitals e carga no main thread.
 */
export function reportWebVitals(metric: NextWebVitalsMetric) {
  bindLifecycleOnce();

  /** Métrica interna do Next 15; em dev dispara a cada HMR/remount e polui `/api/analytics/vitals`. */
  if (process.env.NODE_ENV === 'development' && metric.name === 'Next.js-hydration') {
    return;
  }

  if (metric.name !== 'CLS') {
    sendToApi(metric);
    return;
  }

  pendingCls = metric;
  if (clsTimeout) clearTimeout(clsTimeout);
  clsTimeout = setTimeout(() => {
    if (pendingCls) sendToApi(pendingCls);
    pendingCls = undefined;
    clsTimeout = undefined;
  }, CLS_DEBOUNCE_MS);
}
