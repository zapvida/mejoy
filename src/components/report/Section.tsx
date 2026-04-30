import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";

type SectionProps = PropsWithChildren<{
  title: string;
  icon?: string;
  description?: ReactNode;
  eyebrow?: string;
  className?: string;
  actions?: ReactNode;
}>;

export function Section({ title, icon, description, eyebrow, className, actions, children }: SectionProps) {
  return (
    <section
      className={clsx(
        "scroll-mt-28 print:scroll-mt-12",
        "rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-[0_25px_60px_rgba(10,14,27,0.35)] backdrop-blur-2xl",
        "print:bg-white print:border-slate-200 print:shadow-none print:text-slate-900",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40 print:text-slate-500">{eyebrow}</p>}
          <h2 className="text-2xl font-semibold text-white print:text-slate-900 flex items-center gap-3">
            {icon && <span className="text-3xl">{icon}</span>}
            {title}
          </h2>
          {description && (
            <div className="mt-2 max-w-2xl text-sm text-white/70 print:text-slate-600">{description}</div>
          )}
        </div>
        {actions && <div className="flex flex-col gap-2">{actions}</div>}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
