# Design: FuzzyEnhance System

## Context

The system implements a Mamdani fuzzy inference-based image enhancement pipeline. Users upload an image from a mobile client; the backend decodes it, converts to grayscale (or keeps channels for color reconstruction), extracts six per-pixel features (intensity, local contrast, local mean, local stddev, Sobel edge magnitude, neighborhood entropy), fuzzifies them, evaluates 30 rules, aggregates consequents, defuzzifies to a signed adjustment Delta in [-127, 127], and reconstructs I'(x,y) = clamp(I(x,y) + Delta(x,y), 0, 255). Results (base64 image, histograms, metrics, rule activations) are returned in one API response.

## Goals / Non-Goals

- **Goals:** Single multipart POST for full enhancement; typed end-to-end; no heap allocations in per-pixel hot path; pre-built consequent MF table; SAT-based O(1) local statistics; runnable backend (port 3001) and mobile (Expo).
- **Non-Goals:** Real-time video; multiple enhancement algorithms; server-side image storage or user accounts.

## Decisions

- **Monorepo with workspaces:** Keeps shared types in `shared/` and allows mobile/backend to reference `@shared/*` without publishing. Root `package.json` lists workspaces `["mobile","backend","shared"]`.
- **Fuzzy engine as backend-only modules:** All fuzzy logic lives under `backend/src/fuzzy/`. No fuzzy library dependency; custom membership functions, rule base, and inference ensure full control and no implicit `any`.
- **Sharp for all image I/O:** Decode via `.raw()`, encode to PNG base64. No jimp/canvas/node-canvas to avoid extra native deps and stay consistent with libvips.
- **Single enhancement request/response:** One POST with image + parameters; response includes enhanced image base64, histograms, metrics, processing time, and top rule activations to avoid a second round-trip.
- **Grayscale for inference, color preserved for display:** Features and fuzzy inference run on luminance; adjustment map is applied to all channels (or luminance only for grayscale) in reconstruction so color images remain color.
- **Consequent MF table cached by nDelta:** `buildConsequentMFTable(nDelta)` result is cached in a module-level `Map<number, Record<EnhancementTerm, Float32Array>>` so it is built once per distinct nDelta per process.
- **Frontend state:** Zustand with Immer; slices for image, enhancement (parameters + metrics), and UI. React Query for the enhance mutation; on success, store is updated so Enhance tab can show comparison/histogram/metrics without refetch.

## Risks / Trade-offs

- **Large images:** Backend limits file size and optionally resizes (max dimension). Mobile uses MAX_IMAGE_DIMENSION (e.g. 1024) to avoid timeouts; pipeline is O(M*N) so large images can be slow.
- **Memory:** Full pixel and feature tensors in memory; acceptable for typical phone photo dimensions and single-request concurrency.
- **Centroid defuzzification:** Numerically stable only when denominator (sum of mu) is not near zero; implementation clamps and returns 0 when denominator < 1e-9.

## Migration Plan

N/A (greenfield). After implementation, run backend with `npm run dev` and mobile with `npx expo start`; ensure API base URL in mobile config points to backend (e.g. EXPO_PUBLIC_API_URL).

## Open Questions

None for initial implementation. Rule base (30 rules) and linguistic variable definitions are fully specified in the requirement deltas.
