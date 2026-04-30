'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

const FALLBACK_TITLE = 'Me Joy Farma';

/**
 * Detecta se a imagem é placeholder (pílula, ícone genérico) e devemos usar a embalagem.
 * Garante que 100% do catálogo fique com frasco padronizado quando a "imagem" não for real.
 */
export function shouldUsePackShot(image: string | null | undefined): boolean {
  if (!image || typeof image !== 'string') return true;
  const url = image.toLowerCase();
  return (
    url.includes('placeholder') ||
    url.includes('placehold.co') ||
    url.includes('via.placeholder') ||
    url.includes('pill') ||
    url.includes('pílula') ||
    url.includes('pilula') ||
    url.includes('placeholder.png') ||
    url.includes('placeholder.jpg') ||
    url.includes('metaboslim') ||
    url.includes('zapfarm') ||
    /data:image\/svg\+xml/.test(url)
  );
}

/**
 * Separa nome do produto da dose/unidade no final.
 * Ex: "Valeriana 300 mg" → { name: "Valeriana", dosage: "300 mg" }
 * Ex: "Citrato de Magnésio 500 mg" → { name: "Citrato de Magnésio", dosage: "500 mg" }
 * Ex: "Glicina 5% + ativos" → { name: "Glicina", dosage: "5% + ativos" }
 */
function parseLabelParts(title: string): { name: string; dosage: string } {
  let t = String(title ?? '').trim();
  if (!t) return { name: '', dosage: '' };

  // Remove duplicações de palavras (ex: "Valeriana Valeriana")
  const words = t.split(/\s+/);
  const seen = new Set<string>();
  const deduped = words.filter((w) => {
    const key = w.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  t = deduped.join(' ');

  // Dose no final: número + unidade (mg, mcg, UI, ml, %, g) ou "5% + ativos"
  const dosageMatch = t.match(
    /\s+(\d[\d.,]*)\s*(mg|mcg|UI|ml|mL|%|g)(?:\s*\+\s*ativos)?\s*$/i
  );
  if (dosageMatch) {
    const dosage = t.slice(dosageMatch.index!).trim();
    const name = t.slice(0, dosageMatch.index!).trim();
    return { name, dosage };
  }
  return { name: t, dosage: '' };
}

/** Máximo de caracteres por linha na label (evita overflow). */
const MAX_CHARS_PER_LINE = 14;

function splitByWords(text: string): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length <= MAX_CHARS_PER_LINE) {
      current = next;
    } else {
      if (current) lines.push(current);
      // Nunca trunca palavra: mantém inteira; getScaleFactor reduz fonte para caber
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 4);
}

/**
 * Quebra o nome em linhas que cabem na label, em pontos naturais (+, e).
 * Nunca deixa texto ultrapassar a embalagem.
 */
function nameToLines(name: string): string[] {
  const trimmed = name.trim();
  if (!trimmed) return [];
  if (trimmed.length <= MAX_CHARS_PER_LINE) return [trimmed];

  const atPlus = trimmed.split(/\s+\+\s+/);
  if (atPlus.length >= 2) {
    const result: string[] = [];
    for (let i = 0; i < atPlus.length; i++) {
      const part = atPlus[i].trim();
      const suffix = i < atPlus.length - 1 ? ' +' : '';
      if (part.length + suffix.length <= MAX_CHARS_PER_LINE) {
        result.push(part + suffix);
      } else {
        result.push(...splitByWords(part + suffix));
      }
    }
    return result.filter(Boolean).slice(0, 4);
  }

  const atE = trimmed.split(/\s+e\s+/i);
  if (atE.length >= 2) {
    const result: string[] = [];
    for (const p of atE) {
      const t = p.trim();
      if (t.length <= MAX_CHARS_PER_LINE) result.push(t);
      else result.push(...splitByWords(t));
    }
    return result.filter(Boolean).slice(0, 4);
  }

  return splitByWords(trimmed);
}

const variantStyles = {
  card: {
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
    baseFontSize: 'clamp(9px, 1.8vw, 14px)',
    baseDosageFontSize: 'clamp(7px, 1.3vw, 10px)',
    priority: false,
  },
  pdp: {
    sizes: '(max-width: 1024px) 100vw, 50vw',
    baseFontSize: 'clamp(14px, 2.5vw, 22px)',
    baseDosageFontSize: 'clamp(10px, 1.8vw, 16px)',
    priority: true,
  },
  cart: {
    sizes: '80px',
    baseFontSize: 'clamp(10px, 2vw, 12px)',
    baseDosageFontSize: 'clamp(7px, 1.4vw, 9px)',
    priority: false,
  },
} as const;

/**
 * Escala a fonte para caber na label: mais linhas ou chars = fonte menor.
 * Garante que texto nunca ultrapasse a embalagem.
 */
function getScaleFactor(lineCount: number, maxCharInLine: number): number {
  if (lineCount >= 4 || maxCharInLine >= 14) return 0.5;
  if (lineCount >= 3 || maxCharInLine >= 12) return 0.65;
  if (lineCount >= 2 || maxCharInLine >= 10) return 0.8;
  return 1;
}

export interface ProductPackShotProps {
  title: string;
  className?: string;
  variant?: 'card' | 'pdp' | 'cart';
}

export default function ProductPackShot({
  title,
  className,
  variant = 'card',
}: ProductPackShotProps) {
  const displayTitle = (title ?? '').trim() || FALLBACK_TITLE;
  const { name, dosage } = parseLabelParts(displayTitle);
  const nameLines = nameToLines(name);
  const hasContent = nameLines.length > 0 || dosage || displayTitle === FALLBACK_TITLE;
  const style = variantStyles[variant];

  const maxCharInLine = Math.max(
    ...nameLines.map((l) => l.length),
    dosage?.length ?? 0
  );
  const lineCount = nameLines.length + (dosage ? 1 : 0);
  const scale = getScaleFactor(lineCount, maxCharInLine);

  const pdpScale = variant === 'pdp' ? 1.35 : 1;

  return (
    <div
      className={cn('relative w-full h-full overflow-hidden', className)}
      role="img"
      aria-label={`Embalagem do produto ${displayTitle}`}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={pdpScale > 1 ? { transform: `scale(${pdpScale})`, transformOrigin: 'center center' } : undefined}
      >
        <Image
          src="/mejoy1branco.png"
          alt={`Embalagem do produto ${displayTitle}`}
          fill
          className="object-contain"
          sizes={style.sizes}
          priority={style.priority}
        />
      </div>
      {variant !== 'cart' && hasContent && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden"
          style={{
            top: '38%',
            bottom: '20%',
            left: '10%',
            right: '10%',
          }}
        >
          <div
            className="flex flex-col items-center justify-center text-center w-full max-w-full"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            {nameLines.length > 0 ? (
              <>
                {nameLines.map((line, i) => (
                  <span
                    key={i}
                    className="font-semibold text-[#111111] leading-tight block text-center break-words max-w-full"
                    style={{
                      fontSize: style.baseFontSize,
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {line}
                  </span>
                ))}
                {dosage && (
                  <span
                    className="font-medium text-[#444444] leading-tight block mt-0.5"
                    style={{
                      fontSize: style.baseDosageFontSize,
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      maxWidth: '100%',
                    }}
                  >
                    {dosage}
                  </span>
                )}
              </>
            ) : (
              <span
                className="font-semibold text-[#111111] leading-tight"
                style={{ fontSize: style.baseFontSize }}
              >
                {displayTitle}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
