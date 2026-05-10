import { prisma } from "@/lib/prisma";
import { hasSupabaseAdminConfig, supabaseAdmin } from "@/lib/supabaseAdmin";
import type {
  AdminAlert,
  AdminBreakdownDatum,
  AdminCustomerSnapshot,
  AdminDashboardResponse,
  AdminQueueItem,
  AdminSeriesDatum,
  AdminTechnicalCheck,
  ClinicalHandoffState,
  CustomerCareHighlight,
  CustomerJourneyState,
  CustomerNextAction,
  CustomerNotification,
  CustomerOrderSummary,
  CustomerProfileSummary,
  CustomerReportSummary,
  CustomerRelatedProtocol,
  CustomerRenewalCard,
  DashboardPrimaryAction,
  DashboardSeverity,
  DegradedReason,
  JourneyFaqItem,
  MeDashboardResponse,
  OperationalSla,
  OrderTimelineEvent,
} from "@/lib/dashboard/types";
import {
  deriveEcosystemJourneySignals,
  type DashboardEcosystemEvent,
} from "@/lib/dashboard/ecosystem-journey";
import {
  getRelatedProtocols,
  getSupportedProtocolBySlug,
} from "@/lib/emagrecimento/protocolCatalog";
import { EMAGRECIMENTO_DASHBOARD_ASSETS } from "@/lib/emagrecimento-lp-assets";
import { getScientificFactsForProfile } from "@/lib/emagrecimento/scientificFacts";

type DashboardPeriod = "today" | "7d" | "30d";

type HandoffEventRow = {
  id: string;
  handoff_id: string;
  status: string;
  triage_id: string | null;
  report_id: string | null;
  order_id: string | null;
  patient_id: string | null;
  program_slug: string | null;
  created_at: string;
  metadata?: Record<string, unknown> | null;
};

type EcosystemEventRow = {
  event_id: string;
  event_name: string;
  correlation_id: string;
  source_system: string | null;
  occurred_at: string;
  payload?: Record<string, unknown> | null;
};

const SUPPORT_EMAIL = process.env.EMAIL_REPLY_TO || "suporte@mejoy.com.br";
const SUPPORT_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_CTA || "https://wa.me/5511999999999";
const HIDDEN_VISIT_METRIC_REASON =
  "Métrica de visitas depende de analytics externo e não está validada neste ambiente.";
const TWENTY_ONE_DAYS_MS = 21 * 24 * 60 * 60 * 1000;

function pushReason(reasons: DegradedReason[], reason: DegradedReason) {
  if (
    reasons.some(
      (item) =>
        item.source === reason.source && item.message === reason.message,
    )
  ) {
    return;
  }
  reasons.push(reason);
}

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.toISOString();
}

