import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  BarChart3,
  Shield,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import FooterB2C from '@/components/home/FooterB2C';
import FormulasTable from '@/components/zapfarm/FormulasTable';
import Seo from '@/components/Seo';

const STEPS = [
  {
    step: 1,
    title: 'Check-up gratuito',
    desc: 'Responda nossa triagem em 3-5 minutos e descubra sua elegibilidade',
  },
  {
    step: 2,
    title: 'Relatório personalizado',
    desc: 'Receba análise completa com recomendações baseadas em evidências científicas',
  },
  {
    step: 3,
    title: 'Escolha seu plano',
    desc: 'Selecione entre produto apenas, produto + médico, ou time completo',
  },
];

export default function LancamentoPage() {
  return (
    <>
      <Seo
        title="MeJoy — Lançamento | 33 Fórmulas com Transparência Total"
        description="MeJoy: 11 fluxos de saúde, 33 SKUs, curadoria médica. Transparência total em componentes, doses e custos. Página de apresentação para investidores."
        path="/lancamento"
        keywords={[
          'MeJoy lançamento',
          '33 fórmulas',
          'investidores',
          'transparência',
          'suplementos',
          'saúde integrativa',
        ]}
      />
      <Head>
        <link rel="icon" href="/logosmejoy/faviconmejoy.png" />
      </Head>

      <main
        data-lpac="lancamento"
        className="min-h-screen bg-bg pb-safe"
        role="main"
        aria-label="Página de lançamento MeJoy"
      >
        <Navbar />

        {/* Hero */}
        <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-brand-600/5" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand/10 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-brand-700 dark:text-brand-300 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Página de apresentação para investidores
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-ink mb-6 leading-tight"
            >
              MeJoy — 33 fórmulas com{' '}
              <span className="text-brand">transparência total</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl sm:text-2xl text-fg/80 mb-10 max-w-3xl mx-auto"
            >
              Componentes, doses e custos de cada suplemento. Edite valores e veja totais
              recalcularem em tempo real.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 mb-12"
            >
              <div className="flex items-center gap-2 text-lg font-semibold text-ink">
                <BarChart3 className="w-6 h-6 text-brand" />
                11 fluxos de saúde
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold text-ink">
                <FileSpreadsheet className="w-6 h-6 text-brand" />
                33 SKUs
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold text-ink">
                <Shield className="w-6 h-6 text-brand" />
                Curadoria médica
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a
                href="#formulas"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-4 font-bold text-white text-lg shadow-xl transition-all hover:bg-brand-600 hover:shadow-2xl hover:scale-105"
              >
                Ver todas as fórmulas
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-12 bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: '11 fluxos', value: 'Emagrecimento, sono, calvície, ansiedade e mais' },
                { label: '33 SKUs', value: 'Básico, Completo e Premium por fluxo' },
                { label: 'Curadoria médica', value: 'Protocolos validados por especialistas' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 text-brand mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-lg">{item.label}</span>
                  </div>
                  <p className="text-fg/70 text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tabela de fórmulas */}
        <section id="formulas" className="py-16 sm:py-20 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
                Catálogo completo de fórmulas
              </h2>
              <p className="text-lg text-fg/80 max-w-2xl mx-auto">
                Edite os custos dos componentes e acompanhe o BOM total recalculando
                automaticamente.
              </p>
            </div>
            <FormulasTable editable grouped />
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-ink text-center mb-12">
              Como funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-brand text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-ink mb-2">{s.title}</h3>
                  <p className="text-fg/70 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-ink mb-4">
              Pronto para conhecer os protocolos?
            </h2>
            <p className="text-fg/80 mb-8">
              Check-up gratuito em 3 minutos. Relatório personalizado com recomendações médicas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/protocolos"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-brand-600 hover:shadow-xl"
              >
                Fazer check-up gratuito
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/formulas"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-brand px-8 py-4 font-bold text-brand transition-all hover:bg-brand/5"
              >
                Ver tabela de fórmulas
              </Link>
            </div>
          </div>
        </section>

        <FooterB2C />
      </main>
    </>
  );
}
