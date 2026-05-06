import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';

export default function B2BAssinar() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <Head>
        <title>Assinar em 2 min | MeJoy</title>
        <meta name="description" content="Assine o plano B2B e ative seu ambiente white-label em minutos." />
      </Head>
      <main className="min-h-screen bg-muted px-4 py-10">
        <Navbar />
        <div className="max-w-lg mx-auto bg-white rounded-2xl p-8 shadow-sm border border-[color:var(--ring)] mt-20">
          <h1 className="text-2xl font-bold text-ink mb-2">Assinar plano B2B</h1>
          <p className="text-subtle mb-6">
            Preencha e nossa equipe ativa o seu ambiente white-label em minutos.
          </p>
          {!sent ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data: Record<string, string> = {};
                formData.forEach((value, key) => {
                  data[key] = value.toString();
                });
                console.log('B2B lead:', data);
                // TODO: Enviar para API quando disponível
                // Por enquanto apenas log para não quebrar build
                setSent(true);
              }}
            >
              <div>
                <label className="block text-sm mb-1 text-ink">Nome completo</label>
                <input 
                  name="name" 
                  required 
                  className="w-full rounded-lg border border-[color:var(--ring)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-ink">E-mail</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full rounded-lg border border-[color:var(--ring)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-ink">WhatsApp</label>
                <input 
                  name="whatsapp" 
                  className="w-full rounded-lg border border-[color:var(--ring)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-ink">Nome da clínica/empresa</label>
                <input 
                  name="company" 
                  className="w-full rounded-lg border border-[color:var(--ring)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
                />
              </div>
              <button type="submit" className="btn-brand w-full justify-center">
                Enviar e ativar
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-ink font-semibold mb-2">Recebido ✅</p>
              <p className="text-subtle text-sm">
                Já podemos integrar domínio, logo e CTAs. Se quiser ver a demo, clique abaixo.
              </p>
              <Link href="/b2b/sandbox" className="btn-ghost mt-4 inline-flex">
                Ver sandbox
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

