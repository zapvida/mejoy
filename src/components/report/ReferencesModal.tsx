'use client';

import Modal from "@/components/ui/modals/Modal";
import type { Citation } from "@/types/report";

type ReferencesModalProps = {
  open: boolean;
  onClose: () => void;
  citations: Citation[];
};

export function ReferencesModal({ open, onClose, citations }: ReferencesModalProps) {
  return (
    <Modal isOpen={open} onClose={onClose}>
      <header className="mb-4 space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">Referências</h2>
        <p className="text-sm text-slate-500">
          Fontes que embasam as recomendações personalizadas deste relatório.
        </p>
      </header>

      <ol className="space-y-3 text-sm text-slate-700">
        {citations.map((citation) => (
          <li key={citation.id} className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
            <div className="font-medium text-slate-900">{citation.label}</div>
            {citation.url && (
              <a
                href={citation.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
              >
                {citation.url}
              </a>
            )}
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        Fechar
      </button>
    </Modal>
  );
}
