'use client';

import { motion } from 'framer-motion';
import { RefinedCard } from '@/components/ui/RefinedCard';
import { RefinedButton } from '@/components/ui/RefinedButton';

export function ResultsSection() {
  const testimonials = [
    {
      name: 'Maria S.',
      age: 38,
      location: 'São Paulo',
      result: 'Perdi 12 kg em 4 meses e saí do pré-diabetes',
      quote: 'O acompanhamento médico fez toda diferença – me senti segura o tempo todo.',
      rating: 5,
    },
    {
      name: 'João P.',
      age: 45,
      location: 'Rio de Janeiro',
      result: 'Em 1 mês perdi 5 kg',
      quote: 'Já tinha tentado de tudo sem sucesso. Com a Me Joy, a injeção tira a fome e o médico ajustou minhas metas. Estou muito mais confiante!',
      rating: 5,
    },
    {
      name: 'Ana L.',
      age: 32,
      location: 'Belo Horizonte',
      result: 'Perdi 8 kg em 3 meses',
      quote: 'O suporte nutricional e médico foi essencial. Não é só tomar remédio, é um programa completo.',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Histórias reais de pessoas que decidiram tratar a obesidade como doença
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Na prática do consultório, vemos resultados reais. Mais de 500 pessoas já começaram sua transformação com acompanhamento médico.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
            <span className="text-2xl sm:text-3xl">★★★★★</span>
            <span className="text-base sm:text-lg font-semibold text-foreground">4.8/5</span>
            <span className="text-sm sm:text-base text-muted-foreground">(132 avaliações)</span>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
            >
              <RefinedCard
                padding="lg"
                rounded="xl"
                variant="default"
                className="bg-gradient-to-br from-white to-zinc-50"
                hover
              >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm sm:text-base">★</span>
                ))}
              </div>
              <p className="text-sm sm:text-base text-foreground mb-4 italic leading-relaxed">"{testimonial.quote}"</p>
              <div className="border-t border-zinc-200 pt-4">
                <p className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {testimonial.age} anos, {testimonial.location}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-brand-600 mt-2">{testimonial.result}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-200 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-full">
                  <span className="text-green-600">✓</span>
                  <span>Paciente verificado</span>
                </span>
              </div>
              </RefinedCard>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 space-y-6">
          <div className="text-center">
            <RefinedButton
              variant="primary"
              size="lg"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).analytics) {
                  (window as any).analytics.track('view_resultados_page');
                }
              }}
              asChild
            >
              <a href="/emagrecimento/resultados">
                Ver mais histórias reais →
              </a>
            </RefinedButton>
          </div>
          <RefinedCard
            padding="md"
            rounded="lg"
            variant="subtle"
            className="max-w-2xl mx-auto bg-zinc-50"
          >
            <p className="text-xs sm:text-sm text-muted-foreground text-center italic">
              <strong>Disclaimer:</strong> Resultados individuais. Cada organismo responde de forma diferente.
            </p>
          </RefinedCard>
        </div>
      </div>
    </section>
  );
}

