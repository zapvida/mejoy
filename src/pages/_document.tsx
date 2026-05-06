import Document, { Html, Head, Main, NextScript } from 'next/document';

import { BRAND_ASSETS, BRAND_NAME, BRAND_THEME_COLOR } from '@/lib/brand/assets';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-BR" suppressHydrationWarning>
        <Head>
          {/* 🔥 Meta Tags Essenciais */}
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* Preconnects úteis */}
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          
          {/* Ícones básicos - removido duplicata */}
          
          {/* Manifest (se houver) */}
          <link rel="manifest" href={BRAND_ASSETS.meta.manifest} />

          {/* Meta globais */}
          <meta name="author" content={BRAND_NAME} />
          <meta name="application-name" content={BRAND_NAME} />
          <meta name="apple-mobile-web-app-title" content={BRAND_NAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content={BRAND_THEME_COLOR} />
          <meta name="copyright" content="© 2026 MeJoy" />

          {/* 🔥 Favicon - MeJoy */}
          <link rel="shortcut icon" href={BRAND_ASSETS.meta.faviconIco} />
          <link rel="icon" type="image/png" sizes="16x16" href={BRAND_ASSETS.meta.favicon16} />
          <link rel="icon" type="image/png" sizes="32x32" href={BRAND_ASSETS.meta.favicon32} />
          <link rel="icon" type="image/png" sizes="48x48" href={BRAND_ASSETS.meta.icon48} />
          <link rel="icon" type="image/png" sizes="96x96" href={BRAND_ASSETS.meta.icon96} />
          <link rel="apple-touch-icon" sizes="180x180" href={BRAND_ASSETS.meta.appleTouch} />

          {/* 🔥 Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Poppins:wght@700;800;900&family=Share+Tech+Mono&display=swap"
            rel="stylesheet"
          />

          {/**
           * NÃO carregar GA / Meta / Clarity aqui — duplicava GTM + GA.tsx + initPixels e gerava
           * múltiplos gtag('config') (rajadas /g/collect, histórico estranho, sensação de “reload”).
           * Produção: tags via NEXT_PUBLIC_GTM_ID em _app. Sem GTM: GA.tsx + initPixels.
           */}
        </Head>
        <body className="bg-background text-gray-900">
          {/* GTM noscript */}
          {process.env.NEXT_PUBLIC_GTM_ID ? (
            <noscript>
              <iframe src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`} height="0" width="0" style={{display:'none',visibility:'hidden'}} />
            </noscript>
          ) : null}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
