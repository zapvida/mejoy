'use client';

import type { MouseEventHandler } from "react";

type InlineCTAProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function InlineCTA({ onClick }: InlineCTAProps) {
  return (
    <section
      className="rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-5 text-emerald-50 shadow-sm"
      style={{ contentVisibility: "auto", containIntrinsicSize: "520px 200px" }}
    >
      <h3 className="text-lg font-semibold text-emerald-100">Pronto para acelerar resultados?</h3>
      <p className="mt-2 text-sm text-emerald-50/90">
        Desbloqueie acompanhamento premium: lembretes, check-ins e ajustes semanais.
      </p>
      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-emerald-600 shadow-sm transition hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Conhecer acompanhamento premium
      </button>
    </section>
  );
}
