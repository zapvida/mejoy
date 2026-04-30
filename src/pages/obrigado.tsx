// src/pages/obrigado.tsx
// Página de agradecimento após pagamento

import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiCheck, FiGift, FiLock, FiArrowRight } from 'react-icons/fi';

import Logo from '@/components/ui/Logo';
import { t } from '@/lib/i18n';

export default function ObrigadoPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState<string>('');

  useEffect(() => {
    if (router.isReady) {
      const tipoParam = router.query.tipo as string;
      setTipo(tipoParam || '');
    }
  }, [router.isReady, router.query]);

  const getContentByType = () => {
    switch (tipo) {
      case 'pass':
      case 'assinatura':
        return {
          title: t('obrigado.title'),
          subtitle: t('obrigado.sub'),
          icon: <FiLock className="text-brand" size={48} />,
          primaryAction: {
            text: t('obrigado.cta'),
            href: '/triagem',
            color: 'from-brand to-brand'
          },
          secondaryAction: {
            text: t('obrigado.hint'),
            href: '/relatorios',
            color: 'from-brand to-brand'
          }
        };
      case 'presente':
        return {
          title: '🎁 Presente enviado com sucesso!',
          subtitle: 'O código de presente foi enviado por WhatsApp',
          icon: <FiGift className="text-brand" size={48} />,
          primaryAction: {
            text: 'Ver meus presentes',
            href: '/presentes',
            color: 'from-brand to-brand'
          },
          secondaryAction: {
            text: 'Fazer nova triagem',
            href: '/triagem',
            color: 'from-brand to-brand'
          }
        };
      default:
        return {
          title: '✅ Pagamento realizado!',
          subtitle: 'Obrigado pela sua compra',
          icon: <FiCheck className="text-brand" size={48} />,
          primaryAction: {
            text: 'Voltar ao início',
            href: '/',
            color: 'from-brand to-brand'
          },
          secondaryAction: {
            text: 'Fazer triagem',
            href: '/triagem',
            color: 'from-brand to-brand'
          }
        };
    }
  };

  const content = getContentByType();

  return (
    <>
      <Head>
        <title>Obrigado! | Me Joy</title>
        <meta name="description" content="Pagamento realizado com sucesso" />
      </Head>

      <main className="min-h-screen bg-bg text-fg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-bg/20 backdrop-blur-md border-b border-border py-4"
        >
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
            <Logo size="small" />
          </div>
        </motion.div>

        <div className="mx-auto max-w-4xl px-4 py-12">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="mb-6">
              {content.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-fg mb-4">
              {content.title}
            </h1>
            <p className="text-lg text-fg/70 max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href={content.primaryAction.href}
              className={`bg-gradient-to-r ${content.primaryAction.color} text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2`}
            >
              {content.primaryAction.text}
              <FiArrowRight />
            </Link>
            
            <Link
              href={content.secondaryAction.href}
              className={`bg-gradient-to-r ${content.secondaryAction.color} text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2`}
            >
              {content.secondaryAction.text}
              <FiArrowRight />
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-bg/10 border border-border rounded-2xl p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-fg mb-4">
                🎯 Próximos passos
              </h3>
              <div className="space-y-3 text-fg/70">
                <p>• Acesse todas as triagens disponíveis</p>
                <p>• Receba relatórios personalizados</p>
                <p>• Acompanhe sua evolução de saúde</p>
                <p>• Compartilhe com profissionais de saúde</p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 text-center text-fg/50 text-sm"
          >
            <p>Me Joy - Sua saúde em primeiro lugar</p>
            <p className="mt-2">
              Dúvidas? Entre em contato conosco via WhatsApp
            </p>
          </motion.div>
        </div>
      </main>
    </>
  );
}