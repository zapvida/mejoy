import type { Step } from '@/types/triagem';

export const stepIdadeFaixa: Step = {
  name: 'idade_faixa',
  type: 'select',
  label: 'Qual sua faixa etária?',
  options: [
    { value: '18-30', label: '18–30 anos' },
    { value: '31-45', label: '31–45 anos' },
    { value: '46-60', label: '46–60 anos' },
    { value: '61+', label: '61 anos ou mais' },
  ],
  required: true,
  helperText: 'Essa informação ajuda a personalizar recomendações.',
  justification: 'Necessário para adequação de tratamento.',
};

export const stepSexo: Step = {
  name: 'sexo',
  type: 'select',
  label: 'Qual seu sexo?',
  options: [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'Outro', label: 'Outro' },
    { value: 'Prefiro não dizer', label: 'Prefiro não dizer' },
  ],
  required: true,
  helperText: 'Essa informação ajuda a personalizar recomendações.',
  justification: 'Necessário para adequação de tratamento.',
};
