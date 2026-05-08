/// <reference types="jest" />
/** @jest-environment node */

import {
  formatBirthDateIsoForDisplay,
  formatBirthDateMask,
  parseBirthDateDisplayToIso,
} from '@/lib/emagrecimento/intake-date';

describe('emagrecimento intake date helpers', () => {
  it('applies the DD/MM/AAAA mask progressively', () => {
    expect(formatBirthDateMask('1')).toBe('1');
    expect(formatBirthDateMask('1204')).toBe('12/04');
    expect(formatBirthDateMask('12041990')).toBe('12/04/1990');
    expect(formatBirthDateMask('12-04-1990')).toBe('12/04/1990');
  });

  it('formats ISO values for the triage display', () => {
    expect(formatBirthDateIsoForDisplay('1990-04-12')).toBe('12/04/1990');
    expect(formatBirthDateIsoForDisplay('12041990')).toBe('12/04/1990');
    expect(formatBirthDateIsoForDisplay('')).toBe('');
  });

  it('parses a valid masked date back to ISO', () => {
    expect(parseBirthDateDisplayToIso('12/04/1990')).toBe('1990-04-12');
  });

  it('rejects impossible dates', () => {
    expect(parseBirthDateDisplayToIso('31/02/1990')).toBeNull();
    expect(parseBirthDateDisplayToIso('12/13/1990')).toBeNull();
    expect(parseBirthDateDisplayToIso('12/04/90')).toBeNull();
  });
});
