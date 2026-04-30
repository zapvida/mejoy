import { InteractiveChecklist, ChecklistSection } from '@/components/checklist/InteractiveChecklist';
import Seo from '@/components/Seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export async function getServerSideProps() {
  return { props: {} };
}

export default function ChecklistReuniaoInvestidores() {
  const sections: ChecklistSection[] = [
    {
      id: 'cookie-lgpd',
      title: '🍪 Cookie Banner e LGPD',
      icon: '🍪',
      items: [
        {
          id: 'cookie-banner-implementado',
          title: 'Cookie Banner Implementado',
          description: 'Componente criado e integrado no _app.tsx',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'api-consentimento',
          title: 'API de Consentimento',
          description: 'API /api/lgpd/cookie-consent criada e funcionando',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'design-responsivo',
          title: 'Design Responsivo e Conformidade LGPD',
          description: 'Preferências salvas em cookies + Supabase',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'link-gerenciar-cookies',
          title: 'Link "Gerenciar Cookies" no Footer',
          description: 'Permite usuário alterar preferências a qualquer momento',
          status: 'complete',
          priority: 'medium',
        },
      ],
    },
    {
      id: 'politicas-legais',
      title: '📜 Políticas Legais',
      icon: '📜',
      items: [
        {
          id: 'politica-privacidade',
          title: 'Política de Privacidade',
          description: '/privacidade - Completa e publicada',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'politica-lgpd',
          title: 'Política LGPD',
          description: '/politicas-lgpd - Completa e publicada',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'termos-uso',
          title: 'Termos de Uso',
          description: '/termos - Completo e publicado',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'termo-telemedicina',
          title: 'Termo de Consentimento Telemedicina',
          description: 'No fluxo de triagem (validar com jurídico)',
          status: 'partial',
          priority: 'high',
          estimatedTime: '1 semana'
        },
        {
          id: 'termo-uso-ia',
          title: 'Termo de Uso de IA',
          description: 'Mencionado na triagem (validar com jurídico)',
          status: 'partial',
          priority: 'medium',
          estimatedTime: '1 semana'
        },
      ],
    },
    {
      id: 'fluxo-emagrecimento',
      title: '💊 Fluxo de Emagrecimento',
      icon: '💊',
      items: [
        {
          id: 'landing-page',
          title: 'Landing Page (LPAC)',
          description: '/obesidade funcionando com CTAs corretos',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'triagem-completa',
          title: 'Triagem Completa',
          description: '15 perguntas, validações clínicas, cálculo IMC automático',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'relatorio-gerando',
          title: 'Relatório Gerando Corretamente',
          description: 'IA configurada como endocrinologista, pré-prescrição condicional',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'checkout-funcionando',
          title: 'Checkout Funcionando',
          description: '3 planos, preços corretos, integração Asaas',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'validacao-medica',
          title: 'Validação Médica Obrigatória',
          description: 'Médico revisa e aprova prescrições antes de envio',
          status: 'complete',
          priority: 'high',
        },
      ],
    },
    {
      id: 'precos-env-vars',
      title: '💰 Preços e Variáveis de Ambiente',
      icon: '💰',
      items: [
        {
          id: 'precos-codigo',
          title: 'Preços Atualizados no Código',
          description: '12x de R$ 349, 399, 449 (config centralizada)',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'env-var-basico',
          title: 'Env Var BÁSICO Configurada',
          description: 'ASAAS_PRICE_EMAGRECIMENTO_BASICO=418800 (R$ 4.188,00)',
          status: 'pending',
          priority: 'high',
          actionItems: [
            'Verificar no Vercel se está configurada',
            'Testar criação de pagamento',
            'Validar valor em centavos'
          ],
          estimatedTime: '5 min'
        },
        {
          id: 'env-var-completo',
          title: 'Env Var COMPLETO Configurada',
          description: 'ASAAS_PRICE_EMAGRECIMENTO_COMPLETO=478800 (R$ 4.788,00)',
          status: 'pending',
          priority: 'high',
          estimatedTime: '5 min'
        },
        {
          id: 'env-var-premium',
          title: 'Env Var PREMIUM Configurada',
          description: 'ASAAS_PRICE_EMAGRECIMENTO_PREMIUM=538800 (R$ 5.388,00)',
          status: 'pending',
          priority: 'high',
          estimatedTime: '5 min'
        },
        {
          id: 'supabase-configurado',
          title: 'Supabase Configurado',
          description: 'URL e Keys configuradas corretamente',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'openai-configurado',
          title: 'OpenAI Configurado',
          description: 'API Key configurada e funcionando',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'asaas-configurado',
          title: 'Asaas Configurado',
          description: 'API Key e Webhook configurados',
          status: 'complete',
          priority: 'high',
        },
      ],
    },
    {
      id: 'conformidade-medica',
      title: '🏥 Conformidade Médica e Telemedicina',
      icon: '🏥',
      items: [
        {
          id: 'crm-medicos-ativo',
          title: 'CRM Médicos Ativo',
          description: 'Validar que todos os médicos têm CRM ativo',
          status: 'pending',
          priority: 'high',
          estimatedTime: '2-3 dias'
        },
        {
          id: 'crm-jurisdicao',
          title: 'CRM na Jurisdição Correta',
          description: 'Validar CRM válido na jurisdição do paciente',
          status: 'pending',
          priority: 'high',
          estimatedTime: '2-3 dias'
        },
        {
          id: 'cnes-monjoy',
          title: 'CNES da Clínica Me Joy',
          description: 'Validar necessidade e registro CNES',
          status: 'pending',
          priority: 'high',
          estimatedTime: '1-2 dias'
        },
        {
          id: 'prontuario-data-hora',
          title: 'Prontuário Registra Data/Hora',
          description: 'Garantir que prontuário registra data e hora da consulta',
          status: 'partial',
          priority: 'high',
          estimatedTime: '1 semana'
        },
        {
          id: 'prontuario-canal',
          title: 'Prontuário Registra Canal',
          description: 'Registrar se foi vídeo, áudio ou texto',
          status: 'partial',
          priority: 'medium',
          estimatedTime: '1 semana'
        },
        {
          id: 'prontuario-conteudo',
          title: 'Prontuário Registra Conteúdo Clínico',
          description: 'Registrar conteúdo relevante da consulta',
          status: 'partial',
          priority: 'high',
          estimatedTime: '1 semana'
        },
        {
          id: 'assinatura-digital',
          title: 'Assinatura Digital do Médico',
          description: 'Garantir assinatura digital no prontuário',
          status: 'partial',
          priority: 'high',
          estimatedTime: '1 semana'
        },
        {
          id: 'retencao-20-anos',
          title: 'Retenção Mínima de 20 Anos',
          description: 'Garantir retenção de prontuários por 20 anos',
          status: 'partial',
          priority: 'high',
          estimatedTime: '1 semana'
        },
      ],
    },
    {
      id: 'testes-validacao',
      title: '🧪 Testes e Validação',
      icon: '🧪',
      items: [
        {
          id: 'lint-passando',
          title: 'Lint Passando',
          description: '0 erros, 0 warnings',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'typescript-compilando',
          title: 'TypeScript Compilando',
          description: '0 erros de tipo',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'build-passando',
          title: 'Build Passando',
          description: 'Build sem erros',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'testes-unitarios',
          title: 'Testes Unitários',
          description: 'Se houver, executar e validar',
          status: 'pending',
          priority: 'low',
        },
        {
          id: 'testes-e2e',
          title: 'Testes E2E',
          description: 'Fluxo completo testado (LPAC → Triagem → Relatório → Checkout)',
          status: 'pending',
          priority: 'medium',
          estimatedTime: '15 min'
        },
        {
          id: 'testado-chrome',
          title: 'Testado em Chrome',
          description: 'Validar funcionamento no Chrome',
          status: 'pending',
          priority: 'medium',
          estimatedTime: '10 min'
        },
        {
          id: 'testado-mobile',
          title: 'Testado em Mobile',
          description: 'iOS e Android',
          status: 'pending',
          priority: 'medium',
          estimatedTime: '15 min'
        },
        {
          id: 'performance-lighthouse',
          title: 'Performance Lighthouse > 90',
          description: 'Testar e validar performance',
          status: 'pending',
          priority: 'low',
          estimatedTime: '10 min'
        },
      ],
    },
    {
      id: 'documentacao-investidor',
      title: '📊 Documentação para Investidor',
      icon: '📊',
      items: [
        {
          id: 'fluxograma-completo',
          title: 'Fluxograma Completo da Triagem',
          description: 'Documento visual criado',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'mapas-visuais',
          title: 'Mapas Visuais',
          description: 'Mapas visuais da triagem criados',
          status: 'complete',
          priority: 'high',
        },
        {
          id: 'arquitetura-sistema',
          title: 'Arquitetura do Sistema',
          description: 'Diagrama de arquitetura (se necessário)',
          status: 'pending',
          priority: 'low',
        },
        {
          id: 'stack-tecnologico',
          title: 'Stack Tecnológico Documentado',
          description: 'Lista de tecnologias usadas',
          status: 'pending',
          priority: 'low',
        },
        {
          id: 'modelo-receita',
          title: 'Modelo de Receita Documentado',
          description: 'Como a empresa gera receita',
          status: 'pending',
          priority: 'medium',
        },
        {
          id: 'projecoes-financeiras',
          title: 'Projeções Financeiras',
          description: 'Se houver, preparar projeções',
          status: 'pending',
          priority: 'low',
        },
        {
          id: 'metricas-conversao',
          title: 'Métricas de Conversão',
          description: 'Estimativas de conversão',
          status: 'pending',
          priority: 'medium',
        },
        {
          id: 'diferenciais-competitivos',
          title: 'Diferenciais Competitivos',
          description: 'Documentar diferenciais',
          status: 'pending',
          priority: 'medium',
        },
        {
          id: 'pitch-deck',
          title: 'Pitch Deck Preparado',
          description: 'Apresentação para investidores',
          status: 'pending',
          priority: 'high',
          estimatedTime: '2-3 horas'
        },
        {
          id: 'demo-funcionando',
          title: 'Demo Funcionando',
          description: 'Demo pronta para apresentação',
          status: 'complete',
          priority: 'high',
        },
      ],
    },
  ];

  return (
    <>
      <Seo
        title="Checklist: Reunião com Investidores | Me Joy"
        description="Checklist interativo para reunião com investidores - Me Joy Emagrecimento"
        path="/checklist/reuniao-investidores"
      />
      <Navbar />
      <InteractiveChecklist
        title="Checklist Final - Reunião com Investidores"
        subtitle="Me Joy Emagrecimento - Padrão Voy Saúde"
        sections={sections}
        storageKey="checklist-reuniao-investidores"
        showFilters={true}
        showSearch={true}
      />
      <Footer />
    </>
  );
}

