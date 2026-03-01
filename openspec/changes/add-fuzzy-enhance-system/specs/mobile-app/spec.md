# Spec Delta: mobile-app

## ADDED Requirements

### Requirement: Expo Router and root layout

The mobile app SHALL use Expo Router (file-based routing) with a root _layout.tsx wrapping the app in QueryClientProvider (React Query v5), GestureHandlerRootView, SafeAreaProvider, and StatusBar configuration. No class components.

#### Scenario: App mounts without crash

- **WHEN** the app is launched
- **THEN** root layout renders and tabs or initial route are reachable

### Requirement: Tab navigation

The mobile app SHALL provide a tab layout with three tabs: Home (upload), Enhance (enhancement), About (info). Tab bar SHALL use dark theme styling and appropriate icons.

#### Scenario: All three tabs navigable

- **WHEN** user switches tabs
- **THEN** Home, Enhance, and About screens render correctly

### Requirement: Zustand store

The mobile app SHALL maintain a Zustand store with Immer middleware and slices: image (originalImage, enhancedImageBase64, histograms, set/reset actions), enhancement (parameters, metrics, processingTimeMs, setParameters, resetParameters, setMetrics, setProcessingTime), UI (comparisonMode, showMetrics, showHistogram, picker open state and toggles). Export useStore and selector hooks (e.g. useOriginalImage, useEnhancedImage, useParameters, useMetrics, useUIState).

#### Scenario: Store updates on enhancement success

- **WHEN** enhancement mutation succeeds
- **THEN** store contains enhanced image base64, histograms, metrics, and processing time

### Requirement: API client and enhancement service

The mobile app SHALL provide an Axios apiClient with baseURL from config, timeout 120000, request/response interceptors, and ApiError class. enhancementService SHALL expose enhanceImage(imageUri, parameters) that reads file as base64 (expo-file-system), builds FormData with image and params, POSTs to /enhance with multipart/form-data, and returns typed EnhancementResponse data; and checkHealth() for health endpoint.

#### Scenario: Enhance request sends multipart

- **WHEN** enhanceImage is called with a local image URI and parameters
- **THEN** one POST request is made with Content-Type multipart/form-data and body includes image and parameter fields

### Requirement: Image picker and image service

The mobile app SHALL provide useImagePicker (pickImage, pickFromCamera, permission handling) that updates store with selected image; and imageService with base64ToDataUri, resizeImageIfNeeded, getImageDimensions, computeHistogramFromBase64 using Expo APIs.

#### Scenario: Picked image stored and resized if needed

- **WHEN** user picks an image larger than MAX_IMAGE_DIMENSION
- **THEN** image is resized and store is updated with the result

### Requirement: Enhancement and histogram/metrics hooks

The mobile app SHALL provide useEnhancement (mutation: enhance, isLoading, isError, error, isSuccess, reset; on success update store). useHistogram SHALL return originalData, enhancedData, normalized arrays for chart, and maxBinValue. useMetrics SHALL return metrics, hasImproved, entropyDelta, ciiFormatted.

#### Scenario: Histogram hook normalizes for display

- **WHEN** both original and enhanced histograms exist
- **THEN** normalizedOriginal and normalizedEnhanced are in [0, 1] range for Skia rendering

### Requirement: Upload and enhancement UI components

The mobile app SHALL provide ImageUploadCard (dashed upload area, gallery/camera buttons, thumbnail and dimensions when selected); EnhancementControls (sliders for window radius, nDelta, defuzz method, tnorm, implication; Apply Enhancement and Reset buttons; disabled when no image); ParameterSlider with label, value, unit, optional description, throttled onChange (e.g. 100ms); ProcessingIndicator (full-screen overlay with spinner and "Processing..." when isLoading).

#### Scenario: Apply disabled without image

- **WHEN** no image is in store
- **THEN** Apply Enhancement button is disabled

### Requirement: Comparison and histogram components

The mobile app SHALL provide ComparisonView with modes: side-by-side (two Images with Before/After labels), swipe (draggable divider with Reanimated/GestureHandler), overlay (enhanced on top with opacity slider). HistogramChart SHALL use React Native Skia to draw 256 bars for original (blue) and enhanced (green) with normalized data, height 120, legend; empty state when no data.

#### Scenario: Side-by-side shows both images

- **WHEN** comparison mode is side-by-side and original and enhanced are set
- **THEN** two images render with Before and After labels

### Requirement: Metrics and rule viewer components

The mobile app SHALL provide MetricsPanel (expandable accordion with entropy before/after/delta, mean, stddev, CII, processing time; color for positive/negative delta and CII). RuleViewer SHALL display top rule activations (from metadata) with rule id, description, consequent, and firing strength bar; color-coded by consequent (e.g. brightening green, darkening red).

#### Scenario: Metrics panel shows entropy delta

- **WHEN** metrics are available and panel expanded
- **THEN** entropy delta is shown with color (e.g. green if positive)

### Requirement: Screens content

The Home tab SHALL show header "FuzzyEnhance", ImageUploadCard, and "Proceed to Enhance" CTA enabled only when image is selected. The Enhance tab SHALL show ComparisonView, HistogramChart, EnhancementControls, MetricsPanel, RuleViewer, and ProcessingIndicator overlay when loading. The About tab SHALL show system name, version, description, technical overview of Mamdani inference, input features list, output terms, tech stack, and attribution.

#### Scenario: Proceed to Enhance only when image selected

- **WHEN** no image is selected on Home
- **THEN** "Proceed to Enhance" (or equivalent) is disabled

### Requirement: Theming and constants

The mobile app SHALL use a dark theme: background #0F0F0F, surface #1C1C1E, primary #1A73E8, text primary white, secondary gray; spacing scale (xs to xxl); typography scale; border radius; design tokens in constants/theme.ts. config SHALL provide API_BASE_URL from EXPO_PUBLIC_API_URL with fallback, default enhancement parameters, MAX_IMAGE_DIMENSION, SUPPORTED_FORMATS, QUERY_STALE_TIME.

#### Scenario: Theme used in components

- **WHEN** components use theme constants
- **THEN** colors and spacing match the specified dark theme

### Requirement: Not-found and error handling

The mobile app SHALL provide +not-found.tsx for unmatched routes. An error boundary SHALL wrap the root layout so unhandled errors are caught and a fallback UI is shown.

#### Scenario: Unknown route shows not-found

- **WHEN** user navigates to an undefined route
- **THEN** not-found screen is displayed
