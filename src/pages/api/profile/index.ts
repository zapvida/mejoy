import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getProfileFromRequest } from '@/lib/api/auth-helper';

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

type UpdateProfileRequest = {
  name?: string;
  whatsapp?: string;
  sex?: string;
  birth_date?: string;
  weight_kg?: number;
  height_cm?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProfileData | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      const profile = await getProfileFromRequest(req);

      if (!profile) {
        return res.status(404).json({ error: 'Perfil não encontrado' });
      }

      return res.status(200).json(profile as ProfileData);
    } catch (error: any) {
      console.error('[profile] GET Error:', error);
      return res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const profile = await getProfileFromRequest(req);

      if (!profile) {
        return res.status(404).json({ error: 'Perfil não encontrado' });
      }

      const updateData: UpdateProfileRequest = req.body;

      // Validar dados
      if (updateData.weight_kg !== undefined && (updateData.weight_kg < 0 || updateData.weight_kg > 500)) {
        return res.status(400).json({ error: 'Peso inválido' });
      }

      if (updateData.height_cm !== undefined && (updateData.height_cm < 0 || updateData.height_cm > 300)) {
        return res.status(400).json({ error: 'Altura inválida' });
      }

      if (updateData.sex && !['male', 'female', 'undisclosed'].includes(updateData.sex)) {
        return res.status(400).json({ error: 'Sexo inválido' });
      }

      // Preparar dados para atualização
      const updatePayload: any = {};
      if (updateData.name !== undefined) updatePayload.name = updateData.name;
      if (updateData.whatsapp !== undefined) updatePayload.whatsapp = updateData.whatsapp;
      if (updateData.sex !== undefined) updatePayload.sex = updateData.sex;
      if (updateData.birth_date !== undefined) updatePayload.birth_date = updateData.birth_date;
      if (updateData.weight_kg !== undefined) updatePayload.weight_kg = updateData.weight_kg;
      if (updateData.height_cm !== undefined) updatePayload.height_cm = updateData.height_cm;

      // Atualizar profile
      const { data: updatedProfile, error } = await supabaseAdmin
        .from('profiles')
        .update(updatePayload)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        console.error('[profile] PUT Error:', error);
        return res.status(500).json({ error: 'Erro ao atualizar perfil' });
      }

      return res.status(200).json(updatedProfile as ProfileData);
    } catch (error: any) {
      console.error('[profile] PUT Error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

