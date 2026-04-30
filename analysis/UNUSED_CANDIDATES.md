# UNUSED CANDIDATES ANALYSIS

## FILES_UNUSED (89 files)

### Scripts (14 files)
- `apply-migration-final.js`
- `create-tables-direct.js`
- `execute-final-solution.js`
- `firebase.framework.config.js`
- `lighthouserc.js`
- `scripts/check-pii-logs.js`
- `scripts/extract-brand-color.js`
- `scripts/optimize-final.js`
- `scripts/qa-final.js`
- `scripts/run-migrate-on-deploy.js`
- `scripts/test-accessibility.js`
- `scripts/test-complete-system.js`
- `setup-direct-url.js`
- `test-complete-system.js`
- `test-deployment.js`

### Components (25 files)
- `src/components/analytics/GoogleAnalytics.tsx`
- `src/components/auth/index.ts`
- `src/components/landing/FeaturesSection.tsx`
- `src/components/landing/Hero.tsx`
- `src/components/landing/index.ts`
- `src/components/lgpd/ConsentGate.tsx`
- `src/components/lgpd/TriageConsentWrapper.tsx`
- `src/components/lpac/Why.tsx`
- `src/components/patient/index.ts`
- `src/components/patient/PatientInfoForm.tsx`
- `src/components/patient/PatientSummary.tsx`
- `src/components/pdf/SecurePdfExport.tsx`
- `src/components/relatorio/LinhaDoTempoSection.tsx`
- `src/components/relatorio/ProdutosAlloeCTA.tsx`
- `src/components/relatorio/Relatorio.tsx`
- `src/components/relatorio/RelatorioChat.tsx`
- `src/components/relatorio/ZapVidaCTA.tsx`
- `src/components/report/PrintOnly.tsx`
- `src/components/triagem/index.ts`
- `src/components/triagem/TriagemStepForm.tsx`
- `src/components/ui/CopyText.tsx`
- `src/components/ui/CtaDeck.tsx`
- `src/components/ui/DeleteDataButton.tsx`
- `src/components/ui/LazyLoading.tsx`
- `src/components/ui/LoadingScreen.tsx`
- `src/components/ui/OptimizedImage.tsx`
- `src/components/ui/ProgressBar.tsx`
- `src/components/ui/ProgressIndicator.tsx`
- `src/components/ui/StandardCTAs.tsx`
- `src/components/ui/Toast.tsx`
- `src/components/whatsapp/index.ts`
- `src/components/whatsapp/WhatsAppDoctorOption.tsx`

### Hooks (5 files)
- `src/hooks/useCPF.ts`
- `src/hooks/useIsMobile.ts`
- `src/hooks/usePaciente.ts`
- `src/hooks/usePerformance.ts`
- `src/hooks/useVoiceRecognition.ts`

### Lib Files (15 files)
- `src/lib/ai.ts` ⚠️ **LEGACY AI PIPELINE**
- `src/lib/copy.ts`
- `src/lib/database-fix.ts`
- `src/lib/emailTemplates.ts`
- `src/lib/followUp.ts`
- `src/lib/medicalScales.ts`
- `src/lib/metrics.ts`
- `src/lib/paymentSecurity.ts`
- `src/lib/relatorio.ts` ⚠️ **LEGACY REPORT PIPELINE**
- `src/lib/security.ts`
- `src/lib/supabase/middleware.ts`
- `src/lib/supabase/server.ts`
- `src/lib/triage/config.ts`
- `src/lib/whatsappTemplates.ts`

### Middleware (2 files)
- `src/middleware/security.ts`
- `src/middleware/withCPF.ts`

### Types (3 files)
- `src/types/lpac.ts`
- `src/types/relatorio.ts`
- `src/types/RelatorioProps.ts`

### Utils (20 files)
- `src/utils/cache.ts`
- `src/utils/calcularScore.ts`
- `src/utils/convertTimestamp.ts`
- `src/utils/cookies.ts`
- `src/utils/formatCPF.ts`
- `src/utils/formatDate.ts`
- `src/utils/generateCharts.ts`
- `src/utils/pdf.ts`
- `src/utils/pdfTemplate.ts`
- `src/utils/pdfTriagemGeral.ts`
- `src/utils/processarTriagemGeral.ts`
- `src/utils/scales.ts`
- `src/utils/scores.ts`
- `src/utils/sendToHighLevel.ts`
- `src/utils/useLocalStorage.ts`
- `src/utils/usePersistentState.ts`

