'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';

export default function B2BDominio() {
  const [domain, setDomain] = useState('');
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'configured' | 'error'>('idle');
  const [cnameValue, setCnameValue] = useState('');
  const [message, setMessage] = useState('');

  const handleCheckCNAME = async () => {
    if (!domain) {
      alert('Digite um domínio');
      return;
    }

    setChecking(true);
    setStatus('idle');

    try {
      // Verificar CNAME via API
      const res = await fetch('/api/b2b/check-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });

      const data = await res.json();

      if (data.configured) {
        setStatus('configured');
        setMessage(`Domínio ${domain} está configurado corretamente!`);
      } else {
        setStatus('pending');
        setCnameValue(data.cnameValue || 'cname.vercel-dns.com');
        setMessage(data.message || 'Configure o CNAME no seu DNS');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setMessage('Erro ao verificar domínio. Tente novamente.');
    } finally {
      setChecking(false);
    }
  };

  const handleApplyDomain = async () => {
    if (!domain || !cnameValue) {
      alert('Configure o CNAME primeiro');
      return;
    }

    try {
      const res = await fetch('/api/b2b/apply-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });

      if (!res.ok) {
        throw new Error('Erro ao aplicar domínio');
      }

      setStatus('configured');
      setMessage(`Domínio ${domain} aplicado com sucesso!`);
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao aplicar domínio. Tente novamente.');
    }
  };

  return (
    <>
      <Head>
        <title>Configurar domínio | MeJoy</title>
        <meta name="description" content="Configure seu domínio customizado para sua plataforma white-label." />
      </Head>
      <main className="min-h-screen bg-muted">
        <Navbar />
        
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[color:var(--ring)] mt-20">
            <h1 className="text-2xl font-bold text-ink mb-2">Configurar domínio</h1>
            <p className="text-subtle mb-6">
              Configure seu domínio customizado para sua plataforma white-label.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Domínio
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="clinicaexemplo.com.br"
                    className="flex-1 rounded-lg border border-[color:var(--ring)] px-3 py-2"
                  />
                  <button
                    onClick={handleCheckCNAME}
                    disabled={checking || !domain}
                    className="btn-brand"
                    data-testid="verificar-cname"
                  >
                    {checking ? 'Verificando...' : 'Verificar'}
                  </button>
                </div>
              </div>

              {status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-ink mb-2">
                    Configure o seguinte CNAME no seu DNS:
                  </p>
                  <div className="bg-white rounded p-2 mb-2 font-mono text-sm">
                    {domain} → {cnameValue}
                  </div>
                  <p className="text-xs text-subtle mb-4">
                    Isso pode levar algumas horas para propagar. Você pode continuar usando sua URL provisória enquanto isso.
                  </p>
                  <button
                    onClick={handleApplyDomain}
                    className="btn-brand"
                    data-testid="aplicar-dominio"
                  >
                    Aplicar domínio agora
                  </button>
                </div>
              )}

              {status === 'configured' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">{message}</p>
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{message}</p>
                </div>
              )}

              {message && status !== 'pending' && status !== 'configured' && status !== 'error' && (
                <p className="text-sm text-subtle">{message}</p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-[color:var(--ring)]">
              <Link href="/b2b/dashboard" className="btn-ghost">
                Voltar ao dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

