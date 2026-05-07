import type { NextApiRequest, NextApiResponse } from 'next';

import { getProfileFromRequest, getUserEmailFromRequest } from '@/lib/api/auth-helper';
import { methodNotAllowed } from '@/lib/mobile/http';
import { resolveMobileActor } from '@/lib/mobile/service';
import { mobileProfileSchema } from '@mejoy/api-contracts/mobile';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const email = await getUserEmailFromRequest(req);
      const profile = await getProfileFromRequest(req);
      const actor = await resolveMobileActor({ email, profile });

      if (!actor.profile) {
        return res.status(404).json({ error: 'Perfil não encontrado' });
      }

      return res.status(200).json(actor.profile);
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Erro ao buscar perfil mobile',
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const email = await getUserEmailFromRequest(req);
      const profile = await getProfileFromRequest(req);
      const actor = await resolveMobileActor({ email, profile });

      if (!actor.profile) {
        return res.status(404).json({ error: 'Perfil não encontrado' });
      }

      const input = req.body ?? {};
      const updatePayload: Record<string, unknown> = {};

      if (typeof input.name === 'string') updatePayload.name = input.name;
      if (typeof input.whatsapp === 'string') updatePayload.whatsapp = input.whatsapp;
      if (typeof input.sex === 'string') updatePayload.sex = input.sex;
      if (typeof input.birthDate === 'string') updatePayload.birth_date = input.birthDate;
      if (typeof input.weightKg === 'number') updatePayload.weight_kg = input.weightKg;
      if (typeof input.heightCm === 'number') updatePayload.height_cm = input.heightCm;

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update(updatePayload)
        .eq('id', actor.profile.id)
        .select('*')
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const normalized = mobileProfileSchema.parse({
        id: data.id,
        name: data.name ?? null,
        email: data.email ?? null,
        whatsapp: data.whatsapp ?? null,
        sex: data.sex ?? null,
        birthDate: data.birth_date ?? null,
        weightKg: data.weight_kg == null ? null : Number(data.weight_kg),
        heightCm: data.height_cm == null ? null : Number(data.height_cm),
        bmi:
          data.weight_kg == null || data.height_cm == null
            ? null
            : Number((Number(data.weight_kg) / ((Number(data.height_cm) / 100) * (Number(data.height_cm) / 100))).toFixed(1)),
        createdAt: data.created_at ?? null,
        updatedAt: data.updated_at ?? null,
      });

      return res.status(200).json(normalized);
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Erro ao atualizar perfil mobile',
      });
    }
  }

  return methodNotAllowed(res, ['GET', 'PUT']);
}
