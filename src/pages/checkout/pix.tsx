'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { QrCodeIcon, CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';

export default function PixCheckoutPage() {
  const router = useRouter();
  const { paymentId, qrCode } = router.query;
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'error'>('pending');

  useEffect(() => {
    // Verificar status do pagamento periodicamente
    if (paymentId) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/asaas/payment-status?paymentId=${paymentId}`);
          const data = await response.json();
          if (data.status === 'PAID' || data.status === 'CONFIRMED' || data.status === 'RECEIVED') {
            setPaymentStatus('paid');
            clearInterval(interval);
            // Redirecionar após 3 segundos
            setTimeout(() => {
              router.push('/obrigado?payment_id=' + paymentId);
            }, 3000);
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
        }
      }, 5000); // Verificar a cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [paymentId, router]);

  const handleCopyPix = () => {
    if (qrCode && typeof qrCode === 'string') {
      navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!qrCode || !paymentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando dados do pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Pagamento PIX - Me Joy</title>
        <meta name="description" content="Complete seu pagamento via PIX" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {paymentStatus === 'paid' ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckIcon className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Pagamento Confirmado!</h1>
                <p className="text-gray-600 mb-8">
                  Seu pagamento foi processado com sucesso. Você será redirecionado em instantes...
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento PIX</h1>
                  <p className="text-gray-600">Escaneie o QR Code ou copie o código PIX</p>
                </div>

                {/* QR Code */}
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6 flex justify-center">
                  <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCodeIcon className="w-32 h-32 text-gray-400" />
                    <p className="text-sm text-gray-500 ml-4">QR Code será exibido aqui</p>
                  </div>
                </div>

                {/* Código PIX */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Código PIX (copiar e colar)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={qrCode as string}
                      className="flex-1 px-4 py-3 text-xs border-2 border-gray-300 rounded-lg bg-white font-mono"
                    />
                    <button
                      onClick={handleCopyPix}
                      className={`
                        px-6 py-3 rounded-lg font-semibold text-sm transition-all
                        ${copied
                          ? 'bg-green-600 text-white'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                        }
                      `}
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="w-5 h-5 inline mr-2" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <ClipboardIcon className="w-5 h-5 inline mr-2" />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Informações */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckIcon className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-purple-900 mb-1">Pagamento processado pelo Asaas</h4>
                      <p className="text-sm text-purple-700">
                        Plataforma brasileira segura e confiável. Seu pagamento será confirmado automaticamente em instantes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Aguardando confirmação do pagamento...
                  </p>
                  <div className="inline-flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-75" />
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-150" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

