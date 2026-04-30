import { supabaseClient } from './supabase/client';

const getRedirectUrl = () => `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`;

export const authService = {
  async signInWithEmail(email: string) {
    const { data, error } = await supabaseClient().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    });
    return { data, error };
  },

  async verifyOtp(email: string, token: string) {
    const { data, error } = await supabaseClient().auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    return { data, error };
  },

  async signInWithPassword(email: string, password: string) {
    const { data, error } = await supabaseClient().auth.signInWithPassword({ email, password });
    return { data, error };
  },

  async signInWithGoogle() {
    const { data, error } = await supabaseClient().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
      },
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabaseClient().auth.signOut();
    return { error };
  },

  async resetPasswordForEmail(email: string) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabaseClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/auth/update-password`,
    });
    return { error };
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabaseClient().auth.updateUser({ password: newPassword });
    return { error };
  },

  async getUser() {
    const { data: { user } } = await supabaseClient().auth.getUser();
    return user;
  },

  async getSession() {
    const { data: { session } } = await supabaseClient().auth.getSession();
    return session;
  },

   
  async onAuthStateChange(callback: (_user: any) => void) {
    const { data: { subscription } } = supabaseClient().auth.onAuthStateChange(
      (event: string, session: any) => {
        callback(session?.user ?? null);
      }
    );
    return subscription;
  }
};
