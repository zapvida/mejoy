'use client';

import { motion } from 'framer-motion';
import { RefinedCard } from '@/components/ui/RefinedCard';

export function BenefitsSection() {
  const benefits = [
    {
      icon: '🩺',
      title: 'Aprovado e Seguro',
      description: 'Tratamento aprovado pela Anvisa, com prescrição médica e monitoramento de segurança.',
    },
    {
      icon: '👨‍⚕️',
      title: 'Médicos Especialistas',
      description: 'Acompanhamento por endocrinologistas experientes, atendimento humanizado e personalizado.',
    },
    {
      icon: '💉',
      title: 'Medicação de Ponta',
      description: 'Utilizamos a tirzepatida (Mounjaro®), a mais nova geração de medicamento para emagrecimento, com resultados superiores.',
    },
    {
      icon: '📊',
      title: 'Resultados Reais',
      description: 'Resultados sustentáveis: nossos pacientes alcançaram em média 15% de redução do peso em 6–12 meses.',
    },
    {
      icon: '🍎',
      title: 'Programa Completo',
      description: 'Plano alimentar e de exercícios incluso, ajuste de hábitos de vida para manter o peso perdido.',
    },
    {
      icon: '📱',
      title: 'Facilidade e Conveniência',
      description: 'Sem burocracia: tudo 100% online, entrega do medicamento em domicílio refrigerada, suporte pelo WhatsApp.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Por que escolher a Me Joy?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Um programa completo de emagrecimento com acompanhamento médico especializado
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
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
          {benefits.map((benefit, index) => (
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
                className="bg-gradient-to-br from-white to-zinc-50"
              >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight">
                {benefit.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
              </RefinedCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

