'use client';

const FAQ_ITEMS = [
  {
    question: 'A consulta com médico é obrigatória?',
    answer:
      'A triagem é online e gratuita. Quando indicada, abrimos a consulta com médico para avaliar seu caso com critério clínico antes de qualquer prescrição.',
  },
  {
    question: 'Quanto custa começar?',
    answer:
      'A triagem online é gratuita e gera um relatório personalizado. Os planos com acompanhamento médico são apresentados após o relatório, com transparência de preços.',
  },
  {
    question: 'O que é o relatório personalizado?',
    answer:
      'É um resumo organizado dos seus dados, com elegibilidade preliminar e próximos passos sugeridos. Ele orienta a conversa com o médico sem antecipar prescrição.',
  },
  {
    question: 'Como funciona o acompanhamento?',
    answer:
      'Pelo canal oficial da Me Joy no WhatsApp, com clareza sobre cada etapa: triagem, consulta, plano e suporte contínuo durante o programa.',
  },
  {
    question: 'Meus dados estão protegidos?',
    answer:
      'Sim. Tratamos seus dados com sigilo, criptografia e em conformidade com a LGPD. Você controla seus dados e pode solicitar exclusão a qualquer momento.',
  },
] as const;

export function HomeFAQ() {
  return (
    <section
      id="faq"
      className="bg-[#f7faf7] py-14 sm:py-16 md:py-20"
      data-home-section="faq"
      aria-labelledby="home-faq-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Dúvidas frequentes</p>
            <h2
              id="home-faq-heading"
              className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl md:text-5xl"
            >
              Tire suas dúvidas antes de começar
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {FAQ_ITEMS.map(({ question, answer }) => (
              <details
                key={question}
                className="group rounded-[24px] border border-emerald-100 bg-white open:shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <p className="text-base font-bold text-slate-950 sm:text-lg">{question}</p>
                  <span
                    aria-hidden
                    className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-emerald-200 text-xl font-light text-emerald-700 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="border-t border-emerald-50 px-5 py-4 text-sm leading-relaxed text-slate-600 sm:px-6 sm:text-base">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
