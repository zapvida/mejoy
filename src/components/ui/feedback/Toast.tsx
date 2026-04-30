'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

type ToastProps = {
  message: string;
  onClose?: () => void;
  duration?: number;
};

export default function Toast({
  message,
  onClose,
  duration = 4000,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.35, type: 'spring' }}
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-4
          max-w-xs sm:max-w-sm bg-gradient-to-br from-brand to-brand-700
          text-white backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl px-6 py-4
          animate-in fade-in slide-in-from-bottom"
        >
          <span className="flex-1 text-sm font-medium text-white drop-shadow-sm">{message}</span>
          <button
            onClick={() => {
              setVisible(false);
              if (onClose) onClose();
            }}
            className="text-white/60 hover:text-white transition transform hover:scale-110"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}