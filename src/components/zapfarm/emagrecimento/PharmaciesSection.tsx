import { RefinedCard } from '@/components/ui/RefinedCard';

export function PharmaciesSection() {
  const pharmacies = [
    {
      name: 'Farmácia Parceira SP',
      cnpj: '00.000.000/0001-00',
      responsible: 'Responsável técnico credenciado',
      crf: 'CRF ativo',
      city: 'São Paulo',
      uf: 'SP',
    },
    {
      name: 'Farmácia Parceira RJ',
      cnpj: '00.000.000/0002-00',
      responsible: 'Responsável técnico credenciado',
      crf: 'CRF ativo',
      city: 'Rio de Janeiro',
      uf: 'RJ',
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-yellow-50 to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Farmácias e clínicas credenciadas, dentro da lei
            </h2>
          </div>

          <RefinedCard
            padding="lg"
            rounded="xl"
            variant="default"
            className="mb-8 bg-white border-yellow-200"
          >
            <p className="text-base sm:text-lg text-foreground leading-relaxed text-center">
              <strong>A MeJoy não é uma farmácia.</strong> As consultas são realizadas por clínicas e profissionais parceiros, e os medicamentos, quando prescritos, são dispensados por farmácias com CNPJ regular e responsável técnico (CRF) registrado, seguindo normas da ANVISA.
            </p>
            <p className="mt-3 text-center text-xs sm:text-sm text-muted-foreground">
              Lista representativa de parceiros operacionais. A farmácia efetiva pode variar conforme região e disponibilidade.
            </p>
          </RefinedCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {pharmacies.map((pharmacy, index) => (
              <RefinedCard
                key={index}
                padding="lg"
                rounded="xl"
                variant="default"
                className="bg-white border-yellow-200"
                hover
              >
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                  {pharmacy.name}
                </h3>
                <div className="space-y-2 text-sm sm:text-base text-foreground">
                  <p>
                    <strong>CNPJ:</strong> {pharmacy.cnpj}
                  </p>
                  <p>
                    <strong>Responsável Técnico:</strong> {pharmacy.responsible}
                  </p>
                  <p>
                    <strong>CRF:</strong> {pharmacy.crf}
                  </p>
                  <p>
                    <strong>Localização:</strong> {pharmacy.city}, {pharmacy.uf}
                  </p>
                </div>
              </RefinedCard>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="mailto:contato@mejoy.com.br"
              className="inline-block text-brand-600 hover:text-brand-700 font-semibold text-sm sm:text-base transition-colors underline"
            >
              Quero ser uma farmácia credenciada →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
