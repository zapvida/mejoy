'use client';

import { motion } from 'framer-motion';
import { RefinedCard } from '@/components/ui/RefinedCard';

export function TreatmentsSection() {
  const treatments = [
    {
      title: 'Mudança de estilo de vida',
      subtitle: 'Sempre a base do tratamento',
      items: [
        'Alimentação equilibrada',
        'Atividade física',
        'Sono adequado',
        'Manejo do estresse',
      ],
      icon: '🥗',
    },
    {
      title: 'Medicações modernas',
      subtitle: 'Quando indicadas',
      description: 'Agem em receptores do intestino e cérebro para ajudar a regular fome e saciedade.',
      indication: 'Para quem costuma ser indicado: IMC ≥ 30 ou IMC ≥ 27 com comorbidade (diabetes, pressão alta, apneia do sono, etc.).',
      note: 'Sempre com prescrição médica e acompanhamento.',
      icon: '💉',
    },
    {
      title: 'Acompanhamento e suporte contínuo',
      subtitle: 'Fundamental para resultados duradouros',
      items: [
        'Consultas de seguimento',
        'Ajuste de medicação quando necessário',
        'Orientação de hábitos',
        'Monitoramento de exames',
      ],
      icon: '🤝',
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-white">
            Tratamentos modernos para obesidade, com segurança
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Como médico, vejo que o tratamento da obesidade exige uma abordagem completa: mudança de estilo de vida, medicação quando indicada e acompanhamento contínuo. Sempre de forma segura, seguindo as normas da ANVISA.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-10"
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
          {treatments.map((treatment, index) => (
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
                className="bg-zinc-800/50 backdrop-blur-sm border-zinc-700 text-white"
                hover
              >
              <div className="text-4xl mb-4">{treatment.icon}</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">{treatment.title}</h3>
              <p className="text-white/70 text-sm mb-4">{treatment.subtitle}</p>
              
              {treatment.items && (
                <ul className="space-y-2 mb-4">
                  {treatment.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm sm:text-base text-white/90">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {treatment.description && (
                <p className="text-sm sm:text-base text-white/80 mb-3 leading-relaxed">
                  {treatment.description}
                </p>
              )}
              
              {treatment.indication && (
                <p className="text-xs sm:text-sm text-white/70 mb-3 italic">
                  {treatment.indication}
                </p>
              )}
              
              {treatment.note && (
                <p className="text-xs text-white/60 italic border-t border-zinc-700 pt-3 mt-3">
                  {treatment.note}
                </p>
              )}
              </RefinedCard>
            </motion.div>
          ))}
        </motion.div>

        <RefinedCard
          padding="lg"
          rounded="xl"
          variant="default"
          className="bg-red-900/30 backdrop-blur-sm border-red-500/50 max-w-4xl mx-auto mb-8"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">O que NÃO fazemos:</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm sm:text-base text-white/90">
              <span className="text-red-400 mt-1">✗</span>
              <span>Não prometemos resultado rápido ou milagroso</span>
            </li>
            <li className="flex items-start gap-3 text-sm sm:text-base text-white/90">
              <span className="text-red-400 mt-1">✗</span>
              <span>Não vendemos medicamento sem receita</span>
            </li>
            <li className="flex items-start gap-3 text-sm sm:text-base text-white/90">
              <span className="text-red-400 mt-1">✗</span>
              <span>Não utilizamos tratamentos fora das normas de segurança</span>
            </li>
          </ul>
        </RefinedCard>

        <RefinedCard
          padding="lg"
          rounded="xl"
          variant="default"
          className="bg-yellow-900/40 backdrop-blur-sm border-yellow-500/50 max-w-4xl mx-auto mb-6"
        >
          <p className="text-sm sm:text-base text-white leading-relaxed text-center font-semibold">
            <strong>Todo tratamento é indicado e acompanhado por médicos, conforme normas do CFM e ANVISA. Este site não substitui consulta presencial quando necessária.</strong>
          </p>
        </RefinedCard>

        <div className="text-center">
          <a
            href="/emagrecimento/tratamentos"
            className="text-sm sm:text-base text-white/80 hover:text-white font-medium underline transition-colors"
          >
            Veja todos os detalhes dos tratamentos →
          </a>
        </div>
      </div>
    </section>
  );
}
