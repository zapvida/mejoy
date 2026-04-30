import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, demo } = req.query as { id?: string; demo?: string };
  const qs = new URLSearchParams({ ...(id ? { id } : {}), ...(demo ? { demo: "1" } : {}) }).toString();

  if (req.method === "HEAD") {
    res.setHeader("x-adapter", "pdf-id");
    res.status(200).end();
    return;
  }
  
  res.writeHead(307, { Location: `/api/pdf/report${qs ? `?${qs}` : ""}` });
  res.end();
}
