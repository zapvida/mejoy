import { supabaseClient } from './supabase/client';

export const storageService = {
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabaseClient().storage
      .from(bucket)
      .upload(path, file);
    
    return { data, error };
  },

  async getPublicUrl(bucket: string, path: string) {
    const { data } = supabaseClient().storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabaseClient().storage
      .from(bucket)
      .remove([path]);
    
    return { error };
  },

  async listFiles(bucket: string, path?: string) {
    const { data, error } = await supabaseClient().storage
      .from(bucket)
      .list(path);
    
    return { data, error };
  }
};
