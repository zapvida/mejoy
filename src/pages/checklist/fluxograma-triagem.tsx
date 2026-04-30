import { useState, useEffect } from 'react';
import Seo from '@/components/Seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import Script from 'next/script';

export async function getServerSideProps() {
  return { props: {} };
}

export default function FluxogramaTriagem() {
  const [mermaidLoaded, setMermaidLoaded] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).mermaid) {
      (window as any).mermaid.initialize({ 
        startOnLoad: true,
        theme: 'default',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        }
      });
      setMermaidLoaded(true);
    }
  }, []);

  const mermaidDiagram = `
flowchart TD
    Start([Usuário chega na Landing Page]) --> LP[Landing Page<br/>zapfarm.com.br/obesidade]
    LP --> CTA[CTA: Começar minha avaliação]
    CTA --> Triagem[Início da Triagem<br/>/triagem/emagrecimento]
    
    Triagem --> Node0{Aceita Termos?}
    Node0 -->|Não| Fim1[X FIM<br/>Não pode prosseguir]
    Node0 -->|Sim| Node1[NÓ 1: Dados Básicos]
    
    Node1 --> Idade[Idade Faixa]
    Idade --> Sexo[Sexo]
    Sexo --> Peso[Peso]
    Peso --> Altura[Altura]
    Altura --> IMC[IMC Calculado Automaticamente]
    
    IMC --> Node2[NÓ 2: Histórico Médico]
    Node2 --> Comorbidades[Comorbidades]
    Comorbidades --> Medicamentos[Medicamentos em Uso]
    Medicamentos --> Alergias[Alergias]
    
    Alergias --> Node3{NÓ 3: Contraindicações}
    Node3 -->|Tem Contraindicação| Fim2[X FIM<br/>Não Indicado]
    Node3 -->|Sem Contraindicação| Node4[NÓ 4: Candidato GLP-1?]
    
    Node4 -->|Sim| Candidato[Candidato GLP-1<br/>✅ Pré-prescrição Gerada]
    Node4 -->|Não| NaoCandidato[Não Candidato<br/>Recomendações Gerais]
    
    Candidato --> Relatorio[Relatório Gerado<br/>/emagrecimento/relatorio]
    NaoCandidato --> Relatorio
    
    Relatorio --> Checkout[Checkout<br/>Escolha do Plano]
    Checkout --> Plano1[Start GLP-1<br/>R$ 4.188]
    Checkout --> Plano2[Programa 3 Meses<br/>R$ 4.788]
    Checkout --> Plano3[Programa 6 Meses<br/>R$ 5.388]
    
    Plano1 --> Pagamento[Pagamento Asaas]
    Plano2 --> Pagamento
    Plano3 --> Pagamento
    
    Pagamento --> Validacao{Médico Valida<br/>Prescrição?}
    Validacao -->|Aprova| EnvioPrescricao[Prescrição Enviada<br/>para Farmácia]
    Validacao -->|Rejeita| Ajuste[Ajuste Necessário<br/>Retorno ao Médico]
    Ajuste --> Validacao
    
    EnvioPrescricao --> Entrega[Entrega em Casa]
    Entrega --> Acompanhamento[Acompanhamento<br/>WhatsApp/Grupo VIP]
    
    style Start fill:#667eea,stroke:#764ba2,stroke-width:3px,color:#fff
    style Fim1 fill:#f56565,stroke:#c53030,stroke-width:2px,color:#fff
    style Fim2 fill:#f56565,stroke:#c53030,stroke-width:2px,color:#fff
    style Candidato fill:#48bb78,stroke:#2f855a,stroke-width:2px,color:#fff
    style EnvioPrescricao fill:#48bb78,stroke:#2f855a,stroke-width:2px,color:#fff
    style Entrega fill:#48bb78,stroke:#2f855a,stroke-width:2px,color:#fff
    style Node0 fill:#ed8936,stroke:#c05621,stroke-width:2px,color:#fff
    style Node3 fill:#ed8936,stroke:#c05621,stroke-width:2px,color:#fff
    style Node4 fill:#ed8936,stroke:#c05621,stroke-width:2px,color:#fff
    style Validacao fill:#ed8936,stroke:#c05621,stroke-width:2px,color:#fff
  `;

  const handleExport = () => {
    window.print();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  return (
    <>
      <Seo
        title="Fluxograma Completo da Triagem de Emagrecimento | Me Joy"
        description="Fluxograma interativo completo da triagem de emagrecimento - Documento exclusivo para apresentação a investidores"
        path="/checklist/fluxograma-triagem"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"
        onLoad={() => {
          if (typeof window !== 'undefined' && (window as any).mermaid) {
            (window as any).mermaid.initialize({ 
              startOnLoad: true,
              theme: 'default',
              flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
              }
            });
            setMermaidLoaded(true);
          }
        }}
      />
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  🎯 Fluxograma Completo da Triagem de Emagrecimento
                </h1>
                <p className="text-xl text-gray-600">
                  Documento Exclusivo para Apresentação a Investidores
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Diminuir zoom"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Resetar zoom"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Aumentar zoom"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Exportar PDF
                </button>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">15</div>
                <div className="text-sm text-gray-600">Perguntas</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">5-7 min</div>
                <div className="text-sm text-gray-600">Tempo Médio</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">12-18%</div>
                <div className="text-sm text-gray-600">Taxa Conversão</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-gray-600">Classificações</div>
              </div>
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
              📋 Como Usar Este Documento
            </h3>
            <ul className="space-y-2 text-green-800">
              <li><strong>Visualização:</strong> O fluxograma é renderizado automaticamente abaixo</li>
              <li><strong>Exportar:</strong> Clique em "Exportar PDF" ou use Ctrl+P (Cmd+P no Mac)</li>
              <li><strong>Zoom:</strong> Use os botões de zoom para ajustar o tamanho</li>
              <li><strong>Apresentação:</strong> Use modo tela cheia (F11) durante a reunião</li>
            </ul>
          </div>

          {/* Fluxograma */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 overflow-auto">
            <div 
              className="mermaid-container"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left',
                minHeight: '600px'
              }}
            >
              {mermaidLoaded ? (
                <div className="mermaid" style={{ minHeight: '600px' }}>
                  {mermaidDiagram}
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando fluxograma...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legenda */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Legenda</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-purple-600"></div>
                <span className="text-gray-700">Início do Fluxo</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-orange-500"></div>
                <span className="text-gray-700">Decisão/Validação</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-green-600"></div>
                <span className="text-gray-700">Sucesso/Conclusão</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-red-500"></div>
                <span className="text-gray-700">Fim/Não Indicado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

