import type { NextApiRequest, NextApiResponse } from "next";
// Mock TTS implementation for now - replace with actual TTS service
// eslint-disable-next-line no-unused-vars
const generateTTS = async (_text: string, _voice: string): Promise<Buffer> => {
  // This is a placeholder - in production you would use a real TTS service
  // For now, return a small audio buffer
  return Buffer.from("mock audio data");
};
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

type TtsResponse = { url: string } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<TtsResponse>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { text, voice = "pt-BR-AntonioNeural" } = req.body as { text?: string; voice?: string };
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "Texto é obrigatório." });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Supabase não configurado." });
  }

  try {
    const file = await generateTTS(text, voice);

    const supabase = createClient(supabaseUrl, supabaseKey);
    const path = `tts/${randomUUID()}.mp3`;

    const { error: uploadError } = await supabase.storage
      .from("tts")
      .upload(path, file, { contentType: "audio/mpeg", upsert: true });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: signed, error: signedError } = await supabase.storage
      .from("tts")
      .createSignedUrl(path, 60 * 60 * 24 * 30);

    if (signedError) {
      throw new Error(signedError.message);
    }

    return res.status(200).json({ url: signed?.signedUrl ?? `${supabaseUrl}/storage/v1/object/public/tts/${path}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao gerar áudio.";
    return res.status(500).json({ error: message });
  }
}
