import React from 'react';

interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ variant = 'default', children }) => {
  return (
    <div className={`alert alert-${variant}`} role="alert">
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="alert-description">{children}</div>;
};
