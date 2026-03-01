# Spec Delta: enhancement-pipeline

## ADDED Requirements

### Requirement: Image decoder service

The backend SHALL provide decode(filePath, maxDimension?) returning DecodedImage (pixels as Uint8Array, width, height, channels 1|3|4). Implementation SHALL use Sharp to load the image; if maxDimension is provided, resize with fit 'inside' withoutEnlargement; extract raw pixel buffer via .raw().toBuffer({ resolveWithObject: true }).

#### Scenario: Decode returns valid buffer

- **WHEN** decode is called with a valid JPEG path
- **THEN** pixels.length === width * height * channels and channels is 3 or 4

### Requirement: Feature extractor service

The backend SHALL provide extract(pixels, width, height, windowRadius) returning FeatureTensor with intensity, localContrast, localMean, localStdDev, edgeMagnitude, entropy (all Float32Array of length width*height), plus width and height. Implementation SHALL use summed-area tables for mean and variance (O(1) per pixel); Sobel 3x3 for edge magnitude (normalized); sliding-window local histogram for Shannon entropy; reflect padding at boundaries.

#### Scenario: Feature tensor dimensions

- **WHEN** extract is called for WxH image
- **THEN** each feature array has length W*H and values in their specified ranges (e.g. intensity [0,1], entropy [0, ~4.64])

### Requirement: Reconstruction service

The backend SHALL provide reconstruct(originalPixels, adjustmentMap, width, height, channels) returning enhancedPixels (Uint8Array) and enhancedBase64 (PNG). For grayscale (channels=1), I'[i] = clamp(I[i] + adjustmentMap[i], 0, 255) rounded. For color, apply the same luminance adjustment to each channel. Encode result with Sharp to PNG and return base64 string.

#### Scenario: Reconstructed image same dimensions

- **WHEN** reconstruct is called with M*N pixels and M*N adjustment map
- **THEN** enhancedPixels.length === originalPixels.length and enhancedBase64 is a non-empty string

### Requirement: Metrics service

The backend SHALL provide compute(original, enhanced, width, height) returning EnhancementMetrics. Implementation SHALL compute 256-bin histograms, Shannon entropy, mean, stddev, contrast improvement index (ratio of stddevs), and optionally MSE/PSNR when applicable.

#### Scenario: Metrics include entropy and CII

- **WHEN** compute is called with two buffers of same size
- **THEN** return value includes entropyBefore, entropyAfter, entropyDelta, contrastImprovementIndex, and other fields per EnhancementMetrics

### Requirement: Enhancement orchestration service

The backend SHALL provide processImage(filePath, params) that: records start time; decodes image; converts to grayscale luminance if channels 3 or 4 (keeping original for reconstruction); extracts FeatureTensor; runs fuzzy enhancementPipeline.processImage; reconstructs image; computes metrics; records processing time; returns ProcessingResult (enhancedImageBase64, metrics, originalHistogram, enhancedHistogram, processingTimeMs, metadata including topRuleActivations and parametersUsed).

#### Scenario: End-to-end processing returns all result fields

- **WHEN** processImage is called with a valid image path and validated params
- **THEN** the result contains enhancedImageBase64, both histograms, metrics, processingTimeMs, and metadata with image dimensions and rule activation summary