function toNumber(value: unknown): number | null {
  if (value == null) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function hoursSince(value: Date | string | null | undefined): number | null {
  if (!value) return null;
  const at = new Date(value).getTime();
  if (Number.isNaN(at)) return null;
  return Math.round(((Date.now() - at) / (1000 * 60 * 60)) * 10) / 10;
}

function getPeriod(period: string | undefined): {
  period: DashboardPeriod;
  from: Date;
} {
  const normalized: DashboardPeriod =
    period === "today" || period === "7d" || period === "30d" ? period : "30d";
  const from = new Date();

  if (normalized === "today") {
    from.setHours(0, 0, 0, 0);
  } else if (normalized === "7d") {
    from.setDate(from.getDate() - 7);
  } else {
    from.setDate(from.getDate() - 30);
  }

  return { period: normalized, from };
}

function buildJourneyFaq(state: CustomerJourneyState): JourneyFaqItem[] {
  switch (state) {
    case "checkout_pending":
      return [
        {
          question: "Meu PIX ainda não compensou. E agora?",
          answer:
            "Normalmente a confirmação acontece em poucos minutos. Se passar do SLA exibido, fale com o suporte com o número do pedido.",
        },
        {
          question: "Posso perder o pedido?",
          answer:
            "Não. O pedido segue registrado e pode ser retomado ou validado pela equipe caso o pagamento tenha sido concluído fora do prazo.",
        },
      ];
    case "rx_pending":
      return [
        {
          question: "O que falta para liberar o pedido?",
          answer:
            "A validação clínica ou da receita precisa ser concluída. Assim que houver avanço, o painel e os emails serão atualizados.",
        },
        {
          question: "Preciso enviar algo?",
          answer:
            "Se faltar algum documento, o painel mostrará um CTA ou o suporte entrará em contato pelo canal cadastrado.",
        },
      ];
    case "handoff_pending":
    case "consult_in_progress":
      return [
        {
          question: "Qual é a próxima etapa clínica?",
          answer:
            "O handoff para o time clínico já foi iniciado. O painel acompanha abertura, pagamento clínico e conclusão da consulta.",
        },
        {
          question: "Quando devo chamar suporte?",
          answer:
            "Apenas se o SLA informado passar sem atualização. Antes disso, o acompanhamento está dentro do fluxo esperado.",
        },
      ];
    case "shipped":
    case "delivered":
    case "fulfillment":
      return [
        {
          question: "Como acompanho o envio?",
          answer:
            "Quando houver rastreio disponível, ele aparece no pedido e no email transacional.",
        },
        {
          question: "Meu pedido atrasou. O que faço?",
          answer:
            "Se o prazo informado passar sem atualização, use o link de suporte com o número do pedido para atendimento prioritário.",
        },
      ];
    case "report_ready":
      return [
        {
          question: "Onde vejo meus relatórios?",
          answer:
            "Os relatórios ativos ficam listados no painel e também na área de relatórios.",
        },
        {
          question: "Posso compartilhar com meu médico?",
          answer:
            "Sim. O relatório foi desenhado para orientar a próxima conversa clínica e pode ser usado como contexto de consulta.",
        },
      ];
    default:
      return [
        {
          question: "Como acesso minha jornada?",
          answer:
            "Use este painel como fonte única de verdade para compras, relatórios, clínica e próximos passos.",
        },
        {
          question: "Quando o suporte é necessário?",
          answer:
            "Somente quando houver alerta operacional, atraso além do SLA ou ação explícita pedida no painel.",
        },
      ];
  }
}

function buildJourneySummary(params: {
  state: CustomerJourneyState;
  primaryAction: DashboardPrimaryAction | null;
  latestStoreOrder: CustomerOrderSummary | null;
  latestReport: CustomerReportSummary | null;
  latestClinicalStatus: ClinicalHandoffState;
  profileMissing: boolean;
}): {
  title: string;
  summary: string;
  trust: string;
  sla: string;
  supportRule: string;
} {
  switch (params.state) {
    case "checkout_pending":
      return {
        title: "Pagamento aguardando confirmação",
        summary: `Seu pedido ${params.latestStoreOrder ? `#${params.latestStoreOrder.id.slice(-8).toUpperCase()}` : ""} já foi criado e está aguardando compensação.`,
        trust:
          "O painel será atualizado automaticamente assim que o webhook de pagamento confirmar o PIX.",
        sla: "SLA normal: até 10 minutos após o pagamento.",
        supportRule:
          "Acione suporte apenas se o status não mudar após o SLA informado.",
      };
    case "payment_confirmed":
      return {
        title: "Pagamento confirmado",
        summary:
          "Recebemos sua confirmação de compra e o fluxo operacional foi iniciado.",
        trust:
          "Não é necessário abrir chamado enquanto o pedido estiver avançando dentro do SLA.",
        sla: "SLA normal: próxima atualização em até 1 dia útil.",
        supportRule:
          "Abra suporte se não houver qualquer próxima etapa após 1 dia útil.",
      };
    case "rx_pending":
      return {
        title: "Validação clínica em andamento",
        summary:
          "O pedido depende de revisão clínica antes de seguir para a próxima etapa.",
        trust:
          "Esse tipo de pausa é esperada quando a jornada exige receita ou conferência adicional.",
        sla: "SLA normal: até 1 dia útil para retorno inicial.",
        supportRule:
          "Acione suporte somente se houver pedido de documento sem orientação clara.",
      };
    case "handoff_pending":
      return {
        title: "Time clínico recebeu sua jornada",
        summary:
          "Seu handoff MeJoy → ZapVida foi iniciado e estamos acompanhando cada milestone clínica.",
        trust:
          "Você será atualizado no painel conforme abertura, pagamento clínico e evolução do atendimento.",
        sla: "SLA normal: atualização clínica em até 1 dia útil.",
        supportRule:
          "Acione suporte apenas se o handoff ficar parado além do SLA.",
      };
    case "consult_in_progress":
      return {
        title: "Consulta ou acompanhamento clínico em curso",
        summary:
          "Sua jornada clínica está ativa e o próximo avanço depende da equipe assistencial.",
        trust:
          "O painel reflete eventos reais do fluxo clínico, sem estados simulados.",
        sla: "SLA normal: resposta clínica conforme agenda e confirmação do time.",
        supportRule:
          "Não abra chamado se a consulta já estiver em andamento, salvo urgência operacional.",
      };
    case "fulfillment":
      return {
        title: "Pedido em preparação",
        summary:
          "Seu pedido pago já está com o time operacional para separação, manipulação ou despacho.",
        trust:
          "Assim que houver rastreio ou mudança de status, o painel e os emails serão atualizados.",
        sla: "SLA normal: envio em até 2 dias úteis.",
        supportRule:
          "Suporte só é necessário se o pedido ultrapassar o prazo sem qualquer atualização.",
      };
    case "shipped":
      return {
        title: "Pedido enviado",
        summary:
          "Seu pedido saiu para entrega e agora o foco é acompanhar o rastreamento.",
        trust:
          "O rastreio exibido aqui é a referência oficial do status logístico.",
        sla: "SLA normal: entrega conforme a transportadora e região.",
        supportRule:
          "Fale com suporte apenas em caso de atraso além da previsão informada.",
      };
    case "delivered":
      return {
        title: "Pedido entregue",
        summary:
          "A entrega foi concluída e sua jornada segue disponível para acompanhamento e suporte pós-compra.",
        trust:
          "Se algo vier divergente, use o canal contextual deste painel com o número do pedido.",
        sla: "SLA normal: suporte pós-entrega em horário comercial.",
        supportRule:
          "Acione suporte se houver divergência de item, entrega ou acesso.",
      };
    case "report_ready":
      return {
        title: "Relatório pronto para revisão",
        summary: `Seu relatório ${params.latestReport ? `de ${params.latestReport.triageSlug}` : ""} já está disponível para consulta.`,
        trust:
          "Use esse relatório como referência prática para próximos passos e eventual conversa clínica.",
        sla: "SLA normal: acesso imediato ao conteúdo disponível.",
        supportRule:
          "Acione suporte se o relatório não abrir ou estiver incompleto.",
      };
    case "action_required":
    default:
      return {
        title: params.profileMissing
          ? "Acesso precisa ser vinculado"
          : "Há uma ação pendente para continuar",
        summary: params.profileMissing
          ? "Identificamos sua sessão, mas ainda falta vincular o perfil operacional para liberar a jornada completa."
          : "Encontramos uma situação que precisa de conferência antes de seguir com total segurança.",
        trust:
          "O painel está mostrando o problema de forma explícita para evitar silêncio operacional.",
        sla: "SLA normal: resposta do suporte em horário comercial.",
        supportRule:
          "Use o suporte contextual com o máximo de detalhes para aceleração do atendimento.",
      };
  }
}

function mapClinicalState(
  status: string | null | undefined,
): ClinicalHandoffState {
  switch (status) {
    case "created":
    case "sent":
      return "created";
    case "opened":
    case "accepted":
      return "opened";
    case "clinical_payment_started":
    case "clinical_payment_success":
    case "prescription_created":
    case "quote_created":
      return "payment_pending";
    case "consult_started":
      return "consult_in_progress";
    case "followup_started":
    case "retention_started":
      return "followup";
    case "completed":
    case "consult_completed":
    case "order_paid":
    case "pharmacy_order_created":
    case "order_delivered":
      return "completed";
    case "failed":
    case "expired":
    case "cancelled":
    case "rejected":
      return "blocked";
    default:
      return "not_started";
  }
}

function mapHandoffLabel(status: string): string {
  const labels: Record<string, string> = {
    created: "Handoff criado",
    sent: "Handoff enviado",
    opened: "Handoff aberto",
    accepted: "Handoff aceito",
    consult_started: "Consulta iniciada",
    consult_completed: "Consulta concluída",
    clinical_payment_started: "Pagamento clínico iniciado",
    clinical_payment_success: "Pagamento clínico confirmado",
    pharmacy_order_started: "Pedido clínico iniciado",
    pharmacy_order_created: "Pedido clínico criado",
    order_delivered: "Entrega concluída",
    followup_started: "Follow-up iniciado",
    completed: "Fluxo concluído",
    failed: "Falha operacional",
    expired: "Handoff expirado",
    rejected: "Handoff rejeitado",
  };

  return labels[status] || status;
}

function mapEcosystemEventLabel(eventName: string): string {
  const labels: Record<string, string> = {
    "clinical.consult.completed": "Consulta concluída",
    "prescription.created": "Prescrição criada",
    "prescription.signed": "Prescrição assinada",
    "quote.created": "Cotação criada",
    "payment.confirmed": "Pagamento confirmado",
    "order.in_transit": "Pedido em rota",
    "order.delivered": "Entrega concluída",
    "program.purchased": "Programa ativado",
    "program.task.unlocked": "Tarefa liberada",
    "program.followup.required": "Follow-up necessário",
  };

  return labels[eventName] || eventName;
}

function mapEcosystemEventDescription(event: EcosystemEventRow): string {
  const sourceLabel = event.source_system || "ecossistema";

  switch (event.event_name) {
    case "clinical.consult.completed":
      return `A consulta foi concluída e o contexto clínico voltou para o painel a partir de ${sourceLabel}.`;
    case "prescription.created":
    case "prescription.signed":
      return `A prescrição já está disponível e pode seguir para compra ou continuidade sem perder contexto.`;
    case "quote.created":
      return `O fluxo farmacêutico já produziu uma cotação vinculada à mesma jornada.`;
    case "payment.confirmed":
      return `O pagamento foi confirmado e a etapa operacional já pode avançar.`;
    case "order.in_transit":
      return `O medicamento já está em rota de entrega com atualização operacional do ecossistema.`;
    case "order.delivered":
      return `A entrega foi concluída e a jornada entra em fase de adesão e acompanhamento.`;
    case "program.purchased":
      return `O programa foi ativado e já pode destravar próximos passos de cuidado.`;
    case "program.task.unlocked":
      return `Uma nova tarefa do programa foi liberada com base no estado real da jornada.`;
    case "program.followup.required":
      return `A jornada identificou necessidade de retorno para manter continuidade e resultado.`;
    default:
      return `Evento ${event.event_name} recebido de ${sourceLabel}.`;
  }
}

function extractCorrelationIdsFromHandoffEvents(
  handoffEvents: HandoffEventRow[],
  storeOrderSummaries: CustomerOrderSummary[],
): string[] {
  const values = new Set<string>();

  for (const event of handoffEvents) {
    const metadata = event.metadata || {};
    const candidates = [
      typeof metadata.correlation_id === "string"
        ? metadata.correlation_id
        : null,
      typeof metadata.correlationId === "string" ? metadata.correlationId : null,
      event.order_id,
      event.handoff_id,
    ];

    for (const candidate of candidates) {
      if (typeof candidate !== "string") continue;
      const normalized = candidate.trim();
      if (normalized) {
        values.add(normalized);
      }
    }
  }

  for (const order of storeOrderSummaries) {
    const normalized = order.id.trim();
    if (normalized) {
      values.add(normalized);
    }
  }

  return Array.from(values);
}

function normalizeProfile(profile: any): CustomerProfileSummary {
  return {
    id: profile.id,
    name: profile.name ?? null,
    email: profile.email ?? null,
    whatsapp: profile.whatsapp ?? null,
    sex: profile.sex ?? null,
    birthDate: toIso(profile.birth_date),
    weightKg: toNumber(profile.weight_kg),
    heightCm: toNumber(profile.height_cm),
    createdAt: toIso(profile.created_at),
    updatedAt: toIso(profile.updated_at),
  };
}

async function getHandoffEventsForCustomer(params: {
  profileId?: string | null;
  triageIds: string[];
  reportIds: string[];
  orderIds: string[];
  degradedReasons: DegradedReason[];
}): Promise<HandoffEventRow[]> {
  if (!hasSupabaseAdminConfig) {
    pushReason(params.degradedReasons, {
      source: "clinical",
      message:
        "Supabase administrativo não está configurado para ler o histórico clínico.",
      severity: "warning",
    });
    return [];
  }

  const queries: Array<any> = [];

  if (params.profileId) {
    queries.push(
      supabaseAdmin
        .from("handoff_events")
        .select(
          "id,handoff_id,status,triage_id,report_id,order_id,patient_id,program_slug,created_at,metadata",
        )
        .eq("patient_id", params.profileId)
        .order("created_at", { ascending: false })
        .limit(50),
    );
  }

  if (params.triageIds.length > 0) {
    queries.push(
      supabaseAdmin
        .from("handoff_events")
        .select(
          "id,handoff_id,status,triage_id,report_id,order_id,patient_id,program_slug,created_at,metadata",
        )
        .in("triage_id", params.triageIds.slice(0, 50))
        .order("created_at", { ascending: false })
        .limit(100),
    );
  }

  if (params.reportIds.length > 0) {
    queries.push(
      supabaseAdmin
        .from("handoff_events")
        .select(
          "id,handoff_id,status,triage_id,report_id,order_id,patient_id,program_slug,created_at,metadata",
        )
        .in("report_id", params.reportIds.slice(0, 50))
        .order("created_at", { ascending: false })
        .limit(100),
    );
  }

  if (params.orderIds.length > 0) {
    queries.push(
      supabaseAdmin
        .from("handoff_events")
        .select(
          "id,handoff_id,status,triage_id,report_id,order_id,patient_id,program_slug,created_at,metadata",
        )
        .in("order_id", params.orderIds.slice(0, 50))
        .order("created_at", { ascending: false })
        .limit(100),
    );
  }

  if (queries.length === 0) {
    return [];
  }

  const results = await Promise.all(queries);
  const rows: HandoffEventRow[] = [];

  for (const result of results) {
    if (result.error) {
      pushReason(params.degradedReasons, {
        source: "clinical",
        message: `Não foi possível consolidar o handoff clínico: ${result.error.message || "erro desconhecido"}.`,
        severity: "warning",
      });
      continue;
    }
    rows.push(...((result.data || []) as HandoffEventRow[]));
  }

  const deduped = Array.from(
    new Map(rows.map((row) => [row.id, row])).values(),
  );
  deduped.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  return deduped;
}

async function getEcosystemEventsForCustomer(params: {
  correlationIds: string[];
  degradedReasons: DegradedReason[];
}): Promise<EcosystemEventRow[]> {
  if (!hasSupabaseAdminConfig || params.correlationIds.length === 0) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("ecosystem_events")
    .select("event_id,event_name,correlation_id,source_system,occurred_at,payload")
    .in("correlation_id", params.correlationIds.slice(0, 50))
    .order("occurred_at", { ascending: false })
    .limit(200);

  if (error) {
    pushReason(params.degradedReasons, {
      source: "ecosystem",
      message: `Falha ao buscar eventos canônicos do ecossistema: ${error.message}`,
      severity: "warning",
    });
    return [];
  }

  return (data || []) as EcosystemEventRow[];
}

function orderSupportHref(orderId: string | null | undefined): string {
  if (!orderId) return "/dashboard#support";
  return `/pedidos/${orderId}`;
}

function deriveSeedProtocolSlug(params: {
  latestReport: CustomerReportSummary | null;
  latestProtocolOrder: CustomerOrderSummary | null;
  triageSessions: Array<any>;
}) {
  const latestSessionSlug = params.triageSessions[0]?.triage_slug;
  const reportSlug = params.latestReport?.triageSlug;
  const protocolSlug =
    params.latestProtocolOrder?.label?.split(" • ")[0] || null;

  if (getSupportedProtocolBySlug(latestSessionSlug)) return latestSessionSlug;
  if (getSupportedProtocolBySlug(reportSlug)) return reportSlug;
  if (getSupportedProtocolBySlug(protocolSlug)) return protocolSlug;
  return "emagrecimento";
}

function buildNextActionCard(params: {
  state: CustomerJourneyState;
  primaryAction: DashboardPrimaryAction | null;
  latestOrder: CustomerOrderSummary | null;
  latestReport: CustomerReportSummary | null;
  latestClinicalStatus: ClinicalHandoffState;
  ecosystemSignals?: ReturnType<typeof deriveEcosystemJourneySignals>;
}): CustomerNextAction {
  if (params.ecosystemSignals?.followupState === "required") {
    return {
      eyebrow: "Follow-up necessário",
      title: "Agendar seu próximo acompanhamento",
      body: "A jornada já sinalizou necessidade de retorno. O próximo ganho de resultado vem de follow-up, ajuste e continuidade clínica.",
      eta: "Priorize hoje",
      cta:
        params.primaryAction || {
          label: "Ver jornada clínica",
          href: "/dashboard#clinical",
          variant: "primary",
        },
    };
  }

  if (
    params.ecosystemSignals?.prescriptionState === "issued" &&
    params.ecosystemSignals.medicationState !== "paid" &&
    params.ecosystemSignals.medicationState !== "in_transit" &&
    params.ecosystemSignals.medicationState !== "delivered"
  ) {
    return {
      eyebrow: "Prescrição disponível",
      title: "Converter a prescrição em compra ou continuidade",
      body: "Sua prescrição já foi emitida. Agora o foco é sair da clínica com o próximo passo resolvido, sem perder o contexto do tratamento.",
      eta: "Ação recomendada agora",
      cta:
        params.primaryAction || {
          label: "Ver jornada clínica",
          href: "/dashboard#clinical",
          variant: "primary",
        },
    };
  }

  if (params.ecosystemSignals?.medicationState === "in_transit") {
    return {
      eyebrow: "Pedido em rota",
      title: "Acompanhar entrega e preparar o início do tratamento",
      body: "Seu medicamento já está a caminho. O melhor próximo passo é acompanhar a entrega e deixar o plano pronto para começar sem atraso.",
      eta: "Conforme transportadora",
      cta:
        params.primaryAction || {
          label: "Ver pedido",
          href: "/dashboard#orders",
          variant: "primary",
        },
    };
  }

  if (params.ecosystemSignals?.medicationState === "delivered") {
    return {
      eyebrow: "Pós-entrega",
      title: "Iniciar tratamento e manter adesão alta",
      body: "A entrega já aconteceu. Agora o ganho vem de começar direito, acompanhar sinais de tolerância e não quebrar a continuidade da jornada.",
      eta: "Hoje",
      cta:
        params.primaryAction || {
          label: "Ver suporte",
          href: "/dashboard#support",
          variant: "secondary",
        },
    };
  }

  switch (params.state) {
    case "checkout_pending":
      return {
        eyebrow: "Próxima ação",
        title: "Acompanhar a compensação do pagamento",
        body: "O pedido já existe. O painel atualiza sozinho assim que o PIX ou o cartão forem confirmados no Asaas.",
        eta: "Normalmente em minutos",
        cta: params.primaryAction,
      };
    case "payment_confirmed":
    case "fulfillment":
      return {
        eyebrow: "Próxima ação",
        title: "Aguardar o avanço operacional do pedido",
        body: "Pagamento confirmado e jornada operacional iniciada. Não é necessário abrir suporte enquanto o pedido estiver dentro do SLA informado.",
        eta: "Próxima atualização em até 1 dia útil",
        cta: params.primaryAction,
      };
    case "handoff_pending":
    case "consult_in_progress":
      return {
        eyebrow: "Acompanhamento clínico",
        title: "Seguir a jornada clínica sem perder contexto",
        body:
          params.latestClinicalStatus === "consult_in_progress"
            ? "Seu fluxo clínico está ativo. O painel mostra cada milestone confirmada, sem estados simulados."
            : "Seu handoff foi enviado para a etapa clínica. O próximo avanço depende da abertura ou evolução da consulta.",
        eta: "Atualização clínica em até 1 dia útil",
        cta: params.primaryAction,
      };
    case "report_ready":
      return {
        eyebrow: "Próxima ação",
        title: "Revisar o relatório e decidir o próximo passo",
        body: "Seu relatório já organiza o quadro atual, os sinais de risco e os caminhos possíveis para continuar.",
        eta: "Acesso imediato",
        cta: params.primaryAction,
      };
    case "shipped":
    case "delivered":
      return {
        eyebrow: "Próxima ação",
        title: "Acompanhar entrega, adesão e continuidade",
        body: "Com o pedido enviado ou entregue, o foco do painel passa a ser uso correto, suporte e renovação sem atrito.",
        eta:
          params.state === "shipped"
            ? "Entrega conforme transportadora"
            : "Pós-entrega imediato",
        cta: params.primaryAction,
      };
    default:
      return {
        eyebrow: "Próxima ação",
        title: params.latestReport
          ? "Revisar seu último relatório"
          : "Atualizar o perfil e liberar a jornada",
        body: params.latestReport
          ? `Seu último relatório ${params.latestReport.triageSlug} continua sendo a melhor referência para decidir a próxima compra ou retorno clínico.`
          : "Com o perfil operacional correto, o painel passa a conectar compra, relatório, clínica e suporte no mesmo lugar.",
        eta: null,
        cta: params.primaryAction,
      };
  }
}

function buildCareHighlights(params: {
  profile: CustomerProfileSummary | null;
  answers: Record<string, any>;
  seedProtocolSlug: string;
  state: CustomerJourneyState;
  latestReport: CustomerReportSummary | null;
  latestOrder: CustomerOrderSummary | null;
}): CustomerCareHighlight[] {
  const comorbidades = Array.isArray(params.answers.comorbidades)
    ? params.answers.comorbidades.filter((item: string) => item !== "nenhuma")
    : [];
  const scientificFact = getScientificFactsForProfile(
    {
      age: params.profile?.birthDate
        ? Math.max(
            18,
            new Date().getFullYear() -
              new Date(params.profile.birthDate).getFullYear(),
          )
        : undefined,
      sex: params.profile?.sex || undefined,
    },
    comorbidades,
    1,
    params.seedProtocolSlug,
  )[0];

  const metabolicTitle =
    params.profile?.weightKg && params.profile?.heightCm
      ? `${params.profile.weightKg} kg registrados no perfil`
      : "Seu ponto de partida já está organizado";
  const metabolicBody =
    params.profile?.weightKg && params.profile?.heightCm
      ? `Altura ${params.profile.heightCm} cm. Esse ponto de partida ajuda a interpretar risco metabólico, expectativa realista de perda de peso e evolução do tratamento.`
      : "Triagem, dados básicos e histórico ficam conectados para evitar que a próxima etapa comece sem contexto.";

  const continuityBody =
    params.state === "delivered" || params.state === "shipped"
      ? "A fase agora é transformar compra em adesão: uso correto, sinais de tolerância, rotina e renovação sem atrito."
      : params.state === "consult_in_progress" ||
          params.state === "handoff_pending"
        ? "Enquanto a jornada clínica avança, o painel continua sendo a referência única para contexto, SLA e próximos marcos."
        : "Pagamento, relatório, consulta e suporte foram pensados para acontecer na mesma narrativa, com menos atrito para o paciente.";

  return [
    {
      id: "metabolic-baseline",
      title: metabolicTitle,
      body: metabolicBody,
      tone: "neutral",
      meta: params.latestReport
        ? `Último relatório: ${params.latestReport.triageSlug}`
        : "Sem relatório ativo no momento",
      imageSrc: EMAGRECIMENTO_DASHBOARD_ASSETS.metabolicResults,
    },
    {
      id: "continuity-loop",
      title: "Acompanhamento premium, não só confirmação de pedido",
      body: continuityBody,
      tone: params.state === "action_required" ? "warning" : "success",
      meta: params.latestOrder
        ? `Pedido mais recente: ${params.latestOrder.status}`
        : "Sem pedido vinculado",
      imageSrc: EMAGRECIMENTO_DASHBOARD_ASSETS.journeyAcompanhamento,
    },
    {
      id: "habit-accelerator",
      title:
        scientificFact?.title || "Hábitos pequenos ainda decidem o resultado",
      body:
        scientificFact?.description ||
        "Sono, consistência alimentar e movimento regular costumam ser os três pilares que mais protegem o resultado ao longo de meses.",
      tone: "neutral",
      meta: "Conteúdo factual para sustentar adesão",
      imageSrc: EMAGRECIMENTO_DASHBOARD_ASSETS.metabolicHabits,
    },
  ];
}

function buildRenewalCard(params: {
  state: CustomerJourneyState;
  latestStoreOrder: CustomerOrderSummary | null;
}): CustomerRenewalCard {
  const paidAt =
    params.latestStoreOrder?.paidAt ||
    params.latestStoreOrder?.createdAt ||
    null;
  const eligibleForRenewal =
    Boolean(paidAt) &&
    new Date(paidAt).getTime() <= Date.now() - TWENTY_ONE_DAYS_MS;

  if (!params.latestStoreOrder) {
    return {
      status: "inactive",
      title: "A renovação aparece quando houver uma jornada ativa",
      body: "Assim que um pedido confirmado entrar no painel, a MeJoy organiza continuidade, suporte e timing de refil no mesmo lugar.",
      note: "Sem renovação aberta no momento.",
      cta: {
        label: "Ver protocolos",
        href: "/protocolos",
        variant: "secondary",
      },
    };
  }

  if (eligibleForRenewal || params.state === "delivered") {
    return {
      status: "ready",
      title: "Janela de renovação em observação",
      body: "Se o tratamento estiver funcionando e a jornada clínica permitir, vale antecipar a conversa sobre continuidade para não perder ritmo.",
      note: "Use o suporte oficial se precisar revisar refil, retorno ou ajuste de protocolo.",
      cta: {
        label: "Falar com suporte oficial",
        href: `${SUPPORT_WHATSAPP}?text=${encodeURIComponent("Olá! Quero revisar continuidade, renovação ou refil da minha jornada MeJoy.")}`,
        variant: "support",
      },
    };
  }

  return {
    status: "watching",
    title: "Renovação preparada para entrar sem fricção",
    body: "Ainda é cedo para uma nova janela de refil, mas o painel já organiza pedido, suporte e continuidade para evitar lacunas na jornada.",
    note: "Quando a janela abrir, a recomendação aparece aqui primeiro.",
    cta: {
      label: "Ver suporte",
      href: "/dashboard#support",
      variant: "secondary",
    },
  };
}

function buildRelatedProtocolCards(
  seedProtocolSlug: string,
): CustomerRelatedProtocol[] {
  return getRelatedProtocols(seedProtocolSlug, 4).map((item) => ({
    slug: item.slug,
    title: item.title,
    badge: item.badge,
    summary: item.summary,
    href: `/triagem/${item.slug}`,
    imageSrc: item.imageSrc,
  }));
}

export async function buildMeDashboard(params: {
  email: string | null;
  profile?: any | null;
}): Promise<MeDashboardResponse> {
  const degradedReasons: DegradedReason[] = [];
  const normalizedEmail = params.email?.trim().toLowerCase() || null;

  let profile = params.profile ? normalizeProfile(params.profile) : null;

  if (!profile && normalizedEmail) {
    try {
      const fallbackProfile = await prisma.profile.findFirst({
        where: { email: { equals: normalizedEmail, mode: "insensitive" } },
      });
      if (fallbackProfile) {
        profile = normalizeProfile(fallbackProfile);
      }
    } catch (error) {
      pushReason(degradedReasons, {
        source: "profile",
        message: `Falha ao buscar perfil operacional: ${(error as Error).message}`,
        severity: "critical",
      });
    }
  }

  if (!profile) {
    pushReason(degradedReasons, {
      source: "profile",
      message:
        "Perfil operacional não encontrado para esta conta. O painel seguirá em modo assistido.",
      severity: "critical",
    });
  }

  let triageSessions: Array<any> = [];
  if (profile?.id) {
    try {
      triageSessions = await prisma.triageSession.findMany({
        where: { profile_id: profile.id },
        include: {
          reports: {
            orderBy: { created_at: "desc" },
          },
        },
        orderBy: { created_at: "desc" },
        take: 20,
      });
    } catch (error) {
      pushReason(degradedReasons, {
        source: "reports",
        message: `Não foi possível carregar triagens e relatórios: ${(error as Error).message}`,
        severity: "warning",
      });
    }
  }

  const ordersWhere = {
    OR: [
      ...(profile?.id ? [{ profileId: profile.id }] : []),
      ...(normalizedEmail ? [{ customerEmail: normalizedEmail }] : []),
    ],
  };

  let protocolOrders: Array<any> = [];
  let storeOrders: Array<any> = [];

  if (ordersWhere.OR.length > 0) {
    try {
      [protocolOrders, storeOrders] = await Promise.all([
        prisma.zapfarmOrder.findMany({
          where: ordersWhere,
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
        prisma.order.findMany({
          where: ordersWhere,
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
      ]);
    } catch (error) {
      pushReason(degradedReasons, {
        source: "orders",
        message: `Não foi possível consolidar pedidos: ${(error as Error).message}`,
        severity: "warning",
      });
    }
  }

  const reportSummaries: CustomerReportSummary[] = triageSessions.flatMap(
    (session) => {
      const reports = Array.isArray(session.reports) ? session.reports : [];

      if (reports.length === 0) {
        return [
          {
            id: `pending-${session.triage_id}`,
            triageId: session.triage_id,
            triageSlug: session.triage_slug,
            status: session.completed_at ? "pending" : "in_progress",
            createdAt: toIso(session.created_at) || new Date().toISOString(),
            completedAt: toIso(session.completed_at),
            summary: null,
            href: "/relatorios",
          },
        ];
      }

      return reports.map((report: any) => ({
        id: report.id,
        triageId: session.triage_id,
        triageSlug: session.triage_slug,
        status: report.status,
        createdAt: toIso(session.created_at) || new Date().toISOString(),
        completedAt: toIso(report.created_at || session.completed_at),
        summary: report.summary ?? null,
        href: "/relatorios",
      }));
    },
  );

  const protocolOrderSummaries: CustomerOrderSummary[] = protocolOrders.map(
    (order) => ({
      id: order.id,
      type: "protocol",
      label: `${order.productSlug} • ${order.planSlug}`,
      status: order.status,
      amountCents: order.amount,
      createdAt: order.createdAt.toISOString(),
      paidAt: toIso(order.paidAt),
      supportHint:
        "Pedido de protocolo confirmado e vinculado ao mesmo painel.",
    }),
  );

  const storeOrderSummaries: CustomerOrderSummary[] = storeOrders.map(
    (order) => ({
      id: order.id,
      type: "store_v2",
      label: `Pedido #${order.id.slice(-8).toUpperCase()}`,
      status: order.status,
      amountCents: order.totalCents,
      createdAt: order.createdAt.toISOString(),
      paidAt: order.status === "PAID" ? order.updatedAt.toISOString() : null,
      trackingCode: order.trackingCode,
      trackingUrl: order.trackingUrl,
      href: orderSupportHref(order.id),
      supportHint:
        order.status === "PENDING_PAYMENT"
          ? "Acompanhe a confirmação do pagamento neste painel."
          : "Use este pedido como referência única para envio e pós-compra.",
    }),
  );

  const handoffEvents = await getHandoffEventsForCustomer({
    profileId: profile?.id,
    triageIds: triageSessions.map((session) => session.triage_id),
    reportIds: reportSummaries
      .filter((report) => !report.id.startsWith("pending-"))
      .map((report) => report.id),
    orderIds: storeOrderSummaries.map((order) => order.id),
    degradedReasons,
  });

  const latestStoreOrder = storeOrderSummaries[0] || null;
  const latestProtocolOrder = protocolOrderSummaries[0] || null;
  const latestReport = reportSummaries[0] || null;
  const latestHandoff = handoffEvents[0] || null;
  const correlationIds = extractCorrelationIdsFromHandoffEvents(
    handoffEvents,
    storeOrderSummaries,
  );
  const ecosystemEvents = await getEcosystemEventsForCustomer({
    correlationIds,
    degradedReasons,
  });
  const dashboardEcosystemEvents: DashboardEcosystemEvent[] = ecosystemEvents.map(
    (event) => ({
      eventName: event.event_name,
      occurredAt: event.occurred_at,
      sourceSystem: event.source_system,
      payload: event.payload ?? null,
    }),
  );
  const ecosystemSignals =
    dashboardEcosystemEvents.length > 0
      ? deriveEcosystemJourneySignals(dashboardEcosystemEvents)
      : null;
  const latestClinicalStatus =
    ecosystemSignals?.clinicalStatusOverride ??
    mapClinicalState(latestHandoff?.status);
  const latestAnswers = (triageSessions[0]?.answers || {}) as Record<
    string,
    any
  >;
  const seedProtocolSlug = deriveSeedProtocolSlug({
    latestReport,
    latestProtocolOrder,
    triageSessions,
  });

  const localOrderState: CustomerJourneyState | null = (() => {
    if (latestStoreOrder?.status === "PENDING_PAYMENT")
      return "checkout_pending";
    if (
      storeOrders.some(
        (order) =>
          order.requiresRxValidation &&
          (!order.rxValidationStatus || order.rxValidationStatus === "pending"),
      )
    ) {
      return "rx_pending";
    }
    if (latestStoreOrder?.status === "PAID") return "payment_confirmed";
    if (latestStoreOrder?.status === "PREPARING") return "fulfillment";
    if (latestStoreOrder?.status === "SHIPPED") return "shipped";
    if (latestStoreOrder?.status === "DELIVERED") return "delivered";
    if (latestProtocolOrder?.status === "PAID") return "payment_confirmed";
    return null;
  })();

  const state: CustomerJourneyState = (() => {
    if (!profile) return "action_required";

    if (localOrderState) return localOrderState;
    if (ecosystemSignals?.journeyStateOverride) {
      return ecosystemSignals.journeyStateOverride;
    }
    if (latestClinicalStatus === "blocked") return "action_required";
    if (
      latestClinicalStatus === "payment_pending" ||
      latestClinicalStatus === "opened" ||
      latestClinicalStatus === "created"
    ) {
      return "handoff_pending";
    }
    if (
      latestClinicalStatus === "consult_in_progress" ||
      latestClinicalStatus === "followup"
    ) {
      return "consult_in_progress";
    }
    if (latestReport && latestReport.status === "completed")
      return "report_ready";
    return "action_required";
  })();

  const primaryAction: DashboardPrimaryAction | null = (() => {
    if (!profile) {
      return {
        label: "Falar com suporte",
        href: `${SUPPORT_WHATSAPP}?text=${encodeURIComponent("Olá! Preciso vincular meu acesso ao dashboard MeJoy.")}`,
        variant: "support",
        note: "Use o mesmo email da compra para acelerar a vinculação.",
      };
    }

    if (state === "checkout_pending" && latestStoreOrder?.href) {
      return {
        label: "Acompanhar pedido",
        href: latestStoreOrder.href,
        variant: "primary",
        note: "Se o PIX já foi pago, o status atualiza automaticamente.",
      };
    }

    if (
      state === "payment_confirmed" ||
      state === "fulfillment" ||
      state === "shipped" ||
      state === "delivered"
    ) {
      return {
        label: latestStoreOrder?.href ? "Ver pedido" : "Acompanhar jornada",
        href: latestStoreOrder?.href || "/dashboard#orders",
        variant: "primary",
      };
    }

    if (state === "report_ready") {
      return {
        label: "Abrir relatórios",
        href: "/relatorios",
        variant: "primary",
      };
    }

    if (
      state === "rx_pending" ||
      state === "handoff_pending" ||
      state === "consult_in_progress"
    ) {
      return {
        label: "Ver jornada clínica",
        href: "/dashboard#clinical",
        variant: "primary",
      };
    }

    return {
      label: "Atualizar perfil",
      href: "/perfil",
      variant: "secondary",
    };
  })();

  const journeyCopy = buildJourneySummary({
    state,
    primaryAction,
    latestStoreOrder,
    latestReport,
    latestClinicalStatus,
    profileMissing: !profile,
  });
  const nextAction = buildNextActionCard({
    state,
    primaryAction,
    latestOrder: latestStoreOrder || latestProtocolOrder,
    latestReport,
    latestClinicalStatus,
    ecosystemSignals: ecosystemSignals || undefined,
  });
  const careHighlights = buildCareHighlights({
    profile,
    answers: latestAnswers,
    seedProtocolSlug,
    state,
    latestReport,
    latestOrder: latestStoreOrder || latestProtocolOrder,
  });
  const renewalCard = buildRenewalCard({
    state,
    latestStoreOrder: latestStoreOrder || latestProtocolOrder,
  });
  const relatedProtocols = buildRelatedProtocolCards(seedProtocolSlug);

  const allTimelineEvents: OrderTimelineEvent[] = [];

  for (const order of storeOrders.slice(0, 3)) {
    allTimelineEvents.push({
      id: `store-${order.id}-created`,
      at: order.createdAt.toISOString(),
      label: `Pedido ${order.id.slice(-8).toUpperCase()} criado`,
      description: "A compra foi registrada no fluxo Store V2.",
      source: "order",
      status: "done",
    });

    if (order.status !== "PENDING_PAYMENT") {
      allTimelineEvents.push({
        id: `store-${order.id}-paid`,
        at: order.updatedAt.toISOString(),
        label: "Pagamento confirmado",
        description: "O pedido avançou após confirmação do pagamento.",
        source: "order",
        status: order.status === "PAID" ? "current" : "done",
      });
    }

    if (order.shippedAt) {
      allTimelineEvents.push({
        id: `store-${order.id}-shipped`,
        at: order.shippedAt.toISOString(),
        label: "Pedido enviado",
        description: order.trackingCode
          ? `Rastreio disponível: ${order.trackingCode}.`
          : "O pedido foi despachado e aguarda atualização de rastreio.",
        source: "order",
        status: order.status === "SHIPPED" ? "current" : "done",
      });
    }

    if (order.deliveredAt) {
      allTimelineEvents.push({
        id: `store-${order.id}-delivered`,
        at: order.deliveredAt.toISOString(),
        label: "Entrega concluída",
        description: "A entrega foi marcada como concluída.",
        source: "order",
        status: "done",
      });
    }
  }

  for (const report of reportSummaries.slice(0, 4)) {
    allTimelineEvents.push({
      id: `report-${report.id}`,
      at: report.completedAt || report.createdAt,
      label:
        report.status === "completed"
          ? "Relatório disponível"
          : "Triagem em processamento",
      description: `Triagem ${report.triageSlug} com status ${report.status}.`,
      source: "report",
      status: report.status === "completed" ? "done" : "current",
    });
  }

  const clinicalTimeline: OrderTimelineEvent[] = handoffEvents
    .slice(0, 8)
    .map((event, index) => ({
      id: `clinical-${event.id}`,
      at: event.created_at,
      label: mapHandoffLabel(event.status),
      description: `Etapa clínica ${event.program_slug || "mejoy"} atualizada para ${event.status}.`,
      source: "clinical",
      status:
        index === 0 &&
        latestClinicalStatus !== "completed" &&
        latestClinicalStatus !== "blocked"
          ? "current"
          : event.status === "failed" || event.status === "expired"
            ? "issue"
            : "done",
    }));

  const ecosystemTimeline: OrderTimelineEvent[] = ecosystemEvents
    .slice(0, 8)
    .map((event, index) => ({
      id: `ecosystem-${event.event_id}`,
      at: event.occurred_at,
      label: mapEcosystemEventLabel(event.event_name),
      description: mapEcosystemEventDescription(event),
      source: "system",
      status:
        index === 0 &&
        ecosystemSignals?.nextBestAction !== "start_treatment" &&
        event.event_name !== "order.delivered"
          ? "current"
          : "done",
    }));

  allTimelineEvents.push(...clinicalTimeline);
  allTimelineEvents.push(...ecosystemTimeline);
  allTimelineEvents.sort(
    (a, b) => new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime(),
  );

  const notifications: CustomerNotification[] = [];

  if (!profile) {
    notifications.push({
      id: "profile-missing",
      level: "critical",
      title: "Acesso ainda não vinculado",
      body: "Encontramos sua conta, mas o perfil operacional ainda não foi associado. O suporte pode concluir isso rapidamente.",
      cta: primaryAction,
    });
  }

  if (latestStoreOrder?.status === "PENDING_PAYMENT") {
    notifications.push({
      id: `payment-${latestStoreOrder.id}`,
      level: "warning",
      title: "Pagamento ainda pendente",
      body: "Se o PIX já foi pago, aguarde a confirmação automática. Se não, use o pedido para acompanhar os próximos passos.",
      cta: primaryAction,
    });
  }

  if (latestClinicalStatus === "blocked") {
    notifications.push({
      id: "clinical-blocked",
      level: "critical",
      title: "Fluxo clínico precisa de revisão",
      body: "Um evento clínico bloqueante foi identificado. O painel está priorizando o suporte para evitar atrito.",
      cta: {
        label: "Falar com suporte",
        href: `${SUPPORT_WHATSAPP}?text=${encodeURIComponent("Olá! Preciso de ajuda com meu fluxo clínico no dashboard MeJoy.")}`,
        variant: "support",
      },
    });
  }

  if (latestReport?.status === "completed") {
    notifications.push({
      id: `report-ready-${latestReport.id}`,
      level: "success",
      title: "Relatório disponível",
      body: "Seu relatório já está pronto para revisão no painel de relatórios.",
      cta: {
        label: "Abrir relatórios",
        href: "/relatorios",
        variant: "secondary",
      },
    });
  }

  for (const degradedReason of degradedReasons.slice(0, 2)) {
    notifications.push({
      id: `degraded-${degradedReason.source}`,
      level: degradedReason.severity,
      title: "Atenção operacional",
      body: degradedReason.message,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    degraded: degradedReasons.length > 0,
    degradedReasons,
    profile,
    journey: {
      state,
      title: journeyCopy.title,
      summary: journeyCopy.summary,
      trust: journeyCopy.trust,
      sla: journeyCopy.sla,
      primaryAction,
      faq: buildJourneyFaq(state),
      supportRule: journeyCopy.supportRule,
    },
    nextAction,
    careHighlights,
    renewalCard,
    relatedProtocols,
    timeline: allTimelineEvents.slice(0, 12),
    orders: {
      total: protocolOrderSummaries.length + storeOrderSummaries.length,
      storeV2: storeOrderSummaries,
      protocol: protocolOrderSummaries,
    },
    reports: {
      total: reportSummaries.length,
      active: reportSummaries.slice(0, 8),
    },
    clinical: {
      status: latestClinicalStatus,
      latestHandoffId: latestHandoff?.handoff_id || null,
      lastUpdatedAt:
        ecosystemEvents[0]?.occurred_at || latestHandoff?.created_at || null,
      prescriptionState: ecosystemSignals?.prescriptionState,
      medicationState: ecosystemSignals?.medicationState,
      followupState: ecosystemSignals?.followupState,
      nextBestAction: ecosystemSignals?.nextBestAction,
      timeline: [...ecosystemTimeline, ...clinicalTimeline]
        .sort(
          (a, b) =>
            new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime(),
        )
        .slice(0, 12),
    },
    support: {
      whatsappUrl: `${SUPPORT_WHATSAPP}?text=${encodeURIComponent("Olá! Preciso de ajuda com minha jornada no dashboard MeJoy.")}`,
      email: SUPPORT_EMAIL,
      recommendations: [
        "Use sempre o mesmo email da compra para evitar contas duplicadas.",
        "Considere o dashboard como fonte oficial para pedido, clínica e relatórios.",
        "Acione suporte só quando houver alerta, atraso acima do SLA ou ação explícita pedida aqui.",
      ],
      accessResendAvailable: Boolean(profile?.email || normalizedEmail),
    },
    notifications: notifications.slice(0, 6),
  };
}

async function getRecentHandoffRows(
  degradedReasons: DegradedReason[],
  from: Date,
): Promise<HandoffEventRow[]> {
  if (!hasSupabaseAdminConfig) {
    pushReason(degradedReasons, {
      source: "clinical",
      message:
        "Supabase administrativo não está configurado para o dashboard admin.",
      severity: "warning",
    });
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("handoff_events")
    .select(
      "id,handoff_id,status,triage_id,report_id,order_id,patient_id,program_slug,created_at,metadata",
    )
    .gte("created_at", from.toISOString())
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    pushReason(degradedReasons, {
      source: "clinical",
      message: `Falha ao carregar eventos clínicos: ${error.message}`,
      severity: "warning",
    });
    return [];
  }

  return (data || []) as HandoffEventRow[];
}

function buildQueueItem(params: {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  createdAt?: Date | string | null;
  href?: string;
  ctaLabel?: string;
  meta?: string;
}): AdminQueueItem {
  return {
    id: params.id,
    title: params.title,
    subtitle: params.subtitle,
    status: params.status,
    ageHours: hoursSince(params.createdAt),
    href: params.href,
    ctaLabel: params.ctaLabel,
    meta: params.meta,
  };
}

function summarizeRevenueByProduct(
  storeOrders: Array<any>,
  protocolOrders: Array<any>,
): AdminBreakdownDatum[] {
  const totals = new Map<string, number>();

  for (const order of protocolOrders) {
    const label = order.productSlug || "Protocolo";
    totals.set(label, (totals.get(label) || 0) + (order.amount || 0));
  }

  for (const order of storeOrders) {
    const snapshot = order.snapshot as {
      items?: Array<{
        name?: string;
        productSlug?: string;
        quantity?: number;
        priceCents?: number;
      }>;
    } | null;
    const item = snapshot?.items?.[0];
    const label = item?.productSlug || item?.name || "Store V2";
    totals.set(label, (totals.get(label) || 0) + (order.totalCents || 0));
  }

  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }));
}

function summarizeRevenueBySource(
  protocolOrders: Array<any>,
  storeOrders: Array<any>,
): AdminBreakdownDatum[] {
  const totals = new Map<string, number>();

  for (const order of protocolOrders) {
    const label = order.utmSource || "direto";
    totals.set(label, (totals.get(label) || 0) + (order.amount || 0));
  }

  for (const order of storeOrders) {
    totals.set(
      "store_v2_direto",
      (totals.get("store_v2_direto") || 0) + (order.totalCents || 0),
    );
  }

  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }));
}

function buildCohortSeries(
  protocolOrders: Array<any>,
  storeOrders: Array<any>,
  from: Date,
): AdminSeriesDatum[] {
  const buckets = new Map<string, number>();
  const cursor = new Date(from);
  const today = new Date();

  while (cursor <= today) {
    const key = cursor.toISOString().slice(5, 10);
    buckets.set(key, 0);
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const order of [...protocolOrders, ...storeOrders]) {
    const paidAt = order.paidAt || order.updatedAt || order.createdAt;
    const key = new Date(paidAt).toISOString().slice(5, 10);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) || 0) + 1);
    }
  }

  return Array.from(buckets.entries()).map(([label, value]) => ({
    label,
    value,
  }));
}

