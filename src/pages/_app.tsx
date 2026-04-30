// src/pages/_app.tsx

import "@/styles/globals.css";
import "@/styles/theme.css";
import "@/styles/print.css";
import "@/lib/report/print.css";
import { Analytics } from '@vercel/analytics/react';
import type { AppProps, NextWebVitalsMetric } from "next/app";
import { useRouter } from "next/router";
import Script from 'next/script';
import { useEffect, useState } from "react";

import Seo from '@/components/Seo';
import { GA } from "@/components/analytics/GA";
import dynamic from 'next/dynamic'
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { TenantProvider } from "@/components/providers/TenantProvider";
import TrackingProvider from "@/components/providers/TrackingProvider";
import { useConversionTriggers } from "@/hooks/useConversionTriggers";
import { Toaster } from "@/components/common/Toaster";
import AppLayout from "@/components/layout/AppLayout";
import { AuthProvider } from "@/context/AuthContext";

// Lazy load ConversionModal para não impactar LCP
const ConversionModal = dynamic(() => import('@/components/cta/ConversionModal').then(mod => mod.ConversionModal), {
  ssr: false,
  loading: () => null,
})

// Lazy load CookieBanner para não impactar LCP
const CookieBanner = dynamic(() => import('@/components/lgpd/CookieBanner').then(mod => mod.CookieBanner), {
  ssr: false,
  loading: () => null,
})
import { initPixels, track } from '@/lib/analytics';
import { env } from '@/lib/env';
import { resetGADeDup } from "@/lib/ga4";
import { orgJsonLd, websiteJsonLd } from '@/lib/seo';
import { detectTenantByHost } from '@/lib/tenancy/tenant';
import { toCssVars } from '@/lib/tenancy/theme';
import { captureUtms } from '@/lib/utm';
import { isZapFarmDomain } from '@/lib/host';
import { deriveBrand, applyBrandVars, type Hex } from '@/lib/theme/brand';

function ConversionModalWithTriggers() {
  const { shouldShow, setShouldShow } = useConversionTriggers(true)
  
  return (
    <ConversionModal 
      isOpen={shouldShow} 
      onClose={() => setShouldShow(false)}
      title="Não perca esta oportunidade!"
      message="Transforme sua saúde hoje com orientações personalizadas baseadas em evidências científicas."
    />
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [vars, setVars] = useState<Record<string,string>>({});
  const shouldEnableVercelAnalytics =
    process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === '1' ||
    Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV);
  
  useEffect(() => {
    const applyTenantColors = async () => {
      try {
        // ✅ PRIORIDADE 1: Verifica draft do sandbox (sessionStorage)
        if (typeof window !== 'undefined') {
          const draftStr = window.sessionStorage.getItem('b2b_draft');
          if (draftStr) {
            try {
              const draft = JSON.parse(draftStr);
              if (draft.brandColor) {
                const brandSeed = (draft.brandColor as Hex) || '#10b981';
                const base = deriveBrand(brandSeed);
                applyBrandVars(
                  base,
                  draft.accentColor as Hex | undefined
                );
                return; // Draft tem prioridade máxima
              }
            } catch (e) {
              console.warn('[App] Erro ao parsear draft:', e);
            }
          }
        }

        // ✅ PRIORIDADE 2: Tenant hardcoded
        const t = detectTenantByHost(window.location.hostname);
        setVars(toCssVars(t));
        
        if (t.brand?.primary) {
          const brandSeed = (t.brand.primary as Hex) || '#10b981';
          const base = deriveBrand(brandSeed);
          applyBrandVars(
            base,
            t.brand.secondary as Hex | undefined
          );
          return;
        }
      } catch {
        // Continua para próxima tentativa
      }
      
      // ✅ PRIORIDADE 3: Busca do Prisma via API
      try {
        const res = await fetch('/api/tenant/info');
        if (res.ok) {
          const data = await res.json();
          if (data.primaryColor) {
            const brandSeed = (data.primaryColor as Hex) || '#10b981';
            const base = deriveBrand(brandSeed);
            applyBrandVars(
              base,
              data.secondaryColor as Hex | undefined
            );
          }
        }
      } catch {
        // Fallback silencioso
      }
    };
    
    applyTenantColors();
  }, []);
  
  useEffect(() => {
    const cls = document.documentElement.classList;
    if (isZapFarmDomain()) {
      // escolha a paleta ativa do root: 'theme-emerald' | 'theme-navyteal' | 'theme-lime'
      cls.add('theme-emerald');
      cls.remove('theme-navyteal','theme-lime');
    } else {
      cls.remove('theme-emerald','theme-navyteal','theme-lime');
    }
  }, []);
  
  useEffect(() => {
    const onStart = () => resetGADeDup();
    router.events.on("routeChangeStart", onStart);
    return () => router.events.off("routeChangeStart", onStart);
  }, [router.events]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    captureUtms();
    initPixels();

    // Pageview on route change
    const onRoute = (url: string) => track('page_view', { page_location: url });
    onRoute(window.location.pathname + window.location.search);
    router.events.on('routeChangeComplete', onRoute);
    return () => { router.events.off('routeChangeComplete', onRoute); };
  }, [router.events]);

  return (
    <ErrorBoundary>
      <div style={vars as React.CSSProperties}>
        <TenantProvider>
          <TrackingProvider />
          <Toaster />
          <AuthProvider>
            <Seo
              jsonLd={[orgJsonLd(), websiteJsonLd()]}
            />
            
            {/* Tracking global (fallback para GTM global) */}
            {env.NEXT_PUBLIC_GTM_ID && (
              <Script id="gtm-global" strategy="afterInteractive">
                {`
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${env.NEXT_PUBLIC_GTM_ID}');
                `}
              </Script>
            )}
            
            <GA />
            {shouldEnableVercelAnalytics && <Analytics />}
            
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
            
            <ConversionModalWithTriggers />
            <CookieBanner />
          </AuthProvider>
        </TenantProvider>
      </div>
    </ErrorBoundary>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  try {
    // Envia INP/LCP/CLS/FID/TTFB para nosso endpoint
    fetch('/api/analytics/vitals', {
      method: 'POST',
      keepalive: true,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(metric)
    }).catch(() => {});
  } catch {}
}

export default MyApp;
