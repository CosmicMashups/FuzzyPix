# FuzzyEnhance

Production-ready Complex Fuzzy Logic Image Enhancement System. Accepts a digital image, extracts per-pixel neighborhood features, applies a Mamdani fuzzy inference engine to compute per-pixel intensity adjustments, and returns an enhanced image with quality metrics, histograms, and comparison tools.

## Structure

- **shared/** – TypeScript types (image, enhancement, fuzzy, metrics) shared by mobile and backend.
- **backend/** – Node.js Express API: image decode (Sharp), feature extraction, fuzzy pipeline, reconstruction, metrics; `/api/enhance` and `/api/health`.
- **mobile/** – React Native (Expo) app: image upload, parameter tuning, before/after comparison, histogram, metrics.

## Run

```bash
# Backend
cd backend && npm install && npm run dev

# Mobile (set EXPO_PUBLIC_API_URL to backend URL, e.g. http://localhost:3001/api)
cd mobile && npm install && npx expo start
```

## Tech

- Backend: TypeScript, Express, Sharp, custom fuzzy engine (membership functions, 30-rule Mamdani, centroid/bisector/MOM defuzzification).
- Mobile: Expo SDK 51+, Expo Router, Zustand, React Query, Axios, React Native Skia for histograms.
