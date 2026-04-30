// src/components/privacy/DeleteDataButton.tsx
// Componente para exclusão de dados LGPD

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiTrash2, FiAlertTriangle, FiCheck } from 'react-icons/fi';

interface DeleteDataButtonProps {
  userId: string;
  onSuccess?: () => void;
}

export default function DeleteDataButton({ userId, onSuccess }: DeleteDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    if (confirmation !== 'CONFIRMO_EXCLUSAO_DADOS') {
      alert('Por favor, digite exatamente: CONFIRMO_EXCLUSAO_DADOS');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user/delete-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          confirmation 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.();
          // Redirecionar para página inicial
          window.location.href = '/';
        }, 3000);
      } else {
        alert(result.error || 'Erro ao excluir dados');
      }
    } catch (error) {
      console.error('Erro ao excluir dados:', error);
      alert('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 max-w-md w-full text-center"
        >
          <div className="mb-6">
            <FiCheck className="text-brand mx-auto" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Dados excluídos com sucesso
          </h3>
          <p className="text-white/80 mb-6">
            Todos os seus dados pessoais foram excluídos permanentemente. Você será redirecionado em alguns segundos.
          </p>
          <div className="flex items-center justify-center gap-2 bg-brand/20 px-4 py-2 rounded-full w-fit mx-auto">
            <FiCheck className="text-brand" size={16} />
            <span className="text-green-300 text-sm font-medium">
              Exclusão confirmada
            </span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2 bg-fg/20 hover:bg-fg/30 border border-fg/30 text-foreground hover:text-foreground px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium"
      >
        <FiTrash2 size={16} />
        Excluir meus dados
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="mb-4">
            <FiAlertTriangle className="text-fg mx-auto" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Excluir todos os meus dados
          </h3>
          <p className="text-white/80 text-sm">
            Esta ação é irreversível e excluirá permanentemente todos os seus dados pessoais.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-fg/10 border border-fg/30 rounded-xl p-4">
            <h4 className="text-foreground font-semibold mb-2">⚠️ O que será excluído:</h4>
            <ul className="text-foreground text-sm space-y-1">
              <li>• Dados pessoais (nome, email, telefone)</li>
              <li>• Histórico de triagens</li>
              <li>• Relatórios gerados</li>
              <li>• Assinaturas e presentes</li>
              <li>• Todas as informações de saúde</li>
            </ul>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Para confirmar, digite exatamente:
            </label>
            <div className="bg-fg/20 border border-fg/30 rounded-xl p-3 mb-2">
              <code className="text-foreground font-mono text-sm">
                CONFIRMO_EXCLUSAO_DADOS
              </code>
            </div>
            <input
              type="text"
              className="w-full rounded-xl bg-black/30 border border-white/20 p-3 text-white placeholder-white/50 focus:border-fg focus:outline-none"
              placeholder="Digite a confirmação aqui"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => setIsOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 rounded-xl transition-all duration-300"
            >
              Cancelar
            </motion.button>
            <motion.button
              onClick={handleDelete}
              disabled={loading || confirmation !== 'CONFIRMO_EXCLUSAO_DADOS'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-fg hover:bg-fg text-white px-4 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Excluindo...</span>
                </>
              ) : (
                <>
                  <FiTrash2 size={16} />
                  <span>Excluir permanentemente</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
