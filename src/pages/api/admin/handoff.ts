import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

type HandoffMetricsResponse = {
  ok: boolean;
  periodDays: number;
  totals: {
    created: number;
    opened: number;
    completed: number;
    clinicalPaymentStarted: number;
    clinicalPaymentSuccess: number;
    consultCompleted: number;
    pharmacyOrderStarted: number;
    pharmacyOrderCreated: number;
    followupStarted: number;
  };
  rates: {
    openRate: number;
    completionRate: number;
    clinicalPaymentRate: number;
  };
  byStatus: Record<string, number>;
  error?: string;
};

type EventRow = {
  status: string;
  created_at: string;
};

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
    db: { schema: "public" }
  });
}

function toRate(numerator: number, denominator: number): number {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(2));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HandoffMetricsResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      periodDays: 0,
      totals: {
        created: 0,
        opened: 0,
        completed: 0,
        clinicalPaymentStarted: 0,
        clinicalPaymentSuccess: 0,
        consultCompleted: 0,
        pharmacyOrderStarted: 0,
        pharmacyOrderCreated: 0,
        followupStarted: 0
      },
      rates: { openRate: 0, completionRate: 0, clinicalPaymentRate: 0 },
      byStatus: {},
      error: "Use GET"
    });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(500).json({
      ok: false,
      periodDays: 0,
      totals: {
        created: 0,
        opened: 0,
        completed: 0,
        clinicalPaymentStarted: 0,
        clinicalPaymentSuccess: 0,
        consultCompleted: 0,
        pharmacyOrderStarted: 0,
        pharmacyOrderCreated: 0,
        followupStarted: 0
      },
      rates: { openRate: 0, completionRate: 0, clinicalPaymentRate: 0 },
      byStatus: {},
      error: "Supabase não configurado"
    });
  }

  const daysParam = Number(req.query.days || 7);
  const periodDays = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), 90) : 7;
  const fromDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("handoff_events")
    .select("status,created_at")
    .gte("created_at", fromDate)
    .order("created_at", { ascending: false })
    .limit(20000);

  if (error) {
    return res.status(500).json({
      ok: false,
      periodDays,
      totals: {
        created: 0,
        opened: 0,
        completed: 0,
        clinicalPaymentStarted: 0,
        clinicalPaymentSuccess: 0,
        consultCompleted: 0,
        pharmacyOrderStarted: 0,
        pharmacyOrderCreated: 0,
        followupStarted: 0
      },
      rates: { openRate: 0, completionRate: 0, clinicalPaymentRate: 0 },
      byStatus: {},
      error: error.message
    });
  }

  const rows = (data || []) as EventRow[];
  const byStatus = rows.reduce<Record<string, number>>((acc, row) => {
    const key = row.status || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const totals = {
    created: byStatus.created || 0,
    opened: byStatus.opened || 0,
    completed: (byStatus.completed || 0) + (byStatus.accepted || 0),
    clinicalPaymentStarted: byStatus.clinical_payment_started || 0,
    clinicalPaymentSuccess: byStatus.clinical_payment_success || 0,
    consultCompleted: byStatus.consult_completed || 0,
    pharmacyOrderStarted: byStatus.pharmacy_order_started || 0,
    pharmacyOrderCreated: byStatus.pharmacy_order_created || 0,
    followupStarted: byStatus.followup_started || 0
  };

  const rates = {
    openRate: toRate(totals.opened, totals.created),
    completionRate: toRate(totals.completed, totals.created),
    clinicalPaymentRate: toRate(totals.clinicalPaymentStarted, totals.opened)
  };

  return res.status(200).json({
    ok: true,
    periodDays,
    totals,
    rates,
    byStatus
  });
}
