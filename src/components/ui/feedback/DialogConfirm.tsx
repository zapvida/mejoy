'use client';

type DialogConfirmProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DialogConfirm({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: DialogConfirmProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm sm:max-w-md bg-gradient-to-br from-background to-black border border-brand rounded-2xl shadow-2xl p-5 sm:p-6">
        {title && (
          <h2 className="text-xl sm:text-2xl font-bold text-brand mb-4 text-center">
            {title}
          </h2>
        )}

        <p className="text-sm sm:text-base text-white/80 text-center">
          {message}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl w-full sm:w-auto border border-white/20 
            bg-white/5 hover:bg-white/10 text-white transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl w-full sm:w-auto 
            bg-brand hover:bg-brand text-white transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}