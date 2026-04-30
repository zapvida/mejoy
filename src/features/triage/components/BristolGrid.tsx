import * as React from "react";

type Props = { value?: number; onChange: (value: number) => void };

export default function BristolGrid({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 7 }).map((_, i) => {
        const idx = i + 1;
        const active = value === idx;
        return (
          <button
            key={idx}
            type="button"
            aria-label={`Escala de Bristol ${idx}`}
            onClick={() => onChange(idx)}
            className={`aspect-square rounded-lg border text-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              active 
                ? "ring-2 ring-emerald-500 border-emerald-500" 
                : "hover:bg-black/5"
            }`}
          >
            {idx}
          </button>
        );
      })}
    </div>
  );
}
