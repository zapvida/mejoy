/**
 * DescriptionRenderer — parser seguro de description (sem HTML raw).
 * Se contiver "## " → headings h2, "- " → ul/li, demais → p.
 * Sem dependências externas (react-markdown).
 */

type Props = {
  text: string;
  className?: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function DescriptionRenderer({ text, className = '' }: Props) {
  if (!text || typeof text !== 'string') return null;

  const hasSections = text.includes('## ');
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (hasSections && trimmed.startsWith('## ')) {
      const heading = escapeHtml(trimmed.slice(3).trim());
      elements.push(
        <h2 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-3 first:mt-0">
          {heading}
        </h2>
      );
      i++;
      continue;
    }

    if (hasSections && (trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
      const items: string[] = [];
      while (i < lines.length) {
        const ln = lines[i].trim();
        if (ln.startsWith('- ') || ln.startsWith('* ')) {
          items.push(escapeHtml(ln.slice(2).trim()));
          i++;
        } else {
          break;
        }
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1 text-gray-700 my-2">
          {items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
      continue;
    }

    elements.push(
      <p key={i} className="text-gray-700 leading-relaxed my-3 text-[15px]">
        {escapeHtml(trimmed)}
      </p>
    );
    i++;
  }

  if (elements.length === 0) return null;

  return <div className={className}>{elements}</div>;
}
