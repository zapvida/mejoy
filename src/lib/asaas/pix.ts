import { asaasClient, type AsaasPaymentResponse, type AsaasPixQrCodeResponse } from '@/lib/asaas/client';

type ResolveOptions = {
  loggerPrefix?: string;
};

export type SimplifiedPixTransaction = {
  qrCode: string | null;
  qrCodeBase64: string | null;
  value: number | null;
};

const sanitizeBase64 = (value?: string | null): string | null => {
  if (!value) return null;
  return value.replace(/^data:image\/\w+;base64,/, '');
};

const extractPixFromApi = (
  response: AsaasPixQrCodeResponse | null | undefined,
  fallbackValue: number | null
): SimplifiedPixTransaction | null => {
  if (!response) return null;

  const qrCode =
    response.payload ||
    // alguns retornos usam outro nome para o código copia/cola
    response.copyAndPaste ||
    response.qrCode ||
    null;

  const qrCodeBase64 = sanitizeBase64(response.encodedImage);

  if (!qrCode && !qrCodeBase64) {
    return null;
  }

  return {
    qrCode,
    qrCodeBase64,
    value: fallbackValue,
  };
};

export async function resolvePixTransaction(
  payment: AsaasPaymentResponse,
  options: ResolveOptions = {}
): Promise<SimplifiedPixTransaction | null> {
  const prefix = options.loggerPrefix || '[asaas-pix]';

  if (payment.pixTransaction && (payment.pixTransaction.qrCode || payment.pixTransaction.qrCodeBase64)) {
    return {
      qrCode: payment.pixTransaction.qrCode || null,
      qrCodeBase64: payment.pixTransaction.qrCodeBase64 || null,
      value: payment.pixTransaction.value ?? payment.value ?? null,
    };
  }

  try {
    const qrCodeResponse = await asaasClient.getPaymentPixQrCode(payment.id);
    const pixFromApi = extractPixFromApi(qrCodeResponse, payment.value ?? null);

    if (pixFromApi) {
      return pixFromApi;
    }
  } catch (error: any) {
    console.error(`${prefix} Erro ao buscar QR Code direto:`, {
      paymentId: payment.id,
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
  }

  console.warn(`${prefix} QR Code não disponível após fallback`, {
    paymentId: payment.id,
  });

  return null;
}

