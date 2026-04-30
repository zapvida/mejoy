import type { Tenant } from './tenant';

export function toCssVars(tenant: Tenant) {
  return {
    '--brand-primary': tenant.brand.primary,
    '--brand-secondary': tenant.brand.secondary
  } as Record<string,string>;
}
