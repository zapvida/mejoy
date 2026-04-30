'use client';

import {
  ShieldCheckIcon,
  BuildingOffice2Icon,
  DevicePhoneMobileIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const items = [
  {
    icon: ShieldCheckIcon,
    label: 'Médicos com CRM',
    sub: 'Avaliação clínica e prescrição somente quando indicada',
  },
  {
    icon: ShieldCheckIcon,
    label: 'Privacidade e LGPD',
    sub: 'Dados de saúde tratados com boas práticas de segurança',
  },
  {
    icon: BuildingOffice2Icon,
    label: 'Conformidade regulatória',
    sub: 'Fluxo sob orientação médica e operação regular',
  },
  {
    icon: DevicePhoneMobileIcon,
    label: 'Atendimento 100% online',
    sub: 'Triagem, consulta e acompanhamento no mesmo ecossistema',
  },
  {
    icon: TruckIcon,
    label: 'Operação estruturada',
    sub: 'Organização de próximos passos com clareza para o paciente',
  },
] as const;

export function TrustBarSectionObesidade() {
  return (
    <section
      className="border-y border-emerald-100 bg-gradient-to-r from-zinc-50 via-white to-emerald-50/60 py-6 sm:py-8"
      aria-label="Selos de confiança"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {items.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-2 sm:gap-3"
            >
              <div className="rounded-full bg-emerald-100 p-3 text-emerald-700 ring-1 ring-emerald-200/80">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-gray-900">{label}</p>
                <p className="text-xs sm:text-sm text-gray-600 leading-snug mt-1">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
