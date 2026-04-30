export function normalizeBrazilPhone(value: unknown): string | undefined {
  if (value == null) return undefined;
  const raw = typeof value === 'string' ? value : String(value);
  const digits = raw.replace(/\D/g, '');
  if (!digits) return undefined;

  if (digits.startsWith('55')) {
    const local = digits.slice(2);
    if (local.length >= 10 && local.length <= 11) return `55${local}`;
    return undefined;
  }

  if (digits.length >= 10 && digits.length <= 11) {
    return `55${digits}`;
  }

  return undefined;
}

export function coercePhoneLike(value: unknown): string | undefined {
  if (value == null) return undefined;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const normalizedBr = normalizeBrazilPhone(trimmed);
    return normalizedBr || trimmed;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return undefined;
    const asString = String(Math.trunc(value));
    return normalizeBrazilPhone(asString) || asString;
  }

  if (typeof value === 'bigint') {
    const asString = value.toString();
    return normalizeBrazilPhone(asString) || asString;
  }

  return undefined;
}
