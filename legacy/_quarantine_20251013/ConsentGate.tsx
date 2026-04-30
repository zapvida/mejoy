// src/components/lgpd/ConsentGate.tsx
// Componente de consentimento LGPD obrigatório

import React, { useState, useEffect } from 'react';
import { X, Shield, FileText, Eye } from 'lucide-react';

interface ConsentGateProps {
  onConsent: (consentData: ConsentData) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface ConsentData {
  userId: string | null;
  consentAt: string;
  policyVersion: string;
  ipHash: string;
}

const POLICY_VERSION = '1.0.0';

export default function ConsentGate({ onConsent, isOpen, onClose }: ConsentGateProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleConsent = async () => {
    setIsLoading(true);
    
    try {
      // Gerar hash do IP (simplificado)
      const ipHash = await generateIpHash();
      
      const consentData: ConsentData = {
        userId: null, // TODO: Obter do NextAuth
        consentAt: new Date().toISOString(),
        policyVersion: POLICY_VERSION,
        ipHash: ipHash
      };

      // Salvar consentimento no localStorage
      localStorage.setItem('lgpd_consent', JSON.stringify(consentData));
      
      // Salvar consentimento no servidor
      await saveConsentToServer(consentData);
      
      onConsent(consentData);
      setIsVisible(false);
    } catch (error) {
      console.error('Erro ao salvar consentimento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateIpHash = async (): Promise<string> => {
    // Em produção, obter IP real do servidor
    const mockIp = '192.168.1.1';
    const encoder = new TextEncoder();
    const data = encoder.encode(mockIp);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const saveConsentToServer = async (consentData: ConsentData) => {
    // TODO: Implementar API para salvar consentimento
    console.log('Salvando consentimento:', consentData);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Seu consentimento para continuar
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Precisamos do seu consentimento para tratar seus dados de saúde conforme a LGPD. 
            Usaremos suas respostas apenas para gerar seu relatório personalizado e melhorar o serviço. 
            Você pode revogar a qualquer momento.
          </p>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Seus dados são utilizados para:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Gerar relatório personalizado de saúde</li>
                  <li>• Melhorar a qualidade do serviço</li>
                  <li>• Enviar atualizações sobre seu relatório</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Versão da política: {POLICY_VERSION} | Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-3 p-6 pt-0">
          <button
            onClick={handleConsent}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processando...' : 'Aceito e desejo continuar'}
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={() => window.open('/termos', '_blank')}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Ver Termos</span>
            </button>
            
            <button
              onClick={() => window.open('/privacidade', '_blank')}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm">Ver Privacidade</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook para verificar consentimento
export function useLGPDConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [consentData, setConsentData] = useState<ConsentData | null>(null);

  useEffect(() => {
    const checkConsent = () => {
      try {
        const stored = localStorage.getItem('lgpd_consent');
        if (stored) {
          const data = JSON.parse(stored) as ConsentData;
          // Verificar se a versão da política ainda é válida
          if (data.policyVersion === POLICY_VERSION) {
            setConsentData(data);
            setHasConsent(true);
            return;
          }
        }
        setHasConsent(false);
      } catch (error) {
        console.error('Erro ao verificar consentimento:', error);
        setHasConsent(false);
      }
    };

    checkConsent();
  }, []);

  const grantConsent = (data: ConsentData) => {
    setConsentData(data);
    setHasConsent(true);
  };

  const revokeConsent = () => {
    localStorage.removeItem('lgpd_consent');
    setConsentData(null);
    setHasConsent(false);
  };

  return {
    hasConsent,
    consentData,
    grantConsent,
    revokeConsent,
    isLoading: hasConsent === null
  };
}
