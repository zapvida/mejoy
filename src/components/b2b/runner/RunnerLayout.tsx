import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/layout/Navbar";

// SSR-safe (evita hydrate flicker em previews)
const PreviewFrame = dynamic(() => import("@/components/b2b/PreviewFrame"), { 
  ssr: false 
});

export default function RunnerLayout(props: {
  title: string;
  step: number;            // 0..3 (4 passos totais)
  nextHref?: string;
  backHref?: string | null;
  children: React.ReactNode;
  nextLabel?: string;
  onNext?: () => void;
}) {
  const pct = ((props.step + 1) / 4) * 100;
  const router = useRouter();

  // Suporte a teclado (Enter/Arrow keys)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Evitar quando está digitando em inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "Enter" || e.key === "ArrowRight") {
        if (props.nextHref) {
          router.push(props.nextHref);
        } else if (props.onNext) {
          props.onNext();
        }
      }
      if (e.key === "ArrowLeft" && props.backHref) {
        router.push(props.backHref);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props.nextHref, props.backHref, props.onNext, router]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white scroll-smooth pt-20 md:pt-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-10">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 scroll-mt-20">
              Personalize sua marca
            </h1>
            <p className="text-sm text-gray-600">
              Runner em 4 passos — preview ao vivo.
            </p>
          </div>

          {/* Barra de progresso */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">{props.title}</div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Grid: Runner + Preview */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr,400px]">
            {/* Runner (formulário) */}
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6 relative">
              {/* Número do step no canto superior direito */}
              <div className="absolute top-4 right-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs font-bold w-7 h-7 rounded-full shadow-md z-10 flex items-center justify-center ring-2 ring-white">
                {props.step + 1}
              </div>
              {props.children}

              {/* Navegação */}
              <div className="mt-6 flex items-center justify-end gap-3">
                {props.backHref && (
                  <Link
                    href={props.backHref}
                    className="inline-flex items-center justify-center h-10 rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
                  >
                    <span className="mr-1.5">←</span>
                    Voltar
                  </Link>
                )}
                
                {props.nextHref ? (
                  <Link
                    href={props.nextHref}
                    className="inline-flex items-center justify-center h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] transition-all duration-200"
                  >
                    {props.nextLabel ?? "Continuar"}
                    <span className="ml-1.5">→</span>
                  </Link>
                ) : props.onNext ? (
                  <button
                    onClick={props.onNext}
                    className="inline-flex items-center justify-center h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] transition-all duration-200"
                  >
                    {props.nextLabel ?? "Continuar"}
                    <span className="ml-1.5">→</span>
                  </button>
                ) : null}
              </div>
            </section>

            {/* Preview (desktop) */}
            <section className="hidden md:block">
              <PreviewFrame />
            </section>
          </div>

          {/* Preview compacto no mobile */}
          <div className="md:hidden mt-6">
            <PreviewFrame />
          </div>
        </div>
      </main>
    </>
  );
}

