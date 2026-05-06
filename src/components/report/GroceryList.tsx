'use client';

import { Clipboard, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import type { Grocery } from "@/types/report";

type GroceryListProps = {
  grocery: Grocery;
  reportId: string;
  onCopy?: () => void;
  onWhatsapp?: () => void;
};

export function GroceryList({ grocery, reportId, onCopy, onWhatsapp }: GroceryListProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState<"copy" | "whatsapp" | null>(null);

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

  const buildText = useCallback(() => {
    const buySection = grocery.buy.map((item) => `• ${item}`).join("\n");
    const avoidSection = grocery.avoid.map((item) => `• ${item}`).join("\n");
    const notesSection = (grocery.notes ?? []).map((note) => `• ${note}`).join("\n");
    return `Lista inteligente — MeJoy\n\nComprar prioritariamente:\n${buySection}\n\nEvitar neste ciclo:\n${avoidSection}\n\nNotas rápidas:\n${notesSection}`;
  }, [grocery]);

  const handleCopy = useCallback(async () => {
    setLoading("copy");
    try {
      await copyFallback(buildText());
      setFeedback("Lista copiada.");
      onCopy?.();
    } finally {
      setLoading(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  }, [buildText, copyFallback, onCopy]);

  const handleWhatsapp = useCallback(async () => {
    setLoading("whatsapp");
    try {
      const response = await fetch("/api/report/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reportId, section: "grocery" }),
      });
      if (!response.ok) throw new Error("grocery-whatsapp");
      const data = await response.json();
      const text = data?.text ?? buildText();
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener");
      setFeedback("Lista enviada para o WhatsApp.");
      onWhatsapp?.();
    } catch (error) {
      console.error("[GroceryList] whatsapp fallback", error);
      setFeedback("Não foi possível abrir o WhatsApp agora.");
    } finally {
      setLoading(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  }, [buildText, onWhatsapp, reportId]);

  return (
    <section
      aria-labelledby="grocery-title"
      className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/70 p-4 text-white backdrop-blur-xl"
      style={{ contentVisibility: "auto", containIntrinsicSize: "720px 520px" }}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="grocery-title" className="text-lg font-semibold">🛒 Lista de compras inteligente</h2>
          <p className="text-xs uppercase tracking-wide text-white/60">Comprar, evitar e notas rápidas</p>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Clipboard className="h-4 w-4" />}
            label="Copiar"
            disabled={loading === "copy"}
            onClick={handleCopy}
          />
          <ActionButton
            icon={<MessageCircle className="h-4 w-4" />}
            label="WhatsApp"
            disabled={loading === "whatsapp"}
            onClick={handleWhatsapp}
          />
        </div>
      </header>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <ListCard title="Comprar" items={grocery.buy} highlight />
        <ListCard title="Evitar" items={grocery.avoid} tone="danger" />
        <ListCard title="Notas" items={grocery.notes ?? []} tone="muted" />
      </div>

      {feedback && (
        <p className="mt-3 text-xs text-white/70" role="status" aria-live="polite">
          {feedback}
        </p>
      )}
    </section>
  );
}

type ListCardProps = {
  title: string;
  items: string[];
  highlight?: boolean;
  tone?: "danger" | "muted";
};

function ListCard({ title, items, highlight, tone }: ListCardProps) {
  const baseClasses = "rounded-2xl border px-4 py-4 text-sm";
  const palette = highlight
    ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-50"
    : tone === "danger"
      ? "border-rose-300/40 bg-rose-500/10 text-rose-50"
      : "border-white/20 bg-white/10 text-white/80";

  return (
    <div className={`${baseClasses} ${palette}`}>
      <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
      <ul className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="flex items-start gap-2 leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-white/60" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
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
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50"
    >
      <span className="sr-only">{label}</span>
      {icon}
    </button>
  );
}
