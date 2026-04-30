import { cn } from '@/lib/utils';

interface MeJoyBrandProps {
  className?: string;
  iconClassName?: string;
  title?: string;
  titleClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
}

export function MeJoyBrand({
  className,
  iconClassName,
  title = 'MeJoy',
  titleClassName,
  subtitle,
  subtitleClassName,
}: MeJoyBrandProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        className={cn(
          'relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[1.05rem] bg-[linear-gradient(180deg,#ff9c40_0%,#ff7700_100%)] shadow-[0_12px_28px_rgba(255,122,0,0.28)] ring-1 ring-[#d56400]/28',
          iconClassName
        )}
      >
        <span className="absolute inset-[3px] rounded-[0.9rem] bg-[#fff7ea]" aria-hidden="true" />
        <span
          className="relative inline-flex h-[58%] w-[58%] items-center justify-center rounded-[0.72rem] bg-[linear-gradient(180deg,#ffa44d_0%,#ff7a00_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_6px_12px_rgba(255,122,0,0.22)]"
          aria-hidden="true"
        >
          <span className="translate-y-[-0.5px] text-[0.56rem] font-black uppercase tracking-[-0.05em] text-white">
            Me
          </span>
        </span>
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className={cn('text-base font-semibold tracking-[-0.04em] text-slate-950', titleClassName)}>
          {title}
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
