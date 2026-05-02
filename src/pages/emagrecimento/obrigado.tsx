import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';

export default function ObrigadoPage() {
  const router = useRouter();
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    const queryReportId =
      typeof router.query.reportId === 'string'
        ? router.query.reportId
        : typeof router.query.id === 'string'
          ? router.query.id
          : null;

    if (queryReportId) {
      setReportId(queryReportId);
      return;
    }

    if (typeof window === 'undefined') return;
    const storedReportId = localStorage.getItem('zapfarm_report_id');
    if (storedReportId) {
      setReportId(storedReportId);
    }
  }, [router.query.id, router.query.reportId]);

  return (
    <>
      <Head>
        <title>Compra confirmada | Me Joy</title>
        <meta
          name="description"
          content="Seu programa MeJoy foi confirmado. Veja os próximos passos para seguir com avaliação e acompanhamento."
        />
      </Head>

      <div className="min-h-screen bg-[#f7f6f2] text-[#2f2925]">
        <div className="relative z-50">
          <HeaderZapfarm
            mode="report"
            primaryCtaHref="/emagrecimento"
            primaryCtaLabel="Ver programa"
            primaryCtaMobileLabel="Programa"
          />
        </div>

        <main className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 md:pt-28">
          <section className="rounded-[2.5rem] border border-slate-200 bg-white px-6 py-10 shadow-[0_28px_80px_rgba(15,23,42,0.08)] sm:px-10 sm:py-14">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4d6d56]">
                Pagamento confirmado
              </p>
              <h1 className="mt-4 text-[clamp(2.2rem,6vw,4.6rem)] font-semibold tracking-[-0.06em] text-[#2f2925]">
                Seu programa MeJoy já está em andamento
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Agora seguimos com contato, confirmação operacional e continuidade clínica no mesmo fluxo do seu relatório.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Contato oficial',
                  body: 'Nossa equipe entra em contato pelo WhatsApp cadastrado para orientar os próximos passos.',
                },
                {
                  step: '2',
                  title: 'Confirmação do programa',
                  body: 'Você recebe confirmação com detalhes da trilha, agenda e acompanhamento correspondente ao plano.',
                },
                {
                  step: '3',
                  title: 'Avaliação e continuidade',
                  body: 'A conduta médica e eventuais prescrições seguem a consulta obrigatória e critérios clínicos.',
                },
              ].map(item => (
                <article
                  key={item.step}
                  className="rounded-[2rem] border border-slate-200 bg-[#fbfbf8] p-5 text-left shadow-[0_16px_40px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2f2925] text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <h2 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-[#2f2925]">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-[2rem] border border-[#dfe8d8] bg-[#f3f7f1] p-6 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4d6d56]">Próximo passo imediato</p>
              <p className="mt-3 text-base leading-7 text-slate-700 sm:text-lg">
                Se precisar, você já pode revisar seu relatório novamente ou falar com o time clínico para alinhar dúvidas antes do início do acompanhamento.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-start">
                {reportId ? (
                  <a
                    href={`/api/pdf/report?id=${reportId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Baixar relatório em PDF
                  </a>
                ) : null}
                <a
                  href="/emagrecimento/especialistas"
                  className="inline-flex items-center justify-center rounded-full bg-[#2f2925] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#201b18]"
                >
                  Ver especialistas →
                </a>
                <a
                  href="/emagrecimento"
                  className="inline-flex items-center justify-center rounded-full border border-[#93b28d] bg-[#eef4eb] px-6 py-3 text-sm font-semibold text-[#35503b] transition-colors hover:bg-[#e5eee1]"
                >
                  Voltar para o programa
                </a>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-slate-500">
              <p>Contato oficial: contato@mejoy.com.br</p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
