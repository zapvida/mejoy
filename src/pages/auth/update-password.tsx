/**
 * Página para definir nova senha após clicar no link de recuperação
 * Supabase redireciona aqui com tokens no hash; trocamos por sessão e mostramos o form
 */

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import LogoWithName from '@/components/ui/LogoWithName';
import { supabaseClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (hash) {
      supabaseClient().auth.getSession().then(({ data: { session } }) => {
        setReady(!!session);
        if (!session) setError('Link expirado ou inválido. Solicite um novo.');
      });
    } else {
      supabaseClient().auth.getSession().then(({ data: { session } }) => {
        setReady(true);
        if (!session) {
          router.replace('/login?redirect=/auth/update-password');
        }
      });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: err } = await supabaseClient().auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message || 'Erro ao atualizar senha');
    } else {
      setSuccess(true);
      setTimeout(() => router.replace('/dashboard'), 2000);
    }
  };

  const brandColor = 'var(--brand, #16a34a)';

  return (
    <>
      <Head>
        <title>Redefinir senha | Me Joy</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <header className="p-4 sm:p-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <LogoWithName size="small" />
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Nova senha</h1>
              <p className="text-slate-600 text-sm mb-6">
                Digite sua nova senha abaixo.
              </p>

              {success ? (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Senha atualizada! Redirecionando ao painel...
                </div>
              ) : !ready ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto mb-4" />
                  <p className="text-slate-600">Verificando...</p>
                </div>
              ) : error ? (
                <div className="space-y-4">
                  <p className="text-red-600">{error}</p>
                  <Link href="/login" className="block text-center text-sm font-medium" style={{ color: brandColor }}>
                    Voltar ao login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                      Nova senha
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 mb-2">
                      Confirmar senha
                    </label>
                    <input
                      id="confirm"
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repita a senha"
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-white hover:opacity-95 disabled:opacity-70"
                    style={{ background: brandColor }}
                  >
                    {loading ? 'Salvando...' : 'Redefinir senha'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
