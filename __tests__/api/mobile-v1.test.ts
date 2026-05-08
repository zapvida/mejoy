/// <reference types="jest" />
/** @jest-environment node */

import { createMocks } from 'node-mocks-http';

import dashboardHandler from '@/pages/api/mobile/v1/dashboard';
import entitlementsHandler from '@/pages/api/mobile/v1/entitlements';
import weightLogsHandler from '@/pages/api/mobile/v1/programs/glp1/weight-logs';
import shareBundleHandler from '@/pages/api/mobile/v1/share-bundles/[bundleId]';
import { signShareBundleToken } from '@/lib/mobile/share-bundles';

jest.mock('@/lib/api/auth-helper', () => ({
  getUserEmailFromRequest: jest.fn(),
  getProfileFromRequest: jest.fn(),
}));

jest.mock('@/lib/mobile/service', () => ({
  buildMobileDashboard: jest.fn(),
  getEntitlementSnapshot: jest.fn(),
  resolveMobileActor: jest.fn(),
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
