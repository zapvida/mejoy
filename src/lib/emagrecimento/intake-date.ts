const DATE_MASK_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function formatBirthDateMask(rawValue: string) {
  const digits = rawValue.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function formatBirthDateIsoForDisplay(value?: string | null) {
  if (!value) return '';

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  return formatBirthDateMask(value);
}

export function parseBirthDateDisplayToIso(value?: string | null) {
  if (!value) return null;

  const match = value.match(DATE_MASK_PATTERN);
  if (!match) return null;

  const [, dayValue, monthValue, yearValue] = match;
  const day = Number(dayValue);
  const month = Number(monthValue);
  const year = Number(yearValue);

  if (!day || !month || !year || month > 12) return null;

  const normalized = new Date(Date.UTC(year, month - 1, day));
  if (
    Number.isNaN(normalized.getTime()) ||
    normalized.getUTCFullYear() !== year ||
    normalized.getUTCMonth() !== month - 1 ||
    normalized.getUTCDate() !== day
  ) {
    return null;
  }

  return `${year}-${pad(month)}-${pad(day)}`;
}
