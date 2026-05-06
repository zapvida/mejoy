// src/pages/telemedicina.tsx
// Página sobre Telemedicina

import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiVideo, FiShield, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

import LogoWithName from '@/components/ui/LogoWithName';

export default function TelemedicinaPage() {
  return (
    <>
      <Head>
        <title>Telemedicina | MeJoy</title>
        <meta name="description" content="Informações sobre atendimentos por Telemedicina no MeJoy, conforme normas vigentes." />
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
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <FiVideo className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white">Telemedicina</h1>
            </div>
            
            <div className="prose prose-invert max-w-none space-y-6 sm:space-y-8">
              <section className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FiShield className="text-blue-400" />
                  Conformidade Legal
                </h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  O MeJoy realiza atendimentos por Telemedicina em conformidade com a Resolução CFM nº 2.227/2018, que regulamenta a telemedicina no Brasil, e demais normas vigentes do Conselho Federal de Medicina (CFM) e da Agência Nacional de Vigilância Sanitária (ANVISA).
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">1. O que é Telemedicina?</h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
                  Telemedicina é o exercício da medicina mediado por tecnologias de informação e comunicação para fins de assistência, educação, pesquisa, prevenção de doenças e lesões, e promoção de saúde.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <FiVideo className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mb-2" />
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Consultas Online</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Atendimento médico realizado por videoconferência</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <FiFileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mb-2" />
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Prescrições Digitais</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Receitas médicas emitidas eletronicamente</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">2. Requisitos e Condições</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Identificação do Paciente</h3>
                      <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                        É necessário identificar-se adequadamente antes do atendimento, fornecendo documentos válidos e informações precisas sobre seu estado de saúde.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Consentimento Informado</h3>
                      <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                        Você deve consentir explicitamente com o atendimento por telemedicina, compreendendo suas limitações e benefícios.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Privacidade e Segurança</h3>
                      <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                        Todas as comunicações são criptografadas e protegidas conforme LGPD. Seus dados médicos são tratados com máxima confidencialidade.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FiAlertCircle className="text-yellow-400" />
                  3. Limitações da Telemedicina
                </h2>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6 mb-4">
                  <p className="text-yellow-200 leading-relaxed text-sm sm:text-base font-medium mb-3">
                    <strong>⚠️ ATENÇÃO:</strong> A telemedicina tem limitações e não é adequada para todas as situações médicas.
                  </p>
                  <ul className="list-disc list-inside text-yellow-200/90 ml-4 space-y-1.5 text-sm sm:text-base">
                    <li>Emergências médicas devem ser tratadas presencialmente</li>
                    <li>Alguns exames físicos não podem ser realizados remotamente</li>
                    <li>Procedimentos que requerem intervenção física não são possíveis</li>
                    <li>O médico pode determinar que o atendimento presencial é necessário</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">4. Quando a Telemedicina é Adequada</h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
                  A telemedicina é adequada para:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <h3 className="text-base sm:text-lg font-semibold text-green-300 mb-1">Consultas de Rotina</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Acompanhamento de condições crônicas estáveis</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <h3 className="text-base sm:text-lg font-semibold text-green-300 mb-1">Orientações de Saúde</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Esclarecimento de dúvidas e orientações preventivas</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <h3 className="text-base sm:text-lg font-semibold text-green-300 mb-1">Prescrições</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Renovação e ajuste de medicações já estabelecidas</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <h3 className="text-base sm:text-lg font-semibold text-green-300 mb-1">Segunda Opinião</h3>
                    <p className="text-white/80 text-xs sm:text-sm">Avaliação de casos já diagnosticados</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">5. Seus Direitos</h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
                  Durante atendimentos por telemedicina, você tem direito a:
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 space-y-2 text-sm sm:text-base">
                  <li>Receber informações claras sobre o atendimento</li>
                  <li>Ter privacidade e confidencialidade garantidas</li>
                  <li>Solicitar cópia do prontuário médico</li>
                  <li>Ser informado sobre limitações da telemedicina</li>
                  <li>Recusar o atendimento remoto e solicitar presencial</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">6. Responsabilidades do Paciente</h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
                  Para um atendimento eficaz por telemedicina, é importante que você:
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 space-y-2 text-sm sm:text-base">
                  <li>Forneça informações precisas e completas sobre sua saúde</li>
                  <li>Tenha um ambiente privado e adequado para a consulta</li>
                  <li>Garanta conexão estável de internet e dispositivo funcionando</li>
                  <li>Esteja presente e atento durante toda a consulta</li>
                  <li>Siga as orientações médicas recebidas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">7. Regulamentação</h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
                  Nossos atendimentos por telemedicina seguem:
                </p>
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <strong className="text-white">Resolução CFM nº 2.227/2018:</strong> Regulamenta a telemedicina no Brasil
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <strong className="text-white">Código de Ética Médica:</strong> Princípios éticos aplicáveis à telemedicina
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <strong className="text-white">LGPD:</strong> Proteção de dados pessoais e de saúde
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">8. Contato</h2>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  Para dúvidas sobre atendimentos por telemedicina ou para agendar uma consulta, entre em contato conosco através dos canais disponíveis na plataforma.
                </p>
              </section>

              <div className="mt-8 p-4 sm:p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">
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
