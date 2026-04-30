import type { Step } from '@/types/triagem';

export const stepAceitaTermos: Step = {
  name: 'aceita_termos',
  type: 'select',
  label: 'Termos e consentimentos',
  description: 'Para sua segurança e conformidade legal, precisamos da sua confirmação:',
  required: true,
  options: [
    {
      value: 'aceito',
      label: 'Li e concordo com os Termos de Uso, a Política de Privacidade (LGPD), o uso de Inteligência Artificial para geração de relatórios e a realização de atendimentos por Telemedicina, conforme normas vigentes.',
    },
  ],
  helperText: 'Ao marcar esta opção, você confirma que leu e aceita todos os termos necessários para continuar.',
  justification: 'Conformidade LGPD e regulamentação de telemedicina.',
  legalLinks: [
    { label: 'Termos de Uso', href: '/termos' },
    { label: 'Política de Privacidade (LGPD)', href: '/politicas-lgpd' },
    { label: 'Uso de Inteligência Artificial', href: '/uso-ia' },
    { label: 'Telemedicina', href: '/telemedicina' },
  ],
};
