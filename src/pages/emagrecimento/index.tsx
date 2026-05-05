import type { GetStaticProps } from 'next';

import { EmagrecimentoLpacPage } from '@/components/lpac/EmagrecimentoLpacPage';

/** Página pode ser CDN-estática — menos trabalho por hit e comportamento estável vs SSR por request em dev/prod. */
export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default function EmagrecimentoPage() {
  return <EmagrecimentoLpacPage canonicalPath="/emagrecimento" />;
}
