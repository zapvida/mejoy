import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import Navbar from '@/components/layout/Navbar';
import FooterB2C from '@/components/home/FooterB2C';

export default function DadosFiscaisPage() {
  return (
    <>
      <Head>
        <title>Dados Fiscais | MeJoy</title>
        <meta name="description" content="Dados fiscais e informações legais da MeJoy" />
      </Head>

      <main className="min-h-screen bg-bg">
        <Navbar />

        <div className="pt-24 pb-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-surface rounded-2xl border border-border p-8 md:p-10 shadow-sm"
            >
              <Link
                href="/"
                className="inline-flex items-center text-[color:var(--brand-600)] hover:text-[color:var(--brand-700)] mb-6"
              >
                <FiArrowLeft className="mr-2" />
                Voltar ao início
              </Link>

              <h1 className="text-3xl font-bold text-ink mb-8">Dados Fiscais</h1>

              <div className="space-y-6 text-ink-muted leading-relaxed">
                <section>
                  <h2 className="text-lg font-semibold text-ink mb-2">Razão Social</h2>
                  <p>{process.env.NEXT_PUBLIC_LEGAL_NAME || 'MeJoy Tecnologia em Saúde Ltda.'}</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-ink mb-2">CNPJ</h2>
                  <p>{process.env.NEXT_PUBLIC_LEGAL_CNPJ || '00.000.000/0001-00'}</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-ink mb-2">Endereço</h2>
                  <p>{process.env.NEXT_PUBLIC_LEGAL_ADDRESS || 'Florianópolis, SC'}</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-ink mb-2">Inscrição Estadual</h2>
                  <p>Isento (conforme legislação aplicável)</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-ink mb-2">Contato</h2>
                  <p>
                    E-mail: {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contato@mejoy.com.br'}<br />
                    WhatsApp: (47) 99900-9923
                  </p>
                </section>

                <p className="text-sm text-ink-muted/80 mt-8 pt-6 border-t border-border">
                  Para notas fiscais e comprovantes de compra, consulte o e-mail de confirmação do pedido ou entre em contato com nosso suporte.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <FooterB2C />
      </main>
    </>
  );
}
