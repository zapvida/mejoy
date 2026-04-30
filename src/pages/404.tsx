import Head from 'next/head';
import Link from 'next/link';
import Seo from '@/components/Seo';

/**
 * Custom 404 page - fixes Next.js 15 ENOENT build error with 404.html
 */
export default function Custom404() {
  return (
    <>
      <Seo title="Página não encontrada" noIndex />
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-6xl font-bold text-brand-500 mb-2">404</h1>
        <p className="text-lg text-slate-600 mb-8">Página não encontrada</p>
        <Link
          href="/"
          className="px-6 py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </>
  );
}
