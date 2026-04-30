import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Variant =
  | "emerald" | "teal" | "blue" | "indigo" | "violet" | "fuchsia"
  | "rose" | "orange" | "amber" | "cyan";

const bg: Record<Variant, string> = {
  emerald: "bg-lpac-emerald",
  teal: "bg-lpac-teal",
  blue: "bg-lpac-blue",
  indigo: "bg-lpac-indigo",
  violet: "bg-lpac-violet",
  fuchsia: "bg-lpac-fuchsia",
  rose: "bg-lpac-rose",
  orange: "bg-lpac-orange",
  amber: "bg-lpac-amber",
  cyan: "bg-lpac-cyan",
};

export function GradCard({
  variant = "emerald",
  className,
  children,
  overlayOpacity = 90,
}: {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  overlayOpacity?: number;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl shadow-lpac",
        bg[variant],
        "bg-[length:200%_200%] [background-position:0%_50%]",
        "transition-[background-position,transform] duration-700 will-change-transform",
        "hover:[background-position:100%_50%] hover:-translate-y-1",
        className
      )}
      role="region"
      tabIndex={0}
    >
      <div 
        className="surface-overlay text-[color:var(--ink)] rounded-2xl m-[1px] p-4 sm:p-6 relative z-10"
        style={{
          background: overlayOpacity <= 30 
            ? `rgba(255,255,255,${overlayOpacity / 100})` 
            : `rgba(255,255,255,${Math.min(overlayOpacity / 100, 0.35)})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

