'use client';

/**
 * Parseia activeIngredients em linhas { ingredient, dose, unit }.
 * Formatos: "Akkermat 150mg", "Excipiente q.s.p. 1 cápsula", "Cafeína 105 mg"
 */
function parseComposition(text: string | null | undefined): { ingredient: string; dose: string; unit: string }[] {
  if (!text || typeof text !== 'string') return [];

  const rows: { ingredient: string; dose: string; unit: string }[] = [];
  const lines = text.split(/[\n,;]/).map((s) => s.trim()).filter(Boolean);

  const doseRegex = /^(.+?)\s+(\d+(?:[.,]\d+)?)\s*(mg|mcg|g|ml|UI|%|q\.s\.p\.?)?\s*$/i;
  const excipienteRegex = /^(.+?)\s+(q\.s\.p\.?)\s*(.+)?$/i;

  for (const line of lines) {
    const doseMatch = line.match(doseRegex);
    const excMatch = line.match(excipienteRegex);
    if (doseMatch) {
      rows.push({
        ingredient: doseMatch[1].trim(),
        dose: doseMatch[2].replace(',', '.'),
        unit: (doseMatch[3] ?? 'mg').replace(/q\.s\.p\.?/i, 'q.s.p.'),
      });
    } else if (excMatch) {
      rows.push({ ingredient: excMatch[1].trim(), dose: 'q.s.p.', unit: excMatch[3]?.trim() ?? '' });
    } else if (line.length > 3 && !/^\d+$/.test(line)) {
      rows.push({ ingredient: line, dose: '—', unit: '' });
    }
  }

  if (rows.length === 0 && text.length > 10) {
    return [{ ingredient: text, dose: '—', unit: '' }];
  }
  return rows;
}

interface PdpCompositionTableProps {
  activeIngredients: string | null | undefined;
}

export default function PdpCompositionTable({ activeIngredients }: PdpCompositionTableProps) {
  const rows = parseComposition(activeIngredients);
  if (rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full min-w-[280px] text-sm md:text-[15px]">
        <thead>
          <tr className="bg-gray-50/70 border-b border-gray-100">
            <th className="text-left py-3.5 px-4 md:px-5 font-semibold text-gray-900">Composição</th>
            <th className="text-left py-3.5 px-4 md:px-5 font-semibold text-gray-900">Quantidade</th>
            <th className="text-left py-3.5 px-4 md:px-5 font-semibold text-gray-900">Unidade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors">
              <td className="py-3 px-4 md:px-5 font-medium text-gray-800">{row.ingredient}</td>
              <td className="py-3 px-4 md:px-5 text-gray-700">{row.dose}</td>
              <td className="py-3 px-4 md:px-5 text-gray-600">{row.unit || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
