export type DashboardSeverity = "info" | "success" | "warning" | "critical";

export type CustomerJourneyState =
  | "checkout_pending"
  | "payment_confirmed"
  | "rx_pending"
  | "handoff_pending"
  | "consult_in_progress"
  | "fulfillment"
  | "shipped"
  | "delivered"
  | "report_ready"
  | "action_required";

export type ClinicalHandoffState =
  | "not_started"
  | "created"
  | "opened"
  | "payment_pending"
  | "consult_in_progress"
  | "followup"
  | "completed"
  | "blocked";

export type OrderTimelineStatus = "done" | "current" | "upcoming" | "issue";

export interface DegradedReason {
  source: string;
  message: string;
  severity: Exclude<DashboardSeverity, "success">;
}

export interface DashboardPrimaryAction {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "support";
  note?: string;
}

export interface JourneyFaqItem {
  question: string;
  answer: string;
}

export interface OrderTimelineEvent {
  id: string;
  at: string | null;
  label: string;
  description: string;
  source: "order" | "report" | "clinical" | "system";
  status: OrderTimelineStatus;
}

export interface CustomerOrderSummary {
  id: string;
  type: "store_v2" | "protocol";
  label: string;
  status: string;
  amountCents: number;
  createdAt: string;
  paidAt?: string | null;
  trackingCode?: string | null;
  trackingUrl?: string | null;
  href?: string;
  supportHint?: string;
}

export interface CustomerReportSummary {
  id: string;
  triageId: string;
  triageSlug: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  summary: string | null;
  href?: string;
}

export interface CustomerNotification {
  id: string;
  level: DashboardSeverity;
  title: string;
  body: string;
  cta?: DashboardPrimaryAction;
}

export interface CustomerSupportCenter {
  whatsappUrl: string;
  email: string;
  recommendations: string[];
  accessResendAvailable: boolean;
}

export interface CustomerNextAction {
  eyebrow: string;
  title: string;
  body: string;
  eta?: string | null;
  cta: DashboardPrimaryAction | null;
}

export interface CustomerCareHighlight {
  id: string;
  title: string;
  body: string;
  tone: "neutral" | "success" | "warning";
  meta?: string;
  imageSrc?: string | null;
  cta?: DashboardPrimaryAction | null;
}

export interface CustomerRenewalCard {
  status: "inactive" | "watching" | "ready";
  title: string;
  body: string;
  note?: string;
  cta: DashboardPrimaryAction | null;
}

export interface CustomerRelatedProtocol {
  slug: string;
  title: string;
  badge: string;
  summary: string;
  href: string;
  imageSrc: string;
}

export interface CustomerProfileSummary {
  id: string;
  name: string | null;
  email: string | null;
  whatsapp: string | null;
  sex: string | null;
  birthDate: string | null;
  weightKg: number | null;
  heightCm: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CustomerJourneySummary {
  state: CustomerJourneyState;
  title: string;
  summary: string;
  trust: string;
  sla: string;
  primaryAction: DashboardPrimaryAction | null;
  faq: JourneyFaqItem[];
  supportRule: string;
}

export interface CustomerClinicalSummary {
  status: ClinicalHandoffState;
  latestHandoffId: string | null;
  lastUpdatedAt: string | null;
  prescriptionState?: "not_started" | "issued";
  medicationState?: "not_started" | "quoted" | "paid" | "in_transit" | "delivered";
  followupState?: "idle" | "required" | "active";
  nextBestAction?:
    | "book_consult"
    | "review_prescription"
    | "complete_checkout"
    | "track_delivery"
    | "start_treatment"
    | "schedule_followup"
    | "keep_followup";
  timeline: OrderTimelineEvent[];
}

export interface MeDashboardResponse {
  generatedAt: string;
  degraded: boolean;
  degradedReasons: DegradedReason[];
  profile: CustomerProfileSummary | null;
  journey: CustomerJourneySummary;
  nextAction: CustomerNextAction;
  careHighlights: CustomerCareHighlight[];
  renewalCard: CustomerRenewalCard;
  relatedProtocols: CustomerRelatedProtocol[];
  timeline: OrderTimelineEvent[];
  orders: {
    total: number;
    storeV2: CustomerOrderSummary[];
    protocol: CustomerOrderSummary[];
  };
  reports: {
    total: number;
    active: CustomerReportSummary[];
  };
  clinical: CustomerClinicalSummary;
  support: CustomerSupportCenter;
  notifications: CustomerNotification[];
}

export interface AdminAlert {
  id: string;
  level: DashboardSeverity;
  title: string;
  body: string;
  source: string;
  href?: string;
}

export interface AdminQueueItem {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  ageHours: number | null;
  href?: string;
  ctaLabel?: string;
  meta?: string;
}

export interface OperationalSla {
  id: string;
  label: string;
  current: number | null;
  threshold: number;
  unit: "minutes" | "hours" | "count";
  status: "healthy" | "warning" | "critical" | "unknown";
}

export interface AdminMetricValue {
  label: string;
  value: number | null;
  unit?: "count" | "brl" | "percent";
  detail?: string;
}

export interface AdminSeriesDatum {
  label: string;
  value: number;
}

export interface AdminBreakdownDatum {
  label: string;
  value: number;
  detail?: string;
}

export interface AdminTechnicalCheck {
  id: string;
  label: string;
  status: "healthy" | "warning" | "critical" | "unknown";
  detail: string;
  updatedAt?: string | null;
}

export interface AdminCustomerSnapshot {
  id: string;
  name: string;
  email: string;
  reference: string;
  latestStatus: string;
  updatedAt: string | null;
}

export interface AdminPaymentSyncHealth {
  healthy: boolean;
  pendingCount: number;
  unsyncedPaidCount: number;
  detail: string;
}

export interface AdminDashboardReleaseState {
  label: string;
  detail: string;
  severity: DashboardSeverity;
}

export interface AdminDashboardResponse {
  generatedAt: string;
  period: "today" | "7d" | "30d";
  degraded: boolean;
  degradedReasons: DegradedReason[];
  paymentSyncHealth: AdminPaymentSyncHealth;
  dashboardReleaseState: AdminDashboardReleaseState;
  reportFunnelAlerts: AdminAlert[];
  overview: AdminMetricValue[];
  operation: {
    stats: AdminMetricValue[];
    queues: {
      pendingPix: AdminQueueItem[];
      paidWithoutNextAction: AdminQueueItem[];
      rxPending: AdminQueueItem[];
      handoffsStuck: AdminQueueItem[];
      shipmentsAtRisk: AdminQueueItem[];
      supportRisk: AdminQueueItem[];
    };
    slas: OperationalSla[];
  };
  commercial: {
    metrics: AdminMetricValue[];
    revenueByProduct: AdminBreakdownDatum[];
    revenueBySource: AdminBreakdownDatum[];
    cohort: AdminSeriesDatum[];
  };
  clinical: {
    metrics: AdminMetricValue[];
    recentPatients: AdminCustomerSnapshot[];
  };
  technical: {
    buildSha: string | null;
    checks: AdminTechnicalCheck[];
  };
  alerts: AdminAlert[];
}
