'use client';

import { 
  CreditCardIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import LogoWithName from '@/components/ui/LogoWithName';
import { useGA4 } from '@/hooks/useGA4';
import { buildCanonical } from '@/lib/seo';
import { formatPrice } from '@/lib/stripe-config';

export async function getServerSideProps() {
  return { props: {} };
}

const BillingPage = () => {
  const router = useRouter();
  const { trackEvent } = useGA4();
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Billing - MeJoy Plus',
      page_location: window.location.href
    });

    // Simular carregamento de dados
    setTimeout(() => {
      setSubscription({
        status: 'active',
        planType: 'monthly',
        planPrice: '49',
        activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        amount: 4900,
        stripeSubscriptionId: 'sub_1234567890'
      });
      
      setInvoices([
        {
          id: 'inv_1',
          amount: 4900,
          status: 'paid',
          date: new Date(),
          downloadUrl: '#'
        },
        {
          id: 'inv_2',
          amount: 4900,
          status: 'paid',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          downloadUrl: '#'
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, [trackEvent]);

  const handleManageBilling = async () => {
    trackEvent('billing_portal_click', {
      page: 'billing'
    });
    
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'temp-user' // Será substituído pelo sistema de auth
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      alert('Erro ao acessar portal de cobrança. Tente novamente.');
    }
  };

  const handleUpgradePlan = () => {
    trackEvent('upgrade_plan_click', {
      page: 'billing'
    });
    router.push('/pricing');
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    trackEvent('download_invoice_click', {
      invoice_id: invoiceId,
      page: 'billing'
    });
    // Implementar download da fatura
    console.log('Download invoice:', invoiceId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando informações de cobrança...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Cobrança - MeJoy Plus</title>
        <meta name="description" content="Gerencie sua assinatura e faturas do MeJoy Plus." />
        <meta property="og:title" content="Cobrança - MeJoy Plus" />
        <meta property="og:description" content="Gerencie sua assinatura e faturas do MeJoy Plus." />
        <link rel="canonical" href={buildCanonical('/billing')} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        {/* Header */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <LogoWithName size="small" variant="inverse" priority />
                <span className="text-xl font-bold text-white">MeJoy Plus</span>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Cobrança e Assinatura
            </h1>
            <p className="text-zinc-300">
              Gerencie sua assinatura, faturas e métodos de pagamento
            </p>
          </div>

          {/* Current Subscription */}
          <div className="bg-zinc-800 rounded-2xl p-6 mb-8 border border-zinc-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Assinatura Atual
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                subscription?.status === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}>
                {subscription?.status === 'active' ? 'Ativa' : 'Inativa'}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Plano</h3>
                <p className="text-zinc-300">
                  {subscription?.planPrice === '49' ? 'Premium' : 'Básico'} 
                  ({subscription?.planType === 'yearly' ? 'Anual' : 'Mensal'})
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Valor</h3>
                <p className="text-zinc-300">
                  {formatPrice(subscription?.amount || 0)} / 
                  {subscription?.planType === 'yearly' ? 'ano' : 'mês'}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Próxima Cobrança</h3>
                <p className="text-zinc-300">
                  {subscription?.activeUntil?.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleManageBilling}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center space-x-2"
              >
                <CreditCardIcon className="h-5 w-5" />
                <span>Gerenciar Cobrança</span>
              </button>
              
              {subscription?.planPrice === '29' && (
                <button
                  onClick={handleUpgradePlan}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Fazer Upgrade
                </button>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-zinc-800 rounded-2xl p-6 mb-8 border border-zinc-700">
            <h2 className="text-xl font-semibold text-white mb-6">
              Método de Pagamento
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CreditCardIcon className="h-8 w-8 text-zinc-400" />
                <div>
                  <h3 className="text-lg font-medium text-white">
                    Cartão de Crédito
                  </h3>
                  <p className="text-zinc-400">
                    **** **** **** 4242
                  </p>
                </div>
              </div>
              <button
                onClick={handleManageBilling}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Alterar
              </button>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700">
            <h2 className="text-xl font-semibold text-white mb-6">
              Histórico de Cobrança
            </h2>
            
            {invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="bg-zinc-700 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {invoice.status === 'paid' ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-400" />
                        ) : (
                          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          Fatura #{invoice.id}
                        </h3>
                        <p className="text-zinc-400">
                          {invoice.date.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-white">
                          {formatPrice(invoice.amount)}
                        </div>
                        <div className={`text-sm ${
                          invoice.status === 'paid' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {invoice.status === 'paid' ? 'Pago' : 'Pendente'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                      >
                        <DocumentTextIcon className="h-4 w-4" />
                        <span>Baixar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-400 mb-2">
                  Nenhuma fatura ainda
                </h3>
                <p className="text-zinc-500">
                  Suas faturas aparecerão aqui após o primeiro pagamento
                </p>
              </div>
            )}
          </div>

          {/* Billing Information */}
          <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-4">
              Informações Importantes
            </h3>
            <ul className="space-y-2 text-blue-200">
              <li>• Você pode cancelar sua assinatura a qualquer momento</li>
              <li>• Não há taxas de cancelamento</li>
              <li>• O acesso aos recursos premium continua até o final do período pago</li>
              <li>• Você pode alterar seu método de pagamento a qualquer momento</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingPage;
