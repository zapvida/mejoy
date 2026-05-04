'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Check, Cookie, Settings, X } from 'lucide-react';
import Cookies from 'js-cookie';
import { RefinedButton } from '@/components/ui/RefinedButton';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'zapfarm_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'zapfarm_cookie_preferences';
const COOKIE_VERSION = '1.0.0';

export function CookieBanner() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const asPath = router.asPath?.split('?')[0] || '';
  const isCompactLanding = asPath === '/' || asPath === '/emagrecimento';

  useEffect(() => {
    const consent = Cookies.get(COOKIE_CONSENT_KEY);
    const storedVersion = Cookies.get('cookie_policy_version');

    if (!consent || storedVersion !== COOKIE_VERSION) {
      setIsVisible(true);
      return;
    }

    const savedPrefs = Cookies.get(COOKIE_PREFERENCES_KEY);
    if (!savedPrefs) return;

    try {
      const parsed = JSON.parse(savedPrefs);
      setPreferences(parsed);
      applyCookiePreferences(parsed);
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  }, []);

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    if (typeof window === 'undefined' || !(window as any).gtag) return;

    (window as any).gtag('consent', 'update', {
      analytics_storage: prefs.analytics ? 'granted' : 'denied',
    });
  };

  const saveConsent = (prefs: CookiePreferences) => {
    Cookies.set(COOKIE_CONSENT_KEY, 'true', {
      expires: 365,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    Cookies.set('cookie_policy_version', COOKIE_VERSION, {
      expires: 365,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    Cookies.set(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs), {
      expires: 365,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    applyCookiePreferences(prefs);

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

  const settingsView = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="flex-1 text-center text-sm font-semibold text-zinc-900">Personalizar Cookies</h4>
        <button
          type="button"
          onClick={() => setShowSettings(false)}
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
          aria-label="Voltar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[40vh] space-y-2 overflow-y-auto pr-1">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h5 className="text-sm font-medium text-zinc-900">Essenciais</h5>
              <p className="text-xs text-zinc-600">Necessários ao site</p>
            </div>
            <div className="flex h-5 w-9 items-center justify-end rounded-full bg-[color:var(--brand-500)] px-1">
              <Check className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        {[
          {
            key: 'analytics' as const,
            title: 'Análise',
            description: 'Google Analytics e métricas de uso',
          },
          {
            key: 'marketing' as const,
            title: 'Marketing',
            description: 'Anúncios e campanhas personalizadas',
          },
        ].map((item) => (
          <div
            key={item.key}
            className="rounded-xl border border-zinc-200 bg-white p-3 transition-colors hover:border-[color:var(--brand-300)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h5 className="text-sm font-medium text-zinc-900">{item.title}</h5>
                <p className="text-xs text-zinc-600">{item.description}</p>
              </div>
              <button
                type="button"
                onClick={() => togglePreference(item.key)}
                className={`flex h-5 w-9 shrink-0 rounded-full transition-all duration-200 ${
                  preferences[item.key] ? 'bg-[color:var(--brand-500)]' : 'bg-zinc-300'
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
        <RefinedButton onClick={handleAcceptSelected} disabled={isLoading} size="sm" className="flex-1 py-2">
          Salvar preferências
        </RefinedButton>
        <RefinedButton onClick={() => setShowSettings(false)} variant="outline" size="sm" className="py-2">
          Voltar
        </RefinedButton>
      </div>
    </div>
  );

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[9999] animate-fade-in-up px-3 pb-3 sm:px-4 sm:pb-4 ${
        isCompactLanding ? '' : 'md:inset-x-auto md:left-auto md:right-4 md:w-[min(360px,calc(100vw-2rem))]'
      }`}
      data-testid="cookie-banner"
    >
      <div
        className={`safe-area-bottom overflow-hidden border border-zinc-200 bg-white/98 backdrop-blur-lg ${
          isCompactLanding
            ? 'mx-auto max-w-5xl rounded-[24px] shadow-[0_20px_48px_rgba(15,23,42,0.12)]'
            : 'rounded-[30px] shadow-[0_24px_60px_rgba(15,23,42,0.14)]'
        }`}
        data-testid={isCompactLanding ? 'cookie-banner-compact' : 'cookie-banner-default'}
      >
        <div className="px-4 py-3 sm:py-4">
          {showSettings ? (
            settingsView
          ) : isCompactLanding ? (
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="shrink-0 rounded-full bg-[color:var(--brand-50)] p-2">
                  <Cookie className="h-4 w-4 text-[color:var(--brand-600)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900">Cookies essenciais e opcionais</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 sm:text-xs">
                    Mantêm a navegação estável. Você pode aceitar, recusar opcionais ou personalizar.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                <a
                  href="/politicas-lgpd#cookies"
                  className="text-[11px] text-zinc-500 underline underline-offset-2 transition-colors hover:text-[color:var(--brand-600)]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Política de cookies
                </a>
                <div className="grid grid-cols-3 gap-2 sm:flex">
                  <RefinedButton
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-full border-zinc-300 px-3 text-[12px] text-zinc-800"
                  >
                    <Settings className="mr-1 h-3 w-3" />
                    Ajustar
                  </RefinedButton>
                  <RefinedButton
                    onClick={handleRejectAll}
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    className="h-9 px-3 text-[12px]"
                  >
                    Recusar
                  </RefinedButton>
                  <RefinedButton
                    onClick={handleAcceptAll}
                    disabled={isLoading}
                    size="sm"
                    className="h-9 rounded-full px-4 text-[12px]"
                  >
                    Aceitar
                  </RefinedButton>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="sm:hidden">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-full bg-[color:var(--brand-50)] p-2">
                    <Cookie className="h-4 w-4 text-[color:var(--brand-600)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900">Cookies essenciais e opcionais</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                      Mantêm a navegação estável. Você pode ajustar depois.
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <a
                    href="/politicas-lgpd#cookies"
                    className="text-[11px] text-zinc-500 underline underline-offset-2 transition-colors hover:text-[color:var(--brand-600)]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de cookies
                  </a>
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    disabled={isLoading}
                    className="text-[11px] font-medium text-zinc-500 underline underline-offset-2 transition-colors hover:text-zinc-700"
                  >
                    Rejeitar opcionais
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <RefinedButton
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-full border-zinc-300 px-3 text-[13px] text-zinc-800"
                  >
                    <Settings className="mr-1 h-3 w-3" />
                    Personalizar
                  </RefinedButton>
                  <RefinedButton onClick={handleAcceptAll} disabled={isLoading} size="sm" className="h-9 rounded-full px-3 text-[13px]">
                    Aceitar
                  </RefinedButton>
                </div>
              </div>

              <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-full bg-[color:var(--brand-50)] p-2">
                    <Cookie className="h-4 w-4 text-[color:var(--brand-600)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 sm:text-xs">Cookies essenciais e opcionais</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500 sm:text-[11px]">
                      Mantêm a navegação estável e você pode ajustar depois.
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <a
                        href="/politicas-lgpd#cookies"
                        className="text-[11px] text-zinc-500 underline underline-offset-2 transition-colors hover:text-[color:var(--brand-600)]"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Política de cookies
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <RefinedButton
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-full border-zinc-300 px-3 text-xs text-zinc-800"
                  >
                    <Settings className="mr-1 h-3 w-3" />
                    Personalizar
                  </RefinedButton>
                  <RefinedButton onClick={handleAcceptAll} disabled={isLoading} size="sm" className="h-9 rounded-full px-4 text-xs">
                    Aceitar
                  </RefinedButton>
                  <RefinedButton onClick={handleRejectAll} variant="ghost" size="sm" disabled={isLoading} className="h-9 px-3 text-xs">
                    Rejeitar
                  </RefinedButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
