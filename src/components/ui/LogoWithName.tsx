'use client';

import Image from 'next/image';

import BrandLogo from '@/components/ui/BrandLogo';
import { useTenant } from '@/components/providers/TenantProvider';
import {
  BRAND_NAME,
  getBrandHorizontalLogoSrc,
} from '@/lib/brand/assets';

const DEFAULT_LOGO_PRIMARY = getBrandHorizontalLogoSrc('primary');
const DEFAULT_LOGO_INVERSE = getBrandHorizontalLogoSrc('inverse');
const DEFAULT_LOGO_DARK = getBrandHorizontalLogoSrc('dark');
const DEFAULT_LOGO_MONO = '/brand/logo-horizontal-mono.png';
const DEFAULT_LOGO_OLD_PRIMARY = '/logosmejoy/logomejoy.svg';
const DEFAULT_LOGO_OLD_INVERSE = '/logosmejoy/logomejoy-inverse.svg';
const DEFAULT_LOGO_LEGACY = '/logosmejoy/logomejoy.png';

interface LogoWithNameProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'header';
  className?: string;
  priority?: boolean;
  showName?: boolean;
  nameClassName?: string;
  variant?: 'primary' | 'inverse';
  /** Tagline exibido após a logo, ex: "Me Cuido, Me Amo!" */
  tagline?: string;
  /** Conteúdo customizado do tagline (sobrescreve tagline quando taglineBelow) */
  taglineContent?: React.ReactNode;
  /** Se true, tagline fica centralizado abaixo da logo (em vez de ao lado) */
  taglineBelow?: boolean;
}

const sizeMap = {
  small: { brandSize: 'sm' as const, logoWidth: 128, logoHeight: 40, fontSize: 'text-base', gap: 'gap-2.5', taglineSize: 'text-[11px] sm:text-xs' },
  medium: { brandSize: 'md' as const, logoWidth: 144, logoHeight: 44, fontSize: 'text-lg', gap: 'gap-3', taglineSize: 'text-sm' },
  large: { brandSize: 'lg' as const, logoWidth: 164, logoHeight: 52, fontSize: 'text-xl', gap: 'gap-3.5', taglineSize: 'text-sm sm:text-base' },
  xlarge: { brandSize: 'xl' as const, logoWidth: 208, logoHeight: 64, fontSize: 'text-2xl', gap: 'gap-4', taglineSize: 'text-base sm:text-lg' },
  header: { brandSize: 'header' as const, logoWidth: 138, logoHeight: 42, fontSize: 'text-lg', gap: 'gap-2.5', taglineSize: 'text-[10px] sm:text-[11px]' },
};

const LogoWithName: React.FC<LogoWithNameProps> = ({
  size = 'medium',
  className = '',
  priority = false,
  showName: showNameProp,
  nameClassName = '',
  variant = 'primary',
  tagline,
  taglineContent,
  taglineBelow = false,
}) => {
  const tenant = useTenant();
  const displayName = tenant?.name || BRAND_NAME;
  const isLegacyDefaultLogo = [
    DEFAULT_LOGO_PRIMARY,
    DEFAULT_LOGO_INVERSE,
    DEFAULT_LOGO_DARK,
    DEFAULT_LOGO_MONO,
    DEFAULT_LOGO_OLD_PRIMARY,
    DEFAULT_LOGO_OLD_INVERSE,
    DEFAULT_LOGO_LEGACY,
  ].includes(tenant?.logoUrl || '');
  const isCustomLogo = Boolean(tenant?.logoUrl && !isLegacyDefaultLogo);
  const logoUrl = isCustomLogo
    ? tenant?.logoUrl
    : variant === 'inverse'
      ? DEFAULT_LOGO_INVERSE
      : DEFAULT_LOGO_PRIMARY;

  const showName = showNameProp ?? isCustomLogo;
  const dimensions = sizeMap[size];

  const logoBlock = (
    <>
      {isCustomLogo ? (
        <Image
          src={logoUrl}
          alt={displayName}
          width={dimensions.logoWidth}
          height={dimensions.logoHeight}
          priority={priority}
          className="h-auto w-auto max-h-full object-contain"
        />
      ) : (
        <BrandLogo
          variant={variant === 'inverse' ? 'inverse' : 'default'}
          size={dimensions.brandSize}
          priority={priority}
        />
      )}
      {showName && (
        <span
          className={`font-semibold text-fg ${dimensions.fontSize} ${nameClassName} whitespace-nowrap`}
        >
          {displayName}
        </span>
      )}
      {tagline && !taglineBelow && (
        <span
          className={`font-bold text-fg ${dimensions.taglineSize} ${nameClassName} whitespace-nowrap ml-1`}
          style={{ letterSpacing: '0.02em' }}
        >
          {tagline}
        </span>
      )}
    </>
  );

  if (tagline && taglineBelow) {
    return (
      <div className={`flex shrink-0 flex-col items-center justify-center ${className}`}>
        <div className={`flex items-center ${dimensions.gap}`}>
          {logoBlock}
        </div>
        <span
          className={`mt-1 block text-center font-semibold leading-tight ${dimensions.taglineSize} ${nameClassName}`}
          style={{ letterSpacing: '0.03em' }}
        >
          {taglineContent ?? tagline}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${dimensions.gap} ${className}`}>
      {logoBlock}
    </div>
  );
};

export default LogoWithName;
