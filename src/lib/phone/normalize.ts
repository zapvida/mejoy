function digitsOnly(value: unknown): string {
  if (value == null) return '';
  return String(value).replace(/\D/g, '');
}

export function normalizeBrazilPhoneNational(value: unknown): string | undefined {
  const digits = digitsOnly(value);
  if (!digits) return undefined;

  if (digits.startsWith('55')) {
    const local = digits.slice(2);
    if (local.length >= 10 && local.length <= 11) return local;
    return undefined;
  }

  if (digits.length >= 10 && digits.length <= 11) {
    return digits;
  }

  return undefined;
}

export function normalizeBrazilPhone(value: unknown): string | undefined {
  const local = normalizeBrazilPhoneNational(value);
  if (!local) return undefined;
  return `55${local}`;
}

export function validateBrazilPhoneInput(value: unknown): string | null {
  return normalizeBrazilPhoneNational(value)
    ? null
    : 'Informe DDD + número com 10 ou 11 dígitos, com ou sem +55.';
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
