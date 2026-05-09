/// <reference types="jest" />
/** @jest-environment node */

import { createMocks } from 'node-mocks-http';

import dashboardHandler from '@/pages/api/mobile/v1/dashboard';
import entitlementsHandler from '@/pages/api/mobile/v1/entitlements';
import healthScoreHandler from '@/pages/api/mobile/v1/health-score';
import preventionChecklistHandler from '@/pages/api/mobile/v1/prevention/checklist';
import weightLogsHandler from '@/pages/api/mobile/v1/programs/glp1/weight-logs';
import referralStatusHandler from '@/pages/api/mobile/v1/referral/status';
import shareBundleHandler from '@/pages/api/mobile/v1/share-bundles/[bundleId]';
import specialistChannelHandler from '@/pages/api/mobile/v1/specialist-channel/request';
import tiersHandler from '@/pages/api/mobile/v1/tiers';
import { signShareBundleToken } from '@/lib/mobile/share-bundles';

jest.mock('@/lib/api/auth-helper', () => ({
  getUserEmailFromRequest: jest.fn(),
  getProfileFromRequest: jest.fn(),
}));

jest.mock('@/lib/mobile/service', () => ({
  buildMobileDashboard: jest.fn(),
  getEntitlementSnapshot: jest.fn(),
  getHealthScore: jest.fn(),
  getPreventionChecklist: jest.fn(),
  getReferralStatus: jest.fn(),
  getTierDetails: jest.fn(),
  resolveMobileActor: jest.fn(),
  requestSpecialistChannel: jest.fn(),
  createWeightLog: jest.fn(),
  getStoredShareBundle: jest.fn(),
}));

const auth = jest.requireMock('@/lib/api/auth-helper');
const mobileService = jest.requireMock('@/lib/mobile/service');

