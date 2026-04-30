import type { NextApiRequest, NextApiResponse } from "next";
import { readJson } from "@/lib/http/parse";
import { z } from "zod";

const BodySchema = z.object({
  id: z.string().min(1),
  note: z.string().optional(),
});

type ShareResponse = {
  urlCurta: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ShareResponse | { error: string }>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // BEGIN patch share-report
    const body = readJson(req, res, BodySchema);
    if (!body.ok) return;

    const { id } = body.data;
    // END patch

    const shareSlug = createShareSlug(id);
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      `${req.headers["x-forwarded-proto"] ?? "https"}://${req.headers.host ?? "zapfarm.com.br"}`;

    const urlCurta = `${baseUrl.replace(/\/$/, "")}/relatorio/${encodeURIComponent(id)}?share=${shareSlug}`;
    return res.status(200).json({ urlCurta });
  } catch (error) {
    console.error("[api/report/share] Erro ao gerar link curto:", error);
    return res.status(500).json({ error: "Não foi possível gerar link curto" });
  }
}

function createShareSlug(id: string): string {
  const seed = `${id}-${Date.now()}`;
  return Buffer.from(seed).toString("base64url").slice(0, 8);
}
