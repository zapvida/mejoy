import { StepDef, TriageFlow } from "../schema";

import { formularios } from "@/forms";
import type { Formulario } from "@/forms";
import { gastro, type TQuestion, type TStep as GastroStep } from "@/forms/gastro";
import type { Option as LegacyOption, Step as LegacyStep } from "@/types/triagem";

const POR_QUE_PREFIX = "Por que perguntamos? ";
const DEFAULT_INFO_KEY_PREFIX = "info";

const normalizeSlug = (value: string, fallback: string) => {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
  return base || fallback;
};

const toOption = (option: string | LegacyOption): { value: string; label: string } => {
  if (typeof option === "string") {
    const trimmed = option.trim();
    return { value: trimmed, label: option };
  }
  return {
    value: (option.value ?? option.label ?? "").trim(),
    label: option.label ?? option.value
  };
};

const buildHelper = (label?: string, justification?: string, example?: string): { helper?: string; why?: string } => {
  const helperParts: string[] = [];
  if (label) helperParts.push(label);
  if (example) helperParts.push(`Ex.: ${example}`);
  const helper = helperParts.length ? helperParts.join(" ") : undefined;

  let why: string | undefined;
  if (justification) {
    const trimmed = justification.trim();
    why = trimmed
      ? trimmed.startsWith("Por que")
        ? trimmed
        : `${POR_QUE_PREFIX}${trimmed}`
      : undefined;
  }
  return { helper, why };
};

const buildDependsOn = (conditional?: { field: string; value: string | string[] }) => {
  if (!conditional) return undefined;
  return [
    {
      key: conditional.field,
      value: Array.isArray(conditional.value) ? conditional.value : [conditional.value]
    }
  ];
};

const buildGastroDependsOn = (question: TQuestion) => {
  if (!question.condition?.length) return undefined;
  return question.condition.map(cond => ({
    key: cond.when,
    value: Array.isArray(cond.is) ? cond.is : [cond.is]
  }));
};

const convertLegacyStep = (step: LegacyStep, index: number): StepDef[] => {
  const steps: StepDef[] = [];

  if (step.type === "intro" || step.type === "setor") {
    const key = normalizeSlug(step.name ?? `${DEFAULT_INFO_KEY_PREFIX}_${index}`, `${DEFAULT_INFO_KEY_PREFIX}_${index}`);
    const { why } = buildHelper(undefined, step.justification);
    steps.push({
      key,
      type: "info",
      label: step.label || "",
      description: step.description,
      helper: undefined, // Não duplicar description no helper
      why
    });
    return steps;
  }

  // Suporte para tipo 'info' com bullets e highlightTag
  if (step.type === "info") {
    const key = normalizeSlug(step.name ?? `${DEFAULT_INFO_KEY_PREFIX}_${index}`, `${DEFAULT_INFO_KEY_PREFIX}_${index}`);
    steps.push({
      key,
      type: "info",
      label: step.label || "",
      description: step.description,
      helper: undefined, // Não repetir description no helper
      highlightTag: (step as any).highlightTag,
      icon: (step as any).icon,
      bullets: (step as any).bullets
    });
    return steps;
  }

  // Suporte para tipo 'select_cards'
  if (step.type === "select_cards") {
    const key = normalizeSlug(step.name, `field_${index}`);
    const { helper, why } = buildHelper(step.description, step.justification);
    steps.push({
      key,
      type: "select_cards",
      label: step.label ?? step.name,
      group: (step as any).group,
      autoAdvance: (step as any).autoAdvance,
      compact: (step as any).compact,
      helper,
      helperText: (step as any).helperText,
      evidenceNote: (step as any).evidenceNote,
      why,
      required: step.required ?? false,
      cardOptions: (step as any).cardOptions?.map((opt: any) => ({
        value: opt.value,
        title: opt.title,
        subtitle: opt.subtitle,
        priceHint: opt.priceHint,
        badge: opt.badge
      }))
    });
    return steps;
  }

  const key = normalizeSlug(step.name, `field_${index}`);
  const { helper, why } = buildHelper(step.description, step.justification, step.example);
  const dependsOn = buildDependsOn(step.conditional);
  const baseDef: Omit<StepDef, "type"> = {
    key,
    label: step.label ?? step.name,
    group: (step as any).group,
    autoAdvance: (step as any).autoAdvance,
    compact: (step as any).compact,
    helper,
    helperText: (step as any).helperText,
    evidenceNote: (step as any).evidenceNote,
    why,
    placeholder: step.placeholder,
    required: step.required ?? false,
    dependsOn,
    legalLinks: (step as any).legalLinks
  };

  switch (step.type) {
    case "text":
      steps.push({
        ...baseDef,
        type: "text"
      });
      break;
    case "input": {
      // Evita falsos positivos (ex.: whatsapp) e aplica unidade só em campos biométricos.
      const numericFieldKeys = new Set([
        "altura",
        "peso",
        "peso_meta",
        "weight",
        "height",
        "age",
        "idade",
      ]);
      const isNumericField = numericFieldKeys.has((step.name || "").toLowerCase());

      if (isNumericField) {
        steps.push({
          ...baseDef,
          type: "number",
          min: 0,
          step: step.name === 'altura' || step.name === 'height' ? 1 : 0.1
        });
      } else {
        steps.push({
          ...baseDef,
          type: "text"
        });
      }
      break;
    }
    case "textarea":
      steps.push({
        ...baseDef,
        type: "textarea"
      });
      break;
    case "select":
      steps.push({
        ...baseDef,
        type: "select",
        options: step.options?.map(toOption),
        legalLinks: (step as any).legalLinks
      });
      break;
    case "date":
      steps.push({
        ...baseDef,
        type: "date"
      });
      break;
    case "multiselect":
      steps.push({
        ...baseDef,
        type: "multiselect",
        multi: true,
        options: step.options?.map(toOption)
      });
      break;
    default:
      steps.push({
        ...baseDef,
        type: "text"
      });
      break;
  }

  return steps;
};

