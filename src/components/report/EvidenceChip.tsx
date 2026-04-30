'use client';

type EvidenceChipProps = {
  label: string;
  onClick: () => void;
  citationId?: string;
};

export function EvidenceChip({ label, onClick, citationId }: EvidenceChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-citation-id={citationId}
      className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
      <span>{label}</span>
    </button>
  );
}
