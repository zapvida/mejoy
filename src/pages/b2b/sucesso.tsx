'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, ExternalLink, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { track } from '@/lib/analytics';

export default function SucessoPage() {
  const router = useRouter();
  const [slug, setSlug] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Pegar slug da URL ou query params
    const urlSlug = router.query.slug as string || router.query.draft as string || '';
    if (urlSlug) {
      setSlug(urlSlug);
      track('checkout_complete', {
        slug: urlSlug,
        page: 'sucesso',
      });
    }
  }, [router.query]);

  const provisionalUrl = slug ? `https://${slug}.zapfarm.app` : '';

  const handleCopy = async () => {
    if (provisionalUrl) {
      await navigator.clipboard.writeText(provisionalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      track('provisional_copy', { url: provisionalUrl });
    }
  };

  const handleOpen = () => {
    if (provisionalUrl) {
      window.open(provisionalUrl, '_blank');
      track('provisional_open', { url: provisionalUrl });
    }
  };

  return (
    <>
      <Head>
        <title>Sucesso! | MeJoy</title>
        <meta name="description" content="Sua conta foi criada com sucesso. Comece a usar agora!" />
      </Head>

      <main className="min-h-screen bg-muted">
        <Navbar />

        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20">
          {/* Confete animado (simples) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text mb-4">
              Sucesso! 🎉
            </h1>
            <p className="text-lg text-text-soft">
              Sua conta foi criada. Agora você pode personalizar sua marca e começar a usar.
            </p>
          </motion.div>

          {/* URL Provisória */}
          {provisionalUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface rounded-2xl border border-ring/20 p-6 mb-8 shadow-lg"
            >
              <h2 className="text-lg font-semibold text-text mb-2">URL Provisória</h2>
              <p className="text-sm text-text-soft mb-4">
                Você pode usar esta URL enquanto configura o domínio próprio:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted px-4 py-2 rounded-lg text-sm text-text font-mono break-all">
                  {provisionalUrl}
                </code>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-lg border border-ring/20 hover:bg-muted transition-colors"
                  aria-label="Copiar URL"
                >
                  {copied ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Copy className="w-5 h-5 text-text-soft" />
                  )}
                </button>
                <button
                  onClick={handleOpen}
                  className="px-4 py-2 rounded-lg border border-ring/20 hover:bg-muted transition-colors"
                  aria-label="Abrir URL"
                >
                  <ExternalLink className="w-5 h-5 text-text-soft" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Próximos Passos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface rounded-2xl border border-ring/20 p-6 shadow-lg"
          >
            <h2 className="text-lg font-semibold text-text mb-4">Próximos passos</h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <div>
                  <p className="text-text font-medium">Aplicar CNAME</p>
                  <p className="text-sm text-text-soft">
                    Configure seu domínio apontando para nossa infraestrutura.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <div>
                  <p className="text-text font-medium">Abrir painel</p>
                  <p className="text-sm text-text-soft">
                    Acesse o dashboard para configurar logo, cores e CTAs.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <div>
                  <p className="text-text font-medium">Gerar kit de campanhas</p>
                  <p className="text-sm text-text-soft">
                    Crie links curtos, QR codes e embeds para suas campanhas.
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/b2b/dashboard"
                className="flex-1 btn-brand flex items-center justify-center gap-2"
              >
                Ir para o painel
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/b2b/configurar"
                className="flex-1 btn-ghost flex items-center justify-center gap-2"
              >
                Personalizar marca
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}