### Forms (1 file)
- `src/forms/perguntasComuns.ts`

### Env (1 file)
- `src/env.client.ts`

## EXPORTS_UNUSED (162 exports)

### Major Unused Exports
- `formatarRespostas` (src/ai/prompt.ts)
- `generateReportArtifacts` (src/lib/ai.ts)
- `gerarRelatorio` (src/lib/relatorio.ts)
- `useCPF`, `useIsMobile`, `usePaciente`, `usePerformance`, `useVoiceRecognition`
- Multiple UI component exports
- Multiple utility function exports
- Multiple type exports

## ASSETS_SUSPECTS (public/ files to review)

### Images (suspected unused)
- `public/abdomen/` (5 PNG files)
- `public/triagem/` (9 PNG files)
- `public/images/` (25+ files)

### Other Assets
- `public/demo/demo.json`
- `public/videos/` (1 MP4 file)

## DUPLICATED_REPORT_PIPELINES

1. **Legacy Pipeline** (`src/lib/relatorio.ts`): Uses old DatabaseService + OpenAI GPT-4
2. **AI Pipeline** (`src/lib/ai.ts`): Uses generateReportArtifacts + mock fallbacks
3. **New Pipeline** (`src/lib/report/derive.ts`): Uses structured engines + features/triage/configs
4. **PDF Pipeline** (`src/pages/api/pdf/[id].tsx`): Uses @react-pdf/renderer

## LEGACY_APIS

- `/api/gerarPrompt.ts` - Standalone prompt generation
- `/api/listarRelatorios.ts` - Alternative listing
- `/api/relatorios/index.ts` - Duplicate functionality
- `/api/gerarRelatorio.ts` - Main legacy endpoint

## STUBS_MOCKS

- Multiple mock functions in unused utilities
- Test stubs in unused components
- Mock data in unused forms

## BROKEN_CALLS

### Missing Endpoints
- `/api/user/access-status` - Referenced in `src/pages/triagem/index.tsx:21` but may not exist
- Multiple components importing unused utilities

### Import Issues
- Components importing from moved files
- Circular dependencies in unused code

## UNREACHABLE (Files not in dependency graph)

All files listed in FILES_UNUSED are considered UNREACHABLE from the main entrypoints:
- Pages: `src/pages/**/*.tsx` (except _app/_document/_error)
- APIs: `src/pages/api/**/*.ts`
- Scripts: `scripts/**`

## DEPENDENCIES TO REMOVE

### Unused Dependencies (18)
- `@headlessui/react`
- `@types/multer`
- `@uploadcare/react-widget`
- `date-fns`
- `dotenv`
- `edge-tts`
- `html2canvas`
- `html2pdf.js`
- `jspdf`
- `micro`
- `multer`
- `next-connect`
- `react-datepicker`
- `react-hook-form`
- `react-markdown`
- `react-speech-recognition`
- `tailwind-merge`
- `uuid`

### Unused DevDependencies (17)
- `@testing-library/user-event`
- `@types/chart.js`
- `@types/classnames`
- `@types/html2canvas`
- `@types/jspdf`
- `@types/puppeteer`
- `@types/react-icons`
- `@types/react-speech-recognition`
- `@types/stripe`
- `@types/supertest`
- `@types/uuid`
- `axe-playwright`
- `gitleaks`
- `lighthouse`
- `msw`
- `supertest`
- `tsx`

### Unlisted Dependencies (11)
- `playwright` (used in scripts)
- `@supabase/supabase-js` (used in multiple APIs)

## RECOMMENDATIONS

1. **Move to Quarantine**: All FILES_UNUSED should be moved to `legacy/_quarantine_YYYYMMDD/`
2. **Delete Completely**: Scripts and test files can be safely deleted
3. **Unify Pipeline**: Consolidate all report generation into `src/lib/report/derive.ts`
4. **Fix Broken Calls**: Implement missing endpoints or remove references
5. **Clean Dependencies**: Remove unused packages from package.json
6. **Update Imports**: Fix all broken imports after moving files
