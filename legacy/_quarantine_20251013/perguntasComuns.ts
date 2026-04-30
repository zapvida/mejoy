// src/forms/perguntasComuns.ts
import type { Step } from '@/types/triagem';

export const getPerguntasComuns = (jaPreenchido: boolean): Step[] => {
  if (jaPreenchido) return []; // já está preenchido, não mostrar
  return [
    {
      type: 'setor',
      name: 'setor_dados_pessoais',
      label: '👤 Dados Pessoais e Antropometria',
      description:
        'Esses dados ajudam na análise de riscos e são essenciais para personalização das recomendações de saúde.',
    },
    {
      type: 'select',
      name: 'sexo',
      label: 'Qual seu sexo biológico?',
      description: 'Importante para cálculos hormonais e metabólicos.',
      justification: 'Fonte: Sociedade Brasileira de Endocrinologia, 2023',
      options: [
        { value: 'Masculino', label: '🧍‍♂️ Masculino' },
        { value: 'Feminino', label: ' 🧍‍♀️ Feminino' },
      ],
      required: true,
    },
    {
      type: 'text',
      name: 'dataNascimento',
      label: 'Data de nascimento',
      placeholder: 'dd/mm/aaaa',
      description: 'A idade impacta diretamente em fatores de risco e recomendações.',
      justification: 'Fonte: Ministério da Saúde, 2022',
      required: true,
    },
    {
      type: 'text',
      name: 'altura',
      label: 'Altura (em cm)',
      placeholder: 'Ex: 170',
      description: 'Importante para cálculo do IMC e avaliação de composição corporal.',
      justification: 'Fonte: WHO, 2021',
      required: true,
    },
    {
      type: 'text',
      name: 'peso',
      label: 'Peso (em kg)',
      placeholder: 'Ex: 70',
      description: 'Utilizado no cálculo do IMC e avaliação de saúde metabólica.',
      justification: 'Fonte: WHO, 2021',
      required: true,
    },
    {
      type: 'select',
      name: 'circunferencia_abdominal',
      label: 'Compare com seu perfil no espelho e selecione a imagem mais próxima de sua barriga 🪞👇',
      description: 'Imagens meramente ilustrativas para facilitar sua autoavaliação. Use um espelho e escolha o perfil mais próximo.',
      options: [
        {
          value: 'perfil_1',
          label: 'Menor que 90 cm',
          image: '/abdomen/male_funnel_belly_1.png',
        },
        {
          value: 'perfil_2',
          label: '90 a 100 cm',
          image: '/abdomen/male_funnel_belly_2.png',
        },
        {
          value: 'perfil_3',
          label: '100 a 110 cm',
          image: '/abdomen/male_funnel_belly_3.png',
        },
        {
          value: 'perfil_4',
          label: '110 a 120 cm',
          image: '/abdomen/male_funnel_belly_4.png',
        },
      ],
      justification:
        'A circunferência abdominal é um dos principais marcadores de risco cardiometabólico e inflamação crônica.',
      example: 'Exemplo: Medida com fita métrica na altura do umbigo.',
      required: true,
      prioridade: 'alta',
      categoriaIA: 'nutricao',
    },
  ];
};