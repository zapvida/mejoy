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
