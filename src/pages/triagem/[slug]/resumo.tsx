import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { track } from '@/lib/analytics';
import { relatorioPathForTriageSlug } from '@/lib/emagrecimento/whatsappCta';

type ReportStatus = "running" | "completed" | "error";

interface ReportData {
  id: string;
  status: ReportStatus;
  error?: string;
}

export default function TriageResumoPage() {
  const router = useRouter();
  const { slug, triageId } = router.query as { slug?: string; triageId?: string };
  const [status, setStatus] = useState<ReportStatus>("running");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!triageId) return;
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/gerarRelatorio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ triageId }),
        });
        const data: ReportData = await res.json();
        console.log("Resumo: Resposta da API:", data);

        if (cancelled) return;

        if (data.status === "completed" && data.id) {
          const nextPath = relatorioPathForTriageSlug(slug || '', data.id);
          console.log("Resumo: Redirecionando para:", nextPath);
          setStatus("completed");
          
          // Track triage completion
          track('triage_complete', { 
            slug: slug || 'unknown', 
            sections: 0, // Will be updated when we have actual data
            score: null 
          });
          
          window.location.href = nextPath;
          return;
        }

        if (data.status === "running") {
          setStatus("running");
          setTimeout(poll, 3000); // Increased polling interval to reduce server load
          return;
        }

        setStatus("error");
        setErr(data.error || "Falha ao gerar relatório.");
      } catch (e) {
        setStatus("error");
        setErr("Erro de rede ao gerar relatório.");
      }
    }

    poll();
    return () => { cancelled = true; };
  }, [triageId, router]);

  const Title = () => (
    <Head>
      <title>Resumo • {slug ?? "triagem"} | Me Joy</title>
      <meta name="robots" content="noindex" />
    </Head>
  );

  if (status === "running") {
    return (
      <>
        <Title />
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
          <div className="text-center max-w-md px-6 space-y-6">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            <div className="space-y-2">
              <h1 className="text-xl font-semibold">Estamos gerando seu relatório e plano inicial</h1>
              <p className="text-white/70 text-sm">Isso pode levar alguns segundos. Por favor, aguarde...</p>
            </div>
            {/* Barra de progresso animada */}
            <div className="mx-auto w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <Title />
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 text-center text-white">
          <div className="max-w-md space-y-5">
            <h1 className="text-2xl font-semibold">Erro</h1>
            <p className="text-white/70">{err}</p>
            <button
              onClick={() => router.push(`/triagem/${slug ?? ""}`)}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(5,150,105,0.35)]"
            >
              Voltar para triagem
            </button>
          </div>
        </main>
      </>
    );
  }

  // completed: faremos redirect no effect
  return (
    <>
      <Title />
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="mt-4">Redirecionando para seu relatório...</p>
        </div>
      </main>
    </>
  );
}
