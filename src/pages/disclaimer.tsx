import Head from 'next/head';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Disclaimer Médico | Me Joy</title>
        <meta name="description" content="Informações importantes sobre o uso da plataforma Me Joy." />
      </Head>
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold mb-8 text-white">Disclaimer Médico</h1>

          <div className="space-y-8">
            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-2 text-white">1. Não Substitui Atendimento Médico</h2>
              <p className="text-muted-foreground">
                As avaliações, relatórios e recomendações geradas pelo Me Joy não substituem consultas presenciais, diagnósticos realizados por médicos ou exames laboratoriais.
              </p>
            </section>

            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-2 text-white">2. Uso das Informações</h2>
              <p className="text-muted-foreground">
                O conteúdo tem caráter educativo, preventivo e de orientação. Decisões sobre tratamentos devem ser feitas por médicos habilitados.
              </p>
            </section>

            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-2 text-white">3. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground">
                O Me Joy não se responsabiliza por eventuais consequências do uso incorreto das informações. Consulte sempre um profissional de saúde.
              </p>
            </section>

            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-2 text-white">4. Emergências Médicas</h2>
              <p className="text-muted-foreground">
                Em casos de emergência, procure um serviço de pronto atendimento. O Me Joy não oferece serviços de urgência e emergência.
              </p>
            </section>

            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-2 text-white">5. Contato</h2>
              <p className="text-muted-foreground">
                Para dúvidas ou informações, entre em contato pelo e-mail:{' '}
                <a href="mailto:contato@zapfarm.com.br" className="text-brand underline hover:text-green-300">
                  contato@zapfarm.com.br
                </a>
              </p>
            </section>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}