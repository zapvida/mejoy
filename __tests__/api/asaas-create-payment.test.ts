/// <reference types="jest" />
/** @jest-environment node */

import { createMocks } from "node-mocks-http";

import handler from "@/pages/api/asaas/create-payment";

describe("/api/asaas/create-payment", () => {
  it("returns 400 for obviously invalid WhatsApp numbers before hitting Asaas", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        product: "emagrecimento",
        plano: "premium",
        paymentMethod: "PIX",
        nome: "Teste Codex",
        email: "teste@example.com",
        telefone: "11999999999",
      },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        status: "error",
        code: "INVALID_PHONE",
      }),
    );
  });
});
