// src/components/ui/DeleteDataButton.tsx
// Botão para exclusão de dados com confirmação dupla

import React, { useState } from 'react';
import { Button } from '@/components/ui/buttons';
import { Card } from './Card';
import { AlertTriangle, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface DeleteDataButtonProps {
  userId: string;
  userEmail?: string;
  onSuccess?: () => void;
  className?: string;
}

export function DeleteDataButton({ 
  userId, 
  userEmail, 
  onSuccess, 
  className 
}: DeleteDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'warning' | 'confirmation' | 'processing'>('warning');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDeleteData = async () => {
    setLoading(true);
    setStep('processing');
    setError('');

    try {
      // Primeira chamada - verificar se pode excluir
      const checkResponse = await fetch('/api/privacy/delete-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email: userEmail })
      });

      const checkResult = await checkResponse.json();

      if (!checkResult.canDelete) {
        setError(checkResult.error || 'Não é possível excluir os dados neste momento');
        setStep('warning');
        return;
      }

      if (checkResult.requiresConfirmation) {
        setStep('confirmation');
        setMessage(checkResult.message);
        return;
      }

      // Segunda chamada - confirmar exclusão
      const deleteResponse = await fetch('/api/privacy/delete-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          email: userEmail, 
          confirmDeletion: true 
        })
      });

      const deleteResult = await deleteResponse.json();

      if (deleteResult.success) {
        setMessage('Dados excluídos com sucesso! Email de confirmação enviado.');
        setTimeout(() => {
          setIsOpen(false);
          onSuccess?.();
        }, 3000);
      } else {
        setError(deleteResult.error || 'Erro ao excluir dados');
        setStep('warning');
      }
    } catch (error) {
      console.error('Erro ao excluir dados:', error);
      setError('Erro de conexão. Tente novamente.');
      setStep('warning');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setIsOpen(false);
    setStep('warning');
    setMessage('');
    setError('');
    setLoading(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Excluir Meus Dados
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6">
            {step === 'warning' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-fg" />
                </div>
                
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Excluir Meus Dados
                </h2>
                
                <div className="text-left space-y-3 mb-6">
                  <p className="text-sm text-muted-foreground">
                    Esta ação irá <strong>anonimizar</strong> todos os seus dados pessoais:
                  </p>
                  
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Nome, email, telefone</li>
                    <li>• Histórico de triagens</li>
                    <li>• Relatórios gerados</li>
                    <li>• Assinaturas ativas</li>
                  </ul>
                  
                  <div className="bg-brand/10 border border-border rounded-lg p-3">
                    <p className="text-sm text-brand">
                      <strong>⚠️ Atenção:</strong> Esta ação é irreversível e você perderá acesso a todos os serviços.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-muted border border-border rounded-lg p-3 mb-4">
                    <p className="text-sm text-fg">{error}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={resetModal}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteData}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Verificando...' : 'Continuar'}
                  </Button>
                </div>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-fg" />
                </div>
                
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Confirmação Final
                </h2>
                
                <p className="text-sm text-muted-foreground mb-6">
                  {message}
                </p>
                
                <div className="bg-muted border border-border rounded-lg p-4 mb-6">
                  <p className="text-sm text-fg font-semibold">
                    Você tem certeza que deseja excluir TODOS os seus dados?
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('warning')}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteData}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Excluindo...' : 'SIM, EXCLUIR'}
                  </Button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                </div>
                
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Processando Exclusão
                </h2>
                
                <p className="text-sm text-muted-foreground">
                  Anonimizando seus dados pessoais...
                </p>
              </div>
            )}

            {message && step !== 'processing' && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-brand" />
                  <p className="text-sm text-brand">{message}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
