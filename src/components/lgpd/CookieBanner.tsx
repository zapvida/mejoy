'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Cookie, Settings, X } from 'lucide-react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import {
  COOKIE_CONSENT_KEY,
  COOKIE_PREFERENCES_KEY,
  COOKIE_POLICY_VERSION_KEY,
  COOKIE_VERSION,
  DEFAULT_COOKIE_PREFERENCES,
  publishCookieConsentUpdate,
  type CookiePreferences,
} from '@/lib/analytics/consent';

export function CookieBanner() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_COOKIE_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);

  const currentPath = useMemo(() => (router.asPath || '').split('?')[0].toLowerCase(), [router.asPath]);
  const isSensitiveFlow = useMemo(() => {
    return (
      currentPath.includes('/triagem/') ||
      currentPath.endsWith('/triagem') ||
      currentPath.includes('/emagrecimento/checkout') ||
      currentPath.includes('/emagrecimento/relatorio')
    );
  }, [currentPath]);
  const asPath = router.asPath?.split('?')[0] || '';
  const isCompactLanding = asPath === '/' || asPath === '/emagrecimento';

  useEffect(() => {
    const consent = Cookies.get(COOKIE_CONSENT_KEY);
    const storedVersion = Cookies.get(COOKIE_POLICY_VERSION_KEY);

    if (!consent || storedVersion !== COOKIE_VERSION) {
      setIsVisible(true);
      return;
    }

    const savedPrefs = Cookies.get(COOKIE_PREFERENCES_KEY);
    if (!savedPrefs) return;

    try {
      const parsed = JSON.parse(savedPrefs);
      setPreferences(parsed);
      publishCookieConsentUpdate(parsed, {
        source: 'cookie_banner_restore',
        mode: 'update',
      });
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isVisible) return;

    const previousBodyPaddingBottom = document.body.style.paddingBottom;
    const previousScrollPaddingBottom = document.documentElement.style.scrollPaddingBottom;
    const previousOverscrollBehavior = document.documentElement.style.overscrollBehaviorY;

    const isMobile = window.innerWidth < 640;
    const offset = isMobile ? (showSettings ? '12.5rem' : '3.75rem') : null;

    if (offset) {
      document.body.style.paddingBottom = offset;
      document.documentElement.style.scrollPaddingBottom = offset;
      document.documentElement.style.overscrollBehaviorY = 'contain';
    }

    return () => {
      document.body.style.paddingBottom = previousBodyPaddingBottom;
      document.documentElement.style.scrollPaddingBottom = previousScrollPaddingBottom;
      document.documentElement.style.overscrollBehaviorY = previousOverscrollBehavior;
    };
  }, [isVisible, showSettings]);

  const saveConsent = (prefs: CookiePreferences) => {
    Cookies.set(COOKIE_CONSENT_KEY, 'true', {
      expires: 365,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    Cookies.set(COOKIE_POLICY_VERSION_KEY, COOKIE_VERSION, {
      expires: 365,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    Cookies.set(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs), {
      expires: 365,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    publishCookieConsentUpdate(prefs, {
      source: 'cookie_banner_save',
      mode: 'update',
    });

    if (typeof window !== 'undefined') {
      fetch('/api/lgpd/cookie-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: prefs,
          version: COOKIE_VERSION,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    setIsLoading(false);
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    setIsLoading(true);
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleAcceptSelected = () => {
    setIsLoading(true);
    saveConsent(preferences);
  };

  const handleRejectAll = () => {
    setIsLoading(true);
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
    });
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return;

    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  if (!isVisible) return null;

  const compactMessage = isSensitiveFlow
    ? 'Cookies essenciais: menos ruido, mais seguranca na avaliacao.'
    : 'Cookies essenciais: menos ruido, mais seguranca na jornada.';

  const subtleButtonClass =
    'inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 text-[11px] font-medium text-zinc-700 transition-colors hover:border-emerald-200 hover:text-emerald-800 disabled:opacity-50';
  const acceptButtonClass =
    'inline-flex h-8 items-center justify-center rounded-full bg-emerald-600 px-3.5 text-[11px] font-semibold text-white shadow-[0_12px_30px_rgba(5,150,105,0.16)] transition-colors hover:bg-emerald-700 disabled:opacity-50';
  const settingsView = (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-[-0.01em] text-zinc-950">Ajustar cookies</p>
          <p className="mt-0.5 text-[11px] text-zinc-500">Você escolhe o que ajuda a melhorar sua jornada.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowSettings(false)}
          className="rounded-full border border-zinc-200 p-1.5 text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-600"
          aria-label="Voltar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[38vh] space-y-2 overflow-y-auto pr-1">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h5 className="text-sm font-medium text-zinc-900">Essenciais</h5>
              <p className="text-xs text-zinc-600">Mantêm o site seguro e estável.</p>
            </div>
            <div className="flex h-5 w-9 items-center justify-end rounded-full bg-emerald-600 px-1">
              <Check className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        {[
          {
            key: 'analytics' as const,
            title: 'Análise',
            description: 'Métricas para deixar a experiência mais clara.',
          },
          {
            key: 'marketing' as const,
            title: 'Marketing',
            description: 'Campanhas mais úteis e menos ruído.',
          },
        ].map((item) => (
          <div key={item.key} className="rounded-2xl border border-zinc-200 bg-white p-3 transition-colors hover:border-emerald-200">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h5 className="text-sm font-medium text-zinc-900">{item.title}</h5>
                <p className="text-xs text-zinc-600">{item.description}</p>
              </div>
              <button
                type="button"
                onClick={() => togglePreference(item.key)}
                className={`flex h-5 w-9 shrink-0 rounded-full transition-all duration-200 ${
                  preferences[item.key] ? 'bg-emerald-600' : 'bg-zinc-300'
                }`}
                aria-label={`Alternar cookies de ${item.title.toLowerCase()}`}
              >
                <div
                  className={`m-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    preferences[item.key] ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={handleAcceptSelected} disabled={isLoading} className={`${acceptButtonClass} flex-1`}>
          Salvar
        </button>
        <button type="button" onClick={() => setShowSettings(false)} className={subtleButtonClass}>
          Voltar
        </button>
      </div>
    </div>
  );

  const compactMobileView = (
    <div className="space-y-1.5 sm:hidden">
      <div className="flex items-center gap-2">
        <div className="shrink-0 rounded-full bg-emerald-50 p-1.5 text-emerald-700">
          <Cookie className="h-3.5 w-3.5" />
        </div>
        <p className="min-w-0 flex-1 pr-1 text-[9.5px] font-medium leading-tight text-zinc-700">{compactMessage}</p>
        <button
          type="button"
          onClick={handleAcceptAll}
          disabled={isLoading}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 px-3.5 text-[10px] font-semibold text-white shadow-[0_10px_24px_rgba(5,150,105,0.14)] transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          Aceitar
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 pl-8">
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={handleRejectAll} disabled={isLoading} className="text-[10px] font-medium text-zinc-500 transition-colors hover:text-emerald-700 disabled:opacity-50">
            Minimos
          </button>
          <button type="button" onClick={() => setShowSettings(true)} className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-500 transition-colors hover:text-emerald-700">
            <Settings className="h-3 w-3" />
            Ajustar
          </button>
        </div>
        <a
          href="/politicas-lgpd#cookies"
          className="text-[10px] font-medium text-zinc-500 underline underline-offset-2 transition-colors hover:text-emerald-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          Politica
        </a>
      </div>
    </div>
  );

  const desktopBannerView = (
    <div className="hidden flex-col gap-2.5 sm:flex">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 rounded-full bg-emerald-50 p-2 text-emerald-700">
          <Cookie className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-950">Privacidade clara</p>
            <a
              href="/politicas-lgpd#cookies"
              className="text-[10px] font-medium text-zinc-500 underline underline-offset-2 transition-colors hover:text-emerald-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Politica
            </a>
          </div>
          <p className="mt-0.5 text-[10.5px] leading-relaxed text-zinc-600">{compactMessage}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={handleAcceptAll} disabled={isLoading} className={acceptButtonClass}>
          Aceitar
        </button>
        <button type="button" onClick={handleRejectAll} disabled={isLoading} className={subtleButtonClass}>
          So essenciais
        </button>
        <button type="button" onClick={() => setShowSettings(true)} className={subtleButtonClass}>
          <Settings className="h-3.5 w-3.5" />
          Ajustar
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[9999] px-3 pb-[max(0.45rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-4 sm:w-[min(380px,calc(100vw-2rem))] sm:px-0 sm:pb-[max(1rem,env(safe-area-inset-bottom))]"
      data-testid="cookie-banner"
    >
      <div
        className={`pointer-events-auto safe-area-bottom overflow-hidden rounded-[26px] border bg-white/95 backdrop-blur-xl ring-1 ring-emerald-950/5 ${
          isSensitiveFlow
            ? 'border-emerald-100/90 shadow-[0_20px_55px_rgba(6,78,59,0.12)]'
            : 'border-emerald-100/80 shadow-[0_18px_48px_rgba(15,23,42,0.12)]'
        }`}
        data-testid={isCompactLanding ? 'cookie-banner-compact' : 'cookie-banner-default'}
      >
        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3">
          {showSettings ? (
            settingsView
          ) : (
            <>
              {compactMobileView}
              {desktopBannerView}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
