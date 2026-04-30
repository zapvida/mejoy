// src/pages/reembolso.tsx
// Página de Política de Reembolso

import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

import Logo from '@/components/ui/Logo';
import Footer from '@/components/layout/Footer';

export default function ReembolsoPage() {
  return (
    <>
      <Head>
        <title>Política de Reembolso, Troca e Devolução | Me Joy</title>
        <meta name="description" content="Política de reembolso, troca e devolução do Me Joy. Garantia de 7 dias, CDC e procedimentos." />
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
            <h1 className="text-4xl font-bold text-white mb-8">Política de Reembolso, Troca e Devolução</h1>
            
            <div className="prose prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Garantia de Satisfação</h2>
                <p className="text-white/80 leading-relaxed">
                  Oferecemos uma garantia de satisfação de 7 dias para todos os nossos produtos e serviços. Se você não estiver satisfeito com sua compra, pode solicitar um reembolso completo.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Período para Solicitação</h2>
                <p className="text-white/80 leading-relaxed">
                  Você tem até 7 dias corridos a partir da data da compra para solicitar um reembolso. Após este período, não serão aceitas solicitações de reembolso.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Como Solicitar Reembolso</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Para solicitar um reembolso:
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 space-y-1">
                  <li>Entre em contato conosco através dos canais de suporte</li>
                  <li>Forneça o número do pedido ou código de transação</li>
                  <li>Explique o motivo da solicitação</li>
                  <li>Aguarde nossa análise e resposta</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Processamento do Reembolso</h2>
                <p className="text-white/80 leading-relaxed">
                  Após a aprovação do reembolso, o valor será processado em até 5 dias úteis. O reembolso será feito através do mesmo método de pagamento utilizado na compra original.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Casos de Reembolso</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Reembolsos são aceitos nos seguintes casos:
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 space-y-1">
                  <li>Problemas técnicos que impedem o uso do serviço</li>
                  <li>Descrição incorreta do produto ou serviço</li>
                  <li>Duplicação acidental de pagamento</li>
                  <li>Insatisfação com a qualidade do serviço</li>
                    </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Casos Não Elegíveis</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Reembolsos não são aceitos nos seguintes casos:
                </p>
                <ul className="list-disc list-inside text-white/80 ml-4 space-y-1">
                  <li>Solicitação após o prazo de 7 dias</li>
                  <li>Uso inadequado ou violação dos termos de uso</li>
                  <li>Mudança de opinião após uso extensivo do serviço</li>
                  <li>Problemas relacionados a terceiros (Stripe, bancos)</li>
                    </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Direito de Arrependimento (CDC)</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Conforme o Art. 49 do Código de Defesa do Consumidor, você tem o direito de desistir da compra em até 7 dias corridos a partir da data de recebimento do produto ou da conclusão do serviço, sem necessidade de justificativa. Basta notificar-nos pelo canal de contato e devolver o produto em perfeitas condições (quando aplicável).
                </p>
                <p className="text-white/80 leading-relaxed">
                  Para produtos manipulados e medicamentos, a devolução só é aceita se a embalagem estiver lacrada e intacta, por questões de segurança e regulamentação sanitária (ANVISA).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Troca de Produtos</h2>
                <p className="text-white/80 leading-relaxed mb-4">
                  Em caso de defeito de fabricação, produto incorreto ou danificado no transporte, oferecemos troca ou reembolso integral. O prazo para solicitação é de 7 dias após o recebimento. Documente o problema com fotos e entre em contato pelo WhatsApp ou e-mail.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Reembolso de Presentes</h2>
                <p className="text-white/80 leading-relaxed">
                  Para códigos de presente não utilizados, oferecemos reembolso completo se solicitado dentro do prazo de 7 dias. Presentes já resgatados seguem a política padrão.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Contato para Reembolso</h2>
                <p className="text-white/80 leading-relaxed">
                  Para solicitar um reembolso, troca ou esclarecer dúvidas sobre esta política, acesse nossa página de <Link href="/contato" className="text-brand hover:underline">Contato</Link> ou entre em contato pelo WhatsApp e e-mail disponíveis na plataforma.
                </p>
              </section>

              <div className="mt-8 p-6 bg-brand/10 border border-brand/30 rounded-xl">
                <p className="text-green-300 text-sm leading-relaxed">
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