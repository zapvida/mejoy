// src/components/lgpd/TriageConsentWrapper.tsx
// Wrapper que bloqueia triagem sem consentimento LGPD

import React, { useState } from 'react';
import ConsentGate, { useLGPDConsent } from './ConsentGate';

interface TriageConsentWrapperProps {
  children: React.ReactNode;
}

export default function TriageConsentWrapper({ children }: TriageConsentWrapperProps) {
  const { hasConsent, isLoading, grantConsent } = useLGPDConsent();
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Mostrar modal de consentimento se não tiver consentimento
  React.useEffect(() => {
    if (!isLoading && !hasConsent) {
      setShowConsentModal(true);
    }
  }, [hasConsent, isLoading]);

  const handleConsent = (consentData: any) => {
    grantConsent(consentData);
    setShowConsentModal(false);
  };

  // Mostrar loading enquanto verifica consentimento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando consentimento...</p>
        </div>
      </div>
    );
  }

  // Bloquear acesso se não tiver consentimento
  if (!hasConsent) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Consentimento Necessário
              </h2>
              <p className="text-gray-600 mb-6">
                Para continuar com a triagem, precisamos do seu consentimento para o tratamento de dados conforme a LGPD.
              </p>
              <button
                onClick={() => setShowConsentModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Dar Consentimento
              </button>
            </div>
          </div>
        </div>
        
        <ConsentGate
          isOpen={showConsentModal}
          onClose={() => setShowConsentModal(false)}
          onConsent={handleConsent}
        />
      </>
    );
  }

  // Renderizar conteúdo normal se tiver consentimento
  return (
    <>
      {children}
      
      <ConsentGate
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onConsent={handleConsent}
      />
    </>
  );
}
