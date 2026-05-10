import Image from 'next/image';
import { RefinedCard } from '@/components/ui/RefinedCard';
import { EMAGRECIMENTO_SPECIALIST_ASSETS } from '@/lib/emagrecimento-lp-assets';

export function SpecialistsSection() {
  const specialists = EMAGRECIMENTO_SPECIALIST_ASSETS.specialistCards;

  const supportAreas = [
    'Rotina Alimentar',
    'Reação ao medicamento',
    'Compulsão alimentar',
    'Fome emocional',
    'Sono e estresse',
    'Dúvidas sobre tratamentos',
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-white">
              Quem cuida de você
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Time de especialistas disponível todos os dias
            </p>
          </div>

          <RefinedCard
            padding="md"
            rounded="xl"
            variant="default"
            className="mb-8 bg-zinc-800/50 backdrop-blur-sm border-zinc-700 text-center"
          >
            <p className="text-sm sm:text-base text-white/90">
              <strong>Atendimento sempre feito por médicos registrados e farmácias credenciadas.</strong>
            </p>
          </RefinedCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
            {specialists.map((specialist, index) => (
              <RefinedCard
                key={index}
                padding="lg"
                rounded="xl"
                variant="default"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
                hover
              >
                <div className="text-center mb-4">
                  <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-white/30">
                    <Image
                      src={specialist.photo}
                      alt={specialist.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                    {specialist.title}
                  </h3>
                  <p className="text-sm text-white/70 mb-2">{specialist.subtitle}</p>
                </div>
                <p className="text-sm text-white/80 text-center leading-relaxed">
                  {specialist.focus}
                </p>
              </RefinedCard>
            ))}
          </div>

          <RefinedCard
            padding="lg"
            rounded="xl"
            variant="default"
            className="bg-white/10 backdrop-blur-sm border-white/20"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center">
              Áreas de suporte disponíveis
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {supportAreas.map((area, index) => (
                <RefinedCard
                  key={index}
                  padding="sm"
                  rounded="lg"
                  variant="subtle"
                  className="bg-white/10 border-white/20 text-center text-sm text-white/90"
                >
                  {area}
                </RefinedCard>
              ))}
            </div>
          </RefinedCard>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm sm:text-base text-white/80">
              O time foi desenhado para responder com clareza, seguranca e continuidade ao longo da jornada.
            </p>
            <div>
              <a
                href="/emagrecimento/especialistas"
                className="text-sm sm:text-base text-white/80 hover:text-white font-medium underline transition-colors"
              >
                Conheça todo o time de especialistas →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
