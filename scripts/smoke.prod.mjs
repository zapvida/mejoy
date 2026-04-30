import fetch from "node-fetch";

const BASE = process.env.BASE_URL || "https://www.zapfarm.com";
const ok = s => s >= 200 && s < 400;

const paths = ["/", "/#cases", "/b2b/sandbox", "/b2b/assinar", "/triagem", "/api/tenant/info"];
const postOnly = [{ path: "/api/analytics/vitals", expect: 405 }];

function mark(pass, msg){ console.log(`${pass ? "✅" : "❌"} ${msg}`); if(!pass) process.exitCode = 1; }

(async () => {
  for (const p of paths) {
    const r = await fetch(`${BASE}${p}`, { redirect: "manual" }).catch(()=>null);
    mark(r && ok(r.status), `GET ${p} -> ${r?.status ?? "ERR"}`);
  }

  for (const {path, expect} of postOnly) {
    const r = await fetch(`${BASE}${path}`, { method: "GET" }).catch(()=>null);
    mark(r && r.status === expect, `GET ${path} -> ${r?.status ?? "ERR"} (esperado ${expect})`);
  }
})();

