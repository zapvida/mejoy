import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/runtime-config";

function hasSupabaseEnv(): boolean {
  const { url, anonKey } = getSupabasePublicConfig();
  return !!(url && anonKey);
}

export const supabaseClient = () => {
  if (!hasSupabaseEnv()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Supabase env vars não configuradas. Usando client mock.');
    }
    // Retornar client mock que não quebra o app
    return {
      auth: { 
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signIn: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({ 
        select: () => ({ 
          eq: () => ({ 
            single: () => Promise.resolve({ data: null, error: null }) 
          }) 
        }) 
      })
    } as any;
  }
  
  // createBrowserClient já usa persistSession: true, autoRefreshToken e detectSessionInUrl → permanecer conectado sempre
  const { url, anonKey } = getSupabasePublicConfig();
  return createBrowserClient(
    url,
    anonKey
  );
};
