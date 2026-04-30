import React from 'react';

interface ToastProps {
  children: React.ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ children, type = 'info', duration: _duration, onClose: _onClose }) => {
  return (
    <div className={`toast toast-${type}`} role="alert">
      {children}
    </div>
  );
};

export const useToast = () => {
  return {
    show: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => {
      console.log(`Toast: ${message} (${type})`);
    },
    hide: () => {
      console.log('Toast hidden');
    }
  };
};

export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="toast-container">{children}</div>;
};
