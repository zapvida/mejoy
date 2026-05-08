// src/components/analytics/GA.tsx
// Componente GA4 usando Script do Next.js

import Script from "next/script";

import { env } from "@/lib/env";

export function GA() {
  const id = env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  if (!id) return null;
  /** Container GTM já injeta gtag + GA4; manter este script em paralelo duplica page_view e rajada /g/collect. */
  if (env.NEXT_PUBLIC_GTM_ID) return null;

  return (
    <>
      <Script 
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`} 
        strategy="afterInteractive" 
      />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
