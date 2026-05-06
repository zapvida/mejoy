import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getProductConfig, getAllProducts } from '@/lib/zapfarm/product-loader';
import { getPricesForProduct } from '@/lib/zapfarm/price-resolver';
import { ProductPricingSection } from '@/components/zapfarm/shared/ProductPricingSection';
import type { ZapfarmProductConfig } from '@/config/zapfarm/products';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { ProductHeroSection } from '@/components/zapfarm/shared/ProductHeroSection';
import { ProductBenefitsSection } from '@/components/zapfarm/shared/ProductBenefitsSection';
import { ProductHowItWorksSection } from '@/components/zapfarm/shared/ProductHowItWorksSection';
import { ProductFaqSection } from '@/components/zapfarm/shared/ProductFaqSection';
import { FooterZapfarm } from '@/components/zapfarm/emagrecimento/FooterZapfarm';
import { StickyCTA } from '@/components/zapfarm/shared/StickyCTA';
import { getTriageUrl } from '@/lib/zapfarm/product-loader';
import Seo from '@/components/Seo';
import { productJsonLd, breadcrumbJsonLd, faqJsonLd, howToJsonLd, SITE } from '@/lib/seo';

type LpVariant = 'A' | 'B' | 'C';

function getVariantFromQuery(query: { v?: string }): LpVariant | null {
  const v = query.v as string | undefined;
  if (v && ['A', 'B', 'C'].includes(v.toUpperCase())) {
    return v.toUpperCase() as LpVariant;
  }
  return null;
}

function getStoredVariant(): LpVariant | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('zapfarm_lp_variant');
    if (stored && ['A', 'B', 'C'].includes(stored)) {
      return stored as LpVariant;
    }
  } catch {
    // Ignore
  }
  return null;
}

function setStoredVariant(variant: LpVariant) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('zapfarm_lp_variant', variant);
  } catch {
    // Ignore
  }
}

function randomVariant(): LpVariant {
  const variants: LpVariant[] = ['A', 'B', 'C'];
  return variants[Math.floor(Math.random() * variants.length)];
}

interface ProductPageProps {
  productConfig: ZapfarmProductConfig;
  pricesReais: { basico: number; completo: number; premium: number } | null;
}

