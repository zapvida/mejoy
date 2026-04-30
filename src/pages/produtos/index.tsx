import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { isStoreV2Enabled, isCopyV4Enabled } from '@/lib/flags';
import { getAllProductsByObjective } from '@/lib/store-v2/catalog';
import { getCopyV4BySku } from '@/lib/store-v2/copy-v2';
import ProdutosCatalog from '@/components/store-v2/ProdutosCatalog';
import type { ProductCardData } from '@/lib/store-v2/catalog';

const ProdutosPageZapfarm = dynamic(
  () => import('@/components/zapfarm/ProdutosPageZapfarm'),
  { ssr: false }
);

interface Section {
  objectiveSlug: string;
  objectiveName: string;
  products: ProductCardData[];
}

interface Props {
  storeV2: boolean;
  sections?: Section[];
}

export default function ProdutosPage({ storeV2, sections }: Props) {
  if (storeV2) {
    return <ProdutosCatalog sections={sections ?? []} />;
  }
  return <ProdutosPageZapfarm />;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  if (!isStoreV2Enabled()) {
    return { props: { storeV2: false } };
  }

  try {
    let sections = await getAllProductsByObjective();

    if (isCopyV4Enabled()) {
      sections = sections.map((sec) => ({
        ...sec,
        products: sec.products.map((p) => {
          if (!p.sku) return p;
          const copy = getCopyV4BySku(p.sku);
          if (!copy?.shortBenefit && !copy?.hero_benefit) return p;
          return { ...p, shortBenefit: copy.shortBenefit || copy.hero_benefit || p.shortBenefit };
        }),
      }));
    }

    return { props: { storeV2: true, sections } };
  } catch {
    return { props: { storeV2: true, sections: [] } };
  }
};
