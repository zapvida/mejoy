import { createClient } from '@supabase/supabase-js';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { deriveReport } from '@/lib/report/derive';
import type { ReportViewModel } from '@/lib/report/derive';
import { getSupabaseServerConfig } from '@/lib/supabase/runtime-config';
import { cn } from '@/lib/utils';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { ReportView } from '@/components/report/ReportView';
import { getProductConfig } from '@/lib/zapfarm/product-loader';
import type { ZapfarmProductConfig } from '@/config/zapfarm/products';
import { getProductColorClasses } from '@/lib/zapfarm/color-utils';

interface RelatorioProductProps {
  vm: ReportViewModel | null;
  reportId: string | null;
  productConfig: ZapfarmProductConfig | null;
  error?: string;
}

async function resolveTriageId(
  supabase: any,
  id: string
): Promise<string> {
  const sessionQuery = await supabase
    .from('triage_sessions')
    .select('triage_id')
    .eq('triage_id', id)
    .maybeSingle();
  const sessionMatch = sessionQuery.data as { triage_id?: string } | null;

  if (sessionMatch?.triage_id) return sessionMatch.triage_id;

  const reportQuery = await supabase
    .from('triage_reports')
    .select('triage_id')
    .eq('id', id)
    .maybeSingle();
  const reportMatch = reportQuery.data as { triage_id?: string } | null;

  return reportMatch?.triage_id || id;
}

