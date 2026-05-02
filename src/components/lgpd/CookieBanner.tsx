'use client';

import React, { useEffect, useState } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);

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
      }).catch(() => {
        /* noop */
      });
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
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 px-3 pb-[max(10px,env(safe-area-inset-bottom))] sm:px-4">
      <div className="mx-auto max-w-5xl rounded-[26px] border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="px-3 py-3 sm:px-5 sm:py-5">
          {!showSettings ? (
            <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 sm:h-10 sm:w-10">
                  <Cookie className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-5 text-zinc-900 sm:text-sm">
                    Cookies para uma navegação estável e segura
                  </p>
                  <p className="mt-1 max-w-2xl text-[12px] leading-5 text-zinc-600 sm:hidden">
                    Cookies essenciais para funcionamento e opcionais para análise de uso.
                  </p>
                  <p className="mt-1 hidden max-w-2xl text-[12px] leading-5 text-zinc-600 sm:block sm:text-sm sm:leading-6">
                    Usamos cookies essenciais para funcionamento do site e opcionais para análise de uso.
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <a
                      href="/politicas-lgpd#cookies"
                      className="hidden text-[11px] font-semibold text-emerald-700 underline underline-offset-2 sm:inline-flex sm:text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ler política de cookies
                    </a>
                    <button
                      type="button"
                      onClick={handleRejectAll}
                      className="hidden text-xs font-semibold text-zinc-500 transition hover:text-zinc-700 sm:inline-flex"
                      disabled={isLoading}
                    >
                      Rejeitar opcionais
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:items-center">
                <RefinedButton
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  size="sm"
                  className="justify-center rounded-full border-zinc-300 px-4 text-sm"
                >
                  <Settings className="h-4 w-4" />
                  Personalizar
                </RefinedButton>
                <RefinedButton
                  onClick={handleAcceptAll}
                  disabled={isLoading}
                  size="sm"
                  className="justify-center rounded-full bg-emerald-600 px-5 text-sm hover:bg-emerald-700"
                >
                  Aceitar
                </RefinedButton>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Personalizar cookies</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Você pode manter apenas o essencial ou liberar análise e marketing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                  aria-label="Fechar preferências"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <CookiePreferenceCard
                  title="Essenciais"
                  description="Login, sessão, segurança e funcionamento básico."
                  enabled
                  locked
                />
                <CookiePreferenceCard
                  title="Análise"
                  description="Medição de uso para melhorar páginas e fluxos."
                  enabled={preferences.analytics}
                  onToggle={() => togglePreference('analytics')}
                />
                <CookiePreferenceCard
                  title="Marketing"
                  description="Campanhas, remarketing e comunicação personalizada."
                  enabled={preferences.marketing}
                  onToggle={() => togglePreference('marketing')}
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="inline-flex justify-center text-sm font-semibold text-zinc-500 transition hover:text-zinc-700"
                  disabled={isLoading}
                >
                  Manter só essenciais
                </button>
                <RefinedButton
                  onClick={() => setShowSettings(false)}
                  variant="outline"
                  size="sm"
                  className="justify-center rounded-full border-zinc-300 px-4"
                >
                  Voltar
                </RefinedButton>
                <RefinedButton
                  onClick={handleAcceptSelected}
                  disabled={isLoading}
                  size="sm"
                  className="justify-center rounded-full bg-emerald-600 px-5 hover:bg-emerald-700"
                >
                  Salvar preferências
                </RefinedButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CookiePreferenceCard({
  title,
  description,
  enabled,
  locked = false,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  locked?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-zinc-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
        </div>
        {locked ? (
          <div className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-white">
            <Check className="h-3.5 w-3.5" />
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${enabled ? 'bg-emerald-600' : 'bg-zinc-300'}`}
            aria-label={`Alternar cookies ${title}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