const convertGastroStep = (step: GastroStep, stepIndex: number): StepDef[] => {
  const steps: StepDef[] = [];
  const infoKey = normalizeSlug(step.id, `${DEFAULT_INFO_KEY_PREFIX}_${stepIndex}`);
  steps.push({
    key: `${infoKey}_intro`,
    type: "info",
    label: step.title,
    description: (step as any).description ?? undefined
  });

  step.questions.forEach((question, index) => {
    const keySource = question.saveAs ?? question.id;
    const key = normalizeSlug(keySource, `${infoKey}_${index}`);
    const { helper: hintHelper } = buildHelper(question.hint, undefined, undefined);
    const helper = [hintHelper, question.unit ? `Unidade: ${question.unit}` : undefined]
      .filter(Boolean)
      .join(" ");
    const dependsOn = buildGastroDependsOn(question);
    const base: Omit<StepDef, "type"> = {
      key,
      label: question.label,
      helper: helper || undefined,
      required: question.required ?? false,
      dependsOn
    };

    switch (question.type) {
      case "input":
        steps.push({
          ...base,
          type: "text",
          placeholder: question.placeholder
        });
        break;
      case "number":
        steps.push({
          ...base,
          type: "number",
          min: question.min,
          max: question.max,
          step: question.step
        });
        break;
      case "radio":
        steps.push({
          ...base,
          type: "radio",
          options: question.options?.map(opt => ({ value: opt.value, label: opt.label }))
        });
        break;
      case "checkbox":
        steps.push({
          ...base,
          type: "checkbox",
          multi: true,
          options: question.options?.map(opt => ({ value: opt.value, label: opt.label }))
        });
        break;
      case "select":
        steps.push({
          ...base,
          type: "select",
          options: question.options?.map(opt => ({ value: opt.value, label: opt.label }))
        });
        break;
      case "scale":
        steps.push({
          ...base,
          type: "scale",
          min: question.min ?? 0,
          max: question.max ?? 10,
          step: question.step ?? 1
        });
        break;
      case "textarea":
        steps.push({
          ...base,
          type: "textarea"
        });
        break;
      case "date":
        steps.push({
          ...base,
          type: "date"
        });
        break;
      default:
        steps.push({
          ...base,
          type: "text"
        });
        break;
    }
  });

  return steps;
};

const buildFlow = (slug: string, form: Formulario): TriageFlow => {
  const steps: StepDef[] = [];

  if (slug === "gastro") {
    gastro.steps.forEach((step, index) => {
      steps.push(...convertGastroStep(step, index));
    });
  } else if (form.perguntas) {
    form.perguntas.forEach((legacyStep, index) => {
      steps.push(...convertLegacyStep(legacyStep, index));
    });
  }

  return {
    slug,
    title: form.titulo,
    intro: form.descricao,
    flowVersion: form.flowVersion,
    schemaVersion: form.schemaVersion,
    steps
  };
};

export const flowsMap: Record<string, TriageFlow> = Object.fromEntries(
  Object.entries(formularios).map(([slug, form]) => [slug, buildFlow(slug, form)])
);

export const triageFlows: TriageFlow[] = Object.values(flowsMap);
