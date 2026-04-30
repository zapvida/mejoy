// src/lib/privacy.ts
// Sistema de LGPD forte com exclusão de dados e segurança

import crypto from 'crypto';

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Função para gerar hash dos dados originais
function generateDataHash(data: any): string {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

// Função para anonimizar dados pessoais
function anonymizePersonalData(data: any): any {
  const anonymized = { ...data };
  
  // Campos a serem anonimizados
  const fieldsToAnonymize = [
    'nome', 'email', 'telefone', 'whatsapp',
    'endereco', 'cidade', 'estado', 'cep', 'dataNascimento'
  ];
  
  fieldsToAnonymize.forEach(field => {
    if (anonymized[field]) {
      anonymized[field] = '[ANONIMIZADO]';
    }
  });
  
  return anonymized;
}

// Função para excluir dados do usuário (LGPD)
export async function deleteUserData(userId: string): Promise<boolean> {
  try {
    // 1. Buscar todos os dados do usuário
    const includeBase = {
      triages: true,
      subscriptions: true,
      reports: true
    } satisfies Prisma.PatientInclude;

    const include = { ...includeBase } as Prisma.PatientInclude & Record<string, any>;
    if (process.env.GIFT_ENABLED === "1") {
      include["gifts"] = true;
    }

    const userData = await prisma.patient.findUnique({
      where: { id: userId },
      include
    });

    if (!userData) {
      return false; // Usuário não encontrado
    }

    // 2. Gerar hash dos dados originais para auditoria
    const originalDataHash = generateDataHash(userData);

    // 3. Anonimizar dados em vez de deletar (melhor prática LGPD)
    const anonymizedData = anonymizePersonalData(userData);

    // 4. Atualizar dados do usuário com versão anonimizada
    await prisma.patient.update({
      where: { id: userId },
      data: {
        ...anonymizedData,
        deletedAt: new Date(),
      }
    });

    // 5. Anonimizar triagens relacionadas
    await prisma.triage.updateMany({
      where: { patientId: userId },
      data: {
        nome: '[ANONIMIZADO]',
        status: 'deleted',
        deletedAt: new Date()
      }
    });

    // 6. Anonimizar relatórios relacionados
    await prisma.report.updateMany({
      where: { patientId: userId },
      data: {
        status: 'deleted',
        deletedAt: new Date()
      }
    });

    // 7. Cancelar assinaturas ativas
    await prisma.subscription.updateMany({
      where: { userId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date()
      }
    });

    // 8. Anonimizar presentes relacionados (se habilitado)
    if (process.env.GIFT_ENABLED === '1') {
      const prismaAny = prisma as any;
      await prismaAny.gift.updateMany({
        where: { 
          OR: [
            { giverUserId: userId },
            { redeemedByUserId: userId }
          ]
        },
        data: {
          recipientName: '[ANONIMIZADO]',
          recipientEmail: '[ANONIMIZADO]',
          recipientWhats: '[ANONIMIZADO]',
          message: '[ANONIMIZADO]',
          status: 'cancelled'
        }
      });
    }

    // 9. Registrar ação de exclusão para auditoria
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'data_deletion',
        details: {
          originalDataHash,
          anonymizedAt: new Date(),
          reason: 'user_request'
        }
      }
    });

    console.log(`✅ Dados do usuário ${userId} anonimizados com sucesso`);
    return true;

  } catch (error) {
    console.error('❌ Erro ao excluir dados do usuário:', error);
    throw error;
  }
}

