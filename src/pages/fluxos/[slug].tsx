import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { ChevronLeft } from 'lucide-react';
import {
  getFluxoBySlug,
  FLUXOS_SOL,
  LABEL_SOL,
} from '@/lib/fluxos-mejoy/dados';
import type { NivelApresentacao } from '@/lib/fluxos-mejoy/types';
import ModeSelector from '@/components/fluxos/ModeSelector';
import FlowDetail from '@/components/fluxos/FlowDetail';
import FooterB2C from '@/components/home/FooterB2C';

interface PageProps {
  slug: string;
}

function parseNivel(nivel: string | string[] | undefined): NivelApresentacao {
  if (nivel === 'moderado' || nivel === 'completo') return nivel;
  return 'simples';
}

export default function FluxoSlugPage({ slug }: PageProps) {
  const router = useRouter();
  const fluxo = getFluxoBySlug(slug);
  const nivel = parseNivel(router.query.nivel as string);

  if (!fluxo) return null;

  const Icon = fluxo.icone;

  return (
    <>
      <Head>
        <title>{fluxo.nome} — Fluxos | MeJoy</title>
        <meta name="description" content={fluxo.simples.frase} />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="container mx-auto">
            <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-brand-600">
                  Início
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/fluxos" className="hover:text-brand-600">
                  Fluxos
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-gray-900 dark:text-white">
                {fluxo.nome}
              </li>
            </ol>
          </div>
        </nav>

        <section className="border-b border-gray-200 bg-white py-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <Link
              href="/fluxos"
              className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Link>
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${fluxo.cor}20` }}
              >
                <Icon className="h-6 w-6" style={{ color: fluxo.cor }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {fluxo.nome}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {fluxo.monetizacao.tipo} — {fluxo.monetizacao.valores}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <ModeSelector basePath="/fluxos" slug={fluxo.slug} />
          </div>
        </section>

        <section className="border-b border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <FlowDetail fluxo={fluxo} nivel={nivel} />
          </div>
        </section>

        <section className="border-b border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
              Outros raios
            </h2>
            <div className="flex flex-wrap gap-2">
              {FLUXOS_SOL.filter((f) => f.slug !== fluxo.slug).map((f) => (
                <Link
                  key={f.slug}
                  href={`/fluxos/${f.slug}`}
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: `${f.cor}20`,
                    color: f.cor,
                  }}
                >
                  {LABEL_SOL[f.slug] ?? f.labelCurto}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FooterB2C />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;
  const fluxo = getFluxoBySlug(slug);

  if (!fluxo) {
    return {
      notFound: true,
    };
  }

  return {
    props: { slug },
  };
};
