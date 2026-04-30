'use client';

import React, { useState, useEffect } from 'react';
import { X, Cookie, Settings, Check } from 'lucide-react';
import { RefinedButton } from '@/components/ui/RefinedButton';
import Cookies from 'js-cookie';

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
    essential: true, // Sempre true, não pode ser desativado
    analytics: false,
    marketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar se já existe consentimento
    const consent = Cookies.get(COOKIE_CONSENT_KEY);
    const storedVersion = Cookies.get('cookie_policy_version');
    
    // Se não tem consentimento OU versão mudou, mostrar banner
    if (!consent || storedVersion !== COOKIE_VERSION) {
      setIsVisible(true);
    } else {
      // Carregar preferências salvas
      const savedPrefs = Cookies.get(COOKIE_PREFERENCES_KEY);
      if (savedPrefs) {
        try {
          const parsed = JSON.parse(savedPrefs);
          setPreferences(parsed);
          applyCookiePreferences(parsed);
        } catch (e) {
          console.error('Erro ao carregar preferências:', e);
        }
      }
    }
  }, []);

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Cookies essenciais sempre ativos
    if (prefs.essential) {
      // Não fazer nada, já estão ativos
    }

    // Analytics (Google Analytics, etc)
    if (prefs.analytics) {
      // Habilitar Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      }
    } else {
      // Desabilitar analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    }

    // Marketing (pixels, remarketing)
    if (prefs.marketing) {
      // Habilitar pixels de marketing
      // Implementar conforme necessário
    } else {
      // Desabilitar marketing
      // Implementar conforme necessário
    }
  };

  const handleAcceptAll = () => {
    setIsLoading(true);
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    
    saveConsent(allAccepted);
  };

  const handleAcceptSelected = () => {
    setIsLoading(true);
    saveConsent(preferences);
  };

  const handleRejectAll = () => {
    setIsLoading(true);
    const minimal: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(minimal);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    // Salvar consentimento
    Cookies.set(COOKIE_CONSENT_KEY, 'true', {
      expires: 365, // 1 ano
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Salvar versão da política
    Cookies.set('cookie_policy_version', COOKIE_VERSION, {
      expires: 365,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Salvar preferências
    Cookies.set(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs), {
      expires: 365,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Aplicar preferências
    applyCookiePreferences(prefs);

    // Salvar no servidor (opcional, para auditoria LGPD)
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
        // Silenciar erro, não é crítico
      });
    }

    setIsLoading(false);
    setIsVisible(false);
    setShowSettings(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Não pode desativar essenciais
    
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Banner fixo na parte inferior - design profissional para apresentação */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-fade-in-up">
        <div className="bg-white/98 backdrop-blur-lg border-t border-zinc-200 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] rounded-t-2xl overflow-hidden safe-area-bottom">
          <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
            {!showSettings ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 rounded-full bg-[color:var(--brand-50)] flex-shrink-0">
                    <Cookie className="w-4 h-4 text-[color:var(--brand-600)]" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-700 leading-snug">
                      Cookies para melhorar sua experiência. Dados seguros • LGPD
                    </p>
                    <a
                      href="/politicas-lgpd#cookies"
                      className="text-[10px] text-zinc-500 hover:text-[color:var(--brand-600)] transition-colors underline underline-offset-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Política de cookies
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <RefinedButton
                    onClick={handleRejectAll}
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    className="text-xs py-1.5 px-3"
                  >
                    Rejeitar
                  </RefinedButton>
                  <RefinedButton
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs py-1.5 px-3"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Personalizar
                  </RefinedButton>
                  <RefinedButton
                    onClick={handleAcceptAll}
                    disabled={isLoading}
                    size="sm"
                    className="text-xs py-1.5 px-4"
                  >
                    Aceitar
                  </RefinedButton>
                </div>
              </div>
            ) : (
              <>
              {/* Settings View - painel que expande no próprio banner */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-zinc-900 text-center flex-1">
                    Personalizar Cookies
                  </h4>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1.5 -mr-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                    aria-label="Voltar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                  {/* Essential Cookies */}
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-zinc-900">Essenciais</h5>
                        <p className="text-xs text-zinc-600">Necessários ao site</p>
                      </div>
                      <div className="w-9 h-5 bg-[color:var(--brand-500)] rounded-full flex items-center justify-end px-1 flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="p-3 bg-white rounded-xl border border-zinc-200 hover:border-[color:var(--brand-300)] transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-zinc-900">Análise</h5>
                        <p className="text-xs text-zinc-600">Google Analytics</p>
                      </div>
                      <button
                        onClick={() => togglePreference('analytics')}
                        className={`w-9 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${
                          preferences.analytics ? 'bg-[color:var(--brand-500)]' : 'bg-zinc-300'
                        }`}
                        aria-label="Alternar cookies de análise"
                      >
                        <div
                          className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform duration-200 m-0.5 ${
                            preferences.analytics ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="p-3 bg-white rounded-xl border border-zinc-200 hover:border-[color:var(--brand-300)] transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-zinc-900">Marketing</h5>
                        <p className="text-xs text-zinc-600">Anúncios personalizados</p>
                      </div>
                      <button
                        onClick={() => togglePreference('marketing')}
                        className={`w-9 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${
                          preferences.marketing ? 'bg-[color:var(--brand-500)]' : 'bg-zinc-300'
                        }`}
                        aria-label="Alternar cookies de marketing"
                      >
                        <div
                          className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform duration-200 m-0.5 ${
                            preferences.marketing ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <RefinedButton
                    onClick={handleAcceptSelected}
                    disabled={isLoading}
                    size="sm"
                    className="flex-1 py-2"
                  >
                    Salvar preferências
                  </RefinedButton>
                  <RefinedButton
                    onClick={() => setShowSettings(false)}
                    variant="outline"
                    size="sm"
                    className="py-2"
                  >
                    Voltar
                  </RefinedButton>
                </div>
              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

