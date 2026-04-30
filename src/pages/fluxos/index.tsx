import Head from 'next/head';
import Link from 'next/link';
import { FileSpreadsheet, ArrowRight } from 'lucide-react';
import { FLUXOS_SOL } from '@/lib/fluxos-mejoy/dados';
import SolDiagram from '@/components/fluxos/SolDiagram';
import FlowCard from '@/components/fluxos/FlowCard';
import ModeSelector from '@/components/fluxos/ModeSelector';
import MonetizationTable from '@/components/fluxos/MonetizationTable';
import FooterB2C from '@/components/home/FooterB2C';

export default function FluxosPage() {
  return (
    <>
      <Head>
        <title>Fluxos de Entrada | MeJoy — 12 Raios, 33 SKUs</title>
        <meta
          name="description"
          content="MeJoy no centro — 12 raios de entrada: 11 produtos + Assinatura 6 meses. R$ 139 – R$ 2.700. Assinatura 6m: R$ 2.382."
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="border-b border-gray-200 bg-white py-10 dark:border-gray-700 dark:bg-gray-800 sm:py-14">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Fluxos de Entrada MeJoy
            </h1>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
              12 raios · 11 produtos + Assinatura 6m · 33 SKUs
            </p>
            <div className="mx-auto mt-6 flex flex-wrap justify-center gap-4 text-sm font-medium">
              <span className="rounded-lg bg-amber-100 px-4 py-2 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                12 raios
              </span>
              <span className="rounded-lg bg-emerald-100 px-4 py-2 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                R$ 139 – R$ 2.700
              </span>
              <span className="rounded-lg bg-teal-100 px-4 py-2 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200">
                Assinatura 6m: R$ 2.382
              </span>
            </div>
            <p className="mx-auto mt-4 max-w-xl text-xs text-gray-500 dark:text-gray-400">
              Simples | Moderado | Completo
            </p>
          </div>
        </section>

        <section className="border-b border-gray-200 bg-white py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="container mx-auto flex justify-center px-4">
            <ModeSelector basePath="/fluxos" />
          </div>
        </section>

        <section className="border-b border-gray-200 bg-white py-10 dark:border-gray-700 dark:bg-gray-800 sm:py-14">
          <div className="container mx-auto px-4">
            <SolDiagram fluxos={FLUXOS_SOL} />
          </div>
        </section>

        <section className="border-b border-gray-200 bg-white py-10 dark:border-gray-700 dark:bg-gray-800 sm:py-14">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-center text-xl font-semibold text-gray-900 dark:text-white">
              Os 12 raios de entrada
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {FLUXOS_SOL.map((fluxo) => (
                <FlowCard key={fluxo.slug} fluxo={fluxo} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-gray-200 bg-white py-10 dark:border-gray-700 dark:bg-gray-800 sm:py-14">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-center text-xl font-semibold text-gray-900 dark:text-white">
              Monetização MeJoy
            </h2>
            <div className="mx-auto max-w-2xl">
              <MonetizationTable />
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/formulas"
                className="inline-flex items-center gap-2 text-[color:var(--brand-600)] dark:text-[color:var(--brand-400)] font-semibold hover:underline"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Ver tabela completa de 33 fórmulas (componentes, doses e custos)
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-gray-200 bg-white py-10 dark:border-gray-700 dark:bg-gray-800 sm:py-14">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Dúvidas sobre os fluxos ou parcerias?
            </p>
            <a
              href="https://wa.me/5547999009923"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-brand-600 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-700"
            >
              Falar no WhatsApp
            </a>
          </div>
        </section>

        <FooterB2C />
      </div>
    </>
  );
}
