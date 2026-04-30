'use client';

import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        className="bg-background rounded-3xl border border-white/10 
        p-6 sm:p-8 w-[90%] max-w-lg shadow-2xl flex flex-col gap-4"
      >
        {title && (
          <h2 className="text-xl sm:text-2xl font-bold text-brand">
            {title}
          </h2>
        )}

        <div className="text-sm sm:text-base text-white">{children}</div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-brand 
            hover:bg-brand transition text-white font-semibold shadow-md"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}