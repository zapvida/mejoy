import Image from 'next/image';

import {
  BRAND_NAME,
  getBrandHorizontalLogoSrc,
  getBrandIconSrc,
} from '@/lib/brand/assets';
import { cn } from '@/lib/utils';

type BrandLogoVariant =
  | 'default'
  | 'light'
  | 'inverse'
  | 'dark'
  | 'mono'
  | 'icon'
  | 'icon-inverse'
  | 'icon-dark';

type BrandLogoSize = 'sm' | 'md' | 'lg' | 'xl' | 'header';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  className?: string;
  priority?: boolean;
  alt?: string;
}

const HORIZONTAL_DIMENSIONS = {
  width: 1069,
  height: 337,
} as const;

const ICON_DIMENSIONS = {
  width: 1024,
  height: 1024,
} as const;

const sizeMap: Record<BrandLogoSize, { horizontalClassName: string; iconClassName: string }> = {
  sm: {
    horizontalClassName: 'h-8 sm:h-9',
    iconClassName: 'h-10 w-10',
  },
  md: {
    horizontalClassName: 'h-9 sm:h-10',
    iconClassName: 'h-12 w-12',
  },
  lg: {
    horizontalClassName: 'h-10 sm:h-11',
    iconClassName: 'h-14 w-14',
  },
  xl: {
    horizontalClassName: 'h-14 sm:h-16',
    iconClassName: 'h-16 w-16 sm:h-20 sm:w-20',
  },
  header: {
    horizontalClassName: 'h-[34px] sm:h-10',
    iconClassName: 'h-11 w-11',
  },
};

function resolveLogoSource(variant: BrandLogoVariant) {
  switch (variant) {
    case 'inverse':
      return {
        src: getBrandHorizontalLogoSrc('inverse'),
        dimensions: HORIZONTAL_DIMENSIONS,
        classes: sizeMap,
        isIcon: false,
      };
    case 'dark':
      return {
        src: getBrandHorizontalLogoSrc('dark'),
        dimensions: HORIZONTAL_DIMENSIONS,
        classes: sizeMap,
        isIcon: false,
      };
    case 'mono':
      return {
        src: getBrandHorizontalLogoSrc('mono'),
        dimensions: HORIZONTAL_DIMENSIONS,
        classes: sizeMap,
        isIcon: false,
      };
    case 'icon':
      return {
        src: getBrandIconSrc('primary'),
        dimensions: ICON_DIMENSIONS,
        classes: sizeMap,
        isIcon: true,
      };
    case 'icon-inverse':
      return {
        src: getBrandIconSrc('inverse'),
        dimensions: ICON_DIMENSIONS,
        classes: sizeMap,
        isIcon: true,
      };
    case 'icon-dark':
      return {
        src: getBrandIconSrc('dark'),
        dimensions: ICON_DIMENSIONS,
        classes: sizeMap,
        isIcon: true,
      };
    case 'light':
    case 'default':
    default:
      return {
        src: getBrandHorizontalLogoSrc('primary'),
        dimensions: HORIZONTAL_DIMENSIONS,
        classes: sizeMap,
        isIcon: false,
      };
  }
}

export default function BrandLogo({
  variant = 'default',
  size = 'md',
  className,
  priority = false,
  alt = BRAND_NAME,
}: BrandLogoProps) {
  const { src, dimensions, isIcon } = resolveLogoSource(variant);
  const sizeClasses = isIcon ? sizeMap[size].iconClassName : sizeMap[size].horizontalClassName;

  return (
    <Image
      src={src}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={cn('w-auto object-contain', sizeClasses, className)}
      sizes={isIcon ? '(max-width: 768px) 48px, 64px' : '(max-width: 768px) 132px, 184px'}
    />
  );
}
