import type { MouseEvent } from "react";

import type { Report } from "@/lib/report/types";

type CTAConfig = {
  id: string;
  label: string;
  subtitle: string;
  href: string;
  tone: "primary" | "secondary";
  emoji: string;
};

const determinePrimaryCTA = (report: Report, overrideCtaId?: "consulta" | "premium" | "whatsapp"): CTAConfig => {
  // Override por query param para A/B testing
  if (overrideCtaId === "consulta") {
    return {
      id: "cta_medical_immediate",
      label: "Consulta médica imediata",
      subtitle: "Conecte-se com um especialista para revisar seu relatório agora.",
      href: "/atendimento?utm_source=relatorio&utm_medium=cta&utm_campaign=ab_test",
      tone: "primary",
      emoji: "🩺",
    };
  }

  if (overrideCtaId === "premium") {
    return {
      id: "cta_unlock_premium",
      label: "Desbloquear acompanhamento premium",
      subtitle: "Relatórios avançados, consultas dedicadas e monitoramento contínuo.",
      href: "/pricing?utm_source=relatorio&utm_medium=cta&utm_campaign=ab_test&plan=MONTHLY_49",
      tone: "primary",
      emoji: "🚀",
    };
  }

  if (overrideCtaId === "whatsapp") {
    return {
      id: "cta_whatsapp",
      label: "Falar no WhatsApp",
      subtitle: "Converse diretamente com nossa equipe médica via WhatsApp.",
      href: "https://wa.me/5511999999999?text=Olá, gostaria de falar sobre meu relatório de saúde",
      tone: "primary",
      emoji: "💬",
    };
  }

  // Lógica padrão (fallback)
  const hasDanger = report.alerts.some(alert => alert.level === "danger");
  if (hasDanger) {
    return {
      id: "cta_medical_immediate",
      label: "Atendimento médico imediato",
      subtitle: "Conecte-se com um especialista para revisar sinais críticos agora.",
      href: "/atendimento?utm_source=relatorio&utm_medium=cta",
      tone: "primary",
      emoji: "🩺",
    };
  }

  if (report.features?.enablePremiumUpsell) {
    return {
      id: "cta_unlock_premium",
      label: "Desbloquear acompanhamento premium",
      subtitle: "Relatórios avançados, consultas dedicadas e monitoramento contínuo.",
      href: "/pricing?utm_source=relatorio&utm_medium=cta&plan=MONTHLY_49",
      tone: "primary",
      emoji: "🚀",
    };
  }

  return {
    id: "cta_follow_up",
    label: "Agendar follow-up",
    subtitle: "Reserve 30 minutos com nosso time para revisar seu progresso.",
    href: "/agendamentos?utm_source=relatorio",
    tone: "secondary",
    emoji: "📅",
  };
};

const shareCTA: CTAConfig = {
  id: "cta_share_whatsapp",
  label: "Compartilhar plano por WhatsApp",
  subtitle: "Envie para um familiar ou cuidador acompanhar com você.",
  href: "/share/whatsapp",
  tone: "secondary",
  emoji: "💬",
};

const pdfCTA: CTAConfig = {
  id: "cta_print_pdf",
  label: "Baixar laudo em PDF",
  subtitle: "Gerar laudo estilo laboratório para compartilhar com médicos.",
  href: "#print",
  tone: "secondary",
  emoji: "📄",
};

// eslint-disable-next-line no-unused-vars
type TrackCTAHandler = (ctaId: string) => void;

type PrimaryCTAsProps = {
  report: Report;
  onRequestPrint?: () => void;
  onCTAClick?: TrackCTAHandler;
  overrideCtaId?: "consulta" | "premium" | "whatsapp";
};

export function PrimaryCTAs({ report, onRequestPrint, onCTAClick, overrideCtaId }: PrimaryCTAsProps) {
  const primary = determinePrimaryCTA(report, overrideCtaId);
  const secondaryButtons: CTAConfig[] = [];
  if (report.features?.enableShare !== false) {
    secondaryButtons.push(shareCTA);
  }
  if (onRequestPrint) {
    secondaryButtons.push(pdfCTA);
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 text-white shadow-[0_22px_55px_rgba(6,10,30,0.35)] print:hidden">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Próximo passo</p>
        <h3 className="mt-1 text-2xl font-semibold">{primary.emoji} {primary.label}</h3>
        <p className="mt-2 text-sm text-white/70">{primary.subtitle}</p>
      </header>

      <a
        className="inline-flex items-center justify-center gap-3 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        href={primary.href}
        target="_blank"
        rel="noreferrer"
        onClick={() => onCTAClick?.(primary.id)}
      >
        {primary.emoji} {primary.label}
      </a>

      <div className="grid gap-3 sm:grid-cols-2">
        {secondaryButtons.map(cta => (
          <ButtonOrLink key={cta.label} action={cta} {...(onRequestPrint ? { onRequestPrint } : {})} {...(onCTAClick ? { onCTAClick } : {})} />
        ))}
      </div>
    </div>
  );
}

type ButtonOrLinkProps = {
  action: CTAConfig;
  onRequestPrint?: () => void;
  onCTAClick?: TrackCTAHandler;
};

function ButtonOrLink({ action, onRequestPrint, onCTAClick }: ButtonOrLinkProps) {
  const isPrint = action === pdfCTA;
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onCTAClick?.(action.id);
    onRequestPrint?.();
  };

  if (isPrint) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex h-full w-full flex-col items-start justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/75 transition hover:border-white/30 hover:text-white"
      >
        <span className="text-base font-semibold">{pdfCTA.emoji} {pdfCTA.label}</span>
        <span className="text-xs text-white/50">{pdfCTA.subtitle}</span>
      </button>
    );
  }

  return (
    <a
      href={action.href}
      target="_blank"
      rel="noreferrer"
      onClick={() => onCTAClick?.(action.id)}
      className="inline-flex h-full w-full flex-col items-start justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/75 transition hover:border-white/30 hover:text-white"
    >
      <span className="text-base font-semibold">{action.emoji} {action.label}</span>
      <span className="text-xs text-white/50">{action.subtitle}</span>
    </a>
  );
}
