'use client';

import { Truck, Shield, MessageCircle, Sparkles, BadgeCheck, Clock3, FlaskConical, HeartHandshake, ShieldCheck } from 'lucide-react';
import Seo from '@/components/Seo';
import StorefrontHeader from './StorefrontHeader';
import TrustBar from './TrustBar';
import ObjectiveSections from './ObjectiveSections';
import HomeCarousel from './HomeCarousel';
import StorefrontFooter from './StorefrontFooter';
import type { ProductCardData } from '@/lib/store-v2/catalog';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '554797789479';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20Me%20Joy%20Farma`;

export interface HomeFeaturedSections {
  maisBuscados: ProductCardData[];
  maisVendidos: ProductCardData[];
  novidades: ProductCardData[];
}

interface StoreV2HomeProps {
  sections: { objectiveSlug: string; objectiveName: string; products: ProductCardData[] }[];
  featured?: HomeFeaturedSections;
}

const VALUE_POINTS = [
  {
    icon: FlaskConical,
    title: 'Formulação por objetivo',
    description: 'Escolha por meta de saúde e receba uma sugestão clara para começar.',
  },
  {
    icon: ShieldCheck,
    title: 'Confiança farmacêutica',
    description: 'Processo de manipulação controlado, rastreável e com suporte humano.',
  },
  {
    icon: Clock3,
    title: 'Compra sem fricção',
    description: 'Checkout simples, pagamento rápido e acompanhamento até a entrega.',
  },
] as const;

const FLOW_STEPS = [
  {
    icon: Sparkles,
    title: 'Escolha sua prioridade',
    description: 'Sono, metabolismo, cabelo, intestino e outros objetivos.',
  },
  {
    icon: BadgeCheck,
    title: 'Selecione a melhor fórmula',
    description: 'Comparação objetiva, preço visível e decisão em poucos segundos.',
  },
  {
    icon: HeartHandshake,
    title: 'Finalize com segurança',
    description: 'Pagamento protegido e suporte via WhatsApp durante toda a jornada.',
  },
] as const;

function scrollToProdutos() {
  document.getElementById('sec-produtos')?.scrollIntoView({ behavior: 'smooth' });
}

export default function StoreV2Home({ sections, featured }: StoreV2HomeProps) {
  return (
    <>
      <Seo
        title="MeJoy | Farmácia de Manipulação Online"
        description="Fórmulas manipuladas para seus objetivos. Qualidade, entrega em todo o Brasil, checkout rápido. Pix e cartão."
        path="/"
        keywords={['farmácia manipulação', 'suplementos', 'fórmulas manipuladas', 'MeJoy']}
      />
      <StorefrontHeader />
      <main className="min-h-screen pb-24 md:pb-0">
        {/* Hero — mobile-first, conversion-optimized */}
        <section className="pt-8 pb-10 md:pt-12 md:pb-14 bg-gradient-to-b from-white via-orange-50/30 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-sm font-medium mb-5">
              Farmácia de Manipulação
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Manipulados de alta confiança para sua rotina
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Escolha com clareza, compre com segurança e receba fórmulas manipuladas com padrão farmacêutico.
            </p>

            {/* Bullets de confiança */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700">Entrega para todo o Brasil</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700">Manipulação segura e rastreável</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-orange-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700">Suporte no WhatsApp</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={scrollToProdutos}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Explorar produtos
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border-2 border-gray-800 text-gray-900 font-semibold text-base hover:bg-gray-100 transition-all text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                Individualize a sua fórmula de saúde
              </a>
            </div>

            <p className="mt-5 text-xs text-gray-500">
              Pix e cartão • Envio com rastreio • Atendimento rápido
            </p>
          </div>
        </section>

        <TrustBar />

        <section className="py-10 md:py-14 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Decisão simples, compra segura, experiência premium
              </h2>
              <p className="mt-3 text-sm md:text-base text-gray-600">
                Tudo o que o cliente precisa para confiar, decidir rápido e comprar com tranquilidade.
              </p>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {VALUE_POINTS.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                  </article>
                );
              })}
            </div>
            <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/60 p-5">
              <div className="grid gap-4 md:grid-cols-3">
                {FLOW_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white border border-orange-200 text-orange-700 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-orange-600" />
                          <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {(featured?.maisBuscados?.length || featured?.maisVendidos?.length || featured?.novidades?.length) ? (
          <section className="py-10 md:py-14 bg-gradient-to-b from-white to-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
              {featured?.maisBuscados?.length ? (
                <HomeCarousel
                  title="Mais buscados"
                  subtitle="Fórmulas com maior procura no momento."
                  badge="Alta procura"
                  tone="search"
                  viewAllHref="/produtos"
                  products={featured.maisBuscados}
                />
              ) : null}
              {featured?.maisVendidos?.length ? (
                <HomeCarousel
                  title="Mais vendidos"
                  subtitle="Produtos com maior saída no catálogo."
                  badge="Escolha recorrente"
                  tone="sales"
                  viewAllHref="/produtos"
                  products={featured.maisVendidos}
                />
              ) : null}
              {featured?.novidades?.length ? (
                <HomeCarousel
                  title="Novidades"
                  subtitle="Lançamentos recentes para novos objetivos."
                  badge="Lançamentos"
                  tone="new"
                  viewAllHref="/produtos"
                  products={featured.novidades}
                />
              ) : null}
            </div>
          </section>
        ) : null}

        <section id="sec-produtos" className="py-12 md:py-16 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {sections.length > 0 ? (
              <ObjectiveSections sections={sections} />
            ) : (
              <div className="text-center py-16 text-gray-500">
                <p>Catálogo em construção. Em breve, 200+ fórmulas para você.</p>
                <p className="mt-2 text-sm">Execute o import CSV para popular o catálogo.</p>
              </div>
            )}
          </div>
        </section>

        <StorefrontFooter />
      </main>
    </>
  );
}
