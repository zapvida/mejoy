import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const qs = req.url?.split("?")[1];
  if (req.method === "HEAD") {
    res.setHeader("x-adapter", "pdf-catchall");
    res.status(200).end();
    return;
  }
  res.writeHead(307, { Location: `/api/pdf/report${qs ? `?${qs}` : ""}` });
  res.end();
}
