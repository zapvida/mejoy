'use client';

const FAQ_ITEMS = [
  {
    question: 'A consulta com médico é obrigatória?',
    answer:
      'Você começa pela triagem online. Quando há indicação clínica, a próxima etapa é a avaliação com médico habilitado antes de qualquer prescrição ou conduta.',
  },
  {
    question: 'Quanto custa começar?',
    answer:
      'A triagem inicial é gratuita. Valores de plano, acompanhamento e eventuais próximas etapas são apresentados com transparência antes de você avançar.',
  },
  {
    question: 'O que é o relatório personalizado?',
    answer:
      'É uma leitura organizada das suas respostas, com elegibilidade preliminar, alertas relevantes e próximos passos. Ele ajuda a transformar suas informações em contexto útil para a decisão clínica.',
  },
  {
    question: 'Como funciona o acompanhamento?',
    answer:
      'Você segue pelo canal oficial da Me Joy, com orientação sobre triagem, avaliação, plano e suporte. A ideia é reduzir dúvida e manter o cuidado em movimento.',
  },
  {
    question: 'Meus dados estão protegidos?',
    answer:
      'Sim. Dados de saúde são tratados com sigilo, boas práticas de segurança e conformidade com a LGPD. Você pode consultar as políticas do site para detalhes sobre uso e direitos.',
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
              className="mt-3 text-2xl font-bold tracking-[-0.04em] text-slate-950 sm:text-3xl md:text-4xl"
            >
              Perguntas comuns
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
