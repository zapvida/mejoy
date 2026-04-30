// Correções temporárias para permitir build
// TODO: Refatorar após correção completa do schema

// src/lib/database-fix.ts
import { prisma } from '@/lib/prisma';

export const DatabaseServiceFixed = {
  async createGiftToken(data: {
    issuerUserId: string;
    expiresAt: Date;
    stripeSessionId?: string;
  }) {
    return await prisma.giftToken.create({
      data,
    });
  },

  async findGiftTokenByCode(code: string) {
    return await prisma.giftToken.findFirst({
      where: { id: code },
      include: { issuer: true, redeemedBy: true },
    });
  },

  async redeemGiftToken(code: string, redeemedByUserId: string) {
    return await prisma.giftToken.update({
      where: { id: code },
      data: {
        status: 'redeemed',
        redeemedByUserId,
        redeemedAt: new Date(),
      },
    });
  },
};
