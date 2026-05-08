import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import LoggedLayout from "@/components/layout/LoggedLayout";
import { useAuth } from "@/context/AuthContext";
import type {
  DashboardSeverity,
  OrderTimelineEvent,
} from "@/lib/dashboard/types";
import { useMeDashboard } from "@/hooks/useMeDashboard";

function formatDate(value: string | null | undefined) {
  if (!value) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function badgeClass(level: DashboardSeverity) {
  if (level === "critical") return "bg-rose-100 text-rose-700 border-rose-200";
  if (level === "warning")
    return "bg-amber-100 text-amber-700 border-amber-200";
  if (level === "success")
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function timelineClass(event: OrderTimelineEvent) {
  if (event.status === "issue") return "border-rose-200 bg-rose-50";
  if (event.status === "current") return "border-emerald-200 bg-emerald-50";
  return "border-slate-200 bg-white";
}

function careHighlightTone(tone: "neutral" | "success" | "warning") {
  if (tone === "success") return "border-emerald-200 bg-[#f6fbf7]";
  if (tone === "warning") return "border-amber-200 bg-amber-50/90";
  return "border-slate-200 bg-white";
}

function renewalTone(status: "inactive" | "watching" | "ready") {
  if (status === "ready")
    return "border-emerald-200 bg-[linear-gradient(180deg,#f7fcf8_0%,#eff8f1_100%)]";
  if (status === "watching") return "border-slate-200 bg-slate-50/90";
  return "border-dashed border-slate-300 bg-white";
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { dashboard, loading, error } = useMeDashboard();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f3]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-500" />
          <p className="text-sm text-slate-600">
            Carregando seu painel MeJoy...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | MeJoy</title>
        <meta
          name="description"
          content="Painel MeJoy com jornada de compra, clínica, relatórios e próximos passos."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <LoggedLayout>
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_32%),linear-gradient(180deg,_#f8fbf8_0%,_#eef4ef_100%)] text-slate-900">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-[linear-gradient(135deg,_#08151f_0%,_#10242b_50%,_#0f3b2f_100%)] p-6 text-white shadow-[0_30px_80px_rgba(8,21,31,0.18)] sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">
                    Painel de jornada MeJoy
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                    {dashboard?.journey.title ||
                      "Sua jornada completa em um só lugar"}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
                    {dashboard?.journey.summary ||
                      "Compras, clínica, relatórios e próximos passos conectados em uma única visão mobile-first."}
                  </p>
                  {dashboard?.journey.trust && (
                    <p className="mt-4 max-w-2xl text-sm text-emerald-100/90">
                      {dashboard.journey.trust}
                    </p>
                  )}
                </div>

                <div className="w-full max-w-sm rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-emerald-100/80">
                        Status atual
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        {dashboard?.journey.state || "loading"}
                      </p>
                    </div>
                    {dashboard?.journey.primaryAction && (
                      <Link
                        href={dashboard.journey.primaryAction.href}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                      >
                        {dashboard.journey.primaryAction.label}
                      </Link>
                    )}
                  </div>
                  {dashboard?.journey.primaryAction?.note && (
                    <p className="mt-3 text-xs text-slate-200">
                      {dashboard.journey.primaryAction.note}
                    </p>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-200">
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-emerald-100/70">
                        SLA
                      </p>
                      <p className="mt-2 leading-relaxed">
                        {dashboard?.journey.sla || "Carregando..."}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-emerald-100/70">
                        Suporte
                      </p>
                      <p className="mt-2 leading-relaxed">
                        {dashboard?.journey.supportRule ||
                          "Evite abrir suporte sem necessidade."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {(error || dashboard?.degraded) && (
              <section className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50/90 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Atenção operacional
                    </p>
                    <p className="mt-1 text-sm text-amber-800">
                      {error?.message ||
                        "Detectamos pontos do fluxo que exigem transparência extra neste momento."}
                    </p>
                  </div>
                  <Link
                    href={
                      dashboard?.support.whatsappUrl ||
                      "https://wa.me/5511999999999"
                    }
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
                  >
                    Falar com suporte
                  </Link>
                </div>
                {dashboard?.degradedReasons?.length ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {dashboard.degradedReasons.map((reason) => (
                      <div
                        key={`${reason.source}-${reason.message}`}
                        className="rounded-2xl border border-amber-200 bg-white p-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
                          {reason.source}
                        </p>
                        <p className="mt-2 text-sm text-slate-700">
                          {reason.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            )}

            {loading && !dashboard ? (
              <div className="flex justify-center py-16">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              </div>
            ) : null}

            {dashboard && (
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.9fr]">
                <section id="timeline" className="space-y-6">
                  <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
                    <section className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                          <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                            {dashboard.nextAction.eyebrow}
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                            {dashboard.nextAction.title}
                          </h2>
                          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                            {dashboard.nextAction.body}
                          </p>
                        </div>
                        {dashboard.nextAction.cta && (
                          <Link
                            href={dashboard.nextAction.cta.href}
                            className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                          >
                            {dashboard.nextAction.cta.label}
                          </Link>
                        )}
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700">
                          {dashboard.journey.sla}
                        </span>
                        {dashboard.nextAction.eta && (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-800">
                            {dashboard.nextAction.eta}
                          </span>
                        )}
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700">
                          {dashboard.journey.supportRule}
                        </span>
                      </div>
                    </section>

                    <section className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                      <div className="grid h-full gap-0 sm:grid-cols-[0.92fr_1.08fr]">
                        <div className="relative min-h-[220px]">
                          <Image
                            src="/images/emagrecimento/medvi/journey-consulta.avif"
                            alt="Espaço reservado para vídeo clínico de boas-vindas"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1280px) 100vw, 18vw"
                          />
                        </div>
                        <div className="flex flex-col justify-between p-5 sm:p-6">
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                              Slot de vídeo
                            </p>
                            <h2 className="mt-2 text-xl font-semibold text-slate-900">
                              Boas-vindas e adesão no topo do cuidado contínuo
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                              Esta posição fica reservada para um vídeo curto de
                              médico ou concierge explicando próximos passos,
                              uso correto e continuidade do tratamento.
                            </p>
                          </div>
                          <div className="mt-5 rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            Inserir aqui o vídeo de boas-vindas/adesão na
                            próxima fase, sem mexer na estrutura do painel.
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  <section className="grid gap-4 xl:grid-cols-3">
                    {dashboard.careHighlights.map((item) => (
                      <div
                        key={item.id}
                        className={`overflow-hidden rounded-[1.5rem] border shadow-[0_16px_40px_rgba(15,23,42,0.06)] ${careHighlightTone(item.tone)}`}
                      >
                        {item.imageSrc ? (
                          <div className="relative aspect-[1.45] overflow-hidden">
                            <Image
                              src={item.imageSrc}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1280px) 100vw, 22vw"
                            />
                          </div>
                        ) : null}
                        <div className="p-5">
                          <p className="text-lg font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-slate-600">
                            {item.body}
                          </p>
                          {item.meta && (
                            <p className="mt-4 text-xs font-medium text-slate-500">
                              {item.meta}
                            </p>
                          )}
                          {item.cta && (
                            <Link
                              href={item.cta.href}
                              className="mt-4 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                              {item.cta.label} →
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </section>

                  <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                          Próximos passos
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-slate-900">
                          Timeline da sua jornada
                        </h2>
                      </div>
                      <p className="text-xs text-slate-500">
                        Atualizado em {formatDate(dashboard.generatedAt)}
                      </p>
                    </div>
                    <div className="mt-5 space-y-3">
                      {dashboard.timeline.map((event) => (
                        <div
                          key={event.id}
                          className={`rounded-[1.25rem] border p-4 ${timelineClass(event)}`}
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {event.label}
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                {event.description}
                              </p>
                            </div>
                            <div className="shrink-0 text-xs text-slate-500">
                              {formatDate(event.at)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-2">
                    <section className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                            Pedidos
                          </p>
                          <h2 className="mt-2 text-xl font-semibold text-slate-900">
                            Compras e entregas
                          </h2>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {dashboard.orders.total} registro(s)
                        </span>
                      </div>
                      <div className="mt-5 space-y-3">
                        {[
                          ...dashboard.orders.storeV2,
                          ...dashboard.orders.protocol,
                        ]
                          .slice(0, 6)
                          .map((order) => (
                            <div
                              key={`${order.type}-${order.id}`}
                              className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {order.label}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-600">
                                    {formatMoney(order.amountCents)}
                                  </p>
                                </div>
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                                  {order.status}
                                </span>
                              </div>
                              <p className="mt-3 text-xs text-slate-500">
                                Criado em {formatDate(order.createdAt)}
                              </p>
                              {order.supportHint && (
                                <p className="mt-2 text-xs text-slate-600">
                                  {order.supportHint}
                                </p>
                              )}
                              {order.href && (
                                <Link
                                  href={order.href}
                                  className="mt-3 inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800"
                                >
                                  Ver detalhes →
                                </Link>
                              )}
                            </div>
                          ))}
                        {dashboard.orders.total === 0 && (
                          <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                            Nenhuma compra vinculada ainda. Quando houver
                            confirmação de pagamento, ela aparecerá aqui com
                            próximos passos e SLA.
                          </div>
                        )}
                      </div>
                    </section>

                    <section className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                            Relatórios
                          </p>
                          <h2 className="mt-2 text-xl font-semibold text-slate-900">
                            Triagens e resultados
                          </h2>
                        </div>
                        <Link
                          href="/relatorios"
                          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                        >
                          Abrir tudo
                        </Link>
                      </div>
                      <div className="mt-5 space-y-3">
                        {dashboard.reports.active.slice(0, 6).map((report) => (
                          <div
                            key={report.id}
                            className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {report.triageSlug}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                                  {report.status}
                                </p>
                              </div>
                              <p className="text-xs text-slate-500">
                                {formatDate(
                                  report.completedAt || report.createdAt,
                                )}
                              </p>
                            </div>
                            {report.summary && (
                              <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                                {report.summary}
                              </p>
                            )}
                          </div>
                        ))}
                        {dashboard.reports.total === 0 && (
                          <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                            Ainda não há relatórios vinculados. Assim que uma
                            triagem entrar em processamento, ela aparece aqui.
                          </div>
                        )}
                      </div>
                    </section>
                  </div>
                </section>

                <aside className="space-y-6">
                  <section
                    className={`rounded-[1.75rem] border p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-6 ${renewalTone(dashboard.renewalCard.status)}`}
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                      Renovação e continuidade
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      {dashboard.renewalCard.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {dashboard.renewalCard.body}
                    </p>
                    {dashboard.renewalCard.note && (
                      <p className="mt-4 rounded-[1.1rem] border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-600">
                        {dashboard.renewalCard.note}
                      </p>
                    )}
                    {dashboard.renewalCard.cta && (
                      <Link
                        href={dashboard.renewalCard.cta.href}
                        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        {dashboard.renewalCard.cta.label}
                      </Link>
                    )}
                  </section>

                  <section className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                      Conta
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      {dashboard.profile?.name || "Conta em validação"}
                    </h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                          Email
                        </p>
                        <p className="mt-1 font-medium text-slate-900">
                          {dashboard.profile?.email ||
                            user.email ||
                            "Não informado"}
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4">
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                          WhatsApp
                        </p>
                        <p className="mt-1 font-medium text-slate-900">
                          {dashboard.profile?.whatsapp || "Adicionar no perfil"}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/perfil"
                      className="mt-4 inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      Atualizar perfil →
                    </Link>
                  </section>

                  <section
                    id="clinical"
                    className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                          Clínico
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-slate-900">
                          Handoff e consulta
                        </h2>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                        {dashboard.clinical.status}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-slate-600">
                      Última atualização clínica:{" "}
                      {formatDate(dashboard.clinical.lastUpdatedAt)}
                    </p>
                    <div className="mt-4 space-y-3">
                      {dashboard.clinical.timeline.slice(0, 4).map((event) => (
                        <div
                          key={event.id}
                          className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4"
                        >
                          <p className="text-sm font-semibold text-slate-900">
                            {event.label}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {event.description}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            {formatDate(event.at)}
                          </p>
                        </div>
                      ))}
                      {dashboard.clinical.timeline.length === 0 && (
                        <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                          Quando a jornada clínica for iniciada, cada etapa
                          aparecerá aqui de forma rastreável.
                        </div>
                      )}
                    </div>
                  </section>

                  <section
                    id="support"
                    className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-6"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                      Centro de suporte
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      Menos atrito, mais contexto
                    </h2>
                    <div className="mt-4 space-y-3">
                      {dashboard.notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`rounded-[1.25rem] border p-4 ${badgeClass(notification.level)}`}
                        >
                          <p className="text-sm font-semibold">
                            {notification.title}
                          </p>
                          <p className="mt-2 text-sm">{notification.body}</p>
                          {notification.cta && (
                            <Link
                              href={notification.cta.href}
                              className="mt-3 inline-flex text-sm font-semibold"
                            >
                              {notification.cta.label} →
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        Regras de suporte
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {dashboard.journey.supportRule}
                      </p>
                      <div className="mt-4 flex flex-col gap-3">
                        <Link
                          href={dashboard.support.whatsappUrl}
                          className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          Abrir WhatsApp de suporte
                        </Link>
                        <a
                          href={`mailto:${dashboard.support.email}`}
                          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                        >
                          {dashboard.support.email}
                        </a>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        FAQ contextual
                      </p>
                      <div className="mt-3 space-y-3">
                        {dashboard.journey.faq.map((item) => (
                          <div key={item.question}>
                            <p className="text-sm font-medium text-slate-900">
                              {item.question}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {item.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">
                          Saúde integral
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-slate-900">
                          Protocolos relacionados
                        </h2>
                      </div>
                      <Link
                        href="/protocolos"
                        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                      >
                        Ver todos
                      </Link>
                    </div>
                    <div className="mt-5 space-y-3">
                      {dashboard.relatedProtocols.map((protocol) => (
                        <Link
                          key={protocol.slug}
                          href={protocol.href}
                          className="block overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-50/70 transition hover:border-emerald-200 hover:bg-white"
                        >
                          <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-0">
                            <div className="relative min-h-[100px]">
                              <Image
                                src={protocol.imageSrc}
                                alt={protocol.title}
                                fill
                                className="object-cover"
                                sizes="92px"
                              />
                            </div>
                            <div className="p-4">
                              <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                                {protocol.badge}
                              </span>
                              <p className="mt-2 text-sm font-semibold text-slate-900">
                                {protocol.title}
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                {protocol.summary}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                </aside>
              </div>
            )}
          </div>
        </main>
      </LoggedLayout>
    </>
  );
}
