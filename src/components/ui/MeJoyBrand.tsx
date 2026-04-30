import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MeJoyBrandProps {
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
}

export function MeJoyBrand({
  className,
  iconClassName,
  titleClassName,
  subtitle,
  subtitleClassName,
}: MeJoyBrandProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        className={cn(
          'relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-2xl bg-[#ff7a00] ring-1 ring-black/5',
          iconClassName
        )}
      >
        <Image
          src="/logosmejoy/faviconmejoy.png"
          alt=""
          fill
          sizes="40px"
          className="object-contain p-1.5"
          aria-hidden="true"
          priority
        />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className={cn('text-base font-semibold tracking-[-0.03em] text-slate-950', titleClassName)}>
          Me Joy
        </span>
        {subtitle ? (
          <span className={cn('mt-1 text-[11px] font-medium text-slate-500', subtitleClassName)}>
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}
