import type { ProductAppValue } from '@mejoy/api-contracts/mobile';
import type { ZapfarmProductConfig } from '@/config/zapfarm/products';
import { buildProductAppValue } from '@/lib/mejoy-app/value';
import { getProductPlans, getProductConfig } from '@/lib/zapfarm/product-loader';
import {
  getPricesForProduct,
  isTestPriceSequenceEnabled,
} from '@/lib/zapfarm/price-resolver';

export interface CheckoutPlans {
  basico: any;
  completo: any;
  premium: any;
}

export interface ZapfarmCheckoutPageProps {
  productConfig: ZapfarmProductConfig;
  plans: CheckoutPlans;
  showVariants: boolean;
  isTestMode: boolean;
  productAppValue: ProductAppValue;
}

export function buildZapfarmCheckoutPageProps(
  product: string
): ZapfarmCheckoutPageProps | null {
  const productConfig = getProductConfig(product);
  const plans = getProductPlans(product);

  if (!productConfig || !plans) {
    return null;
  }

  const showVariants = (process.env.NEXT_PUBLIC_ZAPFARM_VARIANTS ?? '0') === '1';
  const defaultVariant = showVariants ? ('pro' as const) : undefined;
  const resolved = getPricesForProduct(product, defaultVariant, true);
  const productAppValue = buildProductAppValue({
    productSlug: productConfig.slug,
    productName: productConfig.displayName,
  });

  return {
    productConfig,
    plans: {
      basico: { ...plans.basico, unitPrice: resolved.basico / 100 },
      completo: { ...plans.completo, unitPrice: resolved.completo / 100 },
      premium: { ...plans.premium, unitPrice: resolved.premium / 100 },
    },
    showVariants,
    isTestMode: isTestPriceSequenceEnabled(),
    productAppValue,
  };
}