export async function buildAdminDashboard(
  periodInput?: string,
): Promise<AdminDashboardResponse> {
  const degradedReasons: DegradedReason[] = [];
  const { period, from } = getPeriod(periodInput);

  const [
    totalProfiles,
    totalTriageStarts,
    totalReportsReady,
    paidProtocolOrders,
    paidStoreOrders,
    pendingStoreOrders,
    recentStoreOrders,
    rxPendingOrders,
    latestWebhook,
    handoffRows,
  ] = await Promise.all([
    prisma.profile.count().catch((error) => {
      pushReason(degradedReasons, {
        source: "overview",
        message: `Falha ao contar perfis: ${(error as Error).message}`,
        severity: "warning",
      });
      return 0;
    }),
    prisma.triageSession
      .count({
        where: { created_at: { gte: from } },
      })
      .catch((error) => {
        pushReason(degradedReasons, {
          source: "commercial",
          message: `Falha ao contar triagens: ${(error as Error).message}`,
          severity: "warning",
        });
        return 0;
      }),
    prisma.triageReport
      .count({
        where: { status: "completed", created_at: { gte: from } },
      })
      .catch((error) => {
        pushReason(degradedReasons, {
          source: "commercial",
          message: `Falha ao contar relatórios: ${(error as Error).message}`,
          severity: "warning",
        });
        return 0;
      }),
    prisma.zapfarmOrder
      .findMany({
        where: { status: "PAID", createdAt: { gte: from } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          amount: true,
          customerName: true,
          customerEmail: true,
          productSlug: true,
          createdAt: true,
          paidAt: true,
          utmSource: true,
          profileId: true,
        },
      })
      .catch((error) => {
        pushReason(degradedReasons, {
          source: "commercial",
          message: `Falha ao consolidar protocolos pagos: ${(error as Error).message}`,
          severity: "warning",
        });
        return [];
      }),
    prisma.order
      .findMany({
        where: { status: "PAID", createdAt: { gte: from } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          totalCents: true,
          customerName: true,
          customerEmail: true,
          createdAt: true,
          updatedAt: true,
          shippedAt: true,
          deliveredAt: true,
          trackingCode: true,
          trackingUrl: true,
          profileId: true,
          snapshot: true,
        },
      })
      .catch((error) => {
        pushReason(degradedReasons, {
          source: "commercial",
          message: `Falha ao consolidar pedidos pagos Store V2: ${(error as Error).message}`,
          severity: "warning",
        });
        return [];
      }),
    prisma.order
      .findMany({
        where: { status: "PENDING_PAYMENT", createdAt: { gte: from } },
        orderBy: { createdAt: "desc" },
        take: 12,
      })
      .catch((error) => {
        pushReason(degradedReasons, {
          source: "operation",
          message: `Falha ao carregar PIX pendentes: ${(error as Error).message}`,
          severity: "warning",
        });
        return [];
      }),
    prisma.order
      .findMany({
        where: { createdAt: { gte: from } },
        orderBy: { createdAt: "desc" },
        take: 20,
      })
      .catch((error) => {
        pushReason(degradedReasons, {
          source: "operation",
          message: `Falha ao carregar pedidos recentes: ${(error as Error).message}`,
          severity: "warning",
        });
        return [];
      }),
    prisma.order
      .findMany({
        where: {
          requiresRxValidation: true,
          OR: [{ rxValidationStatus: null }, { rxValidationStatus: "pending" }],
          createdAt: { gte: from },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
      })
      .catch((error) => {
        pushReason(degradedReasons, {
          source: "operation",
          message: `Falha ao carregar fila de validação clínica: ${(error as Error).message}`,
          severity: "warning",
        });
        return [];
      }),
    prisma.webhookEvent
      .findFirst({
        orderBy: { createdAt: "desc" },
        select: { createdAt: true, provider: true, eventId: true },
      })
      .catch((error) => {
        pushReason(degradedReasons, {
          source: "technical",
          message: `Falha ao verificar frescor de webhooks: ${(error as Error).message}`,
          severity: "warning",
        });
        return null;
      }),
    getRecentHandoffRows(degradedReasons, from),
  ]);

  const revenueCents =
    paidProtocolOrders.reduce((sum, order) => sum + (order.amount || 0), 0) +
    paidStoreOrders.reduce((sum, order) => sum + (order.totalCents || 0), 0);
  const paidOrdersCount = paidProtocolOrders.length + paidStoreOrders.length;
  const protocolCustomers = new Map<string, number>();
  const storeCustomers = new Map<string, number>();

  for (const order of paidProtocolOrders) {
    protocolCustomers.set(
      order.customerEmail.toLowerCase(),
      (protocolCustomers.get(order.customerEmail.toLowerCase()) || 0) + 1,
    );
  }
  for (const order of paidStoreOrders) {
    storeCustomers.set(
      order.customerEmail.toLowerCase(),
      (storeCustomers.get(order.customerEmail.toLowerCase()) || 0) + 1,
    );
  }

  const repurchaseCount =
    Array.from(protocolCustomers.values()).filter((count) => count > 1).length +
    Array.from(storeCustomers.values()).filter((count) => count > 1).length;
  const unsyncedPaidCount =
    paidProtocolOrders.filter((order) => !order.profileId).length +
    paidStoreOrders.filter((order) => !order.profileId).length;

  const paidWithoutNextAction = recentStoreOrders
    .filter(
      (order) =>
        ["PAID", "PREPARING"].includes(order.status) && !order.shippedAt,
    )
    .slice(0, 10)
    .map((order) =>
      buildQueueItem({
        id: order.id,
        title: `Pedido #${order.id.slice(-8).toUpperCase()}`,
        subtitle: `${order.customerName} • aguardando próxima ação operacional`,
        status: order.status,
        createdAt: order.createdAt,
        href: `/admin/store-v2/orders`,
        ctaLabel: "Abrir pedidos",
        meta: order.customerEmail,
      }),
    );

  const shipmentsAtRisk = recentStoreOrders
    .filter((order) => order.status === "SHIPPED" && !order.trackingCode)
    .slice(0, 10)
    .map((order) =>
      buildQueueItem({
        id: order.id,
        title: `Pedido #${order.id.slice(-8).toUpperCase()}`,
        subtitle: `${order.customerName} • enviado sem rastreio registrado`,
        status: order.status,
        createdAt: order.shippedAt || order.updatedAt,
        href: `/admin/store-v2/orders`,
        ctaLabel: "Completar rastreio",
        meta: order.customerEmail,
      }),
    );

  const supportRisk = recentStoreOrders
    .filter(
      (order) =>
        (order.status === "PENDING_PAYMENT" &&
          hoursSince(order.createdAt) &&
          hoursSince(order.createdAt)! > 6) ||
        (order.status === "PAID" && !order.profileId),
    )
    .slice(0, 10)
    .map((order) =>
      buildQueueItem({
        id: order.id,
        title: `Pedido #${order.id.slice(-8).toUpperCase()}`,
        subtitle:
          order.status === "PENDING_PAYMENT"
            ? `${order.customerName} • PIX pendente além do esperado`
            : `${order.customerName} • pedido pago sem perfil vinculado`,
        status: order.status,
        createdAt: order.createdAt,
        href: `/admin/store-v2/orders`,
        ctaLabel: "Tratar caso",
        meta: order.customerEmail,
      }),
    );

  const latestHandoffById = new Map<string, HandoffEventRow>();
  for (const row of handoffRows) {
    if (!latestHandoffById.has(row.handoff_id)) {
      latestHandoffById.set(row.handoff_id, row);
    }
  }

  const handoffsStuck = Array.from(latestHandoffById.values())
    .filter((row) => {
      const state = mapClinicalState(row.status);
      return (
        !["completed", "blocked"].includes(state) &&
        (hoursSince(row.created_at) || 0) > 24
      );
    })
    .slice(0, 10)
    .map((row) =>
      buildQueueItem({
        id: row.handoff_id,
        title: row.patient_id
          ? `Paciente ${row.patient_id.slice(0, 8)}`
          : `Handoff ${row.handoff_id.slice(0, 8)}`,
        subtitle: `${mapHandoffLabel(row.status)} • ${row.program_slug || "clínico"}`,
        status: row.status,
        createdAt: row.created_at,
        href: "/admin/handoff",
        ctaLabel: "Abrir handoff",
        meta: row.order_id || row.report_id || row.triage_id || undefined,
      }),
    );

  const pendingPix = pendingStoreOrders.map((order) =>
    buildQueueItem({
      id: order.id,
      title: `Pedido #${order.id.slice(-8).toUpperCase()}`,
      subtitle: `${order.customerName} • pagamento aguardando webhook`,
      status: order.status,
      createdAt: order.createdAt,
      href: `/admin/store-v2/orders`,
      ctaLabel: "Abrir pedido",
      meta: order.customerEmail,
    }),
  );

  const rxPending = rxPendingOrders.map((order) =>
    buildQueueItem({
      id: order.id,
      title: `Pedido #${order.id.slice(-8).toUpperCase()}`,
      subtitle: `${order.customerName} • aguardando validação clínica`,
      status: order.rxValidationStatus || "pending",
      createdAt: order.createdAt,
      href: `/admin/store-v2/orders`,
      ctaLabel: "Ver pedido",
      meta: order.customerEmail,
    }),
  );

  const handoffTotals = handoffRows.reduce<Record<string, number>>(
    (acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    },
    {},
  );

  const recentPatients: AdminCustomerSnapshot[] = Array.from(
    latestHandoffById.values(),
  )
    .slice(0, 8)
    .map((row) => ({
      id: row.patient_id || row.handoff_id,
      name: row.patient_id
        ? `Paciente ${row.patient_id.slice(0, 8)}`
        : `Handoff ${row.handoff_id.slice(0, 8)}`,
      email: row.report_id || row.order_id || "-",
      reference: row.handoff_id,
      latestStatus: mapHandoffLabel(row.status),
      updatedAt: row.created_at,
    }));

  const technicalChecks: AdminTechnicalCheck[] = [];
  const criticalEnvChecks = [
    {
      id: "supabase",
      label: "Supabase admin",
      value: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.SUPABASE_SERVICE_ROLE_KEY,
      ),
    },
    {
      id: "asaas",
      label: "Asaas",
      value: Boolean(
        process.env.ASAAS_API_KEY && process.env.ASAAS_WEBHOOK_TOKEN,
      ),
    },
    {
      id: "stripe",
      label: "Stripe",
      value: Boolean(process.env.STRIPE_SECRET_KEY),
    },
    {
      id: "openai",
      label: "OpenAI",
      value: Boolean(process.env.OPENAI_API_KEY),
    },
    {
      id: "resend",
      label: "Resend",
      value: Boolean(process.env.RESEND_API_KEY),
    },
    {
      id: "order-access",
      label: "Assinatura de link do pedido",
      value: Boolean(
        process.env.ORDER_ACCESS_TOKEN_SECRET || process.env.ADMIN_SECRET_KEY,
      ),
    },
  ];

  for (const envCheck of criticalEnvChecks) {
    technicalChecks.push({
      id: `env-${envCheck.id}`,
      label: envCheck.label,
      status: envCheck.value ? "healthy" : "critical",
      detail: envCheck.value
        ? "Configuração presente."
        : "Variável crítica ausente para produção.",
    });
  }

  if (hasSupabaseAdminConfig) {
    const { error } = await supabaseAdmin
      .from("profiles")
      .select("id", { head: true, count: "exact" })
      .limit(1);
    technicalChecks.push({
      id: "supabase-query",
      label: "Leitura Supabase",
      status: error ? "critical" : "healthy",
      detail: error
        ? error.message
        : "Consulta de leitura executada com sucesso.",
    });
  } else {
    technicalChecks.push({
      id: "supabase-query",
      label: "Leitura Supabase",
      status: "unknown",
      detail: "Cliente administrativo do Supabase não está configurado.",
    });
  }

  technicalChecks.push({
    id: "webhook-freshness",
    label: "Frescor de webhook de pagamento",
    status: !latestWebhook
      ? "warning"
      : (hoursSince(latestWebhook.createdAt) || 0) > 24
        ? "warning"
        : "healthy",
    detail: !latestWebhook
      ? "Nenhum webhook de pagamento registrado neste ambiente."
      : `Último evento ${latestWebhook.provider} há ${hoursSince(latestWebhook.createdAt)}h.`,
    updatedAt: latestWebhook?.createdAt.toISOString() || null,
  });

  technicalChecks.push({
    id: "analytics-visits",
    label: "Analytics de visitas",
    status: "unknown",
    detail: HIDDEN_VISIT_METRIC_REASON,
  });

  const alerts: AdminAlert[] = [];

  if (pendingPix.filter((item) => (item.ageHours || 0) > 6).length > 0) {
    alerts.push({
      id: "pending-pix-aging",
      level: "warning",
      title: "PIX pendente acima do esperado",
      body: "Há pedidos aguardando compensação ou conferência acima da janela operacional desejada.",
      source: "operation",
      href: "/admin/store-v2/orders",
    });
  }

  if (handoffsStuck.length > 0) {
    alerts.push({
      id: "handoff-stuck",
      level: "critical",
      title: "Handoffs clínicos travados",
      body: "Existem jornadas clínicas sem avanço dentro do SLA. Isso tende a virar suporte e cancelamento se não houver ação.",
      source: "clinical",
      href: "/admin/handoff",
    });
  }

  for (const degradedReason of degradedReasons.slice(0, 4)) {
    alerts.push({
      id: `degraded-${degradedReason.source}`,
      level: degradedReason.severity,
      title: "Fonte de dados degradada",
      body: degradedReason.message,
      source: degradedReason.source,
    });
  }

  const reportGenerationRate =
    totalTriageStarts > 0
      ? Number(((totalReportsReady / totalTriageStarts) * 100).toFixed(1))
      : null;
  const reportFunnelAlerts: AdminAlert[] = [];

  if (totalTriageStarts > 0 && totalReportsReady === 0) {
    reportFunnelAlerts.push({
      id: "report-funnel-zero",
      level: "critical",
      title: "Triagens sem relatórios concluídos no período",
      body: "O topo do funil está ativo, mas nenhum relatório foi consolidado no período selecionado.",
      source: "reports",
      href: "/admin/leads",
    });
  } else if (reportGenerationRate != null && reportGenerationRate < 55) {
    reportFunnelAlerts.push({
      id: "report-funnel-low-conversion",
      level: "warning",
      title: "Conversão de triagem para relatório abaixo do ideal",
      body: `${reportGenerationRate}% das triagens viraram relatório no período. Vale revisar finalize, geração e gargalos operacionais.`,
      source: "reports",
      href: "/admin/leads",
    });
  }

  if (pendingPix.filter((item) => (item.ageHours || 0) > 24).length > 0) {
    reportFunnelAlerts.push({
      id: "checkout-pix-aging",
      level: "warning",
      title: "PIX envelhecendo após a etapa de relatório",
      body: "Há pagamentos iniciados que ficaram pendentes além de 24h. Isso tende a virar atrito entre relatório e fechamento.",
      source: "checkout",
      href: "/admin/store-v2/orders",
    });
  }

  const operationalSlas: OperationalSla[] = [
    {
      id: "pix-aging",
      label: "PIX pendente > 6h",
      current: pendingPix.filter((item) => (item.ageHours || 0) > 6).length,
      threshold: 0,
      unit: "count",
      status:
        pendingPix.filter((item) => (item.ageHours || 0) > 6).length > 0
          ? "warning"
          : "healthy",
    },
    {
      id: "handoff-stuck",
      label: "Handoff sem avanço > 24h",
      current: handoffsStuck.length,
      threshold: 0,
      unit: "count",
      status: handoffsStuck.length > 0 ? "critical" : "healthy",
    },
    {
      id: "paid-next-action",
      label: "Pago sem próxima ação > 12h",
      current: paidWithoutNextAction.filter((item) => (item.ageHours || 0) > 12)
        .length,
      threshold: 0,
      unit: "count",
      status:
        paidWithoutNextAction.filter((item) => (item.ageHours || 0) > 12)
          .length > 0
          ? "warning"
          : "healthy",
    },
  ];

  const revenueByProduct = summarizeRevenueByProduct(
    paidStoreOrders,
    paidProtocolOrders,
  );
  const revenueBySource = summarizeRevenueBySource(
    paidProtocolOrders,
    paidStoreOrders,
  );
  const cohort = buildCohortSeries(paidProtocolOrders, paidStoreOrders, from);
  const paymentSyncHealth = {
    healthy: pendingPix.length === 0 && unsyncedPaidCount === 0,
    pendingCount: pendingPix.length,
    unsyncedPaidCount,
    detail:
      pendingPix.length === 0 && unsyncedPaidCount === 0
        ? "Pagamentos confirmados, pedidos e perfis estão sincronizando sem pendência crítica observável."
        : `${pendingPix.length} pagamento(s) pendente(s) e ${unsyncedPaidCount} pedido(s) pago(s) ainda sem vínculo de perfil suficiente para liberação automática ideal.`,
  };

  const releaseSeverity: DashboardSeverity =
    unsyncedPaidCount > 0 || handoffsStuck.length > 0
      ? "critical"
      : degradedReasons.length > 0 ||
          pendingPix.filter((item) => (item.ageHours || 0) > 6).length > 0
        ? "warning"
        : "success";
  const dashboardReleaseState = {
    label:
      releaseSeverity === "critical"
        ? "Operação exige intervenção imediata"
        : releaseSeverity === "warning"
          ? "Operação estável com pontos de atenção"
          : "Fluxo liberado para operar continuamente",
    detail:
      releaseSeverity === "critical"
        ? "Há sinais de pagamento sem sincronização plena ou handoffs fora do SLA que podem travar onboarding."
        : releaseSeverity === "warning"
          ? "Os funis continuam vivos, mas existem pendências que merecem observação antes de ampliar volume."
          : "Pagamento, relatório, perfil e clínica estão sem alertas críticos observáveis neste recorte.",
    severity: releaseSeverity,
  };

  return {
    generatedAt: new Date().toISOString(),
    period,
    degraded: degradedReasons.length > 0,
    degradedReasons,
    paymentSyncHealth,
    dashboardReleaseState,
    reportFunnelAlerts,
    overview: [
      {
        label: "Receita confirmada",
        value: revenueCents / 100,
        unit: "brl",
        detail: `${paidOrdersCount} pedidos pagos no período.`,
      },
      { label: "Perfis totais", value: totalProfiles, unit: "count" },
      { label: "Triagens iniciadas", value: totalTriageStarts, unit: "count" },
      { label: "Relatórios prontos", value: totalReportsReady, unit: "count" },
      { label: "PIX pendentes", value: pendingPix.length, unit: "count" },
      {
        label: "Handoffs ativos",
        value: latestHandoffById.size,
        unit: "count",
      },
    ],
    operation: {
      stats: [
        {
          label: "PIX pendente > 6h",
          value: pendingPix.filter((item) => (item.ageHours || 0) > 6).length,
          unit: "count",
        },
        {
          label: "Pagos sem próxima ação",
          value: paidWithoutNextAction.length,
          unit: "count",
        },
        {
          label: "Validação clínica pendente",
          value: rxPending.length,
          unit: "count",
        },
        {
          label: "Handoff travado",
          value: handoffsStuck.length,
          unit: "count",
        },
        {
          label: "Envios em risco",
          value: shipmentsAtRisk.length,
          unit: "count",
        },
        { label: "Risco de suporte", value: supportRisk.length, unit: "count" },
      ],
      queues: {
        pendingPix,
        paidWithoutNextAction,
        rxPending,
        handoffsStuck,
        shipmentsAtRisk,
        supportRisk,
      },
      slas: operationalSlas,
    },
    commercial: {
      metrics: [
        {
          label: "Visitas validadas",
          value: null,
          unit: "count",
          detail: HIDDEN_VISIT_METRIC_REASON,
        },
        {
          label: "Triagens iniciadas",
          value: totalTriageStarts,
          unit: "count",
        },
        {
          label: "Relatórios prontos",
          value: totalReportsReady,
          unit: "count",
        },
        {
          label: "Checkouts observados",
          value:
            pendingStoreOrders.length +
            paidStoreOrders.length +
            paidProtocolOrders.length,
          unit: "count",
        },
        {
          label: "Pagamentos confirmados",
          value: paidOrdersCount,
          unit: "count",
        },
        { label: "Recompra", value: repurchaseCount, unit: "count" },
        {
          label: "Abandono PIX > 24h",
          value: pendingPix.filter((item) => (item.ageHours || 0) > 24).length,
          unit: "count",
        },
      ],
      revenueByProduct,
      revenueBySource,
      cohort,
    },
    clinical: {
      metrics: [
        {
          label: "Handoffs criados",
          value: handoffTotals.created || 0,
          unit: "count",
        },
        {
          label: "Handoffs abertos",
          value: handoffTotals.opened || 0,
          unit: "count",
        },
        {
          label: "Pagamento clínico iniciado",
          value: handoffTotals.clinical_payment_started || 0,
          unit: "count",
        },
        {
          label: "Consulta concluída",
          value: handoffTotals.consult_completed || 0,
          unit: "count",
        },
        {
          label: "Pedido clínico criado",
          value: handoffTotals.pharmacy_order_created || 0,
          unit: "count",
        },
        {
          label: "Follow-up iniciado",
          value: handoffTotals.followup_started || 0,
          unit: "count",
        },
      ],
      recentPatients,
    },
    technical: {
      buildSha:
        process.env.VERCEL_GIT_COMMIT_SHA || process.env.SOURCE_VERSION || null,
      checks: technicalChecks,
    },
    alerts: alerts.slice(0, 8),
  };
}

export async function buildAdminCustomerView(profileId: string): Promise<{
  generatedAt: string;
  dashboard: MeDashboardResponse;
}> {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  });

  if (!profile) {
    throw new Error("Perfil não encontrado");
  }

  const dashboard = await buildMeDashboard({
    email: profile.email || null,
    profile,
  });

  return {
    generatedAt: new Date().toISOString(),
    dashboard,
  };
}
