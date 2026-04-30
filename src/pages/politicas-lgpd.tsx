import Head from 'next/head';
import { Printer, ExternalLink, Shield, FileText, Lock, UserCheck, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Seo from '@/components/Seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Dados da empresa (via env vars com defaults)
const COMPANY = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Me Joy',
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || 'Me Joy Tecnologia em Saúde Ltda.',
  cnpj: process.env.NEXT_PUBLIC_LEGAL_CNPJ || '00.000.000/0001-00',
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || 'Rua Exemplo, 123 – Centro, Cidade/UF, Brasil',
  site: process.env.NEXT_PUBLIC_SITE || process.env.NEXT_PUBLIC_BASE_URL || 'https://zapfarm.com',
};

const DPO = {
  name: process.env.NEXT_PUBLIC_DPO_NAME || 'Fulano de Tal',
  email: process.env.NEXT_PUBLIC_DPO_EMAIL || 'privacidade@zapfarm.com',
  phone: process.env.NEXT_PUBLIC_DPO_PHONE || '+55 00 00000-0000',
};

const ANPD_URL = 'https://www.gov.br/anpd/pt-br';
const ANPD_CONTACT = 'https://www.gov.br/anpd/pt-br/canais-de-atendimento';

export default function PoliticasLGPD() {
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    setLastUpdate(new Date().toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = (subject: string, body: string) => {
    const mailto = `mailto:${DPO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto);
  };

  const handleLGPDRight = (right: string) => {
    const subject = `Exercer Direito LGPD - ${right}`;
    const body = `Olá,\n\nGostaria de exercer meu direito de ${right} conforme previsto no Art. 18 da LGPD.\n\nMeus dados:\n- Nome:\n- E-mail:\n- CPF:\n\nAtenciosamente.`;
    handleEmail(subject, body);
  };

  const sections = [
    { id: 'introducao', title: '1. Introdução' },
    { id: 'definicoes', title: '2. Definições' },
    { id: 'controladora', title: '3. Controladora e DPO' },
    { id: 'bases-legais', title: '4. Bases Legais' },
    { id: 'finalidades', title: '5. Finalidades' },
    { id: 'compartilhamento', title: '6. Compartilhamento' },
    { id: 'transferencia', title: '7. Transferência Internacional' },
    { id: 'retencao', title: '8. Retenção e Eliminação' },
    { id: 'seguranca', title: '9. Segurança' },
    { id: 'direitos', title: '10. Direitos do Titular (Art. 18)' },
    { id: 'cookies', title: '11. Cookies e Tecnologias' },
    { id: 'criancas', title: '12. Dados de Crianças e Adolescentes' },
    { id: 'incidentes', title: '13. Incidentes de Segurança' },
    { id: 'atualizacoes', title: '14. Atualizações' },
    { id: 'anpd', title: '15. ANPD e Contatos' },
  ];

  return (
    <>
      <Seo
        title={`Política de Privacidade e Proteção de Dados - ${COMPANY.appName}`}
        description={`Política de Privacidade e Proteção de Dados Pessoais (LGPD) da ${COMPANY.legalName}. Conheça seus direitos e como tratamos seus dados.`}
        path="/politicas-lgpd"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: COMPANY.legalName,
            url: COMPANY.site,
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'Data Protection Officer',
              email: DPO.email,
              telephone: DPO.phone,
            },
          },
        ]}
      />
      <Head>
        <style>{`
          @media print {
            nav, footer, .no-print {
              display: none !important;
            }
            body {
              padding: 0;
              margin: 0;
            }
            .print-container {
              max-width: 100%;
              padding: 20px;
            }
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-bg">
        <Navbar />
        
        <main className="pt-16 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 print-container">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand/10 via-accent/5 to-brand/10 rounded-2xl p-8 mb-8 border border-brand/20">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-ink mb-2">
                    Política de Privacidade e Proteção de Dados Pessoais
                  </h1>
                  <p className="text-ink-muted">
                    Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018
                  </p>
                  <p className="text-sm text-ink-muted mt-2">
                    Última atualização: {lastUpdate}
                  </p>
                </div>
                <div className="flex gap-2 no-print">
                  <button
                    onClick={handlePrint}
                    className="btn-brand inline-flex items-center gap-2 text-sm font-medium"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir / Salvar PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Sumário */}
            <div className="bg-muted/50 rounded-xl p-6 mb-8 border border-border">
              <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand" />
                Sumário
              </h2>
              <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-sm text-ink-muted hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand/50"></span>
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Botões de Ação LGPD */}
            <div className="bg-brand/5 rounded-xl p-6 mb-8 border border-brand/20 no-print">
              <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand" />
                Exercer meus direitos (Art. 18 da LGPD)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleLGPDRight('Acesso')}
                  className="btn-ghost text-left justify-start gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  Acesso aos meus dados
                </button>
                <button
                  onClick={() => handleLGPDRight('Retificação')}
                  className="btn-ghost text-left justify-start gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Retificar dados
                </button>
                <button
                  onClick={() => handleLGPDRight('Eliminação')}
                  className="btn-ghost text-left justify-start gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Eliminar dados
                </button>
                <button
                  onClick={() => handleLGPDRight('Portabilidade')}
                  className="btn-ghost text-left justify-start gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Portabilidade
                </button>
              </div>
              <p className="text-xs text-ink-muted mt-4">
                Clique em qualquer opção acima para abrir um e-mail pré-preenchido para o DPO.
              </p>
            </div>

            {/* Conteúdo */}
            <div className="prose prose-lg max-w-none">
              {/* 1. Introdução */}
              <section id="introducao" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">1. Introdução</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>
                    A <strong>{COMPANY.legalName}</strong>, CNPJ {COMPANY.cnpj}, com sede em {COMPANY.address}, 
                    operadora do serviço <strong>{COMPANY.appName}</strong>, respeita sua privacidade e está 
                    comprometida com a proteção de seus dados pessoais.
                  </p>
                  <p>
                    Esta Política de Privacidade e Proteção de Dados Pessoais ("Política") descreve como 
                    coletamos, usamos, armazenamos, compartilhamos e protegemos suas informações pessoais, 
                    em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong> - Lei nº 13.709/2018, 
                    e demais legislações aplicáveis.
                  </p>
                  <p>
                    <strong>Ao utilizar nossos serviços, você concorda com esta Política.</strong> Caso não concorde, 
                    solicitamos que não utilize nossos serviços.
                  </p>
                </div>
              </section>

              {/* 2. Definições */}
              <section id="definicoes" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">2. Definições</h2>
                <div className="text-ink-muted leading-relaxed space-y-3">
                  <p><strong>Dados Pessoais:</strong> Informação relacionada a pessoa natural identificada ou identificável.</p>
                  <p><strong>Titular:</strong> Pessoa natural a quem se referem os dados pessoais.</p>
                  <p><strong>Controlador:</strong> {COMPANY.legalName}, responsável pelas decisões sobre o tratamento de dados.</p>
                  <p><strong>Operador:</strong> Quem realiza o tratamento em nome do controlador.</p>
                  <p><strong>DPO (Encarregado):</strong> Pessoa indicada para comunicação entre controlador, titulares e ANPD.</p>
                  <p><strong>Tratamento:</strong> Toda operação realizada com dados pessoais (coleta, armazenamento, uso, compartilhamento, eliminação).</p>
                  <p><strong>LGPD:</strong> Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).</p>
                  <p><strong>ANPD:</strong> Autoridade Nacional de Proteção de Dados.</p>
                </div>
              </section>

              {/* 3. Controladora e DPO */}
              <section id="controladora" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">3. Controladora e DPO</h2>
                <div className="bg-muted/30 rounded-lg p-6 border border-border">
                  <div className="space-y-4 text-ink-muted">
                    <div>
                      <strong className="text-ink">Controladora:</strong>
                      <p>{COMPANY.legalName}</p>
                      <p>CNPJ: {COMPANY.cnpj}</p>
                      <p>{COMPANY.address}</p>
                    </div>
                    <div>
                      <strong className="text-ink">Encarregado de Proteção de Dados (DPO):</strong>
                      <p>Nome: {DPO.name}</p>
                      <p>E-mail: <a href={`mailto:${DPO.email}`} className="text-brand hover:underline">{DPO.email}</a></p>
                      <p>Telefone: <a href={`tel:${DPO.phone}`} className="text-brand hover:underline">{DPO.phone}</a></p>
                    </div>
                    <p className="text-sm">
                      O DPO é o canal de comunicação entre você, nossa empresa e a ANPD. 
                      Para exercer seus direitos ou esclarecer dúvidas sobre tratamento de dados, 
                      entre em contato com o DPO.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Bases Legais */}
              <section id="bases-legais" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">4. Bases Legais para Tratamento</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>
                    Tratamos seus dados pessoais com base nas seguintes hipóteses legais previstas no Art. 7º da LGPD:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li><strong>Consentimento:</strong> Você autoriza expressamente o tratamento para finalidades específicas.</li>
                    <li><strong>Cumprimento de obrigação legal:</strong> Quando necessário para cumprir obrigações legais ou regulatórias.</li>
                    <li><strong>Execução de contrato:</strong> Para execução de contrato ou procedimentos preliminares.</li>
                    <li><strong>Exercício regular de direitos:</strong> Para exercício de direitos em processo judicial, arbitral ou administrativo.</li>
                    <li><strong>Proteção da vida:</strong> Para proteção da vida ou da incolumidade física do titular ou de terceiro.</li>
                    <li><strong>Tutela da saúde:</strong> Em procedimentos realizados por profissionais da área da saúde.</li>
                    <li><strong>Legítimo interesse:</strong> Para atender aos legítimos interesses do controlador ou de terceiro.</li>
                    <li><strong>Proteção do crédito:</strong> Para proteção do crédito, incluída no disposto na legislação pertinente.</li>
                  </ol>
                </div>
              </section>

              {/* 5. Finalidades */}
              <section id="finalidades" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">5. Finalidades do Tratamento</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>Coletamos e tratamos seus dados pessoais para as seguintes finalidades:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Prestação de serviços de triagem de saúde e geração de relatórios personalizados</li>
                    <li>Identificação e autenticação de usuários</li>
                    <li>Comunicação sobre serviços, atualizações e novidades</li>
                    <li>Melhoria contínua de nossos serviços e experiência do usuário</li>
                    <li>Cumprimento de obrigações legais e regulatórias</li>
                    <li>Prevenção de fraudes e garantia de segurança</li>
                    <li>Análise estatística e estudos (com dados anonimizados quando aplicável)</li>
                    <li>Suporte ao cliente e atendimento de solicitações</li>
                    <li>Processamento de pagamentos e gestão financeira</li>
                    <li>Envio de comunicados importantes sobre o serviço</li>
                  </ul>
                  <p className="text-sm bg-amber/10 border border-amber/20 rounded-lg p-4">
                    <strong>Nota:</strong> Não utilizamos seus dados para finalidades incompatíveis com as aqui descritas, 
                    exceto com seu consentimento expresso ou quando exigido por lei.
                  </p>
                </div>
              </section>

              {/* 6. Compartilhamento */}
              <section id="compartilhamento" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">6. Compartilhamento de Dados</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>
                    Podemos compartilhar seus dados pessoais apenas nas seguintes situações:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Com seu consentimento:</strong> Quando você autoriza expressamente o compartilhamento</li>
                    <li><strong>Prestadores de serviços:</strong> Com empresas que nos auxiliam na operação (hospedagem, pagamentos, análise), sempre sob obrigações de confidencialidade</li>
                    <li><strong>Obrigação legal:</strong> Quando exigido por lei, ordem judicial ou autoridade competente</li>
                    <li><strong>Proteção de direitos:</strong> Para proteger nossos direitos, propriedade ou segurança, ou de nossos usuários</li>
                    <li><strong>Operações corporativas:</strong> Em caso de fusão, aquisição ou venda de ativos (com notificação prévia)</li>
                  </ul>
                  <p className="text-sm bg-brand/10 border border-brand/20 rounded-lg p-4">
                    <strong>Compromisso:</strong> Não vendemos, alugamos ou comercializamos seus dados pessoais para terceiros 
                    para fins de marketing sem seu consentimento expresso.
                  </p>
                </div>
              </section>

              {/* 7. Transferência Internacional */}
              <section id="transferencia" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">7. Transferência Internacional de Dados</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>
                    Alguns de nossos prestadores de serviços podem estar localizados fora do Brasil. 
                    Quando transferimos dados para outros países, garantimos que:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>O país de destino ofereça nível adequado de proteção de dados</li>
                    <li>Existam cláusulas contratuais de proteção de dados</li>
                    <li>O tratamento seja realizado em conformidade com a LGPD</li>
                    <li>Você seja informado sobre a transferência</li>
                  </ul>
                  <p>
                    Atualmente, podemos utilizar serviços de empresas como Google (Cloud), AWS, Stripe (pagamentos), 
                    entre outras, que podem processar dados em servidores fora do Brasil, sempre com medidas de segurança adequadas.
                  </p>
                </div>
              </section>

              {/* 8. Retenção */}
              <section id="retencao" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">8. Retenção e Eliminação de Dados</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>
                    Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta Política, 
                    exceto quando a retenção for exigida ou permitida por lei (ex.: obrigações fiscais, contábeis, regulatórias).
                  </p>
                  <p><strong>Critérios de retenção:</strong></p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Dados de contas ativas: enquanto a conta estiver ativa e você utilizar nossos serviços</li>
                    <li>Dados de transações: conforme legislação fiscal e contábil (geralmente 5 anos)</li>
                    <li>Dados de saúde: conforme obrigações legais e necessidade clínica</li>
                    <li>Dados após cancelamento: eliminados após período de retenção legal ou após solicitação do titular</li>
                  </ul>
                  <p>
                    <strong>Você pode solicitar a eliminação de seus dados a qualquer momento</strong>, 
                    exceto quando a retenção for obrigatória por lei. Nesse caso, informaremos os prazos aplicáveis.
                  </p>
                </div>
              </section>

              {/* 9. Segurança */}
              <section id="seguranca" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">9. Medidas de Segurança</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>
                    Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra 
                    acesso não autorizado, perda, destruição, alteração ou divulgação indevida, incluindo:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Criptografia de dados em trânsito (HTTPS/TLS) e em repouso</li>
                    <li>Controle de acesso com autenticação e autorização</li>
                    <li>Monitoramento contínuo de segurança e detecção de ameaças</li>
                    <li>Backups regulares e planos de recuperação de desastres</li>
                    <li>Treinamento de equipe sobre proteção de dados</li>
                    <li>Revisão periódica de políticas e procedimentos de segurança</li>
                    <li>Conformidade com padrões de segurança (ex.: ISO 27001, quando aplicável)</li>
                  </ul>
                  <p className="text-sm">
                    <strong>Importante:</strong> Nenhum sistema é 100% seguro. Recomendamos que você também adote medidas 
                    de segurança, como uso de senhas fortes e não compartilhamento de credenciais.
                  </p>
                </div>
              </section>

              {/* 10. Direitos */}
              <section id="direitos" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">10. Direitos do Titular (Art. 18 da LGPD)</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>
                    Conforme a LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:
                  </p>
                  <div className="bg-muted/30 rounded-lg p-6 border border-border space-y-4">
                    <div>
                      <strong className="text-ink">1. Confirmação e Acesso:</strong>
                      <p>Obter confirmação da existência de tratamento e acessar seus dados pessoais.</p>
                    </div>
                    <div>
                      <strong className="text-ink">2. Correção:</strong>
                      <p>Solicitar correção de dados incompletos, inexatos ou desatualizados.</p>
                    </div>
                    <div>
                      <strong className="text-ink">3. Anonimização, bloqueio ou eliminação:</strong>
                      <p>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.</p>
                    </div>
                    <div>
                      <strong className="text-ink">4. Portabilidade:</strong>
                      <p>Solicitar a portabilidade de seus dados para outro fornecedor de serviço ou produto.</p>
                    </div>
                    <div>
                      <strong className="text-ink">5. Eliminação:</strong>
                      <p>Solicitar a eliminação de dados pessoais tratados com base em consentimento.</p>
                    </div>
                    <div>
                      <strong className="text-ink">6. Informação:</strong>
                      <p>Obter informações sobre entidades públicas e privadas com as quais compartilhamos dados.</p>
                    </div>
                    <div>
                      <strong className="text-ink">7. Revogação do consentimento:</strong>
                      <p>Revogar seu consentimento a qualquer momento (quando o tratamento se basear em consentimento).</p>
                    </div>
                    <div>
                      <strong className="text-ink">8. Revisão de decisões automatizadas:</strong>
                      <p>Solicitar revisão de decisões tomadas unicamente com base em tratamento automatizado de dados pessoais.</p>
                    </div>
                  </div>
                  <p>
                    <strong>Como exercer seus direitos:</strong> Entre em contato com o DPO através do e-mail{' '}
                    <a href={`mailto:${DPO.email}`} className="text-brand hover:underline">{DPO.email}</a> ou telefone{' '}
                    <a href={`tel:${DPO.phone}`} className="text-brand hover:underline">{DPO.phone}</a>. 
                    Responderemos em até <strong>15 (quinze) dias</strong>, conforme previsto na LGPD.
                  </p>
                </div>
              </section>

              {/* 11. Cookies */}
              <section id="cookies" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">11. Cookies e Tecnologias Similares</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>
                    Utilizamos cookies, pixels e outras tecnologias para melhorar sua experiência, analisar uso do site 
                    e personalizar conteúdo. Tipos de tecnologias utilizadas:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Cookies essenciais:</strong> Necessários para funcionamento do site (não podem ser desativados)</li>
                    <li><strong>Cookies de análise:</strong> Para entender como os usuários interagem com o site (ex.: Google Analytics)</li>
                    <li><strong>Cookies de funcionalidade:</strong> Para lembrar suas preferências e personalizar experiência</li>
                    <li><strong>Cookies de marketing:</strong> Para exibir conteúdo relevante e medir eficácia de campanhas (com consentimento)</li>
                  </ul>
                  <p>
                    Você pode gerenciar suas preferências de cookies através das configurações do seu navegador ou 
                    através de nosso banner de consentimento (quando aplicável).
                  </p>
                </div>
              </section>

              {/* 12. Crianças */}
              <section id="criancas" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">12. Dados de Crianças e Adolescentes</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>
                    Nossos serviços são destinados a maiores de 18 anos. Para menores de idade, o tratamento de dados 
                    pessoais requer o <strong>consentimento específico e em destaque de pelo menos um dos pais ou responsável legal</strong>.
                  </p>
                  <p>
                    Se tomarmos conhecimento de que coletamos dados de menores sem o consentimento adequado, 
                    tomaremos medidas imediatas para eliminar tais informações.
                  </p>
                </div>
              </section>

              {/* 13. Incidentes */}
              <section id="incidentes" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">13. Incidentes de Segurança</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>
                    Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, 
                    comunicaremos:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Aos titulares afetados, em prazo razoável</li>
                    <li>À ANPD, conforme disposto na legislação (até 72 horas, quando aplicável)</li>
                  </ul>
                  <p>
                    A comunicação incluirá informações sobre a natureza do incidente, dados afetados, 
                    medidas tomadas e recomendações para proteção.
                  </p>
                </div>
              </section>

              {/* 14. Atualizações */}
              <section id="atualizacoes" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">14. Atualizações desta Política</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>
                    Podemos atualizar esta Política periodicamente para refletir mudanças em nossas práticas, 
                    serviços ou requisitos legais. Quando houver alterações significativas, notificaremos você:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Por e-mail (se você tiver cadastro)</li>
                    <li>Por meio de aviso em nosso site</li>
                    <li>Atualizando a data de "Última atualização" no topo desta página</li>
                  </ul>
                  <p>
                    <strong>Recomendamos que você revise esta Política periodicamente.</strong> 
                    O uso continuado de nossos serviços após alterações indica sua aceitação da Política atualizada.
                  </p>
                </div>
              </section>

              {/* 15. ANPD */}
              <section id="anpd" className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-ink mb-4">15. ANPD e Contatos</h2>
                <div className="text-ink-muted leading-relaxed space-y-4">
                  <p>
                    A <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong> é o órgão responsável por zelar, 
                    implementar e fiscalizar o cumprimento da LGPD em todo o território nacional.
                  </p>
                  <p>
                    Você pode entrar em contato com a ANPD para apresentar reclamações sobre tratamento de dados pessoais:
                  </p>
                  <div className="bg-muted/30 rounded-lg p-6 border border-border">
                    <p><strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong></p>
                    <p>
                      Site: <a href={ANPD_URL} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline inline-flex items-center gap-1">
                        {ANPD_URL} <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                    <p>
                      Canais de Atendimento: <a href={ANPD_CONTACT} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline inline-flex items-center gap-1">
                        {ANPD_CONTACT} <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </div>
                  <div className="bg-brand/5 rounded-lg p-6 border border-brand/20">
                    <p><strong>Para exercer seus direitos ou esclarecer dúvidas sobre esta Política:</strong></p>
                    <p>Encarregado de Proteção de Dados (DPO): <strong>{DPO.name}</strong></p>
                    <p>
                      E-mail: <a href={`mailto:${DPO.email}`} className="text-brand hover:underline">{DPO.email}</a>
                    </p>
                    <p>
                      Telefone: <a href={`tel:${DPO.phone}`} className="text-brand hover:underline">{DPO.phone}</a>
                    </p>
                    <p className="text-sm mt-4">
                      <strong>Horário de atendimento:</strong> Segunda a sexta, das 9h às 18h (horário de Brasília)
                    </p>
                  </div>
                </div>
              </section>

              {/* Aviso Jurídico */}
              <div className="bg-amber/10 border border-amber/20 rounded-lg p-6 mt-10">
                <p className="text-sm text-ink-muted">
                  <strong>Nota Legal:</strong> Esta Política foi elaborada com base na legislação brasileira vigente 
                  (LGPD - Lei nº 13.709/2018). Recomendamos consulta a um advogado especializado em proteção de dados 
                  para análise jurídica completa e adequação às especificidades do seu negócio.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

