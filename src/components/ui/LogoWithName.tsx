'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTenant } from '@/components/providers/TenantProvider';

const ME_JOY_FULL_LOGO = '/logosmejoy/logomejoy.png';

interface LogoWithNameProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'header';
  className?: string;
  priority?: boolean;
  showName?: boolean;
  nameClassName?: string;
  /** Tagline exibido após a logo, ex: "Me Cuido, Me Amo!" */
  tagline?: string;
  /** Conteúdo customizado do tagline (sobrescreve tagline quando taglineBelow) */
  taglineContent?: React.ReactNode;
  /** Se true, tagline fica centralizado abaixo da logo (em vez de ao lado) */
  taglineBelow?: boolean;
}

const sizeMap = {
  small: { logoWidth: 140, logoHeight: 42, heightClass: 'h-8 sm:h-9', fontSize: 'text-lg', gap: 'gap-2', taglineSize: 'text-base' },
  medium: { logoWidth: 160, logoHeight: 48, heightClass: 'h-9 sm:h-10', fontSize: 'text-xl', gap: 'gap-3', taglineSize: 'text-lg' },
  large: { logoWidth: 200, logoHeight: 60, heightClass: 'h-10 sm:h-12', fontSize: 'text-2xl', gap: 'gap-4', taglineSize: 'text-xl' },
  xlarge: { logoWidth: 280, logoHeight: 84, heightClass: 'h-16 sm:h-[4.5rem]', fontSize: 'text-2xl', gap: 'gap-3', taglineSize: 'text-lg sm:text-xl' },
  header: { logoWidth: 196, logoHeight: 59, heightClass: 'h-10 sm:h-11', fontSize: 'text-xl', gap: 'gap-2', taglineSize: 'text-[10px] sm:text-[11px]' },
};

const LogoWithName: React.FC<LogoWithNameProps> = ({
  size = 'medium',
  className = '',
  priority = false,
  showName: showNameProp,
  nameClassName = '',
  tagline,
  taglineContent,
  taglineBelow = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const tenant = useTenant();
  const displayName = tenant?.name || 'Me Joy';
  const logoUrl = tenant?.logoUrl || ME_JOY_FULL_LOGO;

  const isFullLogo = logoUrl.includes('logomejoy');
  const showName = showNameProp ?? !isFullLogo;
  const dimensions = sizeMap[size];

  if (imageError) {
    return (
      <div className={`flex items-center ${dimensions.gap} ${className}`}>
        <div
          className={`${dimensions.heightClass} aspect-[10/3] min-w-[80px] rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0`}
        >
          <span className="text-brand font-bold text-sm">Me Joy</span>
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
          alt="Me Joy Farma"
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

