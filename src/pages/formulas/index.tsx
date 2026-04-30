import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import FooterB2C from '@/components/home/FooterB2C';
import FormulasTable from '@/components/zapfarm/FormulasTable';
import Seo from '@/components/Seo';

export default function FormulasPage() {
  return (
    <>
      <Seo
        title="33 Fórmulas MonJoy — Transparência Total | Componentes, Doses e Custos"
        description="Catálogo completo das 33 fórmulas MonJoy: componentes, doses e custos (BOM) por SKU. Emagrecimento, calvície, sono, ansiedade, intestino, fígado, libido, menopausa, articulações, imunidade e tirzepatida."
        path="/formulas"
        keywords={[
          'fórmulas MonJoy',
          '33 SKUs',
          'suplementos manipulação',
          'BOM custos',
          'transparência',
          'investidores',
        ]}
      />
      <Head>
        <link rel="icon" href="/logosmejoy/faviconmejoy.png" />
      </Head>

      <main
        data-lpac="formulas"
        className="min-h-screen bg-bg pb-safe"
        role="main"
        aria-label="Tabela de fórmulas MonJoy"
      >
        <Navbar />

        {/* Hero */}
        <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden bg-gradient-to-br from-surface via-muted/30 to-surface">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-[color:var(--brand-600)]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[color:var(--brand-600)]/5 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink mb-4 leading-tight">
              33 Fórmulas MonJoy
            </h1>
            <p className="text-lg sm:text-xl text-fg/80 mb-6 max-w-2xl mx-auto">
              Transparência total: componentes, doses e custos (BOM) por SKU. Edite os valores e
              veja os totais recalcularem automaticamente.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="rounded-lg bg-brand-100 dark:bg-brand-900/30 px-4 py-2 text-brand-800 dark:text-brand-200 font-medium">
                11 fluxos de saúde
              </span>
              <span className="rounded-lg bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-emerald-800 dark:text-emerald-200 font-medium">
                33 SKUs
              </span>
              <span className="rounded-lg bg-amber-100 dark:bg-amber-900/30 px-4 py-2 text-amber-800 dark:text-amber-200 font-medium">
                Curadoria médica
              </span>
            </div>
          </div>
        </section>

        {/* Tabela */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FormulasTable editable grouped />
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-ink mb-4">
              Quer conhecer nossos protocolos?
            </h2>
            <p className="text-fg/80 mb-6">
              Faça um check-up gratuito e receba recomendações personalizadas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/protocolos"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-brand-600 hover:shadow-xl"
              >
                Fazer check-up gratuito
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-brand px-6 py-3 font-semibold text-brand transition-all hover:bg-brand/5"
              >
                Ver produtos
              </Link>
            </div>
          </div>
        </section>

        <FooterB2C />
      </main>
    </>
  );
}
