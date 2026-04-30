'use client';

import { motion } from 'framer-motion';
import { RefinedCard } from '@/components/ui/RefinedCard';

export function StatsSection() {
  const stats = [
    {
      number: 'Até 20%',
      title: 'de perda de peso',
      description: 'Estudos com medicações modernas para obesidade mostram perda de até cerca de 20% do peso corporal em 1-2 anos em pessoas com obesidade, quando bem indicadas e acompanhadas.',
      disclaimer: 'Resultados individuais variam. Tratamento sob prescrição médica.',
      source: 'Baseado em grandes estudos com medicamentos modernos para obesidade',
    },
    {
      number: '5-10%',
      title: 'Pequenas perdas, grandes resultados',
      description: 'Perder apenas 5-10% do peso já pode melhorar de forma importante pressão arterial, açúcar no sangue e gordura no fígado.',
      disclaimer: '',
      source: 'Baseado em diretrizes de tratamento da obesidade',
    },
    {
      number: 'Doença',
      title: 'Obesidade é doença crônica, não falha de caráter',
      description: 'Sociedades médicas reconhecem a obesidade como doença crônica que exige acompanhamento regular, e não culpa ou "falta de força de vontade".',
      disclaimer: '',
      source: 'Reconhecido por sociedades médicas internacionais',
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Estatísticas e evidências científicas
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Dados baseados em estudos clínicos, não em opiniões
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
            >
              <RefinedCard
                hover
                padding="lg"
                rounded="xl"
                variant="default"
                className="bg-gradient-to-br from-zinc-50 to-brand-50/30 text-center"
              >
              <div className="mb-4">
                <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-600 mb-2">
                  {stat.number}
                </p>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 leading-tight">
                  {stat.title}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-foreground leading-relaxed mb-4">
                {stat.description}
              </p>
              {stat.disclaimer && (
                <p className="text-xs text-muted-foreground italic mb-3">
                  {stat.disclaimer}
                </p>
              )}
              <p className="text-xs text-muted-foreground border-t border-zinc-200 pt-3">
                {stat.source}
              </p>
              </RefinedCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

