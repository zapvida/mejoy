import * as React from "react";

export default function WhyAsk({ children }: { children: React.ReactNode }) {
  return (
    <div role="note" aria-label="Por que perguntamos?" className="rounded-xl border px-3 py-2 text-sm bg-white/60">
      <div className="font-medium mb-1">💡 Por que perguntamos?</div>
      <div className="opacity-80">{children}</div>
    </div>
  );
}
