import React from 'react';

type SessionContextValue = {
  apiBaseUrl: string;
  email: string;
  setSession: (_input: { apiBaseUrl: string; email: string }) => void;
  signOut: () => void;
};

const DEFAULT_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://www.mejoy.com.br';

const SessionContext = React.createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = React.useState('');
  const [apiBaseUrl, setApiBaseUrl] = React.useState(DEFAULT_API_BASE_URL);

  const value: SessionContextValue = {
    apiBaseUrl,
    email,
    setSession: (input) => {
      setEmail(input.email.trim().toLowerCase());
      setApiBaseUrl(input.apiBaseUrl.trim().replace(/\/$/, ''));
    },
    signOut: () => {
      setEmail('');
      setApiBaseUrl(DEFAULT_API_BASE_URL);
    },
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = React.use(SessionContext);
  if (!value) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return value;
}
