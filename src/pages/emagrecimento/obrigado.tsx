import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { trackFunnelEvent } from '@/lib/funnel/events-client';

type AccessState = 'loading' | 'confirmed' | 'pending' | 'error';

export default function ObrigadoPage() {
  const router = useRouter();
  const paymentId = readStringQuery(router.query.paymentId);
  const queryReportId = readStringQuery(router.query.reportId);
  const appReturnUrl = readStringQuery(router.query.appReturnUrl);
  const [reportId, setReportId] = useState<string | null>(queryReportId || null);
  const [accessState, setAccessState] = useState<AccessState>(paymentId ? 'loading' : 'confirmed');
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedReportId = typeof window !== 'undefined' ? localStorage.getItem('zapfarm_report_id') : null;
    if (!reportId && storedReportId) {
      setReportId(storedReportId);
    }
  }, [reportId]);

  useEffect(() => {
    if (!paymentId) return;

    let cancelled = false;
    setAccessState('loading');

    fetch(`/api/asaas/payment-dashboard-link?paymentId=${paymentId}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 409) {
            setAccessState('pending');
            return;
          }
          throw new Error(data.message || 'Nao foi possivel validar o pagamento.');
        }

        if (cancelled) return;
        setDashboardUrl(data.magicUrl || null);
        setAccessState('confirmed');
        trackFunnelEvent('dashboard_redirect_after_payment', {
          payment_id: paymentId,
          source: 'obrigado_fallback',
        });

        if (appReturnUrl) {
          const nextAppUrl = buildAppContinuationUrl(appReturnUrl, paymentId, reportId);
          window.setTimeout(() => {
            window.location.href = nextAppUrl;
          }, 900);
          return;
        }

        if (data.magicUrl) {
          window.setTimeout(() => {
            window.location.href = data.magicUrl;
          }, 1600);
        }
      })
      .catch((error) => {
        console.error('[obrigado] payment verification failed', error);
        if (!cancelled) {
          setAccessState('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [appReturnUrl, paymentId, reportId]);

  return (
    <>
      <Head>
        <title>Pagamento em validação | MeJoy</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-8 text-white sm:py-10 md:py-12">
        <div className="container mx-auto flex min-h-[80vh] max-w-2xl items-center px-4 sm:px-6">
          <div className="w-full rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-8 md:p-12">
            <div className="text-5xl">✅</div>
            <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
              {accessState === 'pending'
                ? 'Pagamento aguardando confirmação'
                : accessState === 'error'
                  ? 'Pagamento recebido, acesso ainda em preparação'
                  : 'Pagamento confirmado'}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-100 sm:text-lg">
              {accessState === 'loading' &&
                'Estamos validando o pagamento com o Asaas e liberando o seu dashboard MeJoy.'}
              {accessState === 'confirmed' &&
                'Seu acesso está sendo liberado agora. Você será redirecionado para o dashboard em instantes.'}
              {accessState === 'pending' &&
                'O pagamento ainda não virou pago no gateway. Continue por aqui ou retorne ao PIX/cartão para concluir.'}
              {accessState === 'error' &&
                'Recebemos sua solicitação, mas o link seguro do dashboard não foi gerado automaticamente. Use os canais oficiais abaixo.'}
            </p>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/10 p-5">
              <h2 className="text-xl font-bold text-white">Próximos passos</h2>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-slate-100">
                <li>1. O dashboard só abre depois da confirmação real do pagamento.</li>
                <li>2. O time oficial continua o atendimento por WhatsApp e e-mail.</li>
                <li>3. A prescrição, quando houver indicação, segue apenas após avaliação médica.</li>
              </ol>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {appReturnUrl && accessState === 'confirmed' && (
                <a
                  href={buildAppContinuationUrl(appReturnUrl, paymentId, reportId)}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
                >
                  Abrir no app MeJoy
                </a>
              )}
              {dashboardUrl && (
                <a
                  href={dashboardUrl}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
                >
                  Ir para meu dashboard
                </a>
              )}
              {paymentId && (
                <a
                  href={`/emagrecimento/checkout?paymentId=${encodeURIComponent(paymentId)}${reportId ? `&reportId=${encodeURIComponent(reportId)}` : ''}${appReturnUrl ? `&appReturnUrl=${encodeURIComponent(appReturnUrl)}` : ''}`}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Voltar ao checkout
                </a>
              )}
            </div>

            {reportId && (
              <div className="mt-6">
                <a
                  href={`/api/pdf/report?id=${reportId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-500/15 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Baixar relatório em PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function readStringQuery(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildAppContinuationUrl(appReturnUrl: string, paymentId?: string | null, reportId?: string | null) {
  try {
    const nextUrl = new URL(appReturnUrl);
    if (paymentId) nextUrl.searchParams.set('paymentId', paymentId);
    nextUrl.searchParams.set('status', 'confirmed');
    nextUrl.searchParams.set('source', 'checkout');
    if (reportId) nextUrl.searchParams.set('reportId', reportId);
    return nextUrl.toString();
  } catch {
    return appReturnUrl;
  }
}
