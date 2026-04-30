/**
 * Página de validação do Magic Link (acesso via WhatsApp)
 * Valida token, obtém link Supabase e redireciona para login automático
 */

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function MagicLinkPage() {
  const router = useRouter();
  const { token, redirect } = router.query;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || typeof token !== 'string') return;

    const validate = async () => {
      try {
        const params = new URLSearchParams({ token });
        if (redirect && typeof redirect === 'string') {
          params.set('redirect', redirect);
        }
        const res = await fetch(`/api/auth/magic-link/validate?${params}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Link inválido ou expirado');
          return;
        }

        if (data.actionLink) {
          window.location.href = data.actionLink;
          return;
        }

        setError('Erro ao processar link');
      } catch (e) {
        console.error('[magic-link] Erro:', e);
        setError('Erro ao validar link');
      }
    };

    validate();
  }, [token, redirect]);

  return (
    <>
      <Head>
        <title>Entrando... | MeJoy</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center px-4">
          {error ? (
            <>
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <a
                href="/dashboard"
                className="text-green-400 hover:underline"
              >
                Ir para o Dashboard
              </a>
            </>
          ) : (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-white">Validando seu acesso...</p>
              <p className="text-gray-400 text-sm mt-2">Você será redirecionado em instantes.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
