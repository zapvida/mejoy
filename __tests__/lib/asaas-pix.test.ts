/// <reference types="jest" />
/** @jest-environment node */

import type { AsaasPaymentResponse } from '@/lib/asaas/client';
import { asaasClient } from '@/lib/asaas/client';
import { resolvePixTransaction } from '@/lib/asaas/pix';

jest.mock('@/lib/asaas/client', () => ({
  asaasClient: {
    getPaymentPixQrCode: jest.fn(),
  },
}));

const mockedAsaasClient = asaasClient as jest.Mocked<typeof asaasClient>;

function buildPayment(overrides: Partial<AsaasPaymentResponse> = {}): AsaasPaymentResponse {
  return {
    id: 'pay_123',
    customer: 'cus_123',
    value: 10,
    netValue: 8,
    originalValue: 10,
    interestValue: 0,
    description: 'Teste PIX',
    billingType: 'PIX',
    status: 'PENDING',
    dueDate: '2026-05-10',
    originalDueDate: '2026-05-10',
    deleted: false,
    anticipated: false,
    anticipable: false,
    ...overrides,
  };
}

describe('asaas pix fallback', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns the embedded pixTransaction without calling the QR endpoint', async () => {
    const pix = await resolvePixTransaction(
      buildPayment({
        pixTransaction: {
          id: 'pix_1',
          qrCode: '000201',
          qrCodeBase64: 'abc123',
          endToEndIdentifier: 'e2e',
          value: 10,
          netValue: 8,
          status: 'PENDING',
        },
      })
    );

    expect(pix).toEqual({
      qrCode: '000201',
      qrCodeBase64: 'abc123',
      value: 10,
    });
    expect(mockedAsaasClient.getPaymentPixQrCode).not.toHaveBeenCalled();
  });

  it('falls back to the dedicated PIX endpoint when the payment response has no QR data', async () => {
    mockedAsaasClient.getPaymentPixQrCode.mockResolvedValue({
      payload: '000201010212',
      encodedImage: 'data:image/png;base64,ZmFrZQ==',
    });

    const pix = await resolvePixTransaction(buildPayment());

    expect(mockedAsaasClient.getPaymentPixQrCode).toHaveBeenCalledWith('pay_123');
    expect(pix).toEqual({
      qrCode: '000201010212',
      qrCodeBase64: 'ZmFrZQ==',
      value: 10,
    });
  });

  it('returns null when Asaas still has no QR payload available', async () => {
    mockedAsaasClient.getPaymentPixQrCode.mockResolvedValue({});

    const pix = await resolvePixTransaction(buildPayment());

    expect(pix).toBeNull();
  });
});
