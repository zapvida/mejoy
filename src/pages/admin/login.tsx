import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const redirect = typeof router.query.redirect === 'string' ? router.query.redirect : '/admin';
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/auth/session', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, secret }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'Falha ao iniciar sessão admin');
      }

      router.replace(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao iniciar sessão admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login Admin | MeJoy</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_32%),linear-gradient(180deg,_#f7faf8_0%,_#eef3ef_100%)] px-4 py-10 text-slate-900">
        <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
            <section className="bg-[linear-gradient(135deg,_#08151f_0%,_#10242b_50%,_#0f3b2f_100%)] p-8 text-white sm:p-10">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">MeJoy admin</p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Cockpit operacional e executivo do lançamento
              </h1>
              <p className="mt-4 max-w-md text-sm text-slate-200 sm:text-base">
                Sessão server-only para visão real de operação, comercial, clínica e saúde técnica. Sem segredo público, sem mock disfarçado.
              </p>
              <div className="mt-8 space-y-3 text-sm text-slate-200">
                <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                  Use um email com role admin ou analyst configurada no ambiente.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                  O access key é validado apenas no servidor e vira cookie HttpOnly.
                </div>
              </div>
            </section>

            <section className="p-8 sm:p-10">
              <div className="max-w-md">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Entrar</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Acesso administrativo</h2>
                <p className="mt-2 text-sm text-slate-600">
                  O login cria uma sessão segura para navegação do cockpit e das filas operacionais.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                      Email com role administrativa
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="min-h-12 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      placeholder="admin@mejoy.com.br"
                    />
                  </div>

                  <div>
                    <label htmlFor="secret" className="mb-2 block text-sm font-medium text-slate-700">
                      Access key
                    </label>
                    <input
                      id="secret"
                      type="password"
                      required
                      value={secret}
                      onChange={(event) => setSecret(event.target.value)}
                      className="min-h-12 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      placeholder="ADMIN_SECRET_KEY"
                    />
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    {loading ? 'Entrando...' : 'Iniciar sessão admin'}
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
