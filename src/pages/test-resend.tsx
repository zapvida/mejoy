// Página de teste do Resend - Acesse /test-resend
import { useState } from 'react';
import Head from 'next/head';

export async function getServerSideProps() {
  return { props: {} };
}

export default function TestResendPage() {
  const [email, setEmail] = useState('zapfarmx@gmail.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Erro ao testar',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Teste Resend - Me Joy</title>
      </Head>

      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">🧪 Teste do Resend</h1>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <label className="block text-sm font-semibold mb-2">
              Email para teste:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg mb-4"
              placeholder="zapfarmx@gmail.com"
            />
            <button
              onClick={handleTest}
              disabled={loading || !email}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? '⏳ Enviando...' : '📧 Enviar Email de Teste'}
            </button>
          </div>

          {result && (
            <div className={`rounded-lg p-6 ${
              result.success 
                ? 'bg-green-900 border border-green-700' 
                : 'bg-red-900 border border-red-700'
            }`}>
              <h2 className="text-xl font-bold mb-4">
                {result.success ? '✅ Sucesso!' : '❌ Erro'}
              </h2>
              
              {result.success ? (
                <div className="space-y-2">
                  <p>✅ Email enviado com sucesso!</p>
                  <p>📧 Message ID: {result.messageId}</p>
                  <p>📬 {result.checkInbox}</p>
                  <p>
                    🔗{' '}
                    <a 
                      href={result.dashboard} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Ver no Dashboard do Resend
                    </a>
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-semibold">Erro: {result.error}</p>
                  {result.details && (
                    <div className="mt-4 p-4 bg-gray-800 rounded">
                      <p className="text-sm font-semibold mb-2">Detalhes:</p>
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 bg-blue-900 border border-blue-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">💡 Como usar:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Digite o email onde quer receber o teste</li>
              <li>Clique em "Enviar Email de Teste"</li>
              <li>Verifique sua caixa de entrada</li>
              <li>Verifique o Dashboard do Resend</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

