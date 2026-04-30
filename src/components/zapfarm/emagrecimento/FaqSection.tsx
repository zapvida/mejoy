'use client';

import { useState } from 'react';
import { RefinedCard } from '@/components/ui/RefinedCard';
import { RefinedButton } from '@/components/ui/RefinedButton';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    // Segurança & ANVISA
    {
      category: 'Segurança & ANVISA',
      question: 'Quais as novas regras da ANVISA para medicamentos para emagrecer?',
      answer: 'A ANVISA implementou novas regras para medicamentos utilizados no emagrecimento, visando maior segurança. Principais mudanças: retenção de receita (prescrição em duas vias, sendo uma retida pela farmácia), validade da receita de 90 dias, e registro obrigatório no Sistema Nacional de Gerenciamento de Produtos Controlados (SNGPC). Essas medidas visam garantir que os tratamentos sejam realizados com acompanhamento médico adequado.',
    },
    {
      category: 'Segurança & ANVISA',
      question: 'Esse tratamento é seguro? E os efeitos colaterais?',
      answer: 'Sim, quando indicado e acompanhado por médico, o tratamento é seguro. Os efeitos colaterais mais comuns são náusea, perda de apetite e desconforto gastrointestinal leve, geralmente temporários e manejáveis. Haverá acompanhamento médico contínuo para gerenciar qualquer efeito colateral e ajustar a dose conforme necessário. Todo tratamento segue normas do CFM e ANVISA.',
    },
    // Tratamento & medicamentos
    {
      category: 'Tratamento & medicamentos',
      question: 'Quem pode usar esses medicamentos?',
      answer: 'Medicamentos modernos para obesidade são indicados para pessoas com IMC ≥ 30, ou IMC ≥ 27 com comorbidades como diabetes tipo 2, pré-diabetes, hipertensão ou apneia do sono. O médico avaliará caso a caso para garantir segurança e adequação do tratamento. Sempre é necessária avaliação médica individual.',
    },
    {
      category: 'Tratamento & medicamentos',
      question: 'E se eu não puder usar medicações injetáveis?',
      answer: 'Se você não tiver indicação ou preferir não usar medicação injetável, oferecemos um plano alternativo de emagrecimento com acompanhamento nutricional, coaching de hábitos saudáveis e outras abordagens não medicamentosas. Nossa equipe encontrará a melhor solução para você, sempre com base em evidências científicas.',
    },
    {
      category: 'Tratamento & medicamentos',
      question: 'Eu preciso de receita médica? Como obtenho a medicação?',
      answer: 'Sim, você precisa de receita médica. Nosso médico endocrinologista irá prescrever eletronicamente após avaliação completa. A Me Joy cuida de tudo, incluindo a compra e entrega da medicação em farmácias parceiras credenciadas, conforme legislação vigente.',
    },
    // Exames & acompanhamento
    {
      category: 'Exames & acompanhamento',
      question: 'Preciso fazer exames antes?',
      answer: 'Sim, serão solicitados exames de sangue antes e durante o tratamento (especialmente para planos trimestral/semestral) para acompanhamento seguro. Isso mostra nosso cuidado e personalização médica, garantindo que o tratamento seja adequado para você.',
    },
    {
      category: 'Exames & acompanhamento',
      question: 'Como funciona a entrega e o armazenamento do medicamento?',
      answer: 'A medicação é enviada em embalagem refrigerada para todo Brasil, com segurança e instruções de uso/aplicação. Você também pode optar por retirar em farmácia parceira local com a receita digital. O armazenamento deve seguir as instruções do fabricante e da farmácia.',
    },
    // Preço & cancelamento
    {
      category: 'Preço & cancelamento',
      question: 'Qual o custo do programa?',
      answer: 'Oferecemos três planos: Consulta Única, Vida Leve (recomendado) e Vida Premium. Todos incluem consulta médica, quando indicado medicamento e suporte. Os preços variam conforme o plano escolhido e podem ser parcelados. Consulte os valores no checkout após a triagem.',
    },
    {
      category: 'Preço & cancelamento',
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim, você pode cancelar planos longos com reembolso proporcional das doses não utilizadas. Planos mensais podem ser cancelados a qualquer momento sem multa. Oferecemos garantia de satisfação conforme nossos termos de uso.',
    },
    {
      category: 'Preço & cancelamento',
      question: 'Tem reembolso?',
      answer: 'Sim, oferecemos reembolso proporcional para planos longos quando cancelados antes do término. Planos mensais podem ser cancelados sem multa. Consulte nossos termos de uso para mais detalhes sobre a política de reembolso.',
    },
    // Outras
    {
      category: 'Outras',
      question: 'Tenho medo de engordar tudo de novo.',
      answer: 'Entendemos sua preocupação. Por isso, nosso programa inclui acompanhamento contínuo, orientação nutricional e suporte para manutenção dos resultados. O objetivo é criar hábitos sustentáveis que ajudem a manter o peso perdido a longo prazo. Você não estará sozinho(a) nessa jornada.',
    },
    {
      category: 'Outras',
      question: 'Qual a diferença pra ir num endocrinologista presencial?',
      answer: 'A principal diferença é a conveniência e o acompanhamento contínuo. Com a Me Joy, você tem acesso a especialistas em obesidade, relatórios detalhados com tecnologia avançada, acompanhamento entre consultas e tudo 100% online. Além disso, os medicamentos são entregues em casa. O nível de cuidado médico é o mesmo, com mais praticidade.',
    },
    {
      category: 'Outras',
      question: 'Como funciona a triagem online?',
      answer: 'A triagem é um formulário online rápido com cerca de 10 perguntas sobre seu peso, altura, histórico de saúde e objetivos. Leva apenas 1-3 minutos. Com base nas suas respostas, nossa plataforma inteligente + equipe médica organizam um relatório inicial com recomendações e próximos passos.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-zinc-50 to-brand-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Perguntas Frequentes
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Tire suas dúvidas sobre o programa Me Joy
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <RefinedCard
                key={index}
                padding="sm"
                rounded="xl"
                variant="default"
                className="overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-4 sm:px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-50 transition-colors gap-3"
                >
                  <div className="flex-1">
                    {faq.category && (
                      <span className="text-xs text-brand-600 font-semibold uppercase mb-1 block">
                        {faq.category}
                      </span>
                    )}
                    <span className="text-base sm:text-lg font-semibold text-foreground leading-tight block">
                      {faq.question}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-brand-600 transition-transform flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-4 sm:px-6 py-4 bg-zinc-50 border-t border-zinc-200">
                    <p className="text-sm sm:text-base text-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </RefinedCard>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-base sm:text-lg text-foreground mb-6">
              Se ainda ficou alguma dúvida, você pode tirar diretamente com o médico.
            </p>
            <RefinedButton
              variant="primary"
              size="lg"
              asChild
            >
              <a href="/triagem/emagrecimento">
                Começar pela triagem online
              </a>
            </RefinedButton>
          </div>
        </div>
      </div>
    </section>
  );
}
