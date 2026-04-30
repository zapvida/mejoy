import { useBranding } from "@/state/b2bBranding";
import { CURATED_PALETTES, deriveBrand, type Hex } from "@/lib/theme/brand";

export default function StepColors() {
  const { data, set } = useBranding();

  return (
    <div className="space-y-6">
      {/* Cor primária */}
      <div>
        <div className="text-sm font-medium text-gray-900 mb-3">
          Cor primária
        </div>
        
        {/* Swatches curados */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CURATED_PALETTES.map((palette) => {
            const selected = data.primary === palette.brand;
            return (
              <button
                key={palette.name}
                type="button"
                onClick={() => {
                  const d = deriveBrand(palette.brand as Hex);
                  set("primary", d.brand600);
                  set("secondary", palette.accent);
                }}
                className={`
                  relative h-11 w-11 rounded-full ring-2 ring-white shadow-md transition-all
                  ${selected 
                    ? "ring-4 ring-emerald-500 scale-110" 
                    : "hover:scale-105"
                  }
                `}
                style={{ backgroundColor: palette.brand }}
                aria-label={`Cor ${palette.name}`}
                title={palette.name}
              />
            );
          })}
        </div>

        {/* Input hex livre */}
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={data.primary || "#10b981"}
            onChange={(e) => {
              const color = e.target.value as Hex;
              const d = deriveBrand(color);
              set("primary", d.brand600);
            }}
            className="h-11 w-20 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={data.primary || "#10b981"}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
                const d = deriveBrand(v as Hex);
                set("primary", d.brand600);
              } else {
                set("primary", v);
              }
            }}
            placeholder="#10b981"
            className="flex-1 h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Cor secundária (opcional) */}
      <div>
        <div className="text-sm font-medium text-gray-900 mb-2">
          Cor secundária (opcional)
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={data.secondary || "#34d399"}
            onChange={(e) => {
              const color = e.target.value as Hex;
              const d = deriveBrand(color);
              set("secondary", d.brand600);
            }}
            className="h-11 w-20 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={data.secondary || "#34d399"}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
                const d = deriveBrand(v as Hex);
                set("secondary", d.brand600);
              } else {
                set("secondary", v);
              }
            }}
            placeholder="#34d399"
            className="flex-1 h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );
}

