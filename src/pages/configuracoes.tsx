import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Redirect /configuracoes -> /settings/profile
 * Mantém retrocompatibilidade com links antigos.
 */
export default function ConfiguracoesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings/profile');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
    </div>
  );
}
