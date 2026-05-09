// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

import { authService } from '../lib/auth';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (_email: string) => Promise<{ error?: any }>;
  verifyOtp: (_email: string, _token: string) => Promise<{ error?: any }>;
  signInWithPassword: (_email: string, _password: string) => Promise<{ error?: any }>;
  signInWithGoogle: () => Promise<{ error?: any }>;
  signOut: () => Promise<{ error?: any }>;
  resetPassword: (_email: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: 'Not implemented' }),
  verifyOtp: async () => ({ error: 'Not implemented' }),
  signInWithPassword: async () => ({ error: 'Not implemented' }),
  signInWithGoogle: async () => ({ error: 'Not implemented' }),
  signOut: async () => ({ error: 'Not implemented' }),
  resetPassword: async () => ({ error: 'Not implemented' }),
});

// Função para verificar se Supabase está configurado
function hasSupabaseEnv(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se Supabase está configurado
    if (!hasSupabaseEnv()) {
      console.warn('Supabase não configurado, pulando auth state change');
      setLoading(false);
      return;
    }

    let cancelled = false;

    // Verificar sessão atual sem depender de round-trip de rede no bootstrap.
    const checkSession = async () => {
      try {
        const session = await authService.getSession();
        if (!cancelled) {
          setUser((session?.user as User | null) ?? null);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!cancelled) {
          setUser(null);
        }
        if (!/failed to fetch|networkerror|load failed|abort/i.test(message)) {
          console.error('Erro ao verificar sessão:', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // Escutar mudanças de autenticação
    const unsubscribePromise = authService.onAuthStateChange((user) => {
      if (!cancelled) {
        setUser(user);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribePromise.then(unsubscribe => unsubscribe?.unsubscribe?.());
    };
  }, []);

  const signIn = async (email: string) => {
    try {
      const { error } = await authService.signInWithEmail(email);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    try {
      const { error } = await authService.verifyOtp(email, token);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    try {
      const { error } = await authService.signInWithPassword(email, password);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await authService.signInWithGoogle();
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await authService.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await authService.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, verifyOtp, signInWithPassword, signInWithGoogle, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
