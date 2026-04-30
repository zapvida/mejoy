// src/pages/assinatura.tsx
// Página de assinatura do passe de 30 dias

import { CheckCircle, Star, Zap, Shield } from 'lucide-react';
import Head from 'next/head';
import React, { useState } from 'react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/buttons';
import { tVariant } from '@/lib/i18n';

export default function AssinaturaPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/asaas/product-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'zapfarm',
          plano: 'basico', // Plano básico para passe de 30 dias
          paymentMethod: 'PIX',
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        if (data.payment?.pixTransaction) {
          window.location.href = `/checkout/pix?paymentId=${data.paymentId}&qrCode=${encodeURIComponent(data.payment.pixTransaction.qrCode)}`;
        } else if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-brand" />,
      title: "Acesso Completo",
      description: "Todas as triagens médicas disponíveis"
    },
    {
      icon: <Shield className="w-6 h-6 text-brand" />,
      title: "Relatórios Premium",
      description: "Análises detalhadas com IA avançada"
    },
    {
      icon: <Star className="w-6 h-6 text-brand" />,
      title: "30 Dias de Acesso",
      description: "Sem compromisso, cancele quando quiser"
    }
  ];

  return (
    <>
      <Head>
        <title>Liberar Todas as Triagens - Me Joy</title>
        <meta name="description" content="Acesso completo a todas as triagens médicas por 30 dias" />
      </Head>

      <div className="min-h-screen bg-brand">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {tVariant('assinatura.h1_variants', 0)}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {tVariant('assinatura.sub_variants', 0)}
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center">
              <div className="mb-8">
                <div className="text-6xl font-bold text-brand mb-2">R$ 49</div>
                <div className="text-xl text-muted-foreground">30 dias de acesso completo</div>
                <div className="text-sm text-muted-foreground mt-2">Pagamento único • Sem renovação automática</div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {feature.icon}
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{feature.title}</div>
                      <div className="text-sm text-muted-foreground">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-4 text-lg font-semibold"
                size="lg"
              >
                {loading ? 'Processando...' : 'Liberar Todas as Triagens - R$ 49'}
              </Button>

              <div className="mt-6 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Pagamento seguro via Asaas • Pix e cartão aceitos
              </div>
            </Card>
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-foreground mb-8">
              Perguntas Frequentes
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">
                  O que está incluído no passe de 30 dias?
                </h3>
                <p className="text-muted-foreground">
                  Acesso completo a todas as triagens médicas disponíveis, relatórios detalhados 
                  com IA, sugestões de exames e recomendações personalizadas.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">
                  O pagamento é recorrente?
                </h3>
                <p className="text-muted-foreground">
                  Não. É um pagamento único de R$ 49 por 30 dias de acesso. 
                  Não há renovação automática.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">
                  Posso cancelar a qualquer momento?
                </h3>
                <p className="text-muted-foreground">
                  Como é um pagamento único, não há necessidade de cancelamento. 
                  O acesso expira automaticamente após 30 dias.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center text-sm text-muted-foreground">
            <p>Me Joy é oferecido gratuitamente pela Me Joy e pela ZapVida.</p>
          </div>
        </div>
      </div>
    </>
  );
}