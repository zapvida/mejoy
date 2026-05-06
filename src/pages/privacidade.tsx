// src/pages/privacidade.tsx
// Página de Política de Privacidade

import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

import LogoWithName from '@/components/ui/LogoWithName';
import Footer from '@/components/layout/Footer';

export default function PrivacidadePage() {
  return (
    <>
      <Head>
        <title>Política de Privacidade | MeJoy</title>
        <meta name="description" content="Política de privacidade do MeJoy" />
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
            <LogoWithName size="small" variant="inverse" />
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
            <h1 className="text-4xl font-bold text-white mb-8">Política de Privacidade</h1>
            
            <div className="prose prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Informações que Coletamos</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Coletamos informações que você nos fornece diretamente, incluindo:
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 space-y-1">
                  <li>Nome e dados de contato (email, WhatsApp)</li>
                  <li>Informações demográficas (idade, sexo)</li>
                  <li>Dados de saúde fornecidos nas triagens</li>
                  <li>Informações de pagamento (processadas pelo Stripe)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Como Usamos suas Informações</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 space-y-1">
                  <li>Gerar relatórios personalizados de saúde</li>
                  <li>Melhorar nossos serviços e algoritmos</li>
                  <li>Processar pagamentos e assinaturas</li>
                  <li>Enviar comunicações importantes</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Compartilhamento de Informações</h2>
                <p className="text-white/80 leading-relaxed">
                  Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 mt-2 space-y-1">
                  <li>Com provedores de serviços (Stripe, Supabase)</li>
                  <li>Quando exigido por lei</li>
                  <li>Para proteger nossos direitos legais</li>
                  <li>Com seu consentimento explícito</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Segurança dos Dados</h2>
                <p className="text-white/80 leading-relaxed">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Seus Direitos</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Você tem o direito de:
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 space-y-1">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir dados incorretos</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Limitar o processamento de seus dados</li>
                  <li>Portabilidade dos dados</li>
                  <li>Retirar seu consentimento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies e Tecnologias Similares</h2>
                <p className="text-white/80 leading-relaxed">
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do site e personalizar conteúdo.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Retenção de Dados</h2>
                <p className="text-white/80 leading-relaxed">
                  Mantemos suas informações pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que a lei exija um período de retenção mais longo.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Menores de Idade</h2>
                <p className="text-white/80 leading-relaxed">
                  Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente informações de menores sem o consentimento dos pais.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Alterações na Política</h2>
                <p className="text-white/80 leading-relaxed">
                  Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas através do site ou por email.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Contato</h2>
                <p className="text-white/80 leading-relaxed">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato conosco através dos canais disponíveis na plataforma.
                </p>
              </section>

              <div className="mt-8 p-6 bg-brand/10 border border-brand/30 rounded-xl">
                <p className="text-brand-400 text-sm leading-relaxed">
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
