// src/components/ui/inputs/SelectCard.tsx
import clsx from "clsx";
import {
  Smile,
  Brain,
  AlertTriangle,
  Heart,
  Ruler,
  Activity,
} from "lucide-react";
import Image from "next/image";
import React from "react";

type Option =
  | string
  | {
      value: string;
      label: string;
      icon?: React.ReactNode;
      image?: string;
    };

interface SelectCardProps {
  options: Option[];
  value: string | string[];
  // eslint-disable-next-line no-unused-vars
  onChange: (_value: string | string[]) => void;
  className?: string;
  isMulti?: boolean;
}

export default function SelectCard({
  options,
  value,
  onChange,
  className,
  isMulti = false,
}: SelectCardProps) {
  const iconMap: Record<string, React.ReactNode> = {
    "Sedentário": <AlertTriangle />,
    "Leve": <Activity />,
    "Moderado": <Heart />,
    "Intenso": <Heart />,
    "Excelente": <Smile />,
    "Boa": <Smile />,
    "Regular": <Brain />,
    "Ruim": <AlertTriangle />,
    "Não consumo": <Smile />,
    "Ocasionalmente": <Brain />,
    "1-3 doses por semana": <Brain />,
    "Mais de 3 doses por semana": <AlertTriangle />,
    "Não": <Smile />,
    "Sim, ocasionalmente": <Brain />,
    "Sim, diariamente": <AlertTriangle />,
    "Menor que 80 cm": <Ruler />,
    "80 a 94 cm": <Ruler />,
    "94 a 102 cm": <Ruler />,
    "102 a 110 cm": <Ruler />,
    "Acima de 110 cm": <Ruler />,
  };

  return (
    <div className={clsx("grid gap-3 sm:grid-cols-1", className)}>
      {options.map((opt) => {
        const optValue = typeof opt === "string" ? opt : opt.value;
        const optLabel = typeof opt === "string" ? opt : opt.label;
        const optImage = typeof opt === "string" ? null : opt.image;
        const optIcon = typeof opt === "string" ? iconMap[opt] || null : opt.icon;

        const selected = Array.isArray(value)
          ? value.includes(optValue)
          : value === optValue;

        const handleClick = () => {
          if (isMulti) {
            const arrayValue = Array.isArray(value) ? value : [value];
            const newValue = selected
              ? arrayValue.filter((v) => v !== optValue)
              : [...arrayValue, optValue];
            onChange(newValue);
          } else {
            onChange(optValue);
          }
        };

        return (
          <button
            key={optValue}
            type="button"
            onClick={handleClick}
            role="option"
            aria-pressed={selected}
            className={clsx(
              "flex px-3 py-3 rounded-xl border transition-all duration-200 text-left items-center gap-3 cursor-pointer",
              selected
                ? "bg-green-500 border-green-600 shadow-lg ring-2 ring-green-400 text-white"
                : "bg-white border-gray-200 hover:bg-green-50 hover:border-green-500 transition-all duration-300 text-gray-900"
            )}
          >
            <div className="flex items-center gap-4 w-full">
              {optImage && (
                <div className="relative w-14 h-14 flex-shrink-0 rounded-2xl overflow-hidden border border-border shadow-md">
                  <Image
                    src={optImage.startsWith("/") ? optImage : `/${optImage}`}
                    alt={optLabel}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              {!optImage && optIcon && (
                <div className="text-green-600 flex-shrink-0">{optIcon}</div>
              )}
              <span className="text-sm font-semibold text-gray-900 flex items-center gap-2 shadow-sm py-1">
                {optLabel}
                {typeof opt !== "string" && opt.image && !optImage && (
                  <Image
                    src={opt.image.startsWith("/") ? opt.image : `/${opt.image}`}
                    alt="emoji"
                    width={20}
                    height={20}
                    unoptimized
                  />
                )}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
