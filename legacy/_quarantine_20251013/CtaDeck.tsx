import React from 'react';
import { Button } from '@/components/ui/buttons';
import { Card } from '@/components/ui/Card';
import { t } from '@/lib/i18n';
import { getCtaDeck } from '@/lib/utm';

interface CtaDeckProps {
  context: string;
  triage?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'grid';
}

export function CtaDeck({ context, triage = 'gastro', className = '', variant = 'default' }: CtaDeckProps) {
  const ctaDeck = getCtaDeck(context, triage);

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {ctaDeck.map((cta) => (
          <Button
            key={cta.type}
            variant={cta.type === 'pass' || cta.type === 'gift' ? 'default' : 'outline'}
            size="sm"
            className="flex-1 min-w-[120px]"
            onClick={() => {
              if (cta.kind === 'external') {
                window.open(cta.href, '_blank', 'noopener,noreferrer');
              } else {
                window.location.href = cta.href;
              }
            }}
          >
            {cta.label}
          </Button>
        ))}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
        {ctaDeck.map((cta) => (
          <Card key={cta.type} className="p-4 hover:shadow-lg transition-shadow">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">{cta.label}</h3>
              <p className="text-sm text-muted-foreground">{cta.sub}</p>
              <Button
                variant={cta.type === 'pass' || cta.type === 'gift' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => {
                  if (cta.kind === 'external') {
                    window.open(cta.href, '_blank', 'noopener,noreferrer');
                  } else {
                    window.location.href = cta.href;
                  }
                }}
              >
                {cta.type === 'pass' ? 'Ativar' : 
                 cta.type === 'gift' ? 'Presentear' :
                 cta.type === 'products' ? 'Ver Produtos' : 'Falar com Médico'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Variant default
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-center">{t('report.cta_deck_hint')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ctaDeck.map((cta) => (
          <Card key={cta.type} className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center space-y-3">
              <h4 className="font-semibold">{cta.label}</h4>
              <p className="text-sm text-muted-foreground">{cta.sub}</p>
              <Button
                variant={cta.type === 'pass' || cta.type === 'gift' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => {
                  if (cta.kind === 'external') {
                    window.open(cta.href, '_blank', 'noopener,noreferrer');
                  } else {
                    window.location.href = cta.href;
                  }
                }}
              >
                {cta.type === 'pass' ? 'Ativar Passe' : 
                 cta.type === 'gift' ? 'Presentear' :
                 cta.type === 'products' ? 'Ver Produtos' : 'Falar com Médico'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CtaDeck;
