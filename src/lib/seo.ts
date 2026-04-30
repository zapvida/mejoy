// src/lib/seo.ts
type U = string | undefined;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mejoy.com.br';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Me Joy';

export const SITE = {
  name: SITE_NAME,
  baseUrl: BASE_URL,
  defaultTitle: `${SITE_NAME} — Protocolos de Saúde com Curadoria Médica`,
  defaultDescription:
    'Produtos de saúde selecionados por médicos. Emagrecimento, sono, intestino, imunidade e mais. Check-up gratuito. Entrega em todo Brasil.',
  twitter: '@mejoy'
};

export function buildCanonical(path: U) {
  const p = (path || '/').replace(/\/+/g, '/');
  return `${SITE.baseUrl}${p.startsWith('/') ? '' : '/'}${p}`;
}

export function buildTitle(title?: string) {
  if (!title) return SITE.defaultTitle;
  return `${title} · ${SITE.name}`;
}

// ——— JSON-LD helpers ———
export function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.baseUrl,
    logo: `${SITE.baseUrl}/android-chrome-512x512.png`,
    description: 'Protocolos de saúde com curadoria médica. Produtos manipulados e suplementos selecionados por médicos especialistas.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'Portuguese'
    },
    sameAs: [
      process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/mejoy',
      process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/mejoy'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
      bestRating: '5',
      worstRating: '1'
    }
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function productJsonLd(opts: {
  name: string; description: string; url: string; price: number; currency?: string;
  image?: string; brand?: string; sku?: string; category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    brand: opts.brand ? {
      '@type': 'Brand',
      name: opts.brand
    } : undefined,
    sku: opts.sku,
    category: opts.category,
    offers: {
      '@type': 'Offer',
      price: opts.price.toFixed(2),
      priceCurrency: opts.currency || 'BRL',
      availability: 'https://schema.org/InStock',
      url: opts.url,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function medicalBusinessJsonLd(opts: {
  name: string; url: string; description?: string; telephone?: string;
  address?: { street?: string; city?: string; state?: string; postalCode?: string; country?: string; };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: opts.name,
    url: opts.url,
    description: opts.description,
    telephone: opts.telephone,
    address: opts.address ? {
      '@type': 'PostalAddress',
      ...opts.address
    } : undefined
  };
}

export function howToJsonLd(opts: {
  name: string; description: string; steps: Array<{ name: string; text: string; image?: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image
    }))
  };
}

export function serviceJsonLd(opts: {
  name: string; description: string; url: string; provider: string;
  serviceType?: string; areaServed?: string; availableChannel?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: {
      '@type': 'Organization',
      name: opts.provider
    },
    serviceType: opts.serviceType,
    areaServed: opts.areaServed || 'BR',
    availableChannel: opts.availableChannel || 'Online'
  };
}
