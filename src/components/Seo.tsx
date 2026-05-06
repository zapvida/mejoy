// src/components/Seo.tsx
import Head from 'next/head';

import { buildCanonical, buildTitle, SITE } from '@/lib/seo';

type Props = {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  ogImage?: string; // absolute URL recomendado
  jsonLd?: Record<string, any>[]; // array de objetos JSON-LD
  keywords?: string | string[]; // keywords para meta tag
  author?: string;
  ogType?: 'website' | 'article' | 'product';
  publishedTime?: string; // para artigos
  modifiedTime?: string; // para artigos
  renderMeta?: boolean;
};

export default function Seo({
  title,
  description,
  path,
  noIndex,
  ogImage,
  jsonLd = [],
  keywords,
  author,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  renderMeta = true,
}: Props) {
  const canonical = buildCanonical(path);
  const t = buildTitle(title);
  const desc = description || SITE.defaultDescription;
  const image = ogImage || SITE.ogImage;
  const keywordsStr = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  return (
    <>
      {renderMeta ? (
        <Head>
          <title>{t}</title>
          <link rel="canonical" href={canonical} />
          {noIndex && <meta name="robots" content="noindex,nofollow" />}

          {/* Primary meta */}
          <meta name="description" content={desc} />
          {keywordsStr && <meta name="keywords" content={keywordsStr} />}
          {author && <meta name="author" content={author} />}
          <meta name="application-name" content={SITE.applicationName} />
          <meta name="theme-color" content={SITE.themeColor} />
          <meta name="apple-mobile-web-app-title" content={SITE.applicationName} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          {/* Open Graph */}
          <meta property="og:type" content={ogType} />
          <meta property="og:title" content={t} />
          <meta property="og:description" content={desc} />
          <meta property="og:url" content={canonical} />
          <meta property="og:site_name" content={SITE.name} />
          <meta property="og:image" content={image} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={t} />
          <meta property="og:locale" content="pt_BR" />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          {SITE.twitter && <meta name="twitter:site" content={SITE.twitter} />}
          <meta name="twitter:creator" content={SITE.twitter} />
          <meta name="twitter:title" content={t} />
          <meta name="twitter:description" content={desc} />
          <meta name="twitter:image" content={image} />
          <meta name="twitter:image:alt" content={t} />

          {/* Additional SEO */}
          <meta name="geo.region" content="BR" />
          <meta name="geo.placename" content="Brasil" />
          <meta name="language" content="Portuguese" />
          <meta name="revisit-after" content="7 days" />
          <meta name="rating" content="general" />
        </Head>
      ) : null}

      {/* JSON-LD */}
      {jsonLd.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Evita XSS: stringify controlado
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}
