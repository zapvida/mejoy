import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

export async function getServerSideProps() {
  return { props: {} };
}

const TEMPLATES = [
  { id: 'triage-completed', name: 'Triagem Completada', description: 'Enviado quando usuário completa uma triagem' },
  { id: 'report-ready', name: 'Relatório Pronto', description: 'Enviado quando relatório está pronto' },
  { id: 'payment-confirmed', name: 'Pagamento Confirmado', description: 'Enviado quando pagamento é confirmado' },
  { id: 'welcome', name: 'Boas-vindas', description: 'Enviado para novos usuários' },
  { id: 'gift-received', name: 'Presente Recebido', description: 'Enviado quando usuário recebe um presente' },
  { id: 'follow-up-d1', name: 'Follow-up D+1', description: 'Enviado 24h após triagem' },
  { id: 'follow-up-d3', name: 'Follow-up D+3', description: 'Enviado 72h após triagem' },
  { id: 'follow-up-d7', name: 'Follow-up D+7', description: 'Enviado 7 dias após triagem' },
] as const;

const EmailValidationPage: NextPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(TEMPLATES[0].id);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadPreview();
  }, [selectedTemplate]);

  const loadPreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/email-preview?template=${selectedTemplate}&format=html`);
      if (!res.ok) {
        throw new Error('Failed to load preview');
      }
      const html = await res.text();
      setPreviewHtml(html);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      alert('Por favor, insira um email válido');
      return;
    }

    setSending(true);
    try {
      // Importar função de envio dinamicamente
      const emailModule = await import('@/lib/email');
      const templateMap: Record<string, any> = {
        'triage-completed': emailModule.sendTriageCompletedEmail,
        'report-ready': emailModule.sendReportReadyEmail,
        'payment-confirmed': emailModule.sendPaymentConfirmedEmail,
        'welcome': emailModule.sendWelcomeEmail,
        'gift-received': emailModule.sendGiftReceivedEmail,
        'follow-up-d1': emailModule.sendFollowUpD1Email,
        'follow-up-d3': emailModule.sendFollowUpD3Email,
        'follow-up-d7': emailModule.sendFollowUpD7Email,
      };

      const sendFn = templateMap[selectedTemplate];
      if (!sendFn) {
        throw new Error('Template não encontrado');
      }

      const defaultData: Record<string, any> = {
        name: 'João Silva',
        firstName: 'João',
        reportUrl: 'https://www.zapfarm.com.br/dashboard',
        triageType: 'gastro',
        productName: 'Plano Plus - Mensal',
        amount: 99.9,
        orderId: 'ord_123456',
        paymentMethod: 'Cartão de crédito',
        giftCode: 'GIFT-ABC123',
        giftMessage: 'Um presente especial para você!',
        tipSono: 'Durma pelo menos 7-8 horas por noite',
        tipNutricao: 'Beba 2 litros de água por dia',
        tipRotina: 'Faça 30 minutos de exercício diário',
      };

      const result = await sendFn(testEmail, defaultData);
      
      if (result.success) {
        alert(`✅ Email enviado com sucesso! Message ID: ${result.messageId || 'N/A'}`);
      } else {
        alert(`❌ Erro ao enviar email: ${result.error}`);
      }
    } catch (err: any) {
      alert(`❌ Erro: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Head>
        <title>Validação de Emails - MeJoy Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h1 className="text-2xl font-bold text-white">Validação de Emails</h1>
              <p className="text-green-100 text-sm mt-1">Preview e teste de todos os templates de email</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Sidebar - Templates */}
              <div className="lg:col-span-1">
                <h2 className="text-lg font-semibold mb-4">Templates</h2>
                <div className="space-y-2">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedTemplate === template.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                    </button>
                  ))}
                </div>

                {/* Test Email Form */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2">Enviar Email de Teste</h3>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="seu-email@exemplo.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                  />
                  <button
                    onClick={sendTestEmail}
                    disabled={sending || !testEmail}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {sending ? 'Enviando...' : 'Enviar Teste'}
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="lg:col-span-2">
                <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Preview: {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                    </span>
                    <button
                      onClick={loadPreview}
                      className="text-xs text-green-600 hover:text-green-700 font-medium"
                    >
                      Atualizar
                    </button>
                  </div>

                  {loading ? (
                    <div className="p-8 text-center text-gray-500">Carregando preview...</div>
                  ) : error ? (
                    <div className="p-8 text-center text-red-500">Erro: {error}</div>
                  ) : (
                    <div className="p-4 overflow-auto max-h-[600px]">
                      <iframe
                        srcDoc={previewHtml}
                        className="w-full border-0"
                        style={{ minHeight: '500px' }}
                        title="Email Preview"
                      />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Dicas</h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Verifique o preview em diferentes tamanhos de tela</li>
                    <li>• Teste o envio real para seu email</li>
                    <li>• Verifique spam folder após envio</li>
                    <li>• Confirme que todos os links funcionam</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailValidationPage;

