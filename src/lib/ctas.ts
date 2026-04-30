type Tenant = {
  name?: string;
  primaryColor?: string;
};

export function getPrimaryCTA(tenant: Tenant) {
  const isRoot = tenant.name === 'Me Joy';
  
  if (isRoot) {
    return {
      href: '/b2b/assinar',
      label: 'Assinar em 2 min',
    };
  }

  return {
    href: '/protocolos',
    label: 'Fazer check-up gratuito',
  };
}

