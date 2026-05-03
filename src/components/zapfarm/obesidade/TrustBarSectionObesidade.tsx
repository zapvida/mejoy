'use client';

import {
  ShieldCheckIcon,
  BuildingOffice2Icon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

const items = [
  {
    icon: ShieldCheckIcon,
    label: 'Médicos com CRM',
    sub: 'Avaliação clínica com critério',
  },
  {
    icon: ShieldCheckIcon,
    label: 'Privacidade e LGPD',
    sub: 'Dados tratados com boas práticas',
  },
  {
    icon: BuildingOffice2Icon,
    label: 'Conformidade clínica',
    sub: 'Fluxo alinhado a telemedicina',
  },
  {
    icon: DevicePhoneMobileIcon,
    label: 'Atendimento 100% online',
    sub: 'Triagem, consulta e acompanhamento',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    label: 'WhatsApp oficial',
    sub: 'Resumo e próximos passos no canal',
  },
  {
    icon: ClipboardDocumentCheckIcon,
    label: 'Próximos passos claros',
    sub: 'Menos dúvida e menos fricção',
  },
] as const;

export function TrustBarSectionObesidade() {
  return (
    <section
      className="border-y border-emerald-100 bg-gradient-to-r from-zinc-50 via-white to-emerald-50/60 py-6 sm:py-8"
      aria-label="Selos de confiança"
      data-home-section="trust-bar"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid max-w-6xl grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 xl:grid-cols-6 mx-auto">
          {items.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 text-center sm:gap-3"
            >
              <div className="rounded-full bg-emerald-100 p-3 text-emerald-700 ring-1 ring-emerald-200/80">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 sm:text-base">{label}</p>
                <p className="mt-1 text-xs leading-snug text-gray-600 sm:text-sm">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
