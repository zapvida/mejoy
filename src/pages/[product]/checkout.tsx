import type { GetServerSideProps } from 'next';

import ProductCheckoutExperience from '@/components/zapfarm/checkout/ProductCheckoutExperience';
import {
  buildZapfarmCheckoutPageProps,
  type ZapfarmCheckoutPageProps,
} from '@/lib/zapfarm/checkout-page-props';

export default function ProductCheckoutPage(props: ZapfarmCheckoutPageProps) {
  return <ProductCheckoutExperience {...props} />;
}

export const getServerSideProps: GetServerSideProps<ZapfarmCheckoutPageProps> = async ({
  params,
}) => {
  const product = params?.product as string;
  const props = buildZapfarmCheckoutPageProps(product);

  if (!props) {
    return { notFound: true };
  }

  return { props };
};
