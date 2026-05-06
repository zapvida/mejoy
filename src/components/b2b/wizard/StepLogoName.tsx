import * as React from "react";
import { useBranding } from "@/state/b2bBranding";

export default function StepLogoName() {
  const { data, set } = useBranding();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    // Validar tipo
    if (!f.type.startsWith("image/")) {
      alert("Por favor, selecione uma imagem");
      return;
    }

    // Validar tamanho (5MB)
    if (f.size > 5 * 1024 * 1024) {
      alert("Arquivo muito grande. Máximo 5MB");
      return;
    }

    // Preview instantâneo com ObjectURL
    const url = URL.createObjectURL(f);
    set("logoFile", f);
    set("logoUrl", url);
  }

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <label className="block">
        <div className="text-sm font-medium text-gray-900 mb-2">
          Logo da clínica
        </div>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-10 rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
          >
            {data.logoUrl && data.logoUrl !== "/logosmejoy/logomejoy.svg" 
              ? "Trocar logo" 
              : "Enviar logo"}
          </button>
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt="Logo preview"
              className="h-10 w-10 rounded-lg object-contain ring-1 ring-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logosmejoy/logomejoy.svg";
              }}
            />
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          PNG/SVG até 5MB. Pré-visualização imediata.
        </p>
      </label>

      {/* Nome da clínica */}
      <label className="block">
        <div className="text-sm font-medium text-gray-900 mb-2">
          Nome da clínica/empresa
        </div>
        <input
          value={data.fantasyName}
          onChange={(e) => set("fantasyName", e.target.value)}
          placeholder="Ex: Clínica Saúde Total"
          className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </label>
    </div>
  );
}
