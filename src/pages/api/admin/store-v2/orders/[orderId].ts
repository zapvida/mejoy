/**
 * GET /api/admin/store-v2/orders/[orderId] - detalhe
 * PATCH /api/admin/store-v2/orders/[orderId] - atualizar status e/ou tracking
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { sendStoreV2OrderShippedEmail, sendStoreV2OrderDeliveredEmail } from '@/lib/email';

const patchSchema = z.object({
  status: z.enum(['PENDING_PAYMENT', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED']).optional(),
  trackingCode: z.string().optional(),
  trackingUrl: z.string().url().optional().or(z.literal('')),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const orderId = req.query.orderId as string;
  if (!orderId) {
    return res.status(400).json({ error: 'orderId obrigatório' });
  }

  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      return res.status(200).json({
        ...order,
        snapshot: order.snapshot,
        items: order.items,
      });
    }

    if (req.method === 'PATCH') {
      const parsed = patchSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      const data: Record<string, unknown> = {};
      const auditLogs: Array<{ action: string; field?: string; oldValue?: string; newValue?: string }> = [];

      if (parsed.data.status !== undefined) {
        data.status = parsed.data.status;
        auditLogs.push({
          action: 'status_update',
          field: 'status',
          oldValue: order.status,
          newValue: parsed.data.status,
        });
        if (parsed.data.status === 'SHIPPED') {
          data.shippedAt = new Date();
        } else if (parsed.data.status === 'DELIVERED') {
          data.deliveredAt = new Date();
        }
      }

      if (parsed.data.trackingCode !== undefined) {
        data.trackingCode = parsed.data.trackingCode || null;
        auditLogs.push({
          action: 'tracking_update',
          field: 'trackingCode',
          oldValue: order.trackingCode ?? undefined,
          newValue: parsed.data.trackingCode || undefined,
        });
      }

      if (parsed.data.trackingUrl !== undefined) {
        data.trackingUrl = parsed.data.trackingUrl || null;
        auditLogs.push({
          action: 'tracking_update',
          field: 'trackingUrl',
          oldValue: order.trackingUrl ?? undefined,
          newValue: parsed.data.trackingUrl || undefined,
        });
      }

      if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar' });
      }

      const updated = await prisma.order.update({
        where: { id: orderId },
        data,
      });

      for (const log of auditLogs) {
        await prisma.storeV2AdminAuditLog.create({
          data: {
            orderId,
            action: log.action,
            field: log.field,
            oldValue: log.oldValue,
            newValue: log.newValue,
          },
        });
      }

      // Notificações idempotentes ao mudar para SHIPPED ou DELIVERED
      const email = order.customerEmail;
      if (parsed.data.status === 'SHIPPED' && email && !order.shippedNotificationSentAt) {
        try {
          await sendStoreV2OrderShippedEmail(email, {
            name: order.customerName,
            firstName: order.customerName?.split(' ')[0] || 'Cliente',
            orderId,
            trackingCode: (updated as any).trackingCode || undefined,
            trackingUrl: (updated as any).trackingUrl || undefined,
          });
          await prisma.order.update({
            where: { id: orderId },
            data: { shippedNotificationSentAt: new Date() },
          });
        } catch (e) {
          console.error('[admin PATCH] shipped email error:', e);
        }
      }
      if (parsed.data.status === 'DELIVERED' && email && !order.deliveredNotificationSentAt) {
        try {
          await sendStoreV2OrderDeliveredEmail(email, {
            name: order.customerName,
            firstName: order.customerName?.split(' ')[0] || 'Cliente',
            orderId,
          });
          await prisma.order.update({
            where: { id: orderId },
            data: { deliveredNotificationSentAt: new Date() },
          });
        } catch (e) {
          console.error('[admin PATCH] delivered email error:', e);
        }
      }

      const updatedFinal = await prisma.order.findUnique({ where: { id: orderId } });
      return res.status(200).json(updatedFinal ?? updated);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
