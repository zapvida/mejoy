'use client';

import { Clipboard, FileText, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import { buildExamTexts } from "@/lib/report/deriveReport";
import type { PreventiveExam } from "@/types/report";

type PreventiveExamsProps = {
  exams: PreventiveExam[];
  patient?: { nome: string; idade: number; sexo: "masculino" | "feminino" };
  reportId: string;
  showActions?: boolean;
  onCopy?: () => void;
  onWhatsapp?: () => void;
  onPdf?: () => void;
  onRequestPrint?: () => void;
};

export function PreventiveExams({
  exams,
  patient,
  reportId,
  showActions = true,
  onCopy,
  onWhatsapp,
  onPdf,
  onRequestPrint,
}: PreventiveExamsProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<"copy" | "whatsapp" | "pdf" | null>(null);

  const copyFallback = useCallback((text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(text);
      }
    } catch {
      // ignore
    }
    return new Promise<void>((resolve) => {
      if (typeof document === 'undefined') {
        resolve();
        return;
      }
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

  const handleCopy = useCallback(async () => {
    if (!patient) return;
    setLoadingAction("copy");
    const { pedido } = buildExamTexts(patient, exams);
    try {
      await copyFallback(pedido);
      setFeedback("Pedido copiado.");
      onCopy?.();
    } finally {
      setLoadingAction(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  }, [copyFallback, exams, onCopy, patient]);

  const handleWhatsapp = useCallback(async () => {
    setLoadingAction("whatsapp");
    try {
      const response = await fetch("/api/report/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reportId, section: "preventiveExams" }),
      });
      if (!response.ok) throw new Error("whatsapp-failed");
      const data = await response.json();
      const text = data?.text;
      if (typeof text === "string" && text.length) {
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        if (typeof window !== 'undefined') {
          window.open(url, "_blank", "noopener");
        }
        setFeedback("Mensagem aberta no WhatsApp.");
        onWhatsapp?.();
      }
    } catch (error) {
      console.error("[PreventiveExams] whatsapp fallback", error);
      setFeedback("Não foi possível abrir o WhatsApp.");
    } finally {
      setLoadingAction(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  }, [onWhatsapp, reportId]);

  const handlePdf = useCallback(() => {
    setLoadingAction("pdf");
    onRequestPrint?.();
    onPdf?.();
    setTimeout(() => {
      setLoadingAction(null);
    }, 600);
  }, [onPdf, onRequestPrint]);

  if (!exams?.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700">
        Nenhum exame preventivo recomendado neste momento.
      </div>
    );
  }

  return (
    <section aria-labelledby="preventive-exams-title" className="rounded-3xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="preventive-exams-title" className="text-lg font-semibold">Exames preventivos personalizados</h2>
          <p className="text-xs uppercase tracking-wide text-white/60">Atualizado automaticamente por perfil</p>
        </div>
        {showActions && patient && (
          <div className="flex items-center gap-2">
            <ActionIcon
              icon={<Clipboard className="h-4 w-4" />}
              label="Copiar pedido"
              disabled={loadingAction === "copy"}
              onClick={handleCopy}
            />
            <ActionIcon
              icon={<MessageCircle className="h-4 w-4" />}
              label="WhatsApp"
              disabled={loadingAction === "whatsapp"}
              onClick={handleWhatsapp}
            />
            <ActionIcon
              icon={<FileText className="h-4 w-4" />}
              label="Laudo PDF"
              disabled={loadingAction === "pdf"}
              onClick={handlePdf}
            />
          </div>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30" style={{ contentVisibility: "auto", containIntrinsicSize: "600px 240px" }}>
        <table className="min-w-full text-left text-sm text-white/80">
          <thead>
            <tr className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
              <th className="px-4 py-3">Exame</th>
              <th className="px-4 py-3">Quando</th>
              <th className="px-4 py-3">Preparo</th>
              <th className="px-4 py-3">Por que importa</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, index) => (
              <tr key={`${exam.name}-${index}`} className="border-t border-white/10 text-sm">
                <td className="px-4 py-3 font-medium text-white">{exam.name}</td>
                <td className="px-4 py-3">{exam.when || "Conforme orientação"}</td>
                <td className="px-4 py-3">{exam.prep || "Sem preparo específico"}</td>
                <td className="px-4 py-3">{exam.why || "Apoia a prevenção contínua"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {feedback && (
        <p className="mt-3 text-xs text-white/70" role="status" aria-live="polite">
          {feedback}
        </p>
      )}
    </section>
  );
}

type ActionIconProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

function ActionIcon({ icon, label, onClick, disabled }: ActionIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50"
    >
      <span className="sr-only">{label}</span>
      {icon}
    </button>
  );
}
