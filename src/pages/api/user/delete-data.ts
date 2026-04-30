// src/pages/api/user/delete-data.ts
// API para exclusão de dados LGPD

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { userId, confirmation } = req.body;

  if (!userId || !confirmation) {
    return res.status(400).json({ error: 'ID do usuário e confirmação são obrigatórios' });
  }

  if (confirmation !== 'CONFIRMO_EXCLUSAO_DADOS') {
    return res.status(400).json({ error: 'Confirmação inválida' });
  }

  try {
    if (!prisma) {
      return res.status(503).json({ error: "Database not available" });
    }

    // Buscar usuário
    const user = await prisma.patient.findUnique({
      where: { id: userId },
      include: {
        triages: true,
        reports: true,
        subscriptions: true,
        gifts: true,
        giftsRedeemed: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Anonimizar dados pessoais
    const anonymizedData = {
      name: `Usuário_${userId.slice(-8)}`,
      email: `deleted_${userId.slice(-8)}@deleted.com`,
      whatsapp: `deleted_${userId.slice(-8)}`,
      birthDate: null,
      sex: null,
      weight: null,
      height: null,
      deletedAt: new Date(),
    };

    // Atualizar dados do usuário
    await prisma.patient.update({
      where: { id: userId },
      data: anonymizedData
    });

    // Anonimizar triagens
    await prisma.triage.updateMany({
      where: { patientId: userId },
      data: {
        formData: {},
        status: 'deleted'
      }
    });

    // Anonimizar relatórios
    await prisma.report.updateMany({
      where: { patientId: userId },
      data: {
        summary: {},
        plan: {},
        rawPremium: 'Dados excluídos por solicitação do usuário',
        status: 'deleted'
      }
    });

    // Cancelar assinaturas ativas
    await prisma.subscription.updateMany({
      where: { 
        userId: userId,
        status: 'active'
      },
      data: {
        status: 'cancelled'
      }
    });

    // Anonimizar presentes enviados
    await prisma.gift.updateMany({
      where: { giverUserId: userId },
      data: {
        recipientName: 'Dados excluídos',
        recipientEmail: 'deleted@deleted.com',
        recipientWhats: 'deleted',
        message: 'Dados excluídos'
      }
    });

    // Log da exclusão (sem PII)
    console.log(`Dados excluídos para usuário: ${userId.slice(-8)}`);

    return res.status(200).json({
      success: true,
      message: 'Dados excluídos com sucesso',
      deletedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao excluir dados:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
