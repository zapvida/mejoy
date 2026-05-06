import Head from 'next/head';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

export default function FAQ() {
  return (
    <>
      <Head>
        <title>Perguntas Frequentes | MeJoy</title>
        <meta name="description" content="Tire suas dúvidas sobre o MeJoy - Perguntas frequentes sobre nossa plataforma de saúde." />
      </Head>
      <main className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-10 text-center text-white">Perguntas Frequentes</h1>

          <div className="space-y-8">
            {/* 1 */}
            <section aria-labelledby="faq1" className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 id="faq1" className="text-2xl font-bold mb-4 text-white">🩺 O que é o MeJoy?</h2>
              <p className="text-muted-foreground">
                Somos uma plataforma de saúde preditiva que utiliza inteligência artificial, medicina de precisão e dados científicos para gerar diagnósticos preditivos, relatórios inteligentes e planos de longevidade. Tudo 100% online, rápido e seguro.
              </p>
            </section>

            {/* 2 */}
            <section aria-labelledby="faq2" className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 id="faq2" className="text-2xl font-bold mb-4 text-white">📄 O MeJoy substitui consultas médicas presenciais?</h2>
              <p className="text-muted-foreground">
                Não. O MeJoy oferece triagens inteligentes e relatórios preditivos que auxiliam na prevenção e no monitoramento da saúde. As consultas médicas online complementam seu cuidado, mas não substituem atendimentos presenciais quando necessários.
              </p>
            </section>

            {/* 3 */}
            <section aria-labelledby="faq3" className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 id="faq3" className="text-2xl font-bold mb-4 text-white">💳 Como funciona o pagamento?</h2>
              <p className="text-muted-foreground">
                O pagamento é feito através de cartão de crédito ou PIX, processado de forma segura. Você escolhe seu plano, preenche seus dados e gera o link de pagamento instantaneamente.
              </p>
            </section>

            {/* 4 */}
            <section aria-labelledby="faq4" className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 id="faq4" className="text-2xl font-bold mb-4 text-white">🔒 Meus dados estão seguros?</h2>
              <p className="text-muted-foreground">
                100%. Seus dados são protegidos com criptografia de alto nível e seguimos rigorosamente as normas da LGPD (Brasil) e GDPR (Europa).
              </p>
            </section>

            {/* 5 */}
            <section aria-labelledby="faq5" className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 id="faq5" className="text-2xl font-bold mb-4 text-white">⚙️ O que está incluído nos planos pagos?</h2>
              <p className="text-muted-foreground">
                Dependendo do plano, você tem acesso a triagens ilimitadas, relatórios inteligentes, consultas médicas, acompanhamento contínuo, fórmulas personalizadas, check-ups laboratoriais guiados e plano de longevidade.
              </p>
            </section>

            {/* 6 */}
            <section aria-labelledby="faq6" className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 id="faq6" className="text-2xl font-bold mb-4 text-white">🚨 Posso cancelar quando quiser?</h2>
              <p className="text-muted-foreground">
                Sim. Todos os planos são sem fidelidade. Você pode cancelar a qualquer momento diretamente pelo seu dashboard ou entrando em contato pelo suporte.
              </p>
            </section>

            {/* 7 */}
            <section aria-labelledby="faq7" className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 id="faq7" className="text-2xl font-bold mb-4 text-white">📊 Como funciona o relatório?</h2>
              <p className="text-muted-foreground">
                Ao realizar uma triagem, nosso sistema gera um relatório preditivo com sua condição atual de saúde, riscos futuros, análise metabólica, comportamental, emocional e sugestões de melhorias baseadas em medicina baseada em evidências e IA.
              </p>
            </section>

            {/* 8 */}
            <section aria-labelledby="faq8" className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 id="faq8" className="text-2xl font-bold mb-4 text-white">👨‍⚕️ Quem são os médicos do MeJoy?</h2>
              <p className="text-muted-foreground">
                Todos os médicos do MeJoy são profissionais registrados, experientes em saúde integrativa, preventiva, preditiva e longevidade. Você fala diretamente com eles dentro do seu plano contratado.
              </p>
            </section>

            {/* 9 */}
            <section aria-labelledby="faq9" className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 id="faq9" className="text-2xl font-bold mb-4 text-white">🕒 Quanto tempo leva para gerar meu relatório?</h2>
              <p className="text-muted-foreground">
                Imediatamente. Assim que você finaliza a triagem, o relatório é gerado em poucos segundos e fica disponível no seu dashboard.
              </p>
            </section>

            {/* 10 */}
            <section aria-labelledby="faq10" className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 id="faq10" className="text-2xl font-bold mb-4 text-white">🧠 A plataforma usa inteligência artificial?</h2>
              <p className="text-muted-foreground">
                Sim. Utilizamos inteligência artificial para interpretar os dados da sua triagem, comparar com bancos científicos internacionais e gerar insights preditivos personalizados.
              </p>
            </section>

            {/* 11 */}
            <section aria-labelledby="faq11" className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 id="faq11" className="text-2xl font-bold mb-4 text-white">💡 O que é medicina preditiva?</h2>
              <p className="text-muted-foreground">
                É uma abordagem médica focada em identificar riscos futuros antes dos sintomas surgirem, permitindo intervenções precoces para prevenir doenças, melhorar a longevidade e aumentar a qualidade de vida.
              </p>
            </section>

            {/* 12 */}
            <section aria-labelledby="faq12" className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 id="faq12" className="text-2xl font-bold mb-4 text-white">❓ Ainda tenho dúvidas...</h2>
              <p className="text-muted-foreground">
                Estamos aqui para ajudar! Envie um e-mail para{' '}
                <a href="mailto:suporte@mejoy.com.br" className="text-brand underline hover:text-green-300 transition-colors">
                  suporte@mejoy.com.br
                </a>{' '}
                ou acesse o seu dashboard para falar com nosso suporte.
              </p>
            </section>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
