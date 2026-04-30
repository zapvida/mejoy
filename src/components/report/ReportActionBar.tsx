'use client';

import { ArrowLeft, Share2, FileText, Sparkles } from "lucide-react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import PartnerCTAs from "./PartnerCTAs";

import { appendUtmsToUrl } from '@/lib/utm';

type ReportActionBarProps = {
  reportId: string;
  shareEndpoint?: string;
  pdfEndpoint?: string;
  onShareOpen?: () => void;
  onShareConfirm?: (_method: "native" | "link") => void;
  onPdf?: () => void;
};

export function ReportActionBar({
  reportId,
  shareEndpoint = "/api/report/share",
  pdfEndpoint = "/api/pdf/report",
  onShareOpen,
  onShareConfirm,
  onPdf,
}: ReportActionBarProps) {
  const router = useRouter();
  const [loadingShare, setLoadingShare] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleBack = useCallback(() => router.push("/dashboard"), [router]);
  const handleNewTriage = useCallback(() => {
    const url = appendUtmsToUrl("/triagem");
    router.push(url);
  }, [router]);

  const copyFallback = useCallback((text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(text);
      }
    } catch {
      // ignore
    }
    return new Promise<void>((resolve) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      resolve();
    });
  }, []);

  const handleShare = useCallback(async () => {
    if (loadingShare) return;
    setFeedback(null);
    setLoadingShare(true);
    onShareOpen?.();

    const sharePayload = {
      title: "Relatório de saúde",
      text: "Confira meu relatório de saúde personalizado do Me Joy.",
      url: `${window.location.origin}/relatorio/${reportId}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        onShareConfirm?.("native");
        setFeedback("Compartilhado com sucesso.");
        setLoadingShare(false);
        return;
      }
    } catch (error) {
      console.warn("navigator.share falhou, aplicando fallback", error);
    }

    try {
      const response = await fetch(shareEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reportId }),
      });

      if (!response.ok) throw new Error("share-fallback-failed");
      const data = await response.json();
      const urlCurta = data?.urlCurta ?? sharePayload.url;
      await copyFallback(urlCurta);
      setFeedback("Link copiado. Envie para seu paciente.");
      onShareConfirm?.("link");
    } catch (error) {
      console.error("[ReportActionBar] Falha ao compartilhar", error);
      setFeedback("Não foi possível gerar link agora. Tente novamente.");
    } finally {
      setLoadingShare(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  }, [copyFallback, loadingShare, onShareConfirm, onShareOpen, reportId, shareEndpoint]);

  const handlePdf = useCallback(() => {
    onPdf?.();
    const url = `${pdfEndpoint}?id=${encodeURIComponent(reportId)}`;
    window.open(url, "_blank", "noopener");
  }, [onPdf, pdfEndpoint, reportId]);

  return (
    <>
      <div
        className="fixed left-0 right-0 top-0 z-40 flex flex-col gap-2 bg-black/40 px-3 pb-3 pt-3 backdrop-blur-md md:hidden print:hidden"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}
        aria-label="Ações rápidas do relatório"
      >
        <div className="grid grid-cols-4 gap-2 text-xs font-medium text-white">
          <ActionButton icon={<ArrowLeft className="h-4 w-4" />} label="Voltar" onClick={handleBack} />
          <ActionButton
            icon={<Share2 className="h-4 w-4" />}
            label={loadingShare ? "Compart." : "Compart."}
            disabled={loadingShare}
            onClick={handleShare}
          />
          <ActionButton
            icon={<FileText className="h-4 w-4" />}
            label="Laudo PDF"
            onClick={handlePdf}
          />
          <ActionButton
            icon={<Sparkles className="h-4 w-4" />}
            label="Nova triagem"
            onClick={handleNewTriage}
          />
        </div>
        {feedback && (
          <span className="text-center text-[11px] text-white/90" role="status" aria-live="polite">
            {feedback}
          </span>
        )}
      </div>
      
      {/* CTAs de Parceiros */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 md:hidden print:hidden">
        <PartnerCTAs context="gi_report" />
      </div>
    </>
  );
}

type ActionButtonProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

function ActionButton({ icon, label, onClick, disabled }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 flex-col items-center justify-center rounded-xl border border-white/15 bg-white/10 text-center text-[11px] uppercase tracking-wide transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </button>
  );
}
