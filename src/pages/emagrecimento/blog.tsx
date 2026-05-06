import Head from 'next/head';
import { EmagrecimentoLayout } from '@/components/zapfarm/emagrecimento/EmagrecimentoLayout';
import { BlogHeroSection } from '@/components/zapfarm/emagrecimento/BlogHeroSection';
import { BlogArticlesSection } from '@/components/zapfarm/emagrecimento/BlogArticlesSection';

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>Blog de emagrecimento | Guias e dicas com ciência | MeJoy</title>
        <meta
          name="description"
          content="Guias e dicas sobre emagrecimento com ciência e bom senso. Conteúdo educativo baseado em evidências científicas, escrito por especialistas. Não substitui consulta médica."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>

      <EmagrecimentoLayout>
        <BlogHeroSection />
        <BlogArticlesSection />
      </EmagrecimentoLayout>
    </>
  );
}

