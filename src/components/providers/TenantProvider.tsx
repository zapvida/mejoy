'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { detectTenantByHost } from '@/lib/tenancy/tenant';
import { isRootB2BDomain } from '@/lib/flags';

type TenantInfo = {
  id?: string;
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  ctaPrimaryUrl?: string;
  ctaLabel?: string;
};

const TenantContext = createContext<TenantInfo | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // ✅ PRIORIDADE 1: Verifica draft do sandbox (sessionStorage)
        const draftStr = window.sessionStorage.getItem('b2b_draft');
        if (draftStr) {
          try {
            const draft = JSON.parse(draftStr);
            setTenant({
              name: draft.fantasyName || 'Me Joy',
              logoUrl: draft.logoUrl,
              primaryColor: draft.brandColor || '#10b981',
              secondaryColor: draft.accentColor,
              ctaPrimaryUrl: draft.ctaUrl,
              ctaLabel: draft.ctaText,
            });
            return; // Draft tem prioridade
          } catch (e) {
            console.warn('[TenantProvider] Erro ao parsear draft:', e);
          }
        }

        // ✅ PRIORIDADE 2: Tenant hardcoded
        const t = detectTenantByHost(window.location.hostname);
        // Para domínio root B2B (zapfarm.com), sempre usar "Me Joy"
        const isRootB2B = isRootB2BDomain();
        setTenant({
          id: t.id,
          name: isRootB2B ? 'Me Joy' : t.name,
          primaryColor: t.brand?.primary,
          secondaryColor: t.brand?.secondary,
        });
      }
    } catch {
      // Fallback se não encontrar tenant
      setTenant({
        name: 'Me Joy',
        primaryColor: '#10b981',
      });
    }
  }, []);

  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const tenant = useContext(TenantContext);
  return tenant || { name: 'Me Joy', primaryColor: '#10b981' };
}

