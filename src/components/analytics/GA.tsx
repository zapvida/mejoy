// src/components/analytics/GA.tsx
// Componente GA4 usando Script do Next.js

import Script from "next/script";

export function GA() {
  const id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  if (!id) return null;

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