// Função para exportar dados do usuário (LGPD)
export async function exportUserData(userId: string): Promise<any> {
  try {
    const includeBase = {
      triages: true,
      subscriptions: true,
      reports: true
    } satisfies Prisma.PatientInclude;

    const include = { ...includeBase } as Prisma.PatientInclude & Record<string, any>;
    if (process.env.GIFT_ENABLED === "1") {
      include["gifts"] = true;
    }

    const userData = await prisma.patient.findUnique({
      where: { id: userId },
      include
    });

    if (!userData) {
      return null;
    }

    // Registrar exportação para auditoria
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'data_export',
        details: {
          exportedAt: new Date(),
          dataTypes: ['user', 'triages', 'subscriptions', 'gifts', 'reports']
        }
      }
    });

    return userData;
  } catch (error) {
    console.error('❌ Erro ao exportar dados do usuário:', error);
    throw error;
  }
}

// Função para verificar se usuário pode excluir dados
export async function canDeleteUserData(userId: string): Promise<boolean> {
  try {
    // Verificar se usuário tem assinaturas ativas
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        userId,
        status: 'active',
        activeUntil: { gt: new Date() }
      }
    });

    // Verificar se usuário tem presentes não resgatados (se habilitado)
    let unredeemedGifts = 0;
    if (process.env.GIFT_ENABLED === '1') {
      const prismaAny = prisma as any;
      unredeemedGifts = await prismaAny.gift.count({
        where: {
          giverUserId: userId,
          status: 'active',
          redeemedAt: null
        }
      });
    }

    // Permitir exclusão se não houver assinaturas ativas ou presentes não resgatados
    return activeSubscriptions === 0 && unredeemedGifts === 0;
  } catch (error) {
    console.error('❌ Erro ao verificar permissão de exclusão:', error);
    return false;
  }
}

// Função para enviar email de confirmação de exclusão
export async function sendDeletionConfirmationEmail(userId: string, email: string): Promise<void> {
  try {
    // Implementar envio de email de confirmação
    console.log(`📧 Enviando confirmação de exclusão para ${email}`);
    
    // Exemplo de implementação:
    // await sendEmail({
    //   to: email,
      //   subject: 'Confirmação de Exclusão de Dados - ZapFarm',
    //   template: 'data-deletion-confirmation',
    //   data: { userId }
    // });
  } catch (error) {
    console.error('❌ Erro ao enviar email de confirmação:', error);
    throw error;
  }
}

// Função para limpar dados antigos (retention policy)
export async function cleanupOldData(): Promise<void> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 2); // 2 anos

    // Limpar triagens antigas
    const deletedTriages = await prisma.triage.deleteMany({
      where: {
        created_at: { lt: cutoffDate },
        status: 'deleted'
      }
    });

    // Limpar relatórios antigos
    const deletedReports = await prisma.report.deleteMany({
      where: {
        created_at: { lt: cutoffDate },
        status: 'deleted'
      }
    });

    // Limpar logs de auditoria antigos
    const deletedAuditLogs = await prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    });

    console.log(`🧹 Limpeza de dados antigos concluída:`, {
      triages: deletedTriages.count,
      reports: deletedReports.count,
      auditLogs: deletedAuditLogs.count
    });
  } catch (error) {
    console.error('❌ Erro na limpeza de dados antigos:', error);
    throw error;
  }
}

// Função para validar consentimento LGPD
export async function validateConsent(userId: string, consentType: string): Promise<boolean> {
  try {
    const consent = await prisma.consent.findFirst({
      where: {
        userId,
        type: consentType,
        granted: true
      }
    });

    return !!consent;
  } catch (error) {
    console.error('❌ Erro ao validar consentimento:', error);
    return false;
  }
}

// Função para registrar consentimento
 
export async function recordConsent(
  userId: string, 
  consentType: string, 
  granted: boolean,
  // eslint-disable-next-line no-unused-vars
  _expiresAt?: Date
): Promise<void> {
  try {
    await prisma.consent.create({
      data: {
        userId,
        type: consentType,
        granted
      }
    });

    console.log(`✅ Consentimento ${consentType} registrado para usuário ${userId}: ${granted ? 'concedido' : 'negado'}`);
  } catch (error) {
    console.error('❌ Erro ao registrar consentimento:', error);
    throw error;
  }
}
