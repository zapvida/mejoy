// src/components/cta/PartnerCTA.tsx
// Componente único para CTAs de parceiros com variantes responsivas

import Link from 'next/link';
import React from 'react';

import { buildPartnerUrl, getPartnerLabel } from '@/config/partners';
import { trackFunnelEvent } from '@/lib/funnel/events-client';
import { createClinicalHandoff } from '@/lib/handoff/client';

interface PartnerCTAProps {
  partnerId: string;
  context: string;
  variant?: 'primary' | 'light' | 'inline';
  className?: string;
  fullWidth?: boolean;
  content?: string;
  triageId?: string;
  reportId?: string;
  onClick?: () => void;
}

export default function PartnerCTA({
  partnerId,
  context,
  variant = 'primary',
  className = '',
  fullWidth = false,
  content,
  triageId,
  reportId,
  onClick,
}: PartnerCTAProps) {
  const partner = React.useMemo(() => {
    const partners = {
      zapfarm: {
        id: 'zapfarm',
        name: 'MeJoy',
        icon: '🌿',
        description: 'Suplementos para saúde gastrointestinal',
        copy: {
          title: "Plano digestivo com base no seu caso",
          subtitle: "Veja como começar hoje, de forma simples.",
        }
      },
      zapvida: {
        id: 'zapvida',
        name: 'ZapVida',
        icon: '🩺',
        description: 'Atendimento médico digital',
        copy: {
          title: "Fale com um médico agora (WhatsApp)",
          subtitle: "Atendimento em minutos. Sem burocracia.",
        }
      },
    };
    return partners[partnerId as keyof typeof partners];
  }, [partnerId]);

  if (!partner) return null;

  const href = buildPartnerUrl(partnerId, context, content);
  const label = partner.copy?.title || getPartnerLabel(partnerId, context);
  const shouldUseHandoff =
    partnerId === 'zapvida' &&
    (context === 'triage_done' || context === 'gi_report') &&
    !!(triageId || reportId);
  const [isLoadingHandoff, setIsLoadingHandoff] = React.useState(false);

  const baseClasses = 'inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-brand text-white hover:bg-brand-600 shadow-lg hover:shadow-xl',
    light: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm',
    inline: 'text-brand hover:text-brand-600 underline-offset-4 hover:underline',
  };

  const sizeClasses = variant === 'inline' 
    ? 'text-sm font-medium px-2 py-1' 
    : 'min-h-[44px] min-w-[44px] px-4 py-3 text-base font-semibold rounded-lg';

  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${widthClasses} ${className}`;

  const handleClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Tracking opcional
    if (shouldUseHandoff) {
      event.preventDefault();
      if (isLoadingHandoff) return;
      setIsLoadingHandoff(true);
      trackFunnelEvent('cta_clinical_handoff', {
        source: context,
        triage_id: triageId,
        report_id: reportId
      });
      try {
        const json = await createClinicalHandoff({
          triageId: triageId || reportId || '',
          reportId: reportId,
          sourceJourney: context === 'triage_done' ? 'emagrecimento.triage_complete' : 'emagrecimento.report',
          sourceOrigin: context
        });

        trackFunnelEvent('handoff_created', {
          triage_id: triageId,
          report_id: reportId
        });
        trackFunnelEvent('handoff_opened', {
          triage_id: triageId,
          report_id: reportId
        });
        window.location.href = json.redirectUrl;
        return;
      } catch (error) {
        console.error('[PartnerCTA] Erro no handoff ZapVida:', error);
        trackFunnelEvent('handoff_failed', {
          triage_id: triageId,
          report_id: reportId,
          origin: context,
          surface: 'partner_cta'
        });
        // Fallback resiliente: mantém continuidade mesmo se handoff falhar.
        window.location.href = href;
      } finally {
        setIsLoadingHandoff(false);
      }
    }

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'partner_cta_click', {
        partner: partnerId,
        context,
        label,
      });
    }
    onClick?.();
  };

  return (
    <Link
      href={href}
      target={shouldUseHandoff ? undefined : '_blank'}
      rel={shouldUseHandoff ? undefined : 'noopener noreferrer'}
      className={buttonClasses}
      onClick={handleClick}
      aria-label={`${label} - ${partner.description}`}
    >
      <span className="text-lg" aria-hidden="true">
        {partner.icon}
      </span>
      <span>{isLoadingHandoff ? 'Conectando...' : label}</span>
    </Link>
  );
}