describe('/api/mobile/v1 foundation routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the mobile dashboard payload', async () => {
    auth.getUserEmailFromRequest.mockResolvedValue('paciente@mejoy.com.br');
    auth.getProfileFromRequest.mockResolvedValue({ id: 'profile-1' });
    mobileService.buildMobileDashboard.mockResolvedValue({
      generatedAt: '2026-05-06T12:00:00.000Z',
      featureFlags: {
        dashboard: true,
        wearables: true,
        mealAi: true,
        sleep: true,
        meditation: true,
        clinicalShare: true,
        consultRequest: true,
        glp1Tracking: true,
        push: true,
      },
      profile: null,
      journey: {
        state: 'report_ready',
        title: 'Painel',
        summary: 'Resumo',
        primaryAction: null,
      },
      metrics: {
        bmi: null,
        currentWeightKg: null,
        lastWeightLoggedAt: null,
        weightTrend: 'unknown',
      },
      glp1: {
        programSlug: 'emagrecimento',
        currentDoseMg: null,
        dosePhase: null,
        adherenceScore: null,
        lastDoseAt: null,
        sideEffectFlags: [],
      },
      sleep: {
        latestDurationHours: null,
        consistencyScore: null,
        lastSyncedAt: null,
        coachingTip: 'Sincronize o wearable.',
      },
      orders: [],
      reports: [],
      notifications: [],
      exams: {
        totalDocuments: 0,
        lastUploadedAt: null,
        pendingChecklist: [],
      },
      care: {
        latestRequestId: null,
        latestRequestStatus: null,
        conciergeSlaHours: 12,
      },
    });

    const { req, res } = createMocks({ method: 'GET' });
    await dashboardHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().journey.title).toBe('Painel');
  });

  it('protects weight logging when no actor identity is available', async () => {
    auth.getUserEmailFromRequest.mockResolvedValue(null);
    auth.getProfileFromRequest.mockResolvedValue(null);
    mobileService.resolveMobileActor.mockResolvedValue({
      email: null,
      profile: null,
      actorId: null,
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: { weightKg: 92.3 },
    });
    await weightLogsHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData().error).toBe('AUTH_REQUIRED');
  });

  it('returns the mobile entitlement snapshot payload', async () => {
    auth.getUserEmailFromRequest.mockResolvedValue('paciente@mejoy.com.br');
    auth.getProfileFromRequest.mockResolvedValue({ id: 'profile-1' });
    mobileService.getEntitlementSnapshot.mockResolvedValue({
      generatedAt: '2026-05-08T12:00:00.000Z',
      accessLevel: 'full_app',
      activationState: 'care_active',
      protocolContext: {
        primaryProtocolSlug: 'emagrecimento',
        primaryProtocolTitle: 'Emagrecimento + saúde integral',
        careLane: 'glp1_integral',
        relatedProtocols: ['sono', 'ansiedade'],
      },
      recommendedModules: ['dashboard', 'journey', 'consult'],
      recommendedActions: [
        {
          label: 'Solicitar concierge clínico',
          href: '/consult-request',
          reason: 'Seu cenário atual pede revisão humana antes do próximo ajuste.',
        },
      ],
      planId: 'programa_6m',
      durationMonths: 6,
      unlockedFeatures: ['dashboard', 'journey', 'consult', 'prevention'],
      includedCare: ['concierge multidisciplinar'],
      specialistChannelEligible: true,
      deviceRewardEligible: true,
      productAppValue: {
        appIncluded: true,
        appTier: 'premium_full_access',
        headline: 'Ganhe acesso ao App MeJoy Premium em cada compra.',
        summary: 'Produto, protocolo e continuidade nativa no mesmo ecossistema.',
        featureMatrix: [],
      },
    });

    const { req, res } = createMocks({ method: 'GET' });
    await entitlementsHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().activationState).toBe('care_active');
    expect(res._getJSONData().protocolContext.primaryProtocolSlug).toBe('emagrecimento');
  });

  it('returns the health score payload', async () => {
    auth.getUserEmailFromRequest.mockResolvedValue('paciente@mejoy.com.br');
    auth.getProfileFromRequest.mockResolvedValue({ id: 'profile-1' });
    mobileService.getHealthScore.mockResolvedValue({
      overallScore: 78,
      pillars: [],
      trend: 'stable',
      delta24h: 2,
      nextBestActions: [],
      scoreDrivers: [],
    });

    const { req, res } = createMocks({ method: 'GET' });
    await healthScoreHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().overallScore).toBe(78);
  });

  it('returns the prevention checklist payload', async () => {
    auth.getUserEmailFromRequest.mockResolvedValue('paciente@mejoy.com.br');
    auth.getProfileFromRequest.mockResolvedValue({ id: 'profile-1' });
    mobileService.getPreventionChecklist.mockResolvedValue({
      generatedAt: '2026-05-09T12:00:00.000Z',
      ageBand: '40-49',
      sexAtBirth: 'female',
      riskFlags: ['sem_exames_recentes'],
      dueTasks: [],
      upcomingTasks: [],
      sharedDecisionTasks: [],
      sources: [],
    });

    const { req, res } = createMocks({ method: 'GET' });
    await preventionChecklistHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().ageBand).toBe('40-49');
  });

  it('returns the tier payload', async () => {
    auth.getUserEmailFromRequest.mockResolvedValue('paciente@mejoy.com.br');
    auth.getProfileFromRequest.mockResolvedValue({ id: 'profile-1' });
    mobileService.getTierDetails.mockResolvedValue({
      planId: 'programa_3m',
      durationMonths: 3,
      unlockedFeatures: ['dashboard', 'journey'],
      includedCare: ['concierge clínico'],
      deviceRewardEligible: false,
      specialistChannelEligible: false,
    });

    const { req, res } = createMocks({ method: 'GET' });
    await tiersHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().planId).toBe('programa_3m');
  });

  it('returns the referral payload', async () => {
    auth.getUserEmailFromRequest.mockResolvedValue('paciente@mejoy.com.br');
    auth.getProfileFromRequest.mockResolvedValue({ id: 'profile-1' });
    mobileService.getReferralStatus.mockResolvedValue({
      inviteCode: 'MEJOY-123456',
      qrCode: 'https://www.mejoy.com.br/indique?code=MEJOY-123456',
      invitesAccepted: 0,
      streak: 0,
      rewardProgress: 55,
      nextReward: 'Manter score acima de 80.',
    });

    const { req, res } = createMocks({ method: 'GET' });
    await referralStatusHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().rewardProgress).toBe(55);
  });

  it('submits specialist channel requests for authenticated actors', async () => {
    auth.getUserEmailFromRequest.mockResolvedValue('paciente@mejoy.com.br');
    auth.getProfileFromRequest.mockResolvedValue({ id: 'profile-1' });
    mobileService.resolveMobileActor.mockResolvedValue({
      email: 'paciente@mejoy.com.br',
      profile: { id: 'profile-1' },
      actorId: 'profile-1',
    });
    mobileService.requestSpecialistChannel.mockResolvedValue({
      id: 'specialist-1',
      status: 'queued_for_review',
      specialty: 'nutrologia',
      createdAt: '2026-05-09T12:00:00.000Z',
      slaHours: 24,
      nextStep: 'A equipe vai revisar contexto.',
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: { specialty: 'nutrologia', reason: 'Preciso de revisão personalizada.' },
    });
    await specialistChannelHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().specialty).toBe('nutrologia');
  });

  it('serves a signed share bundle payload', async () => {
    const bundleId = 'bundle-123';
    const token = signShareBundleToken({
      bundleId,
      exp: '2099-05-06T12:00:00.000Z',
    });

    mobileService.getStoredShareBundle.mockResolvedValue({
      id: bundleId,
      token,
      expiresAt: '2099-05-06T12:00:00.000Z',
      shareUrl: `https://www.mejoy.com.br/api/mobile/v1/share-bundles/${bundleId}?token=${token}`,
      bundle: {
        patient: {
          id: 'profile-1',
          name: 'Paciente',
          email: 'paciente@mejoy.com.br',
          whatsapp: null,
          sex: null,
          birthDate: null,
          weightKg: null,
          heightCm: null,
          bmi: null,
          createdAt: null,
          updatedAt: null,
        },
        journeyTitle: 'Jornada',
        summary: 'Resumo',
        recentReports: [],
        recentOrders: [],
        latestWeight: null,
        latestSleep: null,
        note: null,
      },
    });

    const { req, res } = createMocks({
      method: 'GET',
      query: { bundleId, token },
    });
    await shareBundleHandler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().id).toBe(bundleId);
  });
});