export default function ProductPage({ productConfig, pricesReais }: ProductPageProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const finalVariant = useMemo(() => {
    if (!mounted) return 'A';
    
    // 1. Check query param first
    const queryVariant = getVariantFromQuery(router.query);
    if (queryVariant) {
      setStoredVariant(queryVariant);
      return queryVariant;
    }

    // 2. Check localStorage
    const storedVariant = getStoredVariant();
    if (storedVariant) {
      return storedVariant;
    }

    // 3. Randomize and store
    const newVariant = randomVariant();
    setStoredVariant(newVariant);
    return newVariant;
  }, [router.query, mounted]);

  useEffect(() => {
    // Track view with variant
    if (mounted && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'zapfarm_lp_view', {
        variant: finalVariant,
        product: productConfig.slug,
      });
    }
  }, [finalVariant, mounted, productConfig.slug]);

  // TODOS os produtos ZapFarm vão para triagem primeiro
  const ctaUrl = getTriageUrl(productConfig.slug);
  
  const { colors, lpac, seo, plans } = productConfig;
  const productUrl = `${SITE.baseUrl}/${productConfig.slug}`;
  const recommendedPlan = plans.completo || plans.premium || plans.basico;

  // JSON-LD para Product
  const productSchema = productJsonLd({
    name: productConfig.commercialName,
    description: seo.description,
    url: productUrl,
    price: recommendedPlan.unitPrice,
    currency: 'BRL',
    image: `${SITE.baseUrl}${productConfig.image}`,
    brand: 'MeJoy',
    sku: productConfig.slug,
    category: productConfig.category
  });

  // JSON-LD para Breadcrumbs
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Início', url: SITE.baseUrl },
    { name: productConfig.displayName, url: productUrl }
  ]);

  // JSON-LD para FAQ
  const faqSchema = faqJsonLd(lpac.faq.map(f => ({
    question: f.question,
    answer: f.answer
  })));

  // JSON-LD para HowTo (Como Funciona)
  const howToSchema = howToJsonLd({
    name: `Como funciona o ${productConfig.commercialName}`,
    description: `Processo completo para adquirir e usar o ${productConfig.commercialName} na MeJoy`,
    steps: lpac.howItWorks.map(step => ({
      name: step.title,
      text: step.description,
      image: `${SITE.baseUrl}${productConfig.image}`
    }))
  });

  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        path={`/${productConfig.slug}`}
        keywords={seo.keywords}
        ogImage={`${SITE.baseUrl}${productConfig.image}`}
        ogType="product"
        jsonLd={[productSchema, breadcrumbSchema, faqSchema, howToSchema]}
      />
      
      <Head>
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>

      <div className="min-h-screen bg-white">
        <HeaderZapfarm />
        
        {/* Sticky CTA bar for mobile */}
        <StickyCTA 
          href={ctaUrl}
          text={lpac.hero.ctaText}
          productSlug={productConfig.slug}
          colors={colors}
        />

        {/* Padding bottom para mobile sticky CTA */}
        <div className="pb-20 md:pb-0">
          <ProductHeroSection productConfig={productConfig} />
        </div>

        <ProductPricingSection productConfig={productConfig} pricesReais={pricesReais} />
        
        <ProductBenefitsSection 
          config={lpac.benefits}
          colors={colors}
          title="Por que escolher a MeJoy?"
          subtitle={`Um programa completo de ${productConfig.displayName.toLowerCase()} com acompanhamento médico especializado`}
        />
        
        <ProductHowItWorksSection 
          config={lpac.howItWorks}
          colors={colors}
        />
        
        {/* Seção específica do produto - pode ser customizada depois */}
        <ProductFaqSection 
          config={lpac.faq}
          colors={colors}
        />

        {/* Final CTA Section */}
        <section className={`py-12 sm:py-16 md:py-20 bg-gradient-to-r ${colors.gradient} text-white`}>
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 text-white">
              Pronto para começar seu tratamento?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Check-up grátis em 2 min. Veja se é para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={ctaUrl}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-bold text-white bg-white/20 backdrop-blur-sm shadow-2xl transition-all hover:scale-105 hover:bg-white/30 w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                Fazer check-up digital →
              </a>
              <a
                href="/produtos"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-bold text-white/90 border-2 border-white/50 backdrop-blur-sm transition-all hover:bg-white/10 w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                Ver produtos →
              </a>
            </div>
            <p className="mt-4 text-sm text-white/80">
              Relatório completo de saúde grátis
            </p>
          </div>
        </section>

        <FooterZapfarm />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const products = getAllProducts();
  
  // Excluir emagrecimento pois tem página própria em /emagrecimento.tsx
  const dynamicProducts = products.filter(product => product.slug !== 'emagrecimento');
  
  return {
    paths: dynamicProducts.map(product => ({ params: { product: product.slug } })),
    fallback: false, // 404 se produto não existir
  };
};

export const getStaticProps: GetStaticProps<ProductPageProps> = async ({ params }) => {
  const product = params?.product as string;
  const config = getProductConfig(product);
  
  if (!config) {
    return { notFound: true };
  }

  let pricesReais: { basico: number; completo: number; premium: number } | null = null;
  try {
    const resolved = getPricesForProduct(product, undefined, false);
    pricesReais = {
      basico: resolved.basico / 100,
      completo: resolved.completo / 100,
      premium: resolved.premium / 100,
    };
  } catch {
    // Env vars podem não estar configuradas em build
  }
  
  return {
    props: {
      productConfig: config,
      pricesReais,
    },
  };
};

