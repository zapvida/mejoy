import { cn } from '@/lib/utils';
import { trackFunnelEvent } from '@/lib/funnel/events-client';
import { buildZapVidaPlantaoUrl } from '@/config/zapfarm/emagrecimento-plans';

type LpVariant = 'A' | 'B' | 'C';

interface HeroSectionProps {
  variant?: LpVariant;
}

const variants = {
  A: {
    title: 'Sua jornada de emagrecimento começa com clareza clínica e plano personalizado',
    subtitle: 'Triagem inteligente no MeJoy, avaliação médica no ZapVida e continuidade guiada. Tudo 100% online, com decisão médica quando indicada.',
  },
  B: {
    title: 'Sua jornada de emagrecimento começa com clareza clínica e plano personalizado',
    subtitle: 'Triagem inteligente no MeJoy, avaliação médica no ZapVida e continuidade guiada. Tudo 100% online, com decisão médica quando indicada.',
  },
  C: {
    title: 'Sua jornada de emagrecimento começa com clareza clínica e plano personalizado',
    subtitle: 'Triagem inteligente no MeJoy, avaliação médica no ZapVida e continuidade guiada. Tudo 100% online, com decisão médica quando indicada.',
  },
};

const trustSignals = [
  'Triagem gratuita e objetiva',
  'Decisao medica quando indicada',
  'Pagamento seguro e continuidade no app',
  'Suporte oficial durante o fechamento',
];

export function HeroSection({ variant = 'A' }: HeroSectionProps) {
  const variantContent = variants[variant];

  return (
    <section className="relative flex min-h-[92vh] items-start justify-center overflow-hidden bg-[linear-gradient(135deg,#0c1714_0%,#124d3b_52%,#d97706_118%)] pt-12 text-white sm:pt-16 md:items-center md:pt-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.18),_transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:78px_78px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/10 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 pb-12 pt-16 text-center sm:px-6 sm:pb-16 sm:pt-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 shadow-[0_18px_40px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:text-xs">
            <span>Avaliacao digital</span>
            <span className="text-white/55">•</span>
            <span>Consulta medica quando indicada</span>
            <span className="text-white/55">•</span>
            <span>Continuidade no app MeJoy</span>
          </div>

          <h1 className="balance px-2 text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[0.98]">
            {variantContent.title}
          </h1>

          <p className="pretty mx-auto mb-8 mt-5 max-w-3xl px-2 text-base leading-relaxed text-white/86 sm:text-lg md:mb-10 md:text-xl lg:text-[1.4rem]">
            {variantContent.subtitle}
          </p>

          <div className="mx-auto mb-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/18 bg-white/10 px-4 py-4 text-left backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Passo 1</p>
              <p className="mt-2 text-sm font-semibold text-white sm:text-base">Triagem objetiva</p>
              <p className="mt-1 text-sm leading-relaxed text-white/78">Respostas claras, sem cadastro longo nem promessa vaga.</p>
            </div>
            <div className="rounded-[22px] border border-white/18 bg-white/10 px-4 py-4 text-left backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Passo 2</p>
              <p className="mt-2 text-sm font-semibold text-white sm:text-base">Relatorio em minutos</p>
              <p className="mt-1 text-sm leading-relaxed text-white/78">A elegibilidade e a trilha aparecem antes do fechamento.</p>
            </div>
            <div className="rounded-[22px] border border-white/18 bg-white/10 px-4 py-4 text-left backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Passo 3</p>
              <p className="mt-2 text-sm font-semibold text-white sm:text-base">Fechamento seguro</p>
              <p className="mt-1 text-sm leading-relaxed text-white/78">Pagamento, consulta e continuidade conectados na mesma jornada.</p>
            </div>
          </div>

          <div className="mb-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/triagem/emagrecimento"
              onClick={() => trackFunnelEvent('cta_start_triage', { source: 'hero_primary' })}
              className={cn(
                'inline-flex w-full max-w-sm items-center justify-center rounded-full bg-white px-7 py-4 text-base font-bold text-slate-950 shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#fff7ef] hover:shadow-[0_24px_55px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-800 sm:w-auto'
              )}
            >
              Iniciar triagem gratuita
            </a>
            <a
              href={buildZapVidaPlantaoUrl('hero_secondary')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackFunnelEvent('clinical_payment_started', { source: 'hero_secondary' })}
              className={cn(
                'inline-flex w-full max-w-sm items-center justify-center rounded-full border border-white/28 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition duration-200 hover:border-white/45 hover:bg-white/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-800 sm:w-auto sm:text-base'
              )}
            >
              Falar com medico antes
            </a>
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/78">
            <span>Sem reiniciar formulario na etapa seguinte</span>
            <span className="hidden text-white/40 sm:inline">•</span>
            <a
              href="#como-funciona"
              onClick={() => trackFunnelEvent('cta_start_triage', { source: 'hero_anchor' })}
              className="font-semibold text-white underline underline-offset-4 transition hover:text-white/80"
            >
              Ver como funciona em 2 minutos
            </a>
          </div>

          <div className="mx-auto grid max-w-4xl gap-3 px-2 sm:grid-cols-2 lg:grid-cols-4">
            {trustSignals.map((signal) => (
              <div
                key={signal}
                className="rounded-[18px] border border-white/16 bg-black/10 px-4 py-3 text-sm text-white/90 backdrop-blur-sm"
              >
                {signal}
              </div>
            ))}
          </div>

          <p className="mt-6 px-2 text-xs text-white/72 sm:text-sm">
            Medicos registrados • prescricao somente quando indicada • experiencia online com continuidade real
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 motion-safe:animate-bounce md:block">
        <svg className="h-6 w-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
