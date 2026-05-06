// src/pages/uso-ia.tsx
// Página sobre Uso de Inteligência Artificial

import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiCpu, FiShield, FiEye, FiCheckCircle } from 'react-icons/fi';

import LogoWithName from '@/components/ui/LogoWithName';

export default function UsoIAPage() {
  return (
    <>
      <Head>
        <title>Uso de Inteligência Artificial | MeJoy</title>
        <meta name="description" content="Informações sobre como o MeJoy utiliza Inteligência Artificial para gerar relatórios personalizados de saúde." />
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
            <Link href="/" className="inline-flex items-center text-brand hover:text-brand/80 transition-colors">
              <FiArrowLeft className="mr-2" />
              <span className="hidden sm:inline">Voltar ao início</span>
            </Link>
          </div>
        </motion.div>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <FiCpu className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white">Uso de Inteligência Artificial</h1>
            </div>
            
            <div className="prose prose-invert max-w-none space-y-6 sm:space-y-8">
              <section className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FiShield className="text-purple-400" />
                  Transparência e Ética
                </h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  O MeJoy utiliza Inteligência Artificial (IA) de forma transparente e ética para gerar relatórios personalizados de saúde baseados em suas respostas aos questionários de triagem. Esta página explica como utilizamos a IA e quais são seus direitos.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">1. Como Utilizamos a IA</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Análise de Respostas</h3>
                      <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                        A IA analisa suas respostas aos questionários de triagem, identificando padrões e correlacionando informações para criar um perfil de saúde personalizado.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Geração de Relatórios</h3>
                      <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                        Com base em evidências científicas e diretrizes médicas, a IA gera relatórios personalizados com recomendações, alertas e próximos passos específicos para seu perfil.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Melhoria Contínua</h3>
                      <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                        Utilizamos dados anonimizados e agregados para melhorar continuamente nossos algoritmos e a qualidade dos relatórios gerados.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FiEye className="text-purple-400" />
                  2. Seus Dados e Privacidade
                </h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
                  <strong className="text-white">Proteção de Dados:</strong> Todos os dados utilizados pela IA são tratados de acordo com a LGPD (Lei Geral de Proteção de Dados). Seus dados pessoais identificáveis nunca são compartilhados com terceiros sem seu consentimento explícito.
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 space-y-2 text-sm sm:text-base">
                  <li>Dados são criptografados durante transmissão e armazenamento</li>
                  <li>Apenas dados anonimizados são utilizados para treinamento de modelos</li>
                  <li>Você pode solicitar a exclusão de seus dados a qualquer momento</li>
                  <li>Todos os processamentos seguem princípios de minimização de dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">3. Limitações e Responsabilidades</h2>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6 mb-4">
                  <p className="text-yellow-200 leading-relaxed text-sm sm:text-base font-medium">
                    <strong>⚠️ IMPORTANTE:</strong> Os relatórios gerados por IA são de caráter informativo e educativo. Eles não substituem consultas médicas, diagnósticos profissionais ou tratamentos prescritos por médicos qualificados.
                  </p>
                </div>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
                  A IA é uma ferramenta de apoio à decisão, não uma substituição para cuidados médicos profissionais. Sempre consulte um médico para questões de saúde importantes.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">4. Transparência Algorítmica</h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
                  Comprometemo-nos com a transparência sobre como nossos algoritmos funcionam:
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 space-y-2 text-sm sm:text-base">
                  <li>Nossos modelos são baseados em evidências científicas publicadas</li>
                  <li>Utilizamos diretrizes médicas reconhecidas internacionalmente</li>
                  <li>Os critérios de classificação são documentados e auditáveis</li>
                  <li>Realizamos testes regulares para garantir precisão e imparcialidade</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">5. Seus Direitos</h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
                  Você tem o direito de:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Acesso</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Saber quais dados são utilizados pela IA</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Correção</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Corrigir dados incorretos ou desatualizados</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Exclusão</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Solicitar a exclusão de seus dados</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Oposição</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Opor-se ao processamento por IA</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">6. Contato</h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  Para dúvidas sobre o uso de IA em nossos serviços ou para exercer seus direitos, entre em contato conosco através dos canais disponíveis na plataforma.
                </p>
              </section>

              <div className="mt-8 p-4 sm:p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
                  <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
