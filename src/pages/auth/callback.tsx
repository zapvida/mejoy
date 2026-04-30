import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { supabaseClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const handleAuthCallback = async () => {
      try {
        // Supabase pode enviar erro na URL
        const errorParam = router.query.error as string | undefined;
        if (errorParam) {
          router.replace(`/login?error=${encodeURIComponent(errorParam)}`);
          return;
        }

        const code = router.query.code as string | undefined;

        // PKCE: trocar code por sessão (Supabase envia ?code=xxx no redirect)
        if (code) {
          const { error } = await supabaseClient().auth.exchangeCodeForSession(code);
          if (error) {
            console.error('Auth callback exchangeCodeForSession:', error);
            router.push('/login?error=auth_callback_failed');
            return;
          }
        }

        const { data, error } = await supabaseClient().auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login?error=auth_callback_failed');
          return;
        }

        if (data.session) {
          const redirect = (router.query.redirect as string) || '/dashboard';
          router.replace(redirect.startsWith('/') ? redirect : '/dashboard');
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/login?error=auth_callback_failed');
      }
    };

    handleAuthCallback();
  }, [router, router.isReady, router.query.code]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-white">Verificando autenticação...</p>
      </div>
    </div>
  );
}
