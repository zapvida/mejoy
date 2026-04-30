'use client';

/**
 * Seção Referências — lista numerada, estilo acadêmico.
 * Espelha o OficialFarma.
 */

interface PdpReferencesProps {
  references: string[];
  className?: string;
}

function extractReferenceLink(ref: string): { href: string | null; label: string } {
  const safe = String(ref ?? '').trim();
  if (!safe) return { href: null, label: '' };

  const urlMatch = safe.match(/https?:\/\/[^\s)]+/i);
  if (urlMatch?.[0]) {
    const href = urlMatch[0].replace(/[.,;]+$/, '');
    const label = safe.replace(urlMatch[0], '').replace(/\s+[—-]\s*$/, '').trim() || href;
    return { href, label };
  }

  const doiMatch = safe.match(/\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/i);
  if (doiMatch?.[0]) {
    const href = `https://doi.org/${doiMatch[0]}`;
    const label = safe.replace(doiMatch[0], '').replace(/\s+[—-]\s*$/, '').trim() || doiMatch[0];
    return { href, label };
  }

  return { href: null, label: safe };
}

export default function PdpReferences({ references, className = '' }: PdpReferencesProps) {
  if (!references || references.length === 0) return null;

  return (
    <div className={`bg-white rounded-2xl border border-amber-200/70 p-6 sm:p-8 shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-900">Referências científicas</h2>
        <span className="inline-flex px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
          {references.length} fontes
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Estudos e literatura técnica usados como base informativa desta fórmula.
      </p>
      <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700 leading-relaxed">
        {references.map((ref, i) => {
          const { href, label } = extractReferenceLink(ref);
          return (
            <li key={i} className="pl-2 break-words bg-gray-50/80 rounded-lg border border-gray-100 p-3">
              {href ? (
                <>
                  <span className="text-gray-800">{label}</span>
                  {label ? ' ' : ''}
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex ml-1 text-[#F97316] font-medium underline underline-offset-2 hover:text-[#EA580C]"
                  >
                    Acessar fonte
                  </a>
                </>
              ) : (
                <span>{label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
