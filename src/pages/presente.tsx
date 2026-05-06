'use client';

import { 
  GiftIcon, 
  CheckIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import LogoWithName from '@/components/ui/LogoWithName';
import { useGA4 } from '@/hooks/useGA4';
import { formatPrice } from '@/lib/asaas/config';

const GiftPage = () => {
  const router = useRouter();
  const { trackEvent } = useGA4();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [giftData, setGiftData] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    message: '',
    planType: 'MONTHLY_29'
  });
  const [giftCode, setGiftCode] = useState('');

  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Presentear - MeJoy Plus',
      page_location: window.location.href
    });
  }, [trackEvent]);

  const handleInputChange = (field: string, value: string) => {
    setGiftData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateGift = async () => {
    setIsLoading(true);
    
    try {
      trackEvent('gift_create_click', {
        plan_type: giftData.planType,
        recipient_email: giftData.recipientEmail
      });

      const response = await fetch('/api/asaas/subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'plus',
          period: giftData.planType.includes('MONTHLY') ? 'monthly' : 'yearly',
          variant: 'gift',
          beneficiaryEmail: giftData.recipientEmail,
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        if (data.payment?.pixTransaction) {
          window.location.href = `/checkout/pix?paymentId=${data.paymentId}&qrCode=${encodeURIComponent(data.payment.pixTransaction.qrCode)}`;
        } else if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('Resposta inválida do servidor');
        }
      } else {
        throw new Error(data.message || 'Erro ao criar checkout');
      }
    } catch (error) {
      console.error('Gift creation error:', error);
      alert('Erro ao criar presente. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeemGift = async () => {
    setIsLoading(true);
    
    try {
      trackEvent('gift_redeem_click', {
        gift_code: giftCode
      });

      const response = await fetch('/api/gift/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: giftCode,
          userId: 'temp-user' // Será substituído pelo sistema de auth
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        trackEvent('gift_redeemed', {
          gift_code: giftCode
        });
        router.push('/dashboard?gift_redeemed=true');
      } else {
        throw new Error(result.error || 'Failed to redeem gift');
      }
    } catch (error) {
      console.error('Gift redemption error:', error);
      alert('Erro ao resgatar presente. Verifique o código e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'MONTHLY_29',
      name: 'Plano Básico',
      price: 29,
      description: '1 mês de acesso completo',
      features: ['Relatórios ilimitados', 'Análise personalizada', 'Suporte prioritário']
    },
    {
      id: 'MONTHLY_49',
      name: 'Plano Premium',
      price: 49,
      description: '1 mês de acesso premium',
      features: ['Tudo do plano básico', 'Consultas virtuais', 'Monitoramento contínuo']
    },
    {
      id: 'YEARLY_29',
      name: 'Plano Básico Anual',
      price: 290,
      description: '1 ano de acesso completo',
      features: ['Relatórios ilimitados', 'Análise personalizada', 'Suporte prioritário', 'Economia de 2 meses']
    },
    {
      id: 'YEARLY_49',
      name: 'Plano Premium Anual',
      price: 490,
      description: '1 ano de acesso premium',
      features: ['Tudo do plano básico', 'Consultas virtuais', 'Monitoramento contínuo', 'Economia de 2 meses']
    }
  ];

  return (
    <>
      <Head>
        <title>Presentear - MeJoy Plus</title>
        <meta name="description" content="Presenteie alguém especial com acesso ao MeJoy Plus. Crie um token de presente personalizado." />
        <meta property="og:title" content="Presentear - MeJoy Plus" />
        <meta property="og:description" content="Presenteie alguém especial com acesso ao MeJoy Plus. Crie um token de presente personalizado." />
        <meta property="og:image" content="https://www.mejoy.com.br/logosmejoy/logomejoy.png" />
        <link rel="canonical" href="https://zapfarm.com.br/presente" />
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
              <GiftIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Presenteie alguém especial
            </h1>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              Dê o presente da saúde para quem você ama. 
              Crie um token personalizado que pode ser resgatado por qualquer pessoa.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1 ? 'bg-purple-600 text-white' : 'bg-zinc-700 text-zinc-400'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-purple-600' : 'bg-zinc-700'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2 ? 'bg-purple-600 text-white' : 'bg-zinc-700 text-zinc-400'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-purple-600' : 'bg-zinc-700'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 3 ? 'bg-purple-600 text-white' : 'bg-zinc-700 text-zinc-400'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Step 1: Choose Plan */}
          {step === 1 && (
            <div className="bg-zinc-800 rounded-2xl p-8 border border-zinc-700">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Escolha o plano para presentear
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-zinc-700 rounded-xl p-6 border-2 transition-all cursor-pointer ${
                      giftData.planType === plan.id 
                        ? 'border-purple-500 bg-purple-900/20' 
                        : 'border-zinc-600 hover:border-zinc-500'
                    }`}
                    onClick={() => handleInputChange('planType', plan.id)}
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="text-3xl font-bold text-white mb-2">
                        {formatPrice(plan.price * 100)}
                      </div>
                      <p className="text-zinc-400 mb-4">
                        {plan.description}
                      </p>
                      <ul className="space-y-2 text-sm text-zinc-300">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckIcon className="h-4 w-4 text-green-400" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setStep(2)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Recipient Information */}
          {step === 2 && (
            <div className="bg-zinc-800 rounded-2xl p-8 border border-zinc-700">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Informações do presenteado
              </h2>
              
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Nome do presenteado
                  </label>
                  <input
                    type="text"
                    value={giftData.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nome da pessoa que receberá o presente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    E-mail do presenteado
                  </label>
                  <input
                    type="email"
                    value={giftData.recipientEmail}
                    onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Telefone (opcional)
                  </label>
                  <input
                    type="tel"
                    value={giftData.recipientPhone}
                    onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+55 11 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Mensagem personalizada
                  </label>
                  <textarea
                    value={giftData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Escreva uma mensagem especial para acompanhar o presente..."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!giftData.recipientName || !giftData.recipientEmail}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-zinc-800 rounded-2xl p-8 border border-zinc-700">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Confirmação do presente
              </h2>
              
              <div className="max-w-2xl mx-auto">
                <div className="bg-zinc-700 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Resumo do presente
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Plano:</span>
                      <span className="text-white">
                        {plans.find(p => p.id === giftData.planType)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Valor:</span>
                      <span className="text-white">
                        {formatPrice(plans.find(p => p.id === giftData.planType)?.price! * 100)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Presenteado:</span>
                      <span className="text-white">{giftData.recipientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">E-mail:</span>
                      <span className="text-white">{giftData.recipientEmail}</span>
                    </div>
                  </div>
                  
                  {giftData.message && (
                    <div className="mt-4 pt-4 border-t border-zinc-600">
                      <h4 className="text-sm font-medium text-zinc-400 mb-2">Mensagem:</h4>
                      <p className="text-zinc-300 italic">"{giftData.message}"</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleCreateGift}
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processando...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5" />
                        <span>Criar Presente</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Redeem Gift Section */}
          <div className="mt-16 bg-zinc-800 rounded-2xl p-8 border border-zinc-700">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Resgatar presente
            </h2>
            <p className="text-zinc-300 text-center mb-8">
              Tem um código de presente? Digite abaixo para resgatar
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={giftCode}
                  onChange={(e) => setGiftCode(e.target.value)}
                  placeholder="Digite o código do presente"
                  className="flex-1 bg-zinc-700 border border-zinc-600 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleRedeemGift}
                  disabled={isLoading || !giftCode}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center space-x-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <ArrowRightIcon className="h-4 w-4" />
                      <span>Resgatar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GiftPage;
