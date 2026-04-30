import { useBranding } from "@/state/b2bBranding";

export default function StepCtas() {
  const { data, set } = useBranding();

  return (
    <div className="space-y-5">
      <label className="block">
        <div className="text-sm font-medium text-gray-900 mb-2">
          Texto do CTA
        </div>
        <input
          value={data.ctaText}
          onChange={(e) => set("ctaText", e.target.value)}
          placeholder="Falar com médico"
          className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </label>

      <label className="block">
        <div className="text-sm font-medium text-gray-900 mb-2">
          URL do CTA
        </div>
        <input
          type="url"
          value={data.ctaUrl}
          onChange={(e) => set("ctaUrl", e.target.value)}
          placeholder="https://wa.me/55XXXXXXXXXX"
          className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
        <p className="mt-1 text-xs text-gray-500">
          Aceita WhatsApp (<code className="text-xs">https://wa.me/55XXXXXXXXXX</code>) ou qualquer URL HTTPS válida.
        </p>
      </label>

      <label className="block">
        <div className="text-sm font-medium text-gray-900 mb-2">
          WhatsApp (opcional)
        </div>
        <input
          type="text"
          value={data.whatsapp || ""}
          onChange={(e) => set("whatsapp", e.target.value)}
          placeholder="11999999999"
          className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </label>
    </div>
  );
}

