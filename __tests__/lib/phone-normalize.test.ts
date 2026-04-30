/// <reference types="jest" />
/** @jest-environment node */

import {
  coercePhoneLike,
  normalizeBrazilPhone,
  normalizeBrazilPhoneNational,
  validateBrazilPhoneInput,
} from '@/lib/phone/normalize';

describe('phone normalization', () => {
  it('accepts Brazilian numbers with country code', () => {
    expect(normalizeBrazilPhoneNational('+55 (11) 99999-8888')).toBe('11999998888');
    expect(normalizeBrazilPhone('+55 (11) 99999-8888')).toBe('5511999998888');
    expect(validateBrazilPhoneInput('+55 (11) 99999-8888')).toBeNull();
  });

  it('accepts Brazilian numbers without country code', () => {
    expect(normalizeBrazilPhoneNational('(11) 99999-8888')).toBe('11999998888');
    expect(normalizeBrazilPhone('(11) 99999-8888')).toBe('5511999998888');
    expect(coercePhoneLike('(11) 99999-8888')).toBe('5511999998888');
  });

  it('rejects incomplete numbers', () => {
    expect(normalizeBrazilPhoneNational('9999-8888')).toBeUndefined();
    expect(validateBrazilPhoneInput('9999-8888')).toBe(
      'Informe DDD + número com 10 ou 11 dígitos, com ou sem +55.'
    );
  });
});
