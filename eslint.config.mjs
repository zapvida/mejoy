// eslint.config.mjs
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import unused from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/legacy/**",
      "src/features/triage/configs/**",
      "src/features/triage/components/**",
      "src/lib/admin-queries.ts",
      "src/lib/alerts-engine.ts",
      "src/lib/analytics/**",
      "src/lib/monitoring/**",
      "src/lib/pdf/**",
      "src/lib/privacy.ts",
      "src/lib/report/**",
      "src/lib/stripe/**",
      "src/pages/api/_utils/**",
      "src/pages/api/gerarRelatorio.ts",
      "src/pages/api/gift/**",
      "src/pages/api/pdf/**",
      "src/pages/api/report/**",
      "src/pages/api/stripe/**",
      "src/pages/api/user/**",
      "src/components/admin/**",
      "src/components/b2b/**",
      "src/components/calculators/**",
      "src/components/gamification/**",
      "src/components/interactions/**",
      "src/components/mobile/**",
      "src/components/notifications/**",
      "src/components/patient/**",
      "src/components/personalization/**",
      "src/components/report/**",
      "src/components/triage/**",
      "src/components/ui/**",
      "src/lib/ga4.ts",
      "src/lib/i18n.ts",
      "src/lib/utm.ts",
      "src/middleware.ts",
      "src/pages/_app.tsx",
      "src/pages/api/chat-medico.ts",
      "src/pages/api/security/**",
      "src/pages/api/tts.ts",
      "src/pages/index.tsx",
      "src/pages/relatorio/**",
      "src/pages/triagem/**",
      "src/types/**"
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: "latest"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "unused-imports": unused,
      "import": importPlugin
    },
    rules: {
      "no-console": "off",
      "no-debugger": "error",
      "no-warning-comments": "off",
      "unused-imports/no-unused-imports": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", args: "after-used", varsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "import/order": "off",
      "no-undef": "off"
    }
  }
];
