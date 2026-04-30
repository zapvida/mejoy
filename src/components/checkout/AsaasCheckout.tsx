'use client';

import { useState } from 'react';
import { CheckIcon, CreditCardIcon, QrCodeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '@/lib/asaas/config';

export interface AsaasCheckoutProps {
  product: string;
  plan: 'basico' | 'completo' | 'premium';
  amount: number; // em centavos
  productName: string;
  planName: string;
  reportId?: string;
  triageId?: string;
  onSuccess?: () => void;
  onError?: () => void;
  className?: string;
}

export default function AsaasCheckout({
  product,
  plan,
  amount,
  productName,
  planName,
  reportId,
  triageId,
  onSuccess,
  onError,
  className = '',
}: AsaasCheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<{
    id: string;
    pixQrCode?: string;
    pixQrCodeBase64?: string;
    invoiceUrl?: string;
  } | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/asaas/product-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          plano: plan,
          paymentMethod,
          reportId: reportId || '',
          triageId: triageId || '',
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        if (paymentMethod === 'PIX' && data.payment?.pixTransaction) {
          // Para PIX, mostrar QR Code
          setPaymentData({
            id: data.paymentId,
            pixQrCode: data.payment.pixTransaction.qrCode,
            pixQrCodeBase64: data.payment.pixTransaction.qrCodeBase64,
          });
        } else if (data.url) {
          // Para cartão ou link de pagamento, redirecionar
          window.location.href = data.url;
        } else {
          throw new Error('Resposta inválida do servidor');
        }
        onSuccess?.();
      } else {
        throw new Error(data.message || 'Erro ao processar pagamento');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao processar pagamento. Tente novamente.';
      setError(errorMessage);
      onError?.();
    } finally {
      setLoading(false);
    }
  };

  if (paymentData && paymentMethod === 'PIX') {
    return (
      <div className={`bg-white rounded-xl shadow-xl p-6 sm:p-8 ${className}`}>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Pagamento PIX</h3>
          <p className="text-gray-600">Escaneie o QR Code ou copie o código PIX</p>
        </div>

        {paymentData.pixQrCodeBase64 && (
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6 flex justify-center">
            <img
              src={`data:image/png;base64,${paymentData.pixQrCodeBase64}`}
              alt="QR Code PIX"
              className="w-64 h-64"
            />
          </div>
        )}

        {paymentData.pixQrCode && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Código PIX (copiar e colar)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={paymentData.pixQrCode}
                className="flex-1 px-4 py-2 text-xs border-2 border-gray-300 rounded-lg bg-white font-mono"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentData.pixQrCode!);
                  alert('Código PIX copiado!');
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-colors"
              >
                Copiar
              </button>
            </div>
          </div>
        )}

        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <CheckIcon className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-purple-900 mb-1">Pagamento processado pelo Asaas</h4>
              <p className="text-sm text-purple-700">
                Plataforma brasileira segura e confiável. Seu pagamento será confirmado em instantes.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Após o pagamento, você receberá um e-mail de confirmação e acesso ao produto.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-xl p-6 sm:p-8 ${className}`}>
      {/* Resumo da Compra */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Resumo da compra</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">{productName}</span>
            <span className="font-semibold">{planName}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
            <span>Total</span>
            <span>{formatPrice(amount)}</span>
          </div>
        </div>
      </div>

      {/* Seleção de Método de Pagamento */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Forma de pagamento</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setPaymentMethod('PIX')}
            disabled={loading}
            className={`
              p-4 rounded-xl border-2 transition-all
              ${paymentMethod === 'PIX'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <QrCodeIcon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-sm font-semibold">PIX</div>
            <div className="text-xs text-gray-500 mt-1">Pagamento instantâneo</div>
          </button>
          <button
            onClick={() => setPaymentMethod('CREDIT_CARD')}
            disabled={loading}
            className={`
              p-4 rounded-xl border-2 transition-all
              ${paymentMethod === 'CREDIT_CARD'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <CreditCardIcon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-sm font-semibold">Cartão</div>
            <div className="text-xs text-gray-500 mt-1">Até 12x sem juros</div>
          </button>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-1">Erro ao processar pagamento</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Botão de Finalizar */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`
          w-full py-4 px-6 rounded-xl font-bold text-white
          bg-gradient-to-r from-purple-600 to-purple-700
          hover:from-purple-700 hover:to-purple-800
          transition-all shadow-lg hover:shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        `}
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Gerando cobrança...
          </>
        ) : (
          <>
            Finalizar pagamento
            <CheckIcon className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Selo de Confiança */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-xs text-gray-500">
          <span className="font-semibold">Pagamento processado pelo Asaas</span>
          <br />
          Plataforma brasileira segura e confiável
        </p>
      </div>
    </div>
  );
}

