import { createBrowserClient } from "@supabase/ssr";

function hasSupabaseEnv(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
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
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
