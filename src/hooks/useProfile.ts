import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { buildAuthenticatedHeaders, fetchWithUserSession } from '@/lib/api/client-auth';

type ProfileData = {
  id: string;
  name: string | null;
  email: string | null;
  whatsapp: string | null;
  sex: string | null;
  birth_date: string | null;
  weight_kg: number | null;
  height_cm: number | null;
  created_at: string;
  updated_at: string;
};

type UpdateProfileData = {
  name?: string;
  whatsapp?: string;
  sex?: string;
  birth_date?: string;
  weight_kg?: number;
  height_cm?: number;
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user?.email) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetchWithUserSession<ProfileData>('/api/profile');
      if (response.ok === false) {
        if (response.status === 404) {
          setProfile(null);
          return;
        }
        throw new Error(response.error || 'Erro ao buscar perfil');
      }
      setProfile(response.data);
    } catch (err: any) {
      console.error('[useProfile] Error:', err);
      setError(err.message || 'Erro ao carregar perfil');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    if (!user?.email) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setUpdating(true);
      setError(null);

      const headers = await buildAuthenticatedHeaders({
        'Content-Type': 'application/json',
      });
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro ao atualizar perfil' }));
        throw new Error(errorData.error || 'Erro ao atualizar perfil');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err: any) {
      console.error('[useProfile] Update Error:', err);
      setError(err.message || 'Erro ao atualizar perfil');
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [user?.email]);

  return { profile, loading, error, updating, updateProfile, refetch: fetchProfile };
}
