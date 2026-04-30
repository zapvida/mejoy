import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const url = process.env.CRM_SINK_URL;
  const token = process.env.CRM_SINK_TOKEN;
  if (!url || !token) return res.status(200).json({ ok: true, skipped: "CRM sink not configured" });

  try {
    const f = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(req.body),
    });
    const ok = f.ok;
    const text = await f.text().catch(() => "");
    if (!ok) console.warn("[crm/sink] upstream error", f.status, text);
    return res.status(200).json({ ok: true, upstream: ok ? "ok" : "error", detail: ok ? undefined : text.slice(0, 256) });
  } catch (e:any) {
    console.error("[crm/sink] exception", e?.message || e);
    return res.status(200).json({ ok: true, upstream: "exception" });
  }
}
