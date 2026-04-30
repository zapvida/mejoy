/**
 * Evolution API Webhook — mensagens inbound
 * Configurar na Evolution: url = https://seu-dominio.com/api/evolution/webhook
 * Eventos: MESSAGES_UPSERT
 *
 * Quando o usuário envia "MENU", responde automaticamente.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEvolutionMessage } from '@/lib/evolution/client';

const MENU_REPLY =
  'Recebi ✅. Uma secretária inteligente irá falar com você em instantes. Por favor, aguarde.';

function extractMessageText(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const obj = payload as Record<string, unknown>;

  // Evolution pode enviar em data.* ou na raiz
  const data = (obj.data ?? obj) as Record<string, unknown>;
  const msg = data.message as Record<string, unknown> | undefined;
  if (!msg) return null;

  return (
    (msg.conversation as string) ??
    (msg.extendedTextMessage as { text?: string })?.text ??
    (msg.text as string) ??
    null
  );
}

function extractRemoteJid(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const obj = payload as Record<string, unknown>;
  const data = (obj.data ?? obj) as Record<string, unknown>;
  const key = data.key as { remoteJid?: string } | undefined;
  return key?.remoteJid ?? null;
}

function isFromMe(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') return true;
  const obj = payload as Record<string, unknown>;
  const data = (obj.data ?? obj) as Record<string, unknown>;
  const key = data.key as { fromMe?: boolean } | undefined;
  return key?.fromMe === true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Ignorar mensagens enviadas por nós
    if (isFromMe(body)) {
      return res.status(200).json({ received: true, skipped: 'from_me' });
    }

    const text = extractMessageText(body);
    const remoteJid = extractRemoteJid(body);

    if (!remoteJid || !text) {
      return res.status(200).json({ received: true, skipped: 'no_text' });
    }

    const trimmed = String(text).trim().toUpperCase();
    if (trimmed !== 'MENU') {
      return res.status(200).json({ received: true, skipped: 'not_menu' });
    }

    // Normalizar telefone (remoteJid pode vir como 557499879409@s.whatsapp.net)
    const phone = remoteJid.replace(/@.*$/, '').replace(/\D/g, '');
    const normalized = phone.length >= 10 ? (phone.startsWith('55') ? phone : `55${phone}`) : null;

    if (!normalized) {
      return res.status(200).json({ received: true, error: 'invalid_phone' });
    }

    const result = await sendEvolutionMessage(normalized, MENU_REPLY);

    return res.status(200).json({
      received: true,
      menu_replied: result.success,
      error: result.error,
    });
  } catch (err) {
    console.error('[evolution-webhook] Erro:', err);
    return res.status(200).json({ received: true, error: 'internal_error' });
  }
}
