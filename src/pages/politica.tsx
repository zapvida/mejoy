import Head from 'next/head';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

export default function Politica() {
  return (
    <>
      <Head>
        <title>Política de Privacidade | Me Joy</title>
        <meta name="description" content="Política de privacidade do Me Joy - Como protegemos seus dados pessoais." />
      </Head>
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-10 md:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">Política de Privacidade</h1>

          <p className="mb-4 leading-relaxed text-muted-foreground">
            A sua privacidade é fundamental para nós. Esta Política de Privacidade explica como coletamos, usamos e protegemos seus dados pessoais quando você utiliza a plataforma Me Joy.
          </p>

          <div className="space-y-8">
            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-xl md:text-3xl font-semibold mb-4 text-white">1. Dados que Coletamos</h2>
              <p className="leading-relaxed text-muted-foreground mb-4">
                Coletamos dados pessoais que você nos fornece diretamente, como:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2 text-muted-foreground">
                <li>Nome completo</li>
                <li>Data de nascimento</li>
                <li>Endereço de e-mail</li>
                <li>Número de WhatsApp</li>
                <li>Dados de saúde preenchidos nas triagens</li>
                <li>Informações de pagamento (processadas de forma segura)</li>
              </ul>
            </section>

            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-xl md:text-3xl font-semibold mb-4 text-white">2. Finalidade dos Dados</h2>
              <p className="leading-relaxed text-muted-foreground mb-4">Seus dados são utilizados para:</p>
              <ul className="list-disc ml-6 mb-4 space-y-2 text-muted-foreground">
                <li>Gerar relatórios personalizados de saúde preditiva</li>
                <li>Fornecer acesso às triagens e resultados</li>
                <li>Realizar cobranças seguras e emitir notas fiscais</li>
                <li>Melhorar sua experiência na plataforma</li>
                <li>Garantir segurança, prevenção contra fraudes e autenticação</li>
                <li>Enviar informações relevantes sobre sua saúde (com seu consentimento)</li>
              </ul>
            </section>

            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-xl md:text-3xl font-semibold mb-4 text-white">3. Compartilhamento de Dados</h2>
              <p className="leading-relaxed text-muted-foreground mb-4">
                Seus dados são confidenciais. Só compartilhamos com:
              </p>
              <ul className="list-disc ml-6 mb-4 space-y-2 text-muted-foreground">
                <li>Profissionais de saúde credenciados na plataforma, mediante sua autorização</li>
                <li>Provedores de pagamento e serviços de nuvem — todos com alto nível de segurança</li>
                <li>Autoridades legais, mediante ordem judicial ou obrigação legal</li>
              </ul>
            </section>

            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-xl md:text-3xl font-semibold mb-4 text-white">4. Segurança dos Dados</h2>
              <p className="leading-relaxed text-muted-foreground">
                Utilizamos criptografia, autenticação em múltiplos níveis, firewalls e proteção em ambiente seguro para proteger seus dados.
              </p>
            </section>

            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-xl md:text-3xl font-semibold mb-4 text-white">5. Seus Direitos (LGPD e GDPR)</h2>
              <p className="leading-relaxed text-muted-foreground mb-4">Você tem direito a:</p>
              <ul className="list-disc ml-6 mb-4 space-y-2 text-muted-foreground">
                <li>Acessar seus dados</li>
                <li>Corrigir informações</li>
                <li>Excluir dados pessoais (direito ao esquecimento)</li>
                <li>Solicitar portabilidade</li>
                <li>Revogar consentimento a qualquer momento</li>
              </ul>
            </section>

            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-xl md:text-3xl font-semibold mb-4 text-white">6. Cookies e Tecnologias</h2>
              <p className="leading-relaxed text-muted-foreground">
                Usamos cookies para melhorar sua navegação, entender seu comportamento e fornecer conteúdos personalizados. Você pode gerenciar os cookies no seu navegador.
              </p>
            </section>

            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-xl md:text-3xl font-semibold mb-4 text-white">7. Alterações na Política</h2>
              <p className="leading-relaxed text-muted-foreground">
                Esta política pode ser atualizada periodicamente para refletir mudanças na legislação ou melhorias na plataforma. As atualizações estarão sempre disponíveis nesta página.
              </p>
            </section>

            <section className="bg-background/50 p-6 rounded-xl border border-border">
              <h2 className="text-xl md:text-3xl font-semibold mb-4 text-white">8. Contato</h2>
              <p className="leading-relaxed text-muted-foreground">
                Se tiver qualquer dúvida sobre esta Política de Privacidade ou desejar exercer seus direitos, entre em contato pelo e-mail:{' '}
                <a href="mailto:suporte@mejoy.com.br" className="text-brand underline hover:text-green-300 transition-colors">
                  suporte@mejoy.com.br
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
