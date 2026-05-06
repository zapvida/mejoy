// src/pages/contato.tsx
// Página de Contato - Canais oficiais da MeJoy

import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, MapPin, Clock, FileText, Shield } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

const CONTACT = {
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '554797789479',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contato@mejoy.com.br',
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || 'MeJoy Tecnologia em Saúde Ltda.',
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || 'Florianópolis, SC',
};

const whatsappUrl = `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}`;

export default function ContatoPage() {
  return (
    <>
      <Head>
        <title>Contato | MeJoy</title>
        <meta name="description" content="Entre em contato com a MeJoy. Suporte, dúvidas, reembolsos e exercício de direitos LGPD." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-bg">
        <Navbar />

        <main className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-ink mb-2">Fale Conosco</h1>
                <p className="text-ink-muted">
                  Estamos aqui para ajudar. Escolha o canal mais conveniente.
                </p>
              </div>

              {/* Canais principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                  href={`${whatsappUrl}?text=Olá! Preciso de ajuda.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-surface hover:border-brand/40 hover:shadow-lg transition-all"
                >
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <MessageCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-ink mb-1">WhatsApp</h2>
                    <p className="text-sm text-ink-muted mb-2">
                      Resposta rápida para dúvidas, pedidos e suporte
                    </p>
                    <span className="text-brand font-medium">Iniciar conversa →</span>
                  </div>
                </a>

                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-surface hover:border-brand/40 hover:shadow-lg transition-all"
                >
                  <div className="p-3 rounded-xl bg-brand/10">
                    <Mail className="w-8 h-8 text-brand" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-ink mb-1">E-mail</h2>
                    <p className="text-sm text-ink-muted mb-2">
                      Para assuntos formais, reembolsos e LGPD
                    </p>
                    <span className="text-brand font-medium">{CONTACT.email}</span>
                  </div>
                </a>
              </div>

              {/* Informações da empresa */}
              <div className="rounded-2xl border border-border bg-muted/30 p-6">
                <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand" />
                  Dados da Empresa
                </h3>
                <div className="space-y-2 text-ink-muted">
                  <p><strong className="text-ink">{CONTACT.legalName}</strong></p>
                  <p>{CONTACT.address}</p>
                  <p className="text-sm mt-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Atendimento: Segunda a sexta, 9h às 18h (horário de Brasília)
                  </p>
                </div>
              </div>

              {/* Links legais e LGPD */}
              <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6">
                <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand" />
                  Documentos e Direitos
                </h3>
                <p className="text-sm text-ink-muted mb-4">
                  Para exercer seus direitos LGPD (acesso, correção, exclusão de dados) ou consultar nossas políticas:
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/politicas-lgpd" className="inline-flex items-center gap-2 text-sm text-brand hover:underline">
                    <FileText className="w-4 h-4" />
                    Política LGPD
                  </Link>
                  <Link href="/privacidade" className="inline-flex items-center gap-2 text-sm text-brand hover:underline">
                    Política de Privacidade
                  </Link>
                  <Link href="/termos" className="inline-flex items-center gap-2 text-sm text-brand hover:underline">
                    Termos de Uso
                  </Link>
                  <Link href="/reembolso" className="inline-flex items-center gap-2 text-sm text-brand hover:underline">
                    Política de Reembolso
                  </Link>
                  <Link href="/dados-fiscais" className="inline-flex items-center gap-2 text-sm text-brand hover:underline">
                    Dados Fiscais
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
