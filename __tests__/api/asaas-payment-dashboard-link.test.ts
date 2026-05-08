/// <reference types="jest" />
/** @jest-environment node */

import { createMocks } from "node-mocks-http";

jest.mock("@/lib/asaas/client", () => ({
  asaasClient: {
    getPayment: jest.fn(),
  },
}));

jest.mock("@/lib/supabaseAdmin", () => ({
  hasSupabaseAdminConfig: true,
}));

jest.mock("@/lib/zapfarm/profile-link", () => ({
  ensureCheckoutProfile: jest.fn(),
}));

jest.mock("@/lib/zapfarm/order-sync", () => ({
  upsertZapfarmOrderFromPayment: jest.fn(),
}));

jest.mock("@/lib/auth/magic-link", () => ({
  createMagicLink: jest.fn(),
}));

import handler from "@/pages/api/asaas/payment-dashboard-link";
import { asaasClient } from "@/lib/asaas/client";
import { ensureCheckoutProfile } from "@/lib/zapfarm/profile-link";
import { upsertZapfarmOrderFromPayment } from "@/lib/zapfarm/order-sync";
import { createMagicLink } from "@/lib/auth/magic-link";

const mockedAsaasClient = asaasClient as jest.Mocked<typeof asaasClient>;
const mockedEnsureCheckoutProfile =
  ensureCheckoutProfile as jest.MockedFunction<typeof ensureCheckoutProfile>;
const mockedUpsertOrder = upsertZapfarmOrderFromPayment as jest.MockedFunction<
  typeof upsertZapfarmOrderFromPayment
>;
const mockedCreateMagicLink = createMagicLink as jest.MockedFunction<
  typeof createMagicLink
>;

describe("/api/asaas/payment-dashboard-link", () => {
  const originalApiKey = process.env.ASAAS_API_KEY;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.ASAAS_API_KEY = "test-key";
  });

  afterAll(() => {
    process.env.ASAAS_API_KEY = originalApiKey;
  });

  it("blocks dashboard access while payment is still pending", async () => {
    mockedAsaasClient.getPayment.mockResolvedValue({
      id: "pay_pending",
      customer: "cus_1",
      value: 12,
      netValue: 10,
      originalValue: 12,
      interestValue: 0,
      description: "Teste",
      billingType: "PIX",
      status: "PENDING",
      dueDate: "2026-05-08",
      originalDueDate: "2026-05-08",
      deleted: false,
      anticipated: false,
      anticipable: false,
      metadata: {
        customer_email: "cliente@example.com",
      },
    } as any);

    const { req, res } = createMocks({
      method: "GET",
      query: { paymentId: "pay_pending" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(409);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        status: "error",
        code: "PAYMENT_NOT_CONFIRMED",
        paymentStatus: "PENDING",
      }),
    );
    expect(mockedEnsureCheckoutProfile).not.toHaveBeenCalled();
  });

  it("returns a magic dashboard link for confirmed payments", async () => {
    mockedAsaasClient.getPayment.mockResolvedValue({
      id: "pay_confirmed",
      customer: "cus_1",
      value: 12,
      netValue: 10,
      originalValue: 12,
      interestValue: 0,
      description: "Teste",
      billingType: "PIX",
      status: "CONFIRMED",
      dueDate: "2026-05-08",
      originalDueDate: "2026-05-08",
      deleted: false,
      anticipated: false,
      anticipable: false,
      metadata: {
        customer_email: "cliente@example.com",
        customer_name: "Cliente Teste",
        customer_phone: "5511987654321",
      },
    } as any);
    mockedEnsureCheckoutProfile.mockResolvedValue({
      id: "profile_123",
      email: "cliente@example.com",
    } as any);
    mockedUpsertOrder.mockResolvedValue(null as any);
    mockedCreateMagicLink.mockResolvedValue({
      magicUrl: "https://www.mejoy.com.br/auth/magic-link?token=test",
      token: "test",
      expiresAt: new Date("2026-05-09T00:00:00.000Z"),
    });

    const { req, res } = createMocks({
      method: "GET",
      query: { paymentId: "pay_confirmed" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        status: "success",
        paymentStatus: "CONFIRMED",
        profileId: "profile_123",
        magicUrl: "https://www.mejoy.com.br/auth/magic-link?token=test",
      }),
    );
    expect(mockedEnsureCheckoutProfile).toHaveBeenCalledWith({
      email: "cliente@example.com",
      name: "Cliente Teste",
      whatsapp: "5511987654321",
    });
    expect(mockedCreateMagicLink).toHaveBeenCalledWith({
      profileId: "profile_123",
      redirectPath: "/dashboard",
    });
  });
});
