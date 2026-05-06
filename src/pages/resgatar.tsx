'use client';

import { 
  GiftIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import LogoWithName from '@/components/ui/LogoWithName';
import { useGA4 } from '@/hooks/useGA4';

const RedeemPage = () => {
  const router = useRouter();
  const { trackEvent } = useGA4();
  const [giftCode, setGiftCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Resgatar Presente - MeJoy Plus',
      page_location: window.location.href
    });

    // Verificar se há código na URL
    const urlCode = router.query.code as string;
    if (urlCode) {
      setGiftCode(urlCode);
    }
  }, [router.query, trackEvent]);

  const handleRedeemGift = async () => {
    if (!giftCode.trim()) {
      setError('Por favor, digite o código do presente');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      trackEvent('gift_redeem_click', {
        gift_code: giftCode,
        page: 'redeem'
      });

      const response = await fetch('/api/gift/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: giftCode.trim(),
          userId: 'temp-user' // Será substituído pelo sistema de auth
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        trackEvent('gift_redeemed', {
          gift_code: giftCode,
          subscription_id: result.subscription.id
        });
        setSuccess(true);
        
        // Redirecionar para o dashboard após 3 segundos
        setTimeout(() => {
          router.push('/dashboard?gift_redeemed=true');
        }, 3000);
      } else {
        setError(result.error || 'Erro ao resgatar presente');
      }
    } catch (error) {
      console.error('Gift redemption error:', error);
      setError('Erro ao resgatar presente. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRedeemGift();
    }
  };

  return (
    <>
      <Head>
        <title>Resgatar Presente - MeJoy Plus</title>
        <meta name="description" content="Resgate seu presente MeJoy Plus usando o código fornecido." />
        <meta property="og:title" content="Resgatar Presente - MeJoy Plus" />
        <meta property="og:description" content="Resgate seu presente MeJoy Plus usando o código fornecido." />
        <link rel="canonical" href="https://www.mejoy.com.br/resgatar" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        {/* Header */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LogoWithName size="small" variant="inverse" priority />
              </div>
              <button
                onClick={() => router.push('/')}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
              <GiftIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Resgatar Presente
            </h1>
            <p className="text-xl text-zinc-300 mb-8">
              Digite o código do presente que você recebeu para ativar sua assinatura
            </p>
          </div>

          {/* Success State */}
          {success && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Presente Resgatado com Sucesso!
              </h2>
              <p className="text-green-300 mb-6">
                Sua assinatura foi ativada. Você será redirecionado para o dashboard em alguns segundos.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Ir para o Dashboard
              </button>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 mb-8">
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400 flex-shrink-0" />
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Redeem Form */}
          {!success && (
            <div className="bg-zinc-800 rounded-2xl p-8 border border-zinc-700">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Código do Presente
                  </label>
                  <input
                    type="text"
                    value={giftCode}
                    onChange={(e) => setGiftCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite o código do presente"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg font-mono"
                    disabled={isLoading}
                  />
                </div>

                <button
                  onClick={handleRedeemGift}
                  disabled={isLoading || !giftCode.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Resgatando...</span>
                    </>
                  ) : (
                    <>
                      <span>Resgatar Presente</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 bg-zinc-800 rounded-2xl p-6 border border-zinc-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Precisa de ajuda?
            </h3>
            <div className="space-y-3 text-zinc-300">
              <p>• O código do presente é enviado por e-mail após a compra</p>
              <p>• Verifique sua caixa de spam se não recebeu o e-mail</p>
              <p>• O código é válido por 1 ano após a compra</p>
              <p>• Entre em contato conosco se tiver problemas</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-zinc-400 mb-2">
              Problemas com o resgate?
            </p>
            <a
              href="mailto:suporte@mejoy.com.br"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              suporte@mejoy.com.br
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default RedeemPage;
