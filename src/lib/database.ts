import { getPrisma } from "./prisma";

export class DatabaseService {
  // Pacientes
  static async createPatient(data: {
    name: string;
    email?: string;
    whatsapp?: string;
    birthdate?: Date;
    sex?: string;
    height_cm?: number;
    weight_kg?: number;
    imc?: number;
    sessionId?: string;
  }) {
    return getPrisma().patient.create({ data });
  }

  static async findPatientByEmail(email: string) {
    return getPrisma().patient.findUnique({ where: { email } });
  }

  static async findPatientBySessionId(sessionId: string) {
    return getPrisma().patient.findUnique({ where: { sessionId } });
  }

  static async findPatientById(id: string) {
    return getPrisma().patient.findUnique({ where: { id } });
  }

  static async updatePatient(id: string, data: any) {
    return getPrisma().patient.update({ where: { id }, data });
  }

  static async deletePatient(id: string) {
    return getPrisma().patient.update({ 
      where: { id }, 
      data: { deletedAt: new Date() } 
    });
  }

  // Triagens
  static async createTriage(data: {
    patientId: string;
    type: string;
    formData: any;
    status?: string;
  }) {
    return getPrisma().triage.create({ data });
  }

  static async updateTriage(id: string, data: any) {
    return getPrisma().triage.update({ where: { id }, data });
  }

  static async getTriagesByPatient(patientId: string) {
    return getPrisma().triage.findMany({
      where: { patientId },
      orderBy: { created_at: 'desc' }
    });
  }

  static async getTriageById(id: string) {
    return getPrisma().triage.findUnique({ where: { id } });
  }

  static async deleteTriage(id: string) {
    return getPrisma().triage.update({ 
      where: { id }, 
      data: { status: 'deleted' } 
    });
  }

  // Relatórios
  static async createReport(data: {
    patientId: string;
    triageId?: string;
    type: string;
    score?: number;
    scoreFuture?: number;
    summary?: any;
    plan?: any;
    rawFree?: string;
    rawPremium?: string;
    timeline?: any;
  }) {
    return getPrisma().report.create({ data });
  }

  static async getReportsByPatient(patientId: string) {
    return getPrisma().report.findMany({
      where: { patientId },
      orderBy: { created_at: 'desc' }
    });
  }

  static async getReportById(id: string) {
    return getPrisma().report.findUnique({ where: { id } });
  }

  static async updateReport(id: string, data: any) {
    return getPrisma().report.update({ where: { id }, data });
  }

  static async deleteReport(id: string) {
    return getPrisma().report.update({ 
      where: { id }, 
      data: { status: 'deleted' } 
    });
  }

  // Presentes
  static async createGift(data: {
    giverUserId: string;
    recipientName: string;
    recipientEmail?: string;
    recipientWhats?: string;
    message?: string;
    code: string;
    stripeSessionId?: string;
  }) {
    // TODO(backcompat-2025-10-23) - Proteger com GIFT_ENABLED
    if (process.env.GIFT_ENABLED !== '1') {
      throw new Error('Gift feature disabled');
    }
    const prismaAny = getPrisma() as any;
    return prismaAny.gift.create({ data });
  }

  static async findGiftByCode(code: string) {
    // TODO(backcompat-2025-10-23) - Proteger com GIFT_ENABLED
    if (process.env.GIFT_ENABLED !== '1') {
      throw new Error('Gift feature disabled');
    }
    const prismaAny = getPrisma() as any;
    return prismaAny.gift.findUnique({ where: { code } });
  }

  static async redeemGift(code: string, redeemedByUserId: string) {
    // TODO(backcompat-2025-10-23) - Proteger com GIFT_ENABLED
    if (process.env.GIFT_ENABLED !== '1') {
      throw new Error('Gift feature disabled');
    }
    const prismaAny = getPrisma() as any;
    return prismaAny.gift.update({
      where: { code },
      data: { 
        redeemedAt: new Date(),
        redeemedByUserId 
      }
    });
  }

  // Assinaturas
  static async createSubscription(data: {
    userId: string;
    kind: string;
    activeFrom: Date;
    activeUntil: Date;
    status: string;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
  }) {
    return getPrisma().subscription.create({ data });
  }

  static async getActiveSubscription(userId: string) {
    return getPrisma().subscription.findFirst({
      where: { 
        userId,
        status: 'active',
        activeUntil: { gt: new Date() }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  static async updateSubscription(id: string, data: any) {
    return getPrisma().subscription.update({ where: { id }, data });
  }

  // Métricas e Analytics
  static async getPatientCount() {
    return getPrisma().patient.count({
      where: { deletedAt: null }
    });
  }

  static async getTriageCount() {
    return getPrisma().triage.count({
      where: { status: { not: 'deleted' } }
    });
  }

  static async getReportCount() {
    return getPrisma().report.count({
      where: { status: { not: 'deleted' } }
    });
  }

  static async getRecentTriages(limit: number = 10) {
    return getPrisma().triage.findMany({
      where: { status: { not: 'deleted' } },
      include: { patient: true },
      orderBy: { created_at: 'desc' },
      take: limit
    });
  }
}
