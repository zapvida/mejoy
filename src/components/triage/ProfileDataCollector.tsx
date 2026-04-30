import { motion } from "framer-motion";
import { useState, type ChangeEvent } from "react";
import { EnhancedInput, NumericInput } from "@/components/ui/EnhancedInput";
import { toNumber, maskWeight, maskHeight } from "@/lib/format/number";
import { cn } from "@/lib/utils";
import { getBrandBySlug, BRAND_CONFIG } from "@/lib/brand/config";

interface ProfileDataCollectorProps {
  triageSlug: string;
  initialData?: {
    name?: string;
    whatsapp?: string;
    email?: string;
    weight?: number;
    height?: number;
    age?: number;
  };
  onSubmit: (data: {
    name: string;
    whatsapp: string;
    email: string;
    weight: number;
    height: number;
    age: number;
  }) => Promise<void>;
  onSkip?: () => void;
}

export function ProfileDataCollector({
  triageSlug,
  initialData = {},
  onSubmit,
  onSkip
}: ProfileDataCollectorProps) {
  const brand = getBrandBySlug(triageSlug);
  const brandConfig = BRAND_CONFIG[brand];

  const getBgGradient = () => {
    if (brand === 'zapfarm') {
      return 'bg-gradient-to-br from-purple-50 via-white to-orange-50';
    }
    return 'bg-gradient-to-br from-green-50 via-white to-emerald-50';
  };

  const getBorderColor = () => {
    if (brand === 'zapfarm') {
      return 'border-purple-200/50';
    }
    return 'border-green-200/50';
  };

  const getButtonGradient = () => {
    if (brand === 'zapfarm') {
      return 'bg-gradient-to-r from-purple-600 via-purple-700 to-orange-600';
    }
    return 'bg-gradient-to-r from-green-500 via-green-600 to-emerald-600';
  };

  const [name, setName] = useState(initialData.name || "");
  const [whatsapp, setWhatsapp] = useState(initialData.whatsapp || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [weight, setWeight] = useState(initialData.weight?.toString() || "");
  const [height, setHeight] = useState(initialData.height?.toString() || "");
  const [age, setAge] = useState(initialData.age?.toString() || "");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Nome completo é obrigatório";
    }

    if (!whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp é obrigatório";
    } else {
      // Validar formato básico de telefone (aceita com ou sem formatação)
      const cleanWhatsapp = whatsapp.replace(/\D/g, "");
      if (cleanWhatsapp.length < 10) {
        newErrors.whatsapp = "WhatsApp inválido";
      }
    }

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Email inválido";
      }
    }

    if (!weight.trim()) {
      newErrors.weight = "Peso é obrigatório";
    } else {
      const weightNum = toNumber(weight);
      if (isNaN(weightNum) || weightNum <= 0 || weightNum > 500) {
        newErrors.weight = "Peso inválido (ex: 70 ou 70.5)";
      }
    }

    if (!height.trim()) {
      newErrors.height = "Altura é obrigatória";
    } else {
      const heightNum = toNumber(height);
      if (isNaN(heightNum) || heightNum <= 0 || heightNum > 300) {
        newErrors.height = "Altura inválida (ex: 170 ou 1.70)";
      }
    }

    if (!age.trim()) {
      newErrors.age = "Idade é obrigatória";
    } else {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        newErrors.age = "Idade inválida";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Normalizar altura: se for menor que 3, assumir que está em metros e converter para cm
      let heightNum = toNumber(height);
      if (heightNum < 3) {
        heightNum = heightNum * 100; // Converter metros para cm
      }

      // Normalizar peso: se for muito grande, assumir que está em gramas e converter para kg
      let weightNum = toNumber(weight);
      if (weightNum > 1000) {
        weightNum = weightNum / 1000; // Converter gramas para kg
      }

      await onSubmit({
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        weight: weightNum,
        height: heightNum,
        age: parseInt(age, 10)
      });
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : "Erro ao salvar dados" });
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full space-y-3 sm:space-y-4", getBgGradient())}
    >
      <div className="rounded-2xl sm:rounded-3xl border bg-white/80 backdrop-blur-sm p-3 sm:p-5 md:p-7 shadow-lg">
        <div className="mb-3 sm:mb-4">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">✍️</span>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              Dados para seu relatório personalizado
            </h2>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
            Para gerar um relatório <strong>individualizado e personalizado</strong>, precisamos de algumas informações básicas. 
            Cada pessoa é única, e essas informações ajudam nossa inteligência artificial a criar um relatório preciso e valioso.
          </p>
          <p className="mt-1.5 text-xs text-gray-500 italic">
            Seus dados serão enviados por WhatsApp e email para você guardar com carinho! 💌
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Nome completo */}
          <div>
            <label className="mb-1 block text-xs sm:text-sm font-semibold text-gray-700">
              1. Nome completo <span className="text-red-500">*</span>
            </label>
            <EnhancedInput
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="Ex: Maria Silva"
              className={cn(
                "w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base",
                errors.name
                  ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
                  : brand === 'zapfarm'
                  ? "border-purple-200 bg-white focus:border-purple-400 focus:ring-purple-200"
                  : "border-green-200 bg-white focus:border-green-400 focus:ring-green-200"
              )}
              disabled={submitting}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="mb-1 block text-xs sm:text-sm font-semibold text-gray-700">
              2. WhatsApp <span className="text-red-500">*</span>
            </label>
            <EnhancedInput
              value={whatsapp}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setWhatsapp(e.target.value);
                if (errors.whatsapp) setErrors({ ...errors, whatsapp: "" });
              }}
              placeholder="Ex: (11) 98765-4321"
              inputMode="tel"
              className={cn(
                "w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base",
                errors.whatsapp
                  ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
                  : brand === 'zapfarm'
                  ? "border-purple-200 bg-white focus:border-purple-400 focus:ring-purple-200"
                  : "border-green-200 bg-white focus:border-green-400 focus:ring-green-200"
              )}
              disabled={submitting}
            />
            {errors.whatsapp && <p className="mt-1 text-xs text-red-600">{errors.whatsapp}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs sm:text-sm font-semibold text-gray-700">
              3. Email <span className="text-red-500">*</span>
            </label>
            <EnhancedInput
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              placeholder="Ex: maria@email.com"
              inputMode="email"
              className={cn(
                "w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base",
                errors.email
                  ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
                  : brand === 'zapfarm'
                  ? "border-purple-200 bg-white focus:border-purple-400 focus:ring-purple-200"
                  : "border-green-200 bg-white focus:border-green-400 focus:ring-green-200"
              )}
              disabled={submitting}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* Peso, Altura e Idade */}
          <div>
            <label className="mb-1 block text-xs sm:text-sm font-semibold text-gray-700">
              4. Peso, Altura e Idade <span className="text-red-500">*</span>
            </label>
            <p className="mb-2 text-[10px] sm:text-xs text-gray-500">
              Aceitamos: peso em kg (ex: 70 ou 70.5), altura em cm ou metros (ex: 170 ou 1.70), idade em anos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Peso (kg)</label>
                <NumericInput
                  value={weight}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    const maskedValue = maskWeight(value);
                    setWeight(maskedValue);
                    if (errors.weight) setErrors({ ...errors, weight: "" });
                  }}
                  onBlur={() => {
                    const normalized = toNumber(weight);
                    if (!isNaN(normalized)) {
                      setWeight(normalized.toString());
                    }
                  }}
                  placeholder="70"
                  className={cn(
                    "w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base",
                    errors.weight
                      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
                      : brand === 'zapfarm'
                      ? "border-purple-200 bg-white focus:border-purple-400 focus:ring-purple-200"
                      : "border-green-200 bg-white focus:border-green-400 focus:ring-green-200"
                  )}
                  disabled={submitting}
                />
                {errors.weight && <p className="mt-1 text-xs text-red-600">{errors.weight}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Altura (cm ou m)</label>
                <NumericInput
                  value={height}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    const maskedValue = maskHeight(value);
                    setHeight(maskedValue);
                    if (errors.height) setErrors({ ...errors, height: "" });
                  }}
                  onBlur={() => {
                    const normalized = toNumber(height);
                    if (!isNaN(normalized)) {
                      setHeight(normalized.toString());
                    }
                  }}
                  placeholder="170"
                  className={cn(
                    "w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base",
                    errors.height
                      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
                      : brand === 'zapfarm'
                      ? "border-purple-200 bg-white focus:border-purple-400 focus:ring-purple-200"
                      : "border-green-200 bg-white focus:border-green-400 focus:ring-green-200"
                  )}
                  disabled={submitting}
                />
                {errors.height && <p className="mt-1 text-xs text-red-600">{errors.height}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Idade (anos)</label>
                <NumericInput
                  value={age}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setAge(value);
                    if (errors.age) setErrors({ ...errors, age: "" });
                  }}
                  placeholder="30"
                  min={0}
                  max={150}
                  className={cn(
                    "w-full rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base",
                    errors.age
                      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200"
                      : brand === 'zapfarm'
                      ? "border-purple-200 bg-white focus:border-purple-400 focus:ring-purple-200"
                      : "border-green-200 bg-white focus:border-green-400 focus:ring-green-200"
                  )}
                  disabled={submitting}
                />
                {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1.5">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={cn(
                "flex-1 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-60",
                getButtonGradient()
              )}
            >
              {submitting ? "Salvando..." : "Gerar meu relatório personalizado"}
            </button>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                disabled={submitting}
                className="rounded-full border-2 px-6 py-3 text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-all"
              >
                Pular
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

