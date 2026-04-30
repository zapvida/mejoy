import { randomUUID } from "crypto";

import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { isFeatureEnabled, serverEnv } from "@/lib/env";
import { withTtsMonitoring, captureUserEvent } from "@/lib/monitoring/api-middleware";

type TtsResponse = { url: string } | { error: string };

// Schema de validação Zod
const TtsRequestSchema = z.object({
  text: z.string().min(1).max(10000), // Limitar tamanho do texto
  voice: z.string().optional().default("pt-BR-AntonioNeural"),
});

// Rate limiting para TTS
const ttsRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const TTS_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const TTS_RATE_LIMIT_MAX_REQUESTS = 3; // Menos requests que triagem

function checkTtsRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = ttsRateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    ttsRateLimitMap.set(ip, { count: 1, resetTime: now + TTS_RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= TTS_RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

// Autenticação via NextAuth (simulada)
async function authenticateTtsRequest(req: NextApiRequest): Promise<{ userId: string | null; isAuthenticated: boolean }> {
  const authHeader = req.headers.authorization;
  
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Em produção: validar JWT token
    return { userId: token, isAuthenticated: true };
  }
  
  return { userId: null, isAuthenticated: false };
}

// Validação de conteúdo tóxico/offensive (simplificada)
function isContentSafe(text: string): boolean {
  const offensiveWords = [
    'hate', 'violence', 'threat', 'abuse', 'harassment',
    'ódio', 'violência', 'ameaça', 'abuso', 'assédio'
  ];
  
  const lowerText = text.toLowerCase();
  return !offensiveWords.some(word => lowerText.includes(word));
}

// Mock TTS implementation - em produção usar OpenAI TTS ou ElevenLabs
const generateTTS = async (text: string, voice: string): Promise<Buffer> => {
  // Validação adicional de conteúdo
  if (!isContentSafe(text)) {
    throw new Error("Conteúdo não permitido");
  }
  
  // Mock: retornar buffer pequeno
  // Em produção: chamar OpenAI TTS ou ElevenLabs
  return Buffer.from("mock audio data for: " + text.substring(0, 50));
};

export default withTtsMonitoring(async function handler(req: NextApiRequest, res: NextApiResponse<TtsResponse>) {
  const startTime = Date.now();
  const reqId = Math.random().toString(36).substring(7);
  const ip = req.headers['x-forwarded-for'] as string || req.connection.remoteAddress || 'unknown';
  
  // Log estruturado
  console.log(`[${reqId}] TTS ${req.method} ${req.url} - IP: ${ip}`);
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  // Verificar feature flag TTS_ENABLED
  if (!isFeatureEnabled('TTS_ENABLED')) {
    console.log(`[${reqId}] TTS disabled by feature flag`);
    return res.status(501).json({ 
      error: "Serviço de áudio temporariamente indisponível. Tente novamente mais tarde." 
    });
  }

  // Rate limiting
  if (!checkTtsRateLimit(ip)) {
    console.log(`[${reqId}] TTS rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ error: "Rate limit exceeded. Try again later." });
  }

  // Validação Zod
  const validationResult = TtsRequestSchema.safeParse(req.body);
  if (!validationResult.success) {
    console.log(`[${reqId}] TTS validation error:`, validationResult.error);
    return res.status(400).json({ 
      error: "Dados inválidos: " + validationResult.error.errors.map(e => e.message).join(", ")
    });
  }

  const { text, voice } = validationResult.data;

  // Autenticação
  const { userId, isAuthenticated } = await authenticateTtsRequest(req);
  
  // Para TTS, exigir autenticação (mais restritivo que triagem)
  if (!isAuthenticated) {
    console.log(`[${reqId}] TTS access denied - not authenticated`);
    return res.status(401).json({ error: "Autenticação necessária para gerar áudio." });
  }

  // Validação de conteúdo
  if (!isContentSafe(text)) {
    console.log(`[${reqId}] TTS content rejected - unsafe content`);
    return res.status(400).json({ error: "Conteúdo não permitido." });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log(`[${reqId}] TTS Supabase not configured`);
    return res.status(500).json({ error: "Supabase não configurado." });
  }

  try {
    // Gerar áudio
    const file = await generateTTS(text, voice);

    // Verificar tamanho do arquivo (limite de 1MB)
    if (file.length > 1024 * 1024) {
      console.log(`[${reqId}] TTS file too large: ${file.length} bytes`);
      return res.status(400).json({ error: "Arquivo de áudio muito grande." });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const path = `tts/${userId || 'anonymous'}/${randomUUID()}.mp3`;

    // Upload com política de segurança
    const { error: uploadError } = await supabase.storage
      .from("tts")
      .upload(path, file, { 
        contentType: "audio/mpeg", 
        upsert: true,
        // Metadata para auditoria
        metadata: {
          userId: userId || 'anonymous',
          timestamp: new Date().toISOString(),
          textLength: text.length,
          voice: voice
        }
      });

    if (uploadError) {
      console.log(`[${reqId}] TTS upload error:`, uploadError);
      throw new Error(uploadError.message);
    }

    // Criar signed URL com expiração curta (1 hora)
    const { data: signed, error: signedError } = await supabase.storage
      .from("tts")
      .createSignedUrl(path, 60 * 60); // 1 hora

    if (signedError) {
      console.log(`[${reqId}] TTS signed URL error:`, signedError);
      throw new Error(signedError.message);
    }

    const duration = Date.now() - startTime;
    console.log(`[${reqId}] TTS success - Duration: ${duration}ms, User: ${userId}, Text length: ${text.length}`);

    // Capturar evento de negócio
    captureUserEvent('tts_generated', {
      userId: userId || 'anonymous',
      textLength: text.length,
      voice,
      duration
    });

    return res.status(200).json({ 
      url: signed?.signedUrl ?? `${supabaseUrl}/storage/v1/object/public/tts/${path}` 
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : "Erro ao gerar áudio.";
    console.log(`[${reqId}] TTS error - Duration: ${duration}ms, Error: ${message}`);
    return res.status(500).json({ error: message });
  }
});
