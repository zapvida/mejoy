'use client';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { EmagrecimentoCheckoutExperience } from '@/components/checkout/EmagrecimentoCheckoutExperience';
import {
  normalizeCheckoutTrilhaParam,
  trilhaFromPreferencia,
  type EmagrecimentoTrilha,
} from '@/lib/emagrecimento/checkoutUrls';

export default function CheckoutPage() {
  const router = useRouter();
  const reportId = readStringQuery(router.query.reportId);
  const triageId = readStringQuery(router.query.triageId);
  const plano = readStringQuery(router.query.plano) || 'programa-3m';
  const principio = readStringQuery(router.query.principio);
  const trilhaQuery = readStringQuery(router.query.trilha);
  const trilha = trilhaQuery
    ? (normalizeCheckoutTrilhaParam(trilhaQuery) as EmagrecimentoTrilha)
    : trilhaFromPreferencia(principio);

  return (
    <>
      <Head>
        <title>Checkout do Programa de Emagrecimento | Me Joy</title>
        <meta
          name="description"
          content="Fallback standalone do checkout Me Joy com pagamento seguro, PIX inline e liberacao do dashboard somente apos confirmacao."
        />
      </Head>

      <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbf8_0%,#edf7f0_28%,#f8fafc_100%)]">
        <div className="relative z-50">
          <HeaderZapfarm />
        </div>

        <div className="px-4 pb-16 pt-24 sm:px-6 md:pt-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Contingencia / deep link
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Checkout standalone do programa
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                Esta rota continua operacional para retomada, links diretos e contingencia. O fluxo principal agora vive dentro do relatorio, mas o mesmo checkout compartilhado roda aqui sem divergencia.
              </p>
            </div>

            <EmagrecimentoCheckoutExperience
              mode="standalone"
              allowPlanSelection
              reportId={reportId}
              triageId={triageId}
              defaultPlanId={plano}
              defaultTrilha={trilha}
              defaultPrincipio={principio}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function readStringQuery(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
