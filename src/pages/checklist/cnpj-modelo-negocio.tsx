import { InteractiveChecklist, ChecklistSection } from '@/components/checklist/InteractiveChecklist';
import Seo from '@/components/Seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ChecklistCNPJModeloNegocio() {
  const sections: ChecklistSection[] = [
    {
      id: 'empresa-intermediadora',
      title: '📋 Empresa Intermediadora e CNPJ',
      icon: '🏢',
      items: [
        {
          id: 'cnpj-configurado',
          title: 'CNPJ Real Configurado',
          description: 'Configurar variável NEXT_PUBLIC_LEGAL_CNPJ com CNPJ real da empresa (não placeholder)',
          status: 'pending',
          priority: 'high',
          actionItems: [
            'Obter CNPJ da empresa MeJoy Tecnologia em Saúde Ltda.',
            'Atualizar variável de ambiente no Vercel',
            'Verificar se aparece corretamente nas políticas LGPD'
          ],
          estimatedTime: '15 min'
        },
        {
          id: 'endereco-configurado',
          title: 'Endereço Legal Real',
          description: 'Configurar NEXT_PUBLIC_LEGAL_ADDRESS com endereço completo da sede',
          status: 'pending',
          priority: 'high',
          actionItems: [
            'Confirmar endereço completo da sede',
            'Atualizar variável de ambiente',
            'Verificar nas políticas legais'
          ],
          estimatedTime: '10 min'
        },
        {
          id: 'dpo-definido',
          title: 'DPO/Encarregado de Dados Definido',
          description: 'Nome, email e telefone do DPO configurados e publicados',
          status: 'pending',
          priority: 'high',
          actionItems: [
            'Definir pessoa responsável pelo DPO',
            'Configurar NEXT_PUBLIC_DPO_NAME, EMAIL e PHONE',
            'Publicar nas políticas de privacidade'
          ],
          estimatedTime: '30 min'
        },
        {
          id: 'modelo-intermediador-definido',
          title: 'Modelo Intermediador Documentado',
          description: 'Texto claro explicando que não somos farmácia nem clínica diretamente',
          status: 'complete',
          priority: 'medium',
        },
      ],
    },
    {
      id: 'parcerias-operacionais',
      title: '🤝 Parcerias Operacionais',
      icon: '🤝',
      items: [
        {
          id: 'clinica-monjoy',
          title: 'Clínica MeJoy Identificada',
          description: 'Parceria com clínica médica para realização de consultas',
          status: 'complete',
          priority: 'medium',
        },
        {
          id: 'cnes-validado',
          title: 'CNES MeJoy Validado',
          description: 'Validar com jurídico se precisa CNES e se está registrado',
          status: 'pending',
          priority: 'high',
          actionItems: [
            'Consultar jurídico sobre necessidade de CNES',
            'Verificar se clínica MeJoy tem CNES registrado',
            'Documentar decisão'
          ],
          estimatedTime: '1-2 dias'
        },
        {
          id: 'farmacias-listadas',
          title: 'Farmácias Credenciadas Reais',
          description: 'Substituir dados placeholder por farmácias reais com CNPJ, CRF e responsável técnico',
          status: 'pending',
          priority: 'high',
          actionItems: [
            'Identificar farmácias parceiras',
            'Coletar CNPJ, CRF e dados do responsável técnico',
            'Atualizar componente PharmaciesSection.tsx'
          ],
          estimatedTime: '2-3 dias'
        },
        {
          id: 'contratos-farmacias',
          title: 'Contratos com Farmácias Assinados',
          description: 'Estabelecer parcerias formais para dispensação de medicamentos',
          status: 'pending',
          priority: 'high',
          estimatedTime: '1-2 semanas'
        },
      ],
    },
    {
      id: 'beneficios-planos',
      title: '🎯 Benefícios dos Planos',
      icon: '🎯',
      items: [
        {
          id: 'consulta-medica',
          title: 'Consulta Médica Online',
          description: 'Sistema de consulta online com endocrinologista',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'relatorio-personalizado',
          title: 'Relatório Personalizado',
          description: 'Relatório gerado por IA e validado por médico',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'balanca-inteligente',
          title: 'Balança Inteligente Conectada',
          description: 'Parceria para fornecimento de balanças inteligentes (plano Start GLP-1)',
          status: 'pending',
          priority: 'medium',
          actionItems: [
            'Identificar fornecedor de balanças inteligentes',
            'Negociar parceria/compras',
            'Integrar com app'
          ],
          estimatedTime: '2-3 semanas'
        },
        {
          id: 'acompanhamento-whatsapp',
          title: 'Acompanhamento WhatsApp Estruturado',
          description: 'Sistema de check-ins semanais e suporte via WhatsApp',
          status: 'partial',
          priority: 'medium',
          actionItems: [
            'Estruturar fluxo de check-ins',
            'Definir horários e frequência',
            'Treinar equipe'
          ],
          estimatedTime: '1 semana'
        },
        {
          id: 'grupo-vip',
          title: 'Grupo VIP WhatsApp',
          description: 'Infraestrutura para grupos VIP com pacientes e equipe médica (plano 3 Meses)',
          status: 'pending',
          priority: 'medium',
          actionItems: [
            'Criar estrutura de grupos',
            'Definir regras e moderação',
            'Treinar equipe médica'
          ],
          estimatedTime: '1 semana'
        },
        {
          id: 'encontros-online',
          title: 'Encontros Online em Grupo',
          description: 'Plataforma para encontros com médico e nutricionista (plano 6 Meses)',
          status: 'pending',
          priority: 'low',
          actionItems: [
            'Escolher plataforma (Zoom/Google Meet)',
            'Criar calendário de encontros',
            'Definir formato e duração'
          ],
          estimatedTime: '1 semana'
        },
        {
          id: 'plano-manutencao',
          title: 'Plano de Manutenção de Peso',
          description: 'Protocolo para evitar reganho de peso (plano 6 Meses Premium)',
          status: 'pending',
          priority: 'low',
          estimatedTime: '2 semanas'
        },
      ],
    },
    {
      id: 'conformidade-regulatoria',
      title: '⚖️ Conformidade Regulatória',
      icon: '⚖️',
      items: [
        {
          id: 'disclaimers-anvisa',
          title: 'Disclaimers ANVISA Presentes',
          description: 'Disclaimers obrigatórios nas páginas e relatórios',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'validacao-medica',
          title: 'Validação Médica Obrigatória',
          description: 'Sistema implementado para médico revisar prescrições',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'prontuario-completo',
          title: 'Prontuário Eletrônico Completo',
          description: 'Registra data/hora, canal, conteúdo, assinatura digital, retenção 20 anos',
          status: 'partial',
          priority: 'high',
          actionItems: [
            'Verificar se todos os campos estão sendo registrados',
            'Garantir assinatura digital do médico',
            'Configurar retenção de 20 anos'
          ],
          estimatedTime: '1 semana'
        },
        {
          id: 'termo-telemedicina',
          title: 'Termo Consentimento Telemedicina',
          description: 'Termo específico antes da consulta (validar com jurídico)',
          status: 'partial',
          priority: 'high',
          actionItems: [
            'Criar termo específico',
            'Validar com jurídico',
            'Integrar no fluxo antes da consulta'
          ],
          estimatedTime: '1 semana'
        },
        {
          id: 'crm-validado',
          title: 'CRM Médicos Validado',
          description: 'Validar que todos os médicos têm CRM ativo na jurisdição correta',
          status: 'pending',
          priority: 'high',
          estimatedTime: '2-3 dias'
        },
      ],
    },
    {
      id: 'integracao-logistica',
      title: '🚚 Integração e Logística',
      icon: '🚚',
      items: [
        {
          id: 'integracao-farmacias',
          title: 'Integração com Farmácias',
          description: 'Sistema para enviar prescrições validadas às farmácias parceiras',
          status: 'pending',
          priority: 'high',
          estimatedTime: '2-3 semanas'
        },
        {
          id: 'logistica-entrega',
          title: 'Logística de Entrega',
          description: 'Parceria com transportadoras ou farmácias para entrega em domicílio',
          status: 'pending',
          priority: 'high',
          estimatedTime: '2-3 semanas'
        },
        {
          id: 'equipe-medica-escalavel',
          title: 'Equipe Médica Escalável',
          description: 'Rede de médicos endocrinologistas para validar prescrições em tempo hábil',
          status: 'partial',
          priority: 'high',
          actionItems: [
            'Recrutar mais médicos',
            'Definir SLA de resposta',
            'Criar sistema de escalonamento'
          ],
          estimatedTime: '1-2 semanas'
        },
        {
          id: 'suporte-cliente',
          title: 'Suporte ao Cliente',
          description: 'Canal de suporte (WhatsApp/email) para dúvidas sobre medicamentos e tratamento',
          status: 'partial',
          priority: 'medium',
          estimatedTime: '1 semana'
        },
      ],
    },
  ];

  return (
    <>
      <Seo
        title="Checklist: Validação CNPJ e Modelo de Negócio | MeJoy"
        description="Checklist interativo para validação do CNPJ e modelo de negócio intermediador"
        path="/checklist/cnpj-modelo-negocio"
      />
      <Navbar />
      <InteractiveChecklist
        title="Validação CNPJ e Modelo de Negócio Intermediador"
        subtitle="Comparação com Voy Saúde e Teladoc Health - Checklist Interativo"
        sections={sections}
        storageKey="checklist-cnpj-modelo-negocio"
        showFilters={true}
        showSearch={true}
      />
      <Footer />
    </>
  );
}

