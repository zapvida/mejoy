// src/pages/termos.tsx
// Página de Termos de Uso

import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

import Logo from '@/components/ui/Logo';
import Footer from '@/components/layout/Footer';

export async function getServerSideProps() {
  return { props: {} };
}

export default function TermosPage() {
  return (
    <>
      <Head>
        <title>Termos de Uso | Me Joy</title>
        <meta name="description" content="Termos de uso do Me Joy" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#000000] via-[#000000] to-[#000000] text-white">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/20 backdrop-blur-md border-b border-white/10 py-4"
        >
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <Logo size="small" />
            <Link href="/" className="inline-flex items-center text-brand hover:text-brand/80">
              <FiArrowLeft className="mr-2" />
              Voltar ao início
            </Link>
          </div>
        </motion.div>

        <div className="mx-auto max-w-4xl px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8"
          >
            <h1 className="text-4xl font-bold text-white mb-8">Termos de Uso</h1>
            
            <div className="prose prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
                <p className="text-white/80 leading-relaxed">
                  Ao utilizar o Me Joy, você concorda com estes termos de uso. Se não concordar com qualquer parte destes termos, não utilize nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Descrição do Serviço</h2>
                <p className="text-white/80 leading-relaxed">
                  O Me Joy é uma plataforma de triagem de saúde que oferece questionários especializados e relatórios personalizados com base em suas respostas. Nossos serviços são de caráter informativo e educativo.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Limitações Médicas</h2>
                <p className="text-white/80 leading-relaxed">
                  <strong>IMPORTANTE:</strong> Os relatórios gerados pelo Me Joy são de caráter informativo e educativo. Eles não substituem consultas médicas, diagnósticos ou tratamentos profissionais. Sempre consulte um médico qualificado para questões de saúde.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Uso Responsável</h2>
                <p className="text-white/80 leading-relaxed">
                  Você concorda em usar o Me Joy de forma responsável e não utilizar nossos serviços para:
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 mt-2 space-y-1">
                  <li>Autodiagnóstico ou automedicação</li>
                  <li>Substituir atendimento médico profissional</li>
                  <li>Transmitir informações falsas ou enganosas</li>
                  <li>Violar leis ou regulamentos aplicáveis</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Privacidade e Dados</h2>
                <p className="text-white/80 leading-relaxed">
                  Seus dados pessoais são tratados de acordo com nossa Política de Privacidade. Coletamos apenas informações necessárias para fornecer nossos serviços e melhorar sua experiência.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Propriedade Intelectual</h2>
                <p className="text-white/80 leading-relaxed">
                  Todo o conteúdo do Me Joy, incluindo textos, algoritmos, design e funcionalidades, é protegido por direitos autorais e propriedade intelectual.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Limitação de Responsabilidade</h2>
                <p className="text-white/80 leading-relaxed">
                  O Me Joy não se responsabiliza por decisões tomadas com base nos relatórios gerados. Os usuários são responsáveis por suas próprias decisões de saúde.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Modificações</h2>
                <p className="text-white/80 leading-relaxed">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Contato</h2>
                <p className="text-white/80 leading-relaxed">
                  Para dúvidas sobre estes termos, entre em contato conosco através dos canais disponíveis na plataforma.
                </p>
              </section>

              <div className="mt-8 p-6 bg-fg/10 border border-fg/30 rounded-xl">
                <p className="text-foreground text-sm leading-relaxed">
                  <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
    </>
  );
}