export default function RelatorioProductPage({ vm, reportId, productConfig, error }: RelatorioProductProps) {
  const router = useRouter();
  const product = router.query.product as string;

  if (error || !vm || !productConfig) {
    return (
      <>
        <Head>
          <title>Relatório não encontrado | Me Joy</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-orange-900 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Relatório não encontrado</h1>
            <p className="text-purple-100 mb-6">{error || 'O relatório solicitado não foi encontrado.'}</p>
            <button
              onClick={() => router.push(`/${product || ''}`)}
              className="px-6 py-3 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
            >
              Voltar para início
            </button>
          </div>
        </div>
      </>
    );
  }

  const { colors } = productConfig;
  const colorClasses = getProductColorClasses(colors);
  const gradientClasses = `bg-gradient-to-br ${colorClasses.gradientBg}`;
  const ctaGradientClasses = `bg-gradient-to-r ${colorClasses.connectorGradient}`;
  const sectionGradientClasses = `bg-gradient-to-r ${colorClasses.gradient}`;

  return (
    <>
      <Head>
        <title>Relatório de {productConfig.displayName} | Me Joy</title>
        <meta name="description" content={`Relatório personalizado de ${productConfig.displayName.toLowerCase()} para ${vm.basics.firstName}`} />
      </Head>

      <div className={`min-h-screen ${gradientClasses}`}>
        {/* Header */}
        <div className="relative z-50">
          <HeaderZapfarm />
        </div>

        {/* Sticky CTA bar for mobile - tap target 48px min, alto contraste */}
        <div className={`fixed bottom-0 left-0 right-0 z-40 ${ctaGradientClasses} p-3 sm:p-4 shadow-2xl md:hidden`}>
          <a
            href={`/${product}/checkout?reportId=${reportId}`}
            className={cn(
              "block w-full text-center rounded-full bg-white font-bold py-3 min-h-[48px] px-5 sm:px-6 transition-all text-sm sm:text-base",
              "shadow-lg active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent",
              colorClasses.text
            )}
          >
            Quero receber este protocolo em casa →
          </a>
        </div>

        {/* Padding top para compensar header fixo e bottom para mobile sticky CTA */}
        <div className="pt-20 sm:pt-16 md:pt-20 pb-20 md:pb-0">
          {/* Report View com componentes genéricos */}
          <ReportView vm={vm} />
          
          {/* CTA Section - conversão primária */}
          <section className={`py-12 sm:py-16 md:py-20 ${sectionGradientClasses} text-white`} aria-label="Próximos passos">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 text-white">
                Pronto para começar seu tratamento?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                Escolha seu plano e inicie sua jornada com segurança e acompanhamento médico especializado
              </p>
              <a
                href={`/${product}/checkout?reportId=${reportId}`}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-4 min-h-[48px] text-sm sm:text-base md:text-lg font-bold bg-white shadow-2xl transition-all hover:scale-105 hover:shadow-white/50 w-full sm:w-auto max-w-sm sm:max-w-none",
                  "focus:outline-none focus:ring-4 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-transparent active:scale-[0.98]",
                  colorClasses.text
                )}
              >
                Ver Produtos →
              </a>
            </div>
          </section>

          {/* Download PDF - secundário */}
          <div className="container mx-auto px-4 sm:px-6 pb-8 sm:pb-10 md:pb-12 text-center">
            <a
              href={`/api/pdf/report?id=${reportId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 min-h-[44px] text-white rounded-full font-semibold text-sm sm:text-base transition-all hover:opacity-95",
                "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent",
                `bg-gradient-to-r ${colorClasses.stepGradient}`
              )}
            >
              ⬇️ Baixar relatório em PDF
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<RelatorioProductProps> = async ({ query, params }) => {
  const id = query.id as string | undefined;
  const product = (params?.product || query.product) as string | undefined;

  if (!id) {
    return { props: { vm: null, reportId: null, productConfig: null, error: 'ID não fornecido' } };
  }

  if (!product) {
    return { props: { vm: null, reportId: null, productConfig: null, error: 'Produto não especificado' } };
  }

  const productConfig = getProductConfig(product);
  if (!productConfig) {
    return { props: { vm: null, reportId: null, productConfig: null, error: 'Produto não encontrado' } };
  }

  try {
    const { url: supabaseUrl, readKey: supabaseKey } = getSupabaseServerConfig();

    if (!supabaseUrl || !supabaseKey) {
      if (process.env.NODE_ENV === 'development') {
        const mockProfile = {
          name: "Paciente",
          sex: "M" as const,
          age: 35,
          birthDateISO: "1990-01-01",
          weightKg: 75,
          heightCm: 170,
          whatsapp: "",
        };
        const vm = await deriveReport({
          triageId: id,
          sessionData: {
            answers: {},
            profile: { ...mockProfile },
            triageSlug: productConfig.triageSlug || product,
          },
          options: { includeAudio: false },
        }, { persist: false });
        (vm as any).answers = {};
        return { props: { vm, reportId: id, productConfig } };
      }
      return { props: { vm: null, reportId: id, productConfig: null, error: 'Ambiente não configurado' } };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resolvedId = await resolveTriageId(supabase, id);

    // Otimização: buscar sessão + relatório em uma única query
    const { data: sessionRow, error: sessionError } = await supabase
      .from('triage_sessions')
      .select(`
        *,
        triage_reports(status, sections)
      `)
      .eq('triage_id', resolvedId)
      .single();

    if (sessionError || !sessionRow) {
      return { props: { vm: null, reportId: id, productConfig: null, error: 'Sessão não encontrada' } };
    }

    const reportRow = Array.isArray(sessionRow.triage_reports)
      ? sessionRow.triage_reports[0]
      : sessionRow.triage_reports;
    const answers = sessionRow.answers || {};
    const triageSlug = sessionRow.triage_slug || productConfig.triageSlug || product;

    // Usar relatório em cache quando status=completed e sections válido (evita deriveReport)
    if (reportRow?.status === 'completed' && reportRow?.sections && typeof reportRow.sections === 'object') {
      const cached = reportRow.sections as ReportViewModel;
      if (cached?.id && cached?.basics && cached?.content) {
        (cached as any).answers = answers;
        return { props: { vm: cached, reportId: resolvedId, productConfig } };
      }
    }

    const patientSnapshot = sessionRow.profile_snapshot || {};
    const normalizedProfile = {
      name: patientSnapshot.name || 'Paciente',
      sex: patientSnapshot.sex || 'undisclosed',
      age: patientSnapshot.age ?? (patientSnapshot.dob || patientSnapshot.birth_date
        ? Math.floor((Date.now() - new Date(patientSnapshot.dob || patientSnapshot.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
        : null),
      birthDate: patientSnapshot.birthDate || patientSnapshot.dob || patientSnapshot.birth_date || null,
      bmi: patientSnapshot.bmi ?? (patientSnapshot.weight && patientSnapshot.height
        ? Number((patientSnapshot.weight / ((patientSnapshot.height / 100) ** 2)).toFixed(1))
        : null),
      whatsapp: patientSnapshot.whatsapp || '',
      weightKg: patientSnapshot.weightKg || patientSnapshot.weight || null,
      heightCm: patientSnapshot.heightCm || patientSnapshot.height || null,
    };

    const vm = await deriveReport({
      triageId: resolvedId,
      sessionData: { answers, profile: normalizedProfile, triageSlug },
      options: { includeAudio: false },
    }, { persist: false });

    (vm as any).answers = answers;
    return { props: { vm, reportId: resolvedId, productConfig } };
  } catch (error: any) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[relatorio] Error:', error?.message);
    } else {
      console.error('[relatorio] Error:', error);
    }
    return { props: { vm: null, reportId: id, productConfig: null, error: error?.message || 'Erro ao gerar relatório' } };
  }
};
