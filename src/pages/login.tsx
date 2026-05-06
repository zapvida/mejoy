'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import LogoWithName from '@/components/ui/LogoWithName';
import { useAuth } from '@/context/AuthContext';

type Tab = 'magic' | 'otp' | 'password';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, signIn, verifyOtp, signInWithPassword, signInWithGoogle, resetPassword } = useAuth();
  const [tab, setTab] = useState<Tab>('magic');
  const [resetMode, setResetMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Redirecionar se já logado
  if (user && !authLoading) {
    router.replace('/dashboard');
    return null;
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);
    const { error } = await signIn(email.trim());
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Erro ao enviar link. Tente novamente.' });
    } else {
      setMessage({
        type: 'success',
        text: 'Link mágico enviado! Verifique seu e-mail e clique no link para acessar.',
      });
    }
  };

  const handleOtpSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);
    const { error } = await signIn(email.trim());
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Erro ao enviar código. Tente novamente.' });
    } else {
      setOtpSent(true);
      setMessage({ type: 'success', text: 'Código enviado! Verifique seu e-mail e digite os 6 dígitos.' });
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !otpCode.trim()) return;
    setLoading(true);
    setMessage(null);
    const { error } = await verifyOtp(email.trim(), otpCode.trim());
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Código inválido ou expirado. Tente novamente.' });
    } else {
      const redirect = (router.query.redirect as string) || '/dashboard';
      router.replace(redirect.startsWith('/') ? redirect : '/dashboard');
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setMessage(null);
    const { error } = await signInWithPassword(email.trim(), password);
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message || 'E-mail ou senha incorretos.' });
    } else {
      const redirect = (router.query.redirect as string) || '/dashboard';
      router.replace(redirect.startsWith('/') ? redirect : '/dashboard');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);
    const { error } = await resetPassword(email.trim());
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Erro ao enviar link. Verifique o e-mail.' });
    } else {
      setMessage({
        type: 'success',
        text: 'Link para redefinir senha enviado! Verifique seu e-mail e clique no link.',
      });
      setResetMode(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await signInWithGoogle();
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message || 'Erro ao conectar com Google.' });
    }
  };

  const brandColor = 'var(--brand, #16a34a)';

  return (
    <>
      <Head>
        <title>Entre na sua conta | MeJoy</title>
        <meta name="description" content="Acesse seu painel de saúde personalizado" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        {/* Header */}
        <header className="p-4 sm:p-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <LogoWithName size="small" />
          </Link>
        </header>

        {/* Main */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Entre na sua conta
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mb-8">
                Digite suas credenciais para acessar seu painel de saúde.
              </p>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => { setTab('magic'); setMessage(null); setOtpSent(false); }}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                    tab === 'magic'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Link
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('otp'); setMessage(null); setOtpSent(false); }}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                    tab === 'otp'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Código
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('password'); setMessage(null); }}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                    tab === 'password'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Senha
                </button>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`mb-6 p-4 rounded-xl text-sm ${
                    message.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Form Magic Link */}
              {tab === 'magic' && (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div>
                    <label htmlFor="email-magic" className="block text-sm font-medium text-slate-700 mb-2">
                      E-mail
                    </label>
                    <input
                      id="email-magic"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all hover:opacity-95 disabled:opacity-70"
                    style={{ background: brandColor }}
                  >
                    {loading ? 'Enviando...' : 'Enviar link mágico'}
                  </button>
                </form>
              )}

              {/* Form OTP */}
              {tab === 'otp' && (
                <form
                  onSubmit={otpSent ? handleOtpVerify : handleOtpSend}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="email-otp" className="block text-sm font-medium text-slate-700 mb-2">
                      E-mail
                    </label>
                    <input
                      id="email-otp"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      disabled={otpSent}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all outline-none disabled:bg-slate-50"
                    />
                  </div>
                  {otpSent && (
                    <div>
                      <label htmlFor="otp-code" className="block text-sm font-medium text-slate-700 mb-2">
                        Código de 6 dígitos
                      </label>
                      <input
                        id="otp-code"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all outline-none text-center text-lg tracking-[0.5em]"
                      />
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtpCode(''); setMessage(null); }}
                        className="mt-2 text-sm text-slate-500 hover:text-slate-700"
                      >
                        Usar outro e-mail
                      </button>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all hover:opacity-95 disabled:opacity-70"
                    style={{ background: brandColor }}
                  >
                    {loading
                      ? 'Enviando...'
                      : otpSent
                        ? 'Verificar código'
                        : 'Enviar código'}
                  </button>
                </form>
              )}

              {/* Form Password */}
              {tab === 'password' && !resetMode && (
                <form onSubmit={handlePassword} className="space-y-4">
                  <div>
                    <label htmlFor="email-pwd" className="block text-sm font-medium text-slate-700 mb-2">
                      E-mail
                    </label>
                    <input
                      id="email-pwd"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                      Senha
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => { setResetMode(true); setMessage(null); }}
                      className="mt-2 text-sm text-slate-500 hover:text-slate-700"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all hover:opacity-95 disabled:opacity-70"
                    style={{ background: brandColor }}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </form>
              )}

              {/* Form Reset Password */}
              {tab === 'password' && resetMode && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label htmlFor="email-reset" className="block text-sm font-medium text-slate-700 mb-2">
                      E-mail
                    </label>
                    <input
                      id="email-reset"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all outline-none"
                    />
                    <p className="mt-2 text-sm text-slate-500">
                      Enviaremos um link para redefinir sua senha.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all hover:opacity-95 disabled:opacity-70"
                    style={{ background: brandColor }}
                  >
                    {loading ? 'Enviando...' : 'Enviar link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setResetMode(false); setMessage(null); }}
                    className="w-full text-sm text-slate-500 hover:text-slate-700"
                  >
                    ← Voltar ao login
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Ou continue com</span>
                </div>
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all disabled:opacity-70"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium text-slate-700">Continuar com Google</span>
              </button>

              {/* Footer link */}
              <p className="mt-8 text-center text-sm text-slate-500">
                Não tem conta?{' '}
                <Link href="/emagrecimento" className="font-medium" style={{ color: brandColor }}>
                  Faça uma triagem gratuita
                </Link>
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-xs text-slate-400">
          <Link href="/politicas-lgpd" className="hover:text-slate-600">Política de Privacidade</Link>
          {' · '}
          <Link href="/termos" className="hover:text-slate-600">Termos de Uso</Link>
        </footer>
      </div>
    </>
  );
}
