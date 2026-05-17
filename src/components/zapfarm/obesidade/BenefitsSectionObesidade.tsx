'use client';

import { DevicePhoneMobileIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const proofCards = [
  {
    icon: ShieldCheckIcon,
    title: 'Avaliação antes da prescrição',
    text: 'A decisão depende do seu perfil, histórico e consulta. Medicamento só entra quando houver indicação médica.',
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Jornada no seu ritmo',
    text: 'Triagem, relatório, WhatsApp, dashboard e checkout seguem no mesmo caminho, sem repetir tudo a cada etapa.',
  },
  {
    icon: UserGroupIcon,
    title: 'Operação de cuidado',
    text: 'Quando houver prescrição e região atendida, a jornada organiza medicação original, orientação e entrega expressa.',
  },
] as const;

export function BenefitsSectionObesidade() {
  return (
    <section
      className="bg-white py-12 sm:py-14 md:py-16"
      data-home-section="benefits"
      data-testid="emagrecimento-proof"
      aria-labelledby="emagrecimento-proof-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Por que funciona</p>
            <h2
              id="emagrecimento-proof-heading"
              className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl"
            >
              Valor alto porque a jornada é completa
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              O programa não vende uma medicação solta. Ele organiza triagem, avaliação médica, suporte, app,
              acompanhamento e próximos passos em uma experiência única.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-600">
              {[
                'Médicos com CRM',
                'LGPD e privacidade',
                'WhatsApp oficial',
                'Dashboard MeJoy',
                'Entrega expressa onde disponível',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-emerald-100 bg-white px-4 py-2 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {proofCards.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-[28px] border border-emerald-100 bg-[#fcfffd] p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)] sm:p-6"
              >
                <div className="inline-flex rounded-2xl bg-emerald-100 p-3 text-emerald-800 ring-1 ring-emerald-200">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-950 sm:text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
