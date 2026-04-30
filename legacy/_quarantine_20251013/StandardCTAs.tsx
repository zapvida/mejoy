// src/components/ui/StandardCTAs.tsx
// Componente de CTAs padronizados conforme especificação

import React from 'react';
import { Button } from '@/components/ui/buttons';
import { Card } from './Card';
import { getCTAsWithUTMs, trackCTAClick, attachUTMsToURL } from '@/lib/ga4';
import { CreditCard, Gift, ShoppingBag, Stethoscope } from 'lucide-react';

interface StandardCTAsProps {
  triageType?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
  showIcons?: boolean;
}

export function StandardCTAs({ 
  triageType = 'geral', 
  className = '',
  variant = 'default',
  showIcons = true
}: StandardCTAsProps) {
  const ctas = getCTAsWithUTMs(triageType);
  
  const icons = {
    pass_49: <CreditCard className="w-5 h-5" />,
    gift_89: <Gift className="w-5 h-5" />,
    products_alloe: <ShoppingBag className="w-5 h-5" />,
    consult_zapvida: <Stethoscope className="w-5 h-5" />
  };

  const handleCTAClick = (ctaId: string, url: string) => {
    trackCTAClick(ctaId, triageType);
    
    // Anexar UTMs dinâmicos
    const finalUrl = attachUTMsToURL(url, triageType);
    
    // Abrir em nova aba para links externos
    if (url.includes('alloeoficial.com.br') || url.includes('zapvida.com')) {
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = finalUrl;
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`grid grid-cols-2 gap-3 ${className}`}>
        {ctas.map((cta) => (
          <Button
            key={cta.id}
            onClick={() => handleCTAClick(cta.id, cta.url)}
            className="text-sm py-2 px-3"
            variant={cta.id.includes('pass') || cta.id.includes('gift') ? 'default' : 'outline'}
          >
            {showIcons && icons[cta.id as keyof typeof icons]}
            <span className="ml-2">{cta.text}</span>
          </Button>
        ))}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {ctas.map((cta) => (
          <Button
            key={cta.id}
            onClick={() => handleCTAClick(cta.id, cta.url)}
            size="sm"
            variant={cta.id.includes('pass') || cta.id.includes('gift') ? 'default' : 'outline'}
          >
            {showIcons && icons[cta.id as keyof typeof icons]}
            <span className="ml-1">{cta.text}</span>
          </Button>
        ))}
      </div>
    );
  }

  // Variant default - cards
  return (
    <div className={`space-y-4 ${className}`}>
      {ctas.map((cta) => (
        <Card key={cta.id} className="p-4 hover:shadow-md transition-shadow">
          <Button
            onClick={() => handleCTAClick(cta.id, cta.url)}
            className="w-full justify-start"
            variant={cta.id.includes('pass') || cta.id.includes('gift') ? 'default' : 'outline'}
            size="lg"
          >
            {showIcons && icons[cta.id as keyof typeof icons]}
            <span className="ml-3">{cta.text}</span>
          </Button>
        </Card>
      ))}
    </div>
  );
}

// Componente específico para relatórios
export function ReportCTAs({ triageType }: { triageType: string }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        Próximos Passos
      </h3>
      <StandardCTAs triageType={triageType} />
      
      {/* Aviso legal */}
      <div className="mt-6 p-4 bg-brand/10 border border-border rounded-lg">
        <p className="text-sm text-brand text-center">
          <strong>⚠️ Aviso:</strong> Conteúdo educativo. Não substitui consulta médica. 
          Procure atendimento nos sinais de alerta.
        </p>
      </div>
    </div>
  );
}

// Componente específico para PDF
export function PDFCTAs({ triageType }: { triageType: string }) {
  return (
    <div className="mt-8 p-6 bg-muted rounded-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        Aproveite Mais
      </h3>
      <StandardCTAs triageType={triageType} variant="compact" />
      
      {/* Rodapé obrigatório */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          AlloeHealth é oferecido gratuitamente pela AlloeZil e pela ZapVida.
        </p>
      </div>
    </div>
  );
}
