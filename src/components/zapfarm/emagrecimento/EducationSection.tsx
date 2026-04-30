import { RefinedCard } from '@/components/ui/RefinedCard';
import { RefinedButton } from '@/components/ui/RefinedButton';

export function EducationSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-zinc-50 to-brand-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Por que isso é mais do que estética
            </h2>
          </div>

          <RefinedCard padding="xl" rounded="xl" variant="default">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Riscos à saúde
                </h3>
                <p className="text-base sm:text-lg text-foreground leading-relaxed">
                  Obesidade e sobrepeso aumentam o risco de desenvolver diabetes tipo 2, pressão alta, gordura no fígado (esteatose hepática), apneia do sono, problemas articulares e eventos cardiovasculares como infarto e acidente vascular cerebral.
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Como funciona no seu corpo
                </h3>
                <p className="text-base sm:text-lg text-foreground leading-relaxed mb-4">
                  O corpo tem hormônios que regulam fome e saciedade, como grelina e leptina. Quando esse sistema está desregulado por fatores genéticos, falta de sono, estresse crônico ou outros fatores, pode ser difícil controlar o peso apenas com força de vontade. É por isso que a obesidade é reconhecida como doença crônica complexa.
                </p>
                <p className="text-base sm:text-lg text-foreground leading-relaxed font-semibold">
                  Obesidade é uma doença complexa, não falta de vergonha na cara.
                </p>
              </div>

              <RefinedCard
                padding="lg"
                rounded="lg"
                variant="subtle"
                className="bg-gradient-to-br from-brand-50 to-zinc-50"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                  Você sabia?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-brand-500 text-xl flex-shrink-0">💡</span>
                    <p className="text-sm sm:text-base text-foreground leading-relaxed">
                      Dormir menos de 6 horas por noite aumenta hormônios da fome (grelina) e reduz hormônios da saciedade (leptina), dificultando o controle do peso.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-500 text-xl flex-shrink-0">💡</span>
                    <p className="text-sm sm:text-base text-foreground leading-relaxed">
                      Perder 5% do peso já reduz gordura visceral e melhora vários marcadores metabólicos, como pressão arterial e controle glicêmico.
                    </p>
                  </li>
                </ul>
              </RefinedCard>

              <div className="pt-6 text-center">
                <RefinedButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  asChild
                >
                  <a href="/triagem/emagrecimento">
                    Quero saber meu risco e receber um plano personalizado
                  </a>
                </RefinedButton>
              </div>
            </div>
          </RefinedCard>
        </div>
      </div>
    </section>
  );
}

