# Spec Delta: fuzzy-engine

## ADDED Requirements

### Requirement: Membership functions

The fuzzy engine SHALL implement triangular, trapezoidal, gaussian, generalized bell, and sigmoid membership functions with explicit types (MFType, MFDefinition). Each MF SHALL return a value in [0, 1]; evaluateMF SHALL dispatch by type; buildLUT SHALL pre-compute a Float32Array lookup table. Edge cases (e.g. zero-width intervals) SHALL return 0; no NaN or Infinity in outputs.

#### Scenario: Triangular at peak returns 1

- **WHEN** triangularMF(x, a, b, c) is called with x === b
- **THEN** the result is exactly 1.0

#### Scenario: Gaussian at center returns 1

- **WHEN** gaussianMF(x, center, sigma) is called with x === center
- **THEN** the result is exactly 1.0

### Requirement: Linguistic variables

The fuzzy engine SHALL define linguistic variables for PixelIntensity, LocalContrast, LocalMean, LocalStdDev, EdgeMagnitude, Entropy (input) and Enhancement (output) with term names and MF definitions matching the specified universes and shapes (trap, tri, gauss). All term types (IntensityTerm, ContrastTerm, etc.) and EnhancementTerm SHALL be exported.

#### Scenario: Rule antecedent terms match variable terms

- **WHEN** ruleBase references a term string (e.g. VERY_DARK, STRONG_BRIGHTENING)
- **THEN** that string exists as a key in the corresponding linguistic variable's terms

### Requirement: Rule base

The system SHALL provide a Mamdani rule base of exactly 30 rules. Each rule SHALL have id, antecedents (variable + term), consequentTerm (EnhancementTerm), weight, and description. Antecedent variables SHALL be one of intensity, contrast, localMean, stddev, edge, entropy.

#### Scenario: All 30 rules load without key error

- **WHEN** fuzzification and inference look up fuzzyState[variable][term] for each rule
- **THEN** no lookup fails due to missing term or variable

### Requirement: Fuzzification

The engine SHALL provide fuzzifyPixel(intensity, contrast, localMean, stddev, edgeMag, entropy) returning a FuzzyState: records per variable of term names to membership degrees in [0, 1]. Implementation SHALL use evaluateMF and SHALL not allocate intermediate objects in hot path where avoidable.

#### Scenario: Fuzzified pixel has all variable keys

- **WHEN** fuzzifyPixel is called with six numeric inputs
- **THEN** the result has keys intensity, contrast, localMean, stddev, edge, entropy each with the correct term keys and numeric values in [0, 1]

### Requirement: Inference engine

The engine SHALL provide evaluateRules(fuzzyState, rules, tnorm) returning RuleActivation[]; computeFiringStrength using min or product T-norm and rule weight; applyImplication(consequentMF, firingStrength, method); aggregateOutputs(activations, consequentMFTable, implicationMethod) returning AggregateOutput (values, deltaGrid, ruleActivations). buildConsequentMFTable(nDelta) SHALL return a Record of EnhancementTerm to Float32Array of MF values at nDelta evenly spaced points in [-127, 127]. Firing strength SHALL be 0 when any antecedent membership is 0 (short-circuit).

#### Scenario: Firing strength uses T-norm

- **WHEN** tnorm is 'min' and antecedent memberships are [0.8, 0.3, 0.5]
- **THEN** firing strength before weight is 0.3

### Requirement: Defuzzification

The engine SHALL provide centroidDefuzz, bisectorDefuzz, meanOfMaximumDefuzz and defuzzify(aggregateOutput, method). Centroid SHALL compute sum(deltaGrid[k]*values[k])/sum(values[k]) with denominator guarded (return 0 if sum < 1e-9). Bisector SHALL use prefix sums to find k* where left sum ≈ right sum and return deltaGrid[k*]. MOM SHALL return the mean of deltaGrid indices where values[k] >= maxVal - 1e-6.

#### Scenario: Centroid with zero denominator

- **WHEN** sum(values[k]) < 1e-9
- **THEN** centroidDefuzz returns 0.0

### Requirement: Enhancement pipeline

The engine SHALL provide processImage(pixelBuffer, featureTensor, width, height, config) returning adjustmentMap (Float32Array), confidenceMap (Float32Array), and avgFiringStrengths per rule. The pipeline SHALL pre-build consequentMFTable once (cached by nDelta) and deltaGrid once; allocate adjustmentMap and confidenceMap once; then iterate over each pixel index with a plain for loop: fuzzify, evaluateRules, aggregateOutputs, defuzzify, write adjustment and confidence; accumulate rule firing for stats. No Array map/filter/reduce or heap allocation inside the pixel loop.

#### Scenario: Per-pixel adjustment applied

- **WHEN** processImage runs on a small test buffer
- **THEN** adjustmentMap.length === width*height and each value is in [-127, 127] (or clamped by caller)
