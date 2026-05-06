import Document, { Html, Head, Main, NextScript } from 'next/document';

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
          <link rel="manifest" href="/manifest.webmanifest" />

          {/* Meta globais */}
          <meta name="author" content="Me Joy" />
          <meta name="copyright" content="© 2025 Me Joy" />

          {/* 🔥 Favicon - Me Joy Farma */}
          <link rel="icon" type="image/svg+xml" href="/logosmejoy/me-mark.svg" />
          <link rel="icon" type="image/png" sizes="32x32" href="/logosmejoy/faviconmejoy.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/logosmejoy/faviconmejoy.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/logosmejoy/faviconmejoy.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/logosmejoy/faviconmejoy.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/logosmejoy/faviconmejoy.png" />
          <link rel="icon" type="image/png" href="/logosmejoy/faviconmejoy.png" />

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
