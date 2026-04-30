import { cn } from "@/lib/utils";

type IllustrationVariant =
  | "emag_intro"
  | "emag_goal"
  | "emag_history"
  | "emag_lifestyle"
  | "emag_glp1"
  | "emag_heart"
  | "emag_support";

interface TriageStepIllustrationProps {
  variant: IllustrationVariant;
  brand: "zapfarm" | string;
}

export function TriageStepIllustration({
  variant,
  brand
}: TriageStepIllustrationProps) {
  const isZapfarm = brand === "zapfarm";
  const baseGradient = isZapfarm
    ? "from-purple-100 via-purple-50 to-orange-100"
    : "from-green-100 via-green-50 to-emerald-100";

  // Mapear variantes para emojis grandes e visíveis
  const emojiMap: Record<IllustrationVariant, string> = {
    emag_intro: "✨",
    emag_goal: "🎯",
    emag_history: "📚",
    emag_lifestyle: "🏃",
    emag_glp1: "🚀",
    emag_heart: "❤️",
    emag_support: "🤝"
  };

  return (
    <div
      className={cn(
        "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0 rounded-2xl sm:rounded-3xl",
        `bg-gradient-to-br ${baseGradient}`,
        "flex items-center justify-center",
        "shadow-lg",
        "border-2",
        isZapfarm ? "border-purple-200/50" : "border-green-200/50"
      )}
    >
      <span className="text-4xl sm:text-5xl md:text-6xl">
        {emojiMap[variant]}
      </span>
    </div>
  );
}

// Função helper para mapear step.key para variante de ilustração
export function getIllustrationVariant(
  flowSlug: string,
  stepKey: string | undefined
): IllustrationVariant | null {
  if (flowSlug !== "emagrecimento" || !stepKey) {
    return null;
  }

  // Mapear keys normalizados para variantes
  const keyMap: Record<string, IllustrationVariant> = {
    intro: "emag_intro",
    setor_objetivo: "emag_goal",
    setor_historico: "emag_history",
    setor_estilo_vida: "emag_lifestyle",
    info_glp1_revolucao: "emag_glp1",
    info_risco_cardiovascular: "emag_heart",
    info_acompanhamento: "emag_support"
  };

  return keyMap[stepKey] || null;
}

