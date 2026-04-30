import type { PropsWithChildren } from "react";
import clsx from "clsx";

type PrintOnlyProps = PropsWithChildren<{
  className?: string;
}>;

export const PrintOnly = ({ children, className }: PrintOnlyProps) => (
  <div className={clsx("hidden print:block", className)}>{children}</div>
);
