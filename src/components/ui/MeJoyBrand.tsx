import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MeJoyBrandProps {
  className?: string;
  iconClassName?: string;
  title?: string;
  titleClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
  variant?: 'primary' | 'inverse';
}

export function MeJoyBrand({
  className,
  iconClassName,
  title = 'MeJoy',
  titleClassName,
  subtitle,
  subtitleClassName,
  variant = 'primary',
}: MeJoyBrandProps) {
  const inverse = variant === 'inverse';

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        className={cn(
          'relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[1.05rem]',
          inverse ? 'ring-1 ring-white/15' : 'shadow-[0_12px_28px_rgba(16,24,40,0.10)] ring-1 ring-white/60',
          iconClassName
        )}
      >
        <Image
          src={inverse ? '/logosmejoy/me-mark-inverse.svg' : '/logosmejoy/me-mark.svg'}
          alt=""
          fill
          className="object-contain"
          sizes="40px"
          priority
        />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            'text-base font-semibold tracking-[-0.05em]',
            inverse ? 'text-white' : 'text-slate-950',
            titleClassName
          )}
        >
          {title}
        </span>
        {subtitle ? (
          <span
            className={cn(
              'mt-1 text-[11px] font-medium',
              inverse ? 'text-white/70' : 'text-slate-500',
              subtitleClassName
            )}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}
