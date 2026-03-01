# Tasks: Add FuzzyEnhance System

## 1. Monorepo and shared types

- [x] 1.1 Create root `fuzzy-enhance/` with `package.json` (workspaces: mobile, backend, shared), `.gitignore`, `README.md`.
- [x] 1.2 Create `shared/package.json`, `shared/types/image.types.ts`, `shared/types/enhancement.types.ts`, `shared/types/fuzzy.types.ts`, `shared/types/metrics.types.ts`, `shared/index.ts`.

## 2. Backend base and utils

- [x] 2.1 Create `backend/package.json`, `backend/tsconfig.json`, `backend/.env.example`.
- [x] 2.2 Create `backend/src/config/index.ts`, `backend/src/config/logger.ts`.
- [x] 2.3 Create `backend/src/utils/mathUtils.ts`, `backend/src/utils/imageBuffer.ts`.

## 3. Fuzzy engine (backend)

- [x] 3.1 Implement `backend/src/fuzzy/membershipFunctions.ts` (tri, trap, gauss, gbell, sig, evaluateMF, buildLUT).
- [x] 3.2 Implement `backend/src/fuzzy/linguisticVariables.ts` (all input/output variables and terms).
- [x] 3.3 Implement `backend/src/fuzzy/ruleBase.ts` (all 30 rules with antecedents, consequent, weight, description).
- [x] 3.4 Implement `backend/src/fuzzy/fuzzification.ts` (fuzzifyPixel, FuzzyState).
- [x] 3.5 Implement `backend/src/fuzzy/inferenceEngine.ts` (evaluateRules, computeFiringStrength, applyImplication, aggregateOutputs, buildConsequentMFTable).
- [x] 3.6 Implement `backend/src/fuzzy/defuzzification.ts` (centroid, bisector, mom, defuzzify).
- [x] 3.7 Implement `backend/src/fuzzy/enhancementPipeline.ts` (processImage with cached MF table, adjustmentMap, confidenceMap, avgFiringStrengths).

## 4. Backend services

- [x] 4.1 Implement `backend/src/services/imageDecoder.service.ts` (decode with Sharp, raw buffer).
- [x] 4.2 Implement `backend/src/services/featureExtractor.service.ts` (FeatureTensor: SAT, Sobel, entropy).
- [x] 4.3 Implement `backend/src/services/reconstruction.service.ts` (apply adjustment, encode PNG base64).
- [x] 4.4 Implement `backend/src/services/metrics.service.ts` (histogram, entropy, mean, stddev, CII, MSE, PSNR).
- [x] 4.5 Implement `backend/src/services/enhancement.service.ts` (processImage: decode, grayscale if needed, extract, pipeline, reconstruct, metrics).

## 5. Backend API layer

- [x] 5.1 Implement `backend/src/middleware/upload.middleware.ts`, `validation.middleware.ts`, `error.middleware.ts`.
- [x] 5.2 Implement `backend/src/controllers/health.controller.ts`, `backend/src/controllers/enhance.controller.ts`.
- [x] 5.3 Implement `backend/src/routes/health.routes.ts`, `enhance.routes.ts`, `index.ts`.
- [x] 5.4 Implement `backend/src/app.ts`, `backend/src/index.ts`.

## 6. Mobile project setup

- [x] 6.1 Create `mobile/package.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`, `app.json`.
- [x] 6.2 Create `mobile/constants/theme.ts`, `mobile/constants/config.ts`.

## 7. Mobile types and store

- [x] 7.1 Create `mobile/types/index.ts` (re-export shared + ImagePickerResult, UIState, SliderConfig).
- [x] 7.2 Implement `mobile/store/imageSlice.ts`, `enhancementSlice.ts`, `uiSlice.ts`, `store/index.ts` (Zustand + Immer, selector hooks).

## 8. Mobile services and hooks

- [x] 8.1 Implement `mobile/services/apiClient.ts`, `imageService.ts`, `enhancementService.ts`.
- [x] 8.2 Implement `mobile/hooks/useImagePicker.ts`, `useEnhancement.ts`, `useHistogram.ts`, `useMetrics.ts`.
- [x] 8.3 Create `mobile/utils/imageUtils.ts`, `mobile/utils/formatters.ts`.

## 9. Mobile components

- [x] 9.1 Implement ThemedText, ProcessingIndicator, ParameterSlider, ImageUploadCard, ImagePreview.
- [x] 9.2 Implement HistogramChart (Skia), MetricsPanel, RuleViewer, EnhancementControls, ComparisonView.

## 10. Mobile screens and app shell

- [x] 10.1 Implement `mobile/app/_layout.tsx` (QueryClient, GestureHandler, SafeArea, StatusBar).
- [x] 10.2 Implement `mobile/app/(tabs)/_layout.tsx` (tabs: Home, Enhance, About).
- [x] 10.3 Implement `mobile/app/(tabs)/index.tsx`, `enhance.tsx`, `about.tsx`, `mobile/app/+not-found.tsx`.

## 11. Documentation and validation

- [x] 11.1 Create `docs/architecture.md`.
- [x] 11.2 Verify imports (backend, mobile, shared), no circular deps in fuzzy modules, all 30 rules and 6 input / 5 output terms present; run `openspec validate add-fuzzy-enhance-system --strict`.
