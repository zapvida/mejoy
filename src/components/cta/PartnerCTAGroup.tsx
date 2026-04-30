// src/components/cta/PartnerCTAGroup.tsx
// Grupo de CTAs de parceiros com ordenação dinâmica

import React from 'react';

import PartnerCTA from './PartnerCTA';

import { getPartnerOrder } from '@/config/partners';

interface PartnerCTAGroupProps {
  partners: string[];
  context: string;
  variant?: 'primary' | 'light' | 'inline';
  redFlags?: string[];
  triageId?: string;
  reportId?: string;
  fullWidth?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export default function PartnerCTAGroup({
  partners,
  context,
  variant = 'primary',
  redFlags = [],
  triageId,
  reportId,
  fullWidth = false,
  className = '',
  orientation = 'horizontal',
}: PartnerCTAGroupProps) {
  // Ordenação dinâmica baseada em contexto e red flags
  const orderedPartners = React.useMemo(() => {
    const availablePartners = partners.filter(p => ['zapfarm', 'zapvida'].includes(p));
    const dynamicOrder = getPartnerOrder(context, redFlags);
    
    // Manter ordem dinâmica mas só incluir parceiros disponíveis
    return dynamicOrder.filter(p => availablePartners.includes(p));
  }, [partners, context, redFlags]);

  if (orderedPartners.length === 0) return null;

  const containerClasses = orientation === 'vertical' 
    ? 'flex flex-col gap-3' 
    : 'flex flex-col sm:flex-row gap-3 sm:gap-4';

  return (
    <div className={`${containerClasses} ${className}`}>
      {orderedPartners.map((partnerId, index) => (
        <PartnerCTA
          key={partnerId}
          partnerId={partnerId}
          context={context}
          variant={variant}
          fullWidth={fullWidth}
          content={`${context}_${partnerId}_${index === 0 ? 'primary' : 'secondary'}`}
          triageId={triageId}
          reportId={reportId}
        />
      ))}
    </div>
  );
}
