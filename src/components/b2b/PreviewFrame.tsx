import * as React from "react";
import { useBranding } from "@/state/b2bBranding";
import { deriveBrand, type Hex } from "@/lib/theme/brand";

export default function PreviewFrame() {
  const { data } = useBranding();

  // Deriva cores com validação de contraste
  const primaryBrand = data.primary 
    ? deriveBrand((data.primary as Hex) || "#10b981")
    : { brand600: "#10b981", brand700: "#059669", optimized: false };
  
  const secondaryBrand = data.secondary
    ? deriveBrand((data.secondary as Hex) || "#34d399")
    : { brand600: "#34d399", brand700: "#10b981", optimized: false };

  const style: React.CSSProperties = {
    ["--brand-600" as any]: primaryBrand.brand600,
    ["--brand-700" as any]: primaryBrand.brand700,
    ["--brand-500" as any]: secondaryBrand.brand600,
    ["--accent-600" as any]: secondaryBrand.brand600,
  };

  return (
    <aside className="sticky top-16">
      <div
        className="rounded-2xl border bg-white shadow-sm p-5 md:p-6"
        style={style}
      >
        {/* Header com logo + nome (SEPARADOS) */}
        <div className="flex items-center gap-3 mb-6">
          {/* logo */}
          <img
            alt="Logo da clínica"
            src={data.logoUrl || "/brand/logo-horizontal-primary.png"}
            className="h-10 w-10 rounded-lg object-contain ring-1 ring-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/brand/logo-horizontal-primary.png";
            }}
          />
          <div className="text-lg font-semibold tracking-tight text-gray-900">
            {data.fantasyName || "Sua clínica"}
          </div>
        </div>

        {/* Hero fake da landing */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm text-gray-600 mb-3">Como ficará sua landing:</div>
          
          {/* Barras simuladas */}
          <div className="space-y-2 mb-4">
            <div 
              className="h-3 w-3/4 rounded-full"
              style={{ backgroundColor: primaryBrand.brand600, opacity: 0.9 }}
            />
            <div 
              className="h-3 w-2/3 rounded-full"
              style={{ backgroundColor: secondaryBrand.brand600, opacity: 0.7 }}
            />
          </div>

          {/* CTA Button */}
          <button
            className="mt-4 h-11 w-full rounded-xl px-4 font-medium text-white shadow-md hover:shadow-lg transition-all hover:brightness-95 active:translate-y-[1px]"
            style={{ backgroundColor: primaryBrand.brand600 }}
            type="button"
          >
            {data.ctaText || "Chamar no WhatsApp"}
          </button>
        </div>
      </div>
    </aside>
  );
}
