import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function ObrigadoPage() {
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    // Tentar obter reportId da sessão ou localStorage
    const storedReportId = localStorage.getItem('zapfarm_report_id');
    if (storedReportId) {
      setReportId(storedReportId);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Obrigado! - Me Joy</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 flex items-center justify-center text-white py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/20">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">🎉</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2 text-white">
              Parabéns por iniciar sua jornada!
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-100 mb-6 sm:mb-8 px-2">
              Seu pagamento foi confirmado com sucesso.
            </p>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 text-left">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">Próximos passos:</h2>
              <ol className="space-y-2 sm:space-y-3 text-slate-100">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">1️⃣</span>
                  <span className="text-sm sm:text-base leading-relaxed">
                    <strong>Nossa equipe entrará em contato</strong> pelo WhatsApp em até 30 minutos úteis para agendar sua consulta.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">2️⃣</span>
                  <span className="text-sm sm:text-base leading-relaxed">
                    <strong>Você receberá um e-mail</strong> de confirmação com todos os detalhes do seu plano.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">3️⃣</span>
                  <span className="text-sm sm:text-base leading-relaxed">
                    <strong>Após a consulta médica</strong>, sua prescrição será liberada e o medicamento será enviado para sua casa.
                  </span>
                </li>
              </ol>
            </div>

            {reportId && (
              <div className="mb-4 sm:mb-6">
                <a
                  href={`/api/pdf/report?id=${reportId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-emerald-700 rounded-full font-semibold text-sm sm:text-base hover:bg-emerald-50 transition-colors"
                >
                  ⬇️ Baixar relatório em PDF novamente
                </a>
              </div>
            )}

            <div className="text-slate-200 text-xs sm:text-sm px-2">
              <p>Estamos juntos nessa caminhada. 💚</p>
              <p className="mt-2 break-words">Dúvidas? Entre em contato: contato@mejoy.com.br</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
