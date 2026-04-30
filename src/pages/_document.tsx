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
          
          {/* Cor do navegador mobile */}
          <meta name="theme-color" content="#00b894" />

          {/* 🔥 SEO */}
          <meta name="author" content="Me Joy" />
          <meta name="copyright" content="© 2025 Me Joy" />
          <meta
            name="description"
            content="Me Joy - Protocolos de Saúde com Curadoria Médica. Produtos manipulados e suplementos selecionados por médicos especialistas. Emagrecimento, sono, cabelos, intestino, fígado, imunidade, libido, menopausa, articulações e ansiedade. Check-up gratuito e entrega em todo Brasil."
          />
          <meta
            name="keywords"
            content="protocolos de saúde, produtos manipulados, suplementos médicos, emagrecimento, tratamento online, medicina integrativa, saúde preventiva, check-up gratuito, tirzepatida, minoxidil, melatonina, probióticos, fitormônios, colágeno, vitamina D, Me Joy"
          />
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow" />
          <meta name="bingbot" content="index, follow" />

          {/* 🔥 Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Me Joy - Protocolos de Saúde com Curadoria Médica | Emagrecimento, Sono e Mais" />
          <meta
            property="og:description"
            content="Compre protocolos de saúde prontos com produtos manipulados e suplementos selecionados por médicos. Emagrecimento, sono, cabelos, intestino, fígado, imunidade, libido, menopausa, articulações e ansiedade. Check-up gratuito e entrega em todo Brasil."
          />
          <meta property="og:image" content="https://www.mejoy.com.br/logosmejoy/logomejoy.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content="https://www.mejoy.com.br" />
          <meta property="og:site_name" content="Me Joy" />
          <meta property="og:locale" content="pt_BR" />

          {/* 🔥 Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Me Joy - Protocolos de Saúde com Curadoria Médica" />
          <meta
            name="twitter:description"
            content="Produtos manipulados e suplementos selecionados por médicos. Emagrecimento, sono, cabelos, intestino e mais. Check-up gratuito."
          />
          <meta name="twitter:image" content="https://www.mejoy.com.br/logosmejoy/logomejoy.png" />
          <meta name="twitter:site" content="@mejoy" />
          <meta name="twitter:creator" content="@mejoy" />

          {/* 🔥 Favicon */}
          <link rel="icon" type="image/svg+xml" href="/logosmejoy/me-mark.svg" />
          <link rel="icon" type="image/png" sizes="32x32" href="/logosmejoy/faviconmejoy.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/logosmejoy/faviconmejoy.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/logosmejoy/faviconmejoy.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/logosmejoy/faviconmejoy.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/logosmejoy/faviconmejoy.png" />

          {/* 🔥 Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Poppins:wght@700;800;900&family=Share+Tech+Mono&display=swap"
            rel="stylesheet"
          />

          {/* 🔥 Google Analytics */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-J9YJXL7K72"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-J9YJXL7K72');
              `,
            }}
          />

          {/* 🔥 Meta Pixel Facebook */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1027946116076290');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=1027946116076290&ev=PageView&noscript=1"
            />
          </noscript>

          {/* 🔥 Microsoft Clarity */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "sc9ss6xf7r");
              `,
            }}
          />
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
