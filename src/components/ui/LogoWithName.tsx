'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTenant } from '@/components/providers/TenantProvider';

const DEFAULT_LOGO_PRIMARY = '/logosmejoy/logomejoy.svg';
const DEFAULT_LOGO_INVERSE = '/logosmejoy/logomejoy-inverse.svg';
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
  small: { logoWidth: 142, logoHeight: 32, heightClass: 'h-8 sm:h-9', fontSize: 'text-lg', gap: 'gap-2.5', taglineSize: 'text-base' },
  medium: { logoWidth: 164, logoHeight: 38, heightClass: 'h-9 sm:h-10', fontSize: 'text-xl', gap: 'gap-3', taglineSize: 'text-lg' },
  large: { logoWidth: 204, logoHeight: 48, heightClass: 'h-10 sm:h-12', fontSize: 'text-2xl', gap: 'gap-4', taglineSize: 'text-xl' },
  xlarge: { logoWidth: 292, logoHeight: 68, heightClass: 'h-16 sm:h-[4.5rem]', fontSize: 'text-2xl', gap: 'gap-3', taglineSize: 'text-lg sm:text-xl' },
  header: { logoWidth: 184, logoHeight: 42, heightClass: 'h-9 sm:h-10', fontSize: 'text-xl', gap: 'gap-2.5', taglineSize: 'text-[10px] sm:text-[11px]' },
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
  const [imageError, setImageError] = useState(false);
  const tenant = useTenant();
  const displayName = tenant?.name || 'MeJoy';
  const isLegacyDefaultLogo = tenant?.logoUrl === DEFAULT_LOGO_LEGACY;
  const isCustomLogo = Boolean(tenant?.logoUrl && !isLegacyDefaultLogo);
  const logoUrl = isCustomLogo
    ? tenant?.logoUrl
    : variant === 'inverse'
      ? DEFAULT_LOGO_INVERSE
      : DEFAULT_LOGO_PRIMARY;

  const showName = showNameProp ?? isCustomLogo;
  const dimensions = sizeMap[size];

  if (imageError) {
    return (
      <div className={`flex items-center ${dimensions.gap} ${className}`}>
        <div
          className={`${dimensions.heightClass} flex min-w-[80px] flex-shrink-0 items-center justify-center rounded-[1rem] px-3 ${
            variant === 'inverse' ? 'bg-white/15 text-white' : 'bg-black text-white'
          }`}
        >
          <span className="text-sm font-bold">MeJoy</span>
        </div>
        {showName && (
          <span className={`font-bold text-fg ${dimensions.fontSize} ${nameClassName}`}>{displayName}</span>
        )}
      </div>
    );
  }

  const logoBlock = (
    <>
      <div className={`relative flex-shrink-0 ${dimensions.heightClass} w-auto min-w-0`}>
        <Image
          src={logoUrl}
          alt="MeJoy"
          width={dimensions.logoWidth}
          height={dimensions.logoHeight}
          priority={priority}
          className="object-contain w-full h-full"
          onError={() => setImageError(true)}
        />
      </div>
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
      <div className={`flex flex-col items-center justify-center shrink-0 ${className}`}>
        <div className={`flex items-center ${dimensions.gap}`}>
          {logoBlock}
        </div>
        <span
          className={`font-bold ${dimensions.taglineSize} ${nameClassName} -mt-0.5 text-center leading-tight block`}
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
