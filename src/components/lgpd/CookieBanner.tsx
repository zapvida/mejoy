'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Cookie, Settings, X } from 'lucide-react';
import { useRouter } from 'next/router';
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
  const isSensitiveCompact = isSensitiveFlow && !isCompactLanding;

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

  useEffect(() => {
    if (typeof window === 'undefined' || !isVisible) return;

    const previousBodyPaddingBottom = document.body.style.paddingBottom;
    const previousScrollPaddingBottom = document.documentElement.style.scrollPaddingBottom;
    const previousOverscrollBehavior = document.documentElement.style.overscrollBehaviorY;

    let offset: string | null = null;
    if (isCompactLanding) {
      offset = showSettings ? 'min(22rem, 40vh)' : 'min(14rem, 28vh)';
    } else if (isSensitiveFlow && window.innerWidth < 768) {
      offset = showSettings ? '23rem' : '15rem';
    }

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
  }, [isCompactLanding, isSensitiveFlow, isVisible, showSettings]);

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
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[9999] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:pb-[max(1rem,env(safe-area-inset-bottom))] ${
        isCompactLanding
          ? ''
          : 'animate-fade-in-up md:inset-x-auto md:left-auto md:right-4 md:w-[min(360px,calc(100vw-2rem))]'
      }`}
      data-testid="cookie-banner"
    >
      <div
        className={`pointer-events-auto safe-area-bottom overflow-hidden border shadow-[0_-4px_24px_rgba(15,23,42,0.08)] ${
          isCompactLanding
            ? 'mx-auto max-w-5xl rounded-2xl border-zinc-200/90 bg-white ring-1 ring-zinc-200/60'
            : isSensitiveCompact
              ? 'rounded-[24px] border-zinc-200 bg-white/98 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-lg'
              : 'rounded-[30px] border-zinc-200 bg-white/98 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-lg'
        }`}
        data-testid={isCompactLanding ? 'cookie-banner-compact' : 'cookie-banner-default'}
      >
        <div className="px-4 py-3 sm:py-4">
          {showSettings ? (
            settingsView
          ) : isCompactLanding ? (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="flex min-w-0 items-start gap-3">
                <div className="shrink-0 rounded-full bg-[color:var(--brand-50)] p-2">
                  <Cookie className="h-4 w-4 text-[color:var(--brand-600)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900">Cookies essenciais e opcionais</p>
                  <p className="mr-1 mt-1 text-[12px] leading-snug text-zinc-600 sm:text-[13px] sm:leading-relaxed">
                    Usamos cookies para o funcionamento do site e, com seu consentimento, para medição e marketing.
                    Você pode aceitar tudo, recusar o que não for essencial ou personalizar.
                  </p>
                  <a
                    href="/politicas-lgpd#cookies"
                    className="mt-2 inline-block text-[12px] font-medium text-[color:var(--brand-600)] underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de cookies
                  </a>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                <RefinedButton
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-full border-2 border-zinc-300 bg-white px-4 text-[13px] font-semibold text-zinc-900 !shadow-none hover:bg-zinc-50"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Ajustar
                </RefinedButton>
                <button
                  type="button"
                  onClick={handleRejectAll}
                  disabled={isLoading}
                  className="h-10 min-h-[2.5rem] px-2 text-[13px] font-semibold text-zinc-600 underline decoration-zinc-400 underline-offset-4 transition hover:text-zinc-900 disabled:opacity-50"
                >
                  Recusar opcionais
                </button>
                <RefinedButton
                  onClick={handleAcceptAll}
                  disabled={isLoading}
                  size="sm"
                  className="h-10 rounded-full px-6 text-[13px]"
                >
                  Aceitar todos
                </RefinedButton>
              </div>
            </div>
          ) : isSensitiveCompact ? (
            <>
              <div className="sm:hidden">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-full bg-[color:var(--brand-50)] p-2">
                    <Cookie className="h-4 w-4 text-[color:var(--brand-600)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900">Cookies essenciais</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                      Mantêm sua avaliação estável. Você pode aceitar, recusar opcionais ou personalizar.
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
                  <RefinedButton
                    onClick={handleAcceptAll}
                    disabled={isLoading}
                    size="sm"
                    className="h-9 rounded-full px-3 text-[13px]"
                  >
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
                    <p className="text-sm font-semibold text-zinc-900 sm:text-xs">Cookies essenciais</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500 sm:text-[11px]">
                      Mantêm a avaliação estável e você pode ajustar depois.
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
                  <RefinedButton
                    onClick={handleAcceptAll}
                    disabled={isLoading}
                    size="sm"
                    className="h-9 rounded-full px-4 text-xs"
                  >
                    Aceitar
                  </RefinedButton>
                  <RefinedButton
                    onClick={handleRejectAll}
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    className="h-9 px-3 text-xs"
                  >
                    Rejeitar
                  </RefinedButton>
                </div>
              </div>
            </>
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
