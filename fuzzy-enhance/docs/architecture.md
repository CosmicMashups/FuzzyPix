# FuzzyEnhance Architecture

## Overview

FuzzyEnhance is a full-stack system for fuzzy-logic-based image enhancement. The mobile app uploads an image and parameters; the backend decodes the image, extracts per-pixel features, runs a Mamdani fuzzy inference engine, reconstructs the enhanced image, and returns it with metrics and histograms.

## Data flow

1. **Mobile**: User picks image, sets parameters (window radius, nDelta, defuzz method, T-norm). On "Apply Enhancement", the app sends a single multipart POST to `/api/enhance` with the image file and form fields.
2. **Backend**: Multer stores the file in a temp directory. Validation middleware parses and validates parameters. The enhance controller calls the enhancement service.
3. **Enhancement service**: Decodes the image with Sharp, converts to grayscale for feature extraction (if color), extracts a FeatureTensor (intensity, local contrast, local mean, stddev, Sobel edge magnitude, local entropy), runs the fuzzy pipeline to get an adjustment map, reconstructs the image (applying the adjustment to luminance or all channels), computes metrics and histograms, and returns the result. Temp file is deleted in a finally block.
4. **Fuzzy pipeline**: For each pixel, features are fuzzified into a FuzzyState. Thirty Mamdani rules are evaluated (T-norm for firing strength). Consequent membership functions are clipped by firing strength and aggregated (max). Centroid (or bisector/MOM) defuzzification yields a single delta in [-127, 127]. The adjustment map and per-rule statistics are returned.
5. **Mobile**: On success, the store is updated with the enhanced image base64, both histograms, metrics, processing time, and metadata (including top rule activations). The Enhance tab shows comparison view, histogram, controls, metrics panel, and rule viewer.

## Key components

- **shared**: TypeScript types only (image, enhancement, fuzzy, metrics). No runtime dependencies. Consumed by backend and mobile via workspace or path alias.
- **backend**: Express app, config, Winston logger, Multer (single file, JPEG/PNG), Zod validation, error middleware. Routes: POST /api/enhance, GET /api/health, GET /api/health/detailed. Services: imageDecoder (Sharp raw buffer), featureExtractor (SAT, Sobel, entropy), reconstruction (apply adjustment, PNG base64), metrics (histogram, entropy, mean, stddev, CII, MSE/PSNR), enhancement (orchestrator). Fuzzy engine: membershipFunctions, linguisticVariables, ruleBase (30 rules), fuzzification, inferenceEngine, defuzzification, enhancementPipeline (per-pixel loop, cached consequent MF table).
- **mobile**: Expo Router (tabs: Home, Enhance, About). Zustand store (image, enhancement, UI slices) with Immer. React Query for the enhance mutation. Services: apiClient (Axios, ApiError), imageService, enhancementService (multipart POST). Hooks: useImagePicker, useEnhancement, useHistogram, useMetrics. Components: ImageUploadCard, ComparisonView (side-by-side/overlay/swipe), HistogramChart (Skia), EnhancementControls, MetricsPanel, RuleViewer, ProcessingIndicator, ParameterSlider, ThemedText, ImagePreview.

## Performance

- Consequent MF table is cached by nDelta in the pipeline module.
- Feature extraction uses summed-area tables for O(1) per-pixel mean/variance.
- Pixel loop uses pre-allocated Float32Arrays; no heap allocation inside the loop.
- Single request/response for enhancement avoids extra round-trips.

## Security and limits

- Backend: CORS configurable via env; Helmet; file type and size limits (Multer); temp files deleted after use.
- Mobile: API base URL from env; no persistent storage of images beyond in-memory/state.
