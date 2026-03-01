# Spec Delta: shared-types

## ADDED Requirements

### Requirement: Image types

The shared package SHALL export image-related interfaces: ImageDimensions (width, height), ImageMetadata (extends ImageDimensions with channels, format, fileSizeBytes), RawPixelBuffer (data as Uint8Array, width, height, channels).

#### Scenario: Consumer imports image types

- **WHEN** backend or mobile imports from `@shared` or `../shared`
- **THEN** ImageDimensions, ImageMetadata, and RawPixelBuffer are available and type-check

### Requirement: Enhancement request and response types

The shared package SHALL export EnhancementParameters (windowRadius, nDelta, defuzzMethod, applyPostFilter, tnorm, implicationMethod), DEFAULT_ENHANCEMENT_PARAMS, EnhancementRequest, EnhancementResponse (success, data with enhancedImageBase64, histograms, metrics, processingTimeMs, metadata), ProcessingMetadata, RuleActivationSummary, and HealthResponse.

#### Scenario: API response matches EnhancementResponse

- **WHEN** backend builds the enhancement API response
- **THEN** the shape conforms to EnhancementResponse and TypeScript compiles

### Requirement: Metrics types

The shared package SHALL export EnhancementMetrics with entropyBefore/After/Delta, meanBefore/After, stddevBefore/After, contrastImprovementIndex, mse, psnr (nullable where applicable).

#### Scenario: Metrics service returns typed metrics

- **WHEN** metrics.service computes results
- **THEN** return value is assignable to EnhancementMetrics

### Requirement: Fuzzy types

The shared package SHALL export TNorm, ImplicationMethod, DefuzzificationMethod, FuzzyVariable, FuzzyTermDefinition, and FuzzyInferenceConfig so that backend fuzzy modules can reference shared types without circular dependency.

#### Scenario: Fuzzy engine imports fuzzy types

- **WHEN** backend fuzzy modules import from shared
- **THEN** FuzzyInferenceConfig and related types resolve and no circular dependency is introduced

### Requirement: Shared barrel export

The shared package SHALL provide an index that re-exports all types from image.types, enhancement.types, fuzzy.types, and metrics.types.

#### Scenario: Single import from shared

- **WHEN** code does `import { EnhancementResponse, EnhancementMetrics } from '@shared'` (or equivalent path)
- **THEN** all listed types are available from that single entry point
