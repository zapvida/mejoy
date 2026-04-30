'use client';

import { CreditCard, Info, QrCode } from 'lucide-react';
import CreditCardPreview from './CreditCardPreview';

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base';

// PIX icon - 4 circles/diamonds style
function PixIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <circle cx="8" cy="12" r="3" />
      <circle cx="16" cy="12" r="3" />
      <path d="M11 12h2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export interface CreditCardData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

interface PaymentFormProps {
  paymentMethod: 'PIX' | 'CREDIT_CARD';
  setPaymentMethod: (m: 'PIX' | 'CREDIT_CARD') => void;
  creditCard: CreditCardData;
  setCreditCard: React.Dispatch<React.SetStateAction<CreditCardData>>;
  totalCents: number;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g) ?? [];
  return groups.join(' ');
}

export default function PaymentForm({
  paymentMethod,
  setPaymentMethod,
  creditCard,
  setCreditCard,
  totalCents: _totalCents,
  loading,
  error,
  onSubmit,
  onBack,
}: PaymentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Pagamento</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>Amex</span>
            <span>•</span>
            <span>Elo</span>
          </div>
        </div>
        <div className="p-4 lg:p-6 space-y-6">
          {/* Seleção PIX / Cartão */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('PIX')}
              className={`
                p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                ${paymentMethod === 'PIX'
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }
              `}
            >
              <PixIcon className="w-10 h-10" />
              <span className="font-medium">Pix</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('CREDIT_CARD')}
              className={`
                p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                ${paymentMethod === 'CREDIT_CARD'
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }
              `}
            >
              <CreditCard className="w-10 h-10" />
              <span className="font-medium">Cartão de Crédito</span>
            </button>
          </div>

          {paymentMethod === 'PIX' && (
            <>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-2">
                <div className="flex gap-2">
                  <Info className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Como funciona?</p>
                    <p className="text-sm text-gray-600">
                      Clique em &quot;Gerar PIX do Pedido&quot;. É simples e o processamento é instantâneo.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-2">
                <div className="flex gap-2">
                  <QrCode className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Finalize sua compra com facilidade</p>
                    <p className="text-sm text-gray-600">
                      Abra o app do seu banco, acesse o PIX e escaneie o QR code ou copie o código.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {paymentMethod === 'CREDIT_CARD' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome no cartão</label>
                  <input
                    type="text"
                    placeholder="Nome como está no cartão"
                    value={creditCard.holderName}
                    onChange={(e) =>
                      setCreditCard((c) => ({ ...c, holderName: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número do cartão</label>
                  <input
                    type="text"
                    placeholder="Digite o número do cartão"
                    value={creditCard.number}
                    onChange={(e) =>
                      setCreditCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))
                    }
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={
                        creditCard.expiryMonth && creditCard.expiryYear
                          ? `${creditCard.expiryMonth}/${creditCard.expiryYear.slice(-2)}`
                          : ''
                      }
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        const mm = v.slice(0, 2);
                        const yy = v.slice(2, 4);
                        setCreditCard((c) => ({
                          ...c,
                          expiryMonth: mm,
                          expiryYear: yy.length === 2 ? `20${yy}` : '',
                        }));
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={creditCard.ccv}
                      onChange={(e) =>
                        setCreditCard((c) => ({
                          ...c,
                          ccv: e.target.value.replace(/\D/g, '').slice(0, 4),
                        }))
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex justify-center items-center">
                <CreditCardPreview
                  holderName={creditCard.holderName}
                  number={creditCard.number}
                  expiryMonth={creditCard.expiryMonth}
                  expiryYear={creditCard.expiryYear}
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-900 font-medium hover:bg-gray-50 bg-white"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 rounded-xl bg-orange-500 text-white font-semibold disabled:opacity-70 hover:bg-orange-600 transition-colors min-h-[48px]"
            >
              {loading
                ? 'Processando...'
                : paymentMethod === 'PIX'
                  ? `Gerar PIX do Pedido →`
                  : `Confirmar Pedido →`}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
