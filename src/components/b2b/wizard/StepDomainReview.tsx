import { useRouter } from "next/router";
import { useState } from "react";
import { useBranding } from "@/state/b2bBranding";
import { track } from "@/lib/analytics";

export default function StepDomainReview() {
  const { data, set } = useBranding();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function saveDraft() {
    setLoading(true);
    track("runner_save_start", { step: 4, section: "wizard" });
    try {
      // Upload do logo se houver arquivo
      let logoUrl = data.logoUrl;
      if (data.logoFile) {
        try {
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(data.logoFile!);
          });

          const uploadRes = await fetch("/api/branding/upload-logo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64 }),
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            logoUrl = uploadData.url;
          }
        } catch (uploadError) {
          console.error("Upload logo error:", uploadError);
          // Continua sem logo se upload falhar
        }
      }

      // Salvar draft (mapeia primary/secondary para brandColor/accentColor)
      const res = await fetch("/api/branding/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logoUrl: logoUrl || undefined,
          brandColor: data.primary || undefined,
          accentColor: data.secondary || undefined,
          fantasyName: data.fantasyName || undefined,
          ctaText: data.ctaText || undefined,
          ctaUrl: data.ctaUrl || undefined,
          whatsapp: data.whatsapp || undefined,
          desiredDomain: data.domain || undefined,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Falha ao salvar");
      }

      const j = await res.json();
      
      // Tracking de sucesso
      track("runner_complete", { 
        step: 4, 
        section: "wizard",
        draft_id: j.id,
        has_logo: !!data.logoUrl,
        has_domain: !!data.domain
      });
      
      // Redirecionar para sandbox/checkout
      router.push(`/b2b/sandbox?draft=${j.id ?? ""}`);
    } catch (e: any) {
      alert(e.message || "Erro ao salvar. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Domínio */}
      <label className="block">
        <div className="text-sm font-medium text-gray-900 mb-2">
          Domínio desejado (opcional)
        </div>
        <input
          value={data.domain || ""}
          onChange={(e) => set("domain", e.target.value)}
          placeholder="clinicexyz.com.br"
          className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
        <p className="mt-2 text-xs text-gray-500">
          Você recebe uma URL provisória agora. O CNAME pode ser feito depois.
        </p>
      </label>

      {/* Revisão */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="font-semibold text-gray-900 mb-3">Revisão</div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <b className="text-gray-900">Nome:</b> {data.fantasyName || "Não informado"}
          </li>
          <li>
            <b className="text-gray-900">Cores:</b> {data.primary || "#10b981"} / {data.secondary || "#34d399"}
          </li>
          <li>
            <b className="text-gray-900">CTA:</b> {data.ctaText || "Não informado"} → {data.ctaUrl || "Não informado"}
          </li>
          {data.whatsapp && (
            <li>
              <b className="text-gray-900">WhatsApp:</b> {data.whatsapp}
            </li>
          )}
          {data.domain && (
            <li>
              <b className="text-gray-900">Domínio:</b> {data.domain}
            </li>
          )}
        </ul>
      </div>

      {/* Botão Salvar */}
      <button
        onClick={saveDraft}
        disabled={loading || !data.fantasyName || !data.ctaText || !data.ctaUrl}
        className="inline-flex items-center justify-center h-10 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
      >
        {loading ? "Salvando..." : "Salvar e abrir demo em tela cheia"}
      </button>
    </div>
  );
}

