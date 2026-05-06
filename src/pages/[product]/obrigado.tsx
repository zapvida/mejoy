import Head from 'next/head';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getProductConfig } from '@/lib/zapfarm/product-loader';
import type { ZapfarmProductConfig } from '@/config/zapfarm/products';
import { getProductColorClasses } from '@/lib/zapfarm/color-utils';
import { cn } from '@/lib/utils';

interface ObrigadoPageProps {
  productConfig: ZapfarmProductConfig;
}

export default function ObrigadoPage({ productConfig }: ObrigadoPageProps) {
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    // Tentar obter reportId da sessão ou localStorage
    const storedReportId = localStorage.getItem('zapfarm_report_id');
    if (storedReportId) {
      setReportId(storedReportId);
    }
  }, []);

  const { colors } = productConfig;
  const colorClasses = getProductColorClasses(colors);
  const zapVidaUrl = `https://zapvida.com/assinatura?utm_source=zapfarm&product=${productConfig.slug}`;

  // Próximos passos específicos por produto (pode ser expandido na config depois)
  const getNextSteps = () => {
    const isEmagrecimento = productConfig.slug === 'emagrecimento';
    
    if (isEmagrecimento) {
      return [
        {
          emoji: '1️⃣',
          title: 'Nossa equipe entrará em contato',
          description: 'pelo WhatsApp em até 30 minutos úteis para agendar sua consulta.',
        },
        {
          emoji: '2️⃣',
          title: 'Você receberá um e-mail',
          description: 'de confirmação com todos os detalhes do seu plano.',
        },
        {
          emoji: '3️⃣',
          title: 'Após a consulta médica',
          description: 'sua prescrição será liberada e o medicamento será enviado para sua casa.',
        },
      ];
    }

    // Para outros produtos (sem triagem obrigatória)
    return [
      {
        emoji: '1️⃣',
        title: 'Seu kit está sendo preparado',
        description: `Nossa equipe está preparando seu kit de ${productConfig.displayName.toLowerCase()} com cuidado e atenção.`,
      },
      {
        emoji: '2️⃣',
        title: 'Você receberá um e-mail',
        description: 'de confirmação com todos os detalhes do seu pedido e prazo de entrega.',
      },
      {
        emoji: '3️⃣',
        title: 'Entrega em até 7 dias úteis',
        description: 'Seu kit será enviado para o endereço informado e você receberá o código de rastreamento.',
      },
    ];
  };

  const nextSteps = getNextSteps();

  return (
    <>
      <Head>
        <title>Obrigado! - {productConfig.displayName} | MeJoy</title>
        <meta name="description" content={`Pagamento confirmado para ${productConfig.displayName.toLowerCase()}`} />
      </Head>

      <div className={cn(
        "min-h-screen flex items-center justify-center text-white py-8 sm:py-10 md:py-12",
        `bg-gradient-to-br ${colorClasses.gradient}`
      )}>
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/20">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">🎉</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 text-white">
              Parabéns por iniciar sua jornada!
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 px-2">
              Seu pagamento foi confirmado com sucesso.
            </p>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 text-left">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">Próximos passos:</h2>
              <ol className="space-y-2 sm:space-y-3 text-white/90">
                {nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{step.emoji}</span>
                    <span className="text-sm sm:text-base leading-relaxed">
                      <strong>{step.title}</strong> {step.description}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Upsell ZapVida */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                Quer falar com um médico especialista?
              </h3>
              <p className="text-sm sm:text-base text-white/80 mb-4">
                Adicione uma consulta médica online para orientações personalizadas sobre seu tratamento.
              </p>
              <a
                href={zapVidaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-block px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-colors hover:scale-105",
                  "bg-white text-gray-900 hover:bg-gray-100"
                )}
              >
                Falar com médico agora →
              </a>
            </div>

            {reportId && (
              <div className="mb-4 sm:mb-6">
                <a
                  href={`/api/pdf/report?id=${reportId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-900 rounded-full font-semibold text-sm sm:text-base hover:bg-gray-100 transition-colors"
                >
                  ⬇️ Baixar relatório em PDF novamente
                </a>
              </div>
            )}

            <div className="text-white/80 text-xs sm:text-sm px-2">
              <p>Estamos juntos nessa caminhada. 💚</p>
              <p className="mt-2 break-words">Dúvidas? Entre em contato: contato@mejoy.com.br</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ObrigadoPageProps> = async ({ params }) => {
  const product = params?.product as string;
  const config = getProductConfig(product);
  
  if (!config) {
    return { notFound: true };
  }
  
  return {
    props: {
      productConfig: config,
    },
  };
};
