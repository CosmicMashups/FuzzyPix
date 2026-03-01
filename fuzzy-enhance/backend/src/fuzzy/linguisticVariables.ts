import type { MFDefinition } from './membershipFunctions';

export type IntensityTerm = 'VERY_DARK' | 'DARK' | 'MEDIUM' | 'BRIGHT' | 'VERY_BRIGHT';
export type ContrastTerm = 'LOW_CONTRAST' | 'MEDIUM_CONTRAST' | 'HIGH_CONTRAST';
export type LocalMeanTerm = 'DARK_REGION' | 'MID_REGION' | 'BRIGHT_REGION';
export type StdDevTerm = 'FLAT' | 'TEXTURED' | 'HIGHLY_VARIABLE';
export type EdgeTerm = 'NO_EDGE' | 'WEAK_EDGE' | 'STRONG_EDGE';
export type EntropyTerm = 'LOW_ENTROPY' | 'MEDIUM_ENTROPY' | 'HIGH_ENTROPY';
export type EnhancementTerm =
  | 'STRONG_DARKENING'
  | 'MODERATE_DARKENING'
  | 'NO_CHANGE'
  | 'MODERATE_BRIGHTENING'
  | 'STRONG_BRIGHTENING';

export interface LinguisticVariable {
  name: string;
  universe: [number, number];
  terms: Record<string, MFDefinition>;
}

export const INTENSITY_VAR: LinguisticVariable = {
  name: 'PixelIntensity',
  universe: [0, 255],
  terms: {
    VERY_DARK: { type: 'trap', params: [0, 0, 25, 55] },
    DARK: { type: 'tri', params: [35, 75, 115] },
    MEDIUM: { type: 'gauss', params: [127.5, 45] },
    BRIGHT: { type: 'tri', params: [135, 175, 220] },
    VERY_BRIGHT: { type: 'trap', params: [200, 235, 255, 255] },
  },
};

export const CONTRAST_VAR: LinguisticVariable = {
  name: 'LocalContrast',
  universe: [0, 1],
  terms: {
    LOW_CONTRAST: { type: 'trap', params: [0, 0, 0.15, 0.35] },
    MEDIUM_CONTRAST: { type: 'gauss', params: [0.45, 0.12] },
    HIGH_CONTRAST: { type: 'trap', params: [0.55, 0.75, 1.0, 1.0] },
  },
};

export const LOCAL_MEAN_VAR: LinguisticVariable = {
  name: 'LocalMean',
  universe: [0, 255],
  terms: {
    DARK_REGION: { type: 'trap', params: [0, 0, 60, 110] },
    MID_REGION: { type: 'tri', params: [60, 127.5, 195] },
    BRIGHT_REGION: { type: 'trap', params: [145, 195, 255, 255] },
  },
};

export const STDDEV_VAR: LinguisticVariable = {
  name: 'LocalStdDev',
  universe: [0, 128],
  terms: {
    FLAT: { type: 'trap', params: [0, 0, 8, 18] },
    TEXTURED: { type: 'gauss', params: [30, 12] },
    HIGHLY_VARIABLE: { type: 'trap', params: [40, 60, 128, 128] },
  },
};

export const EDGE_VAR: LinguisticVariable = {
  name: 'EdgeMagnitude',
  universe: [0, 1],
  terms: {
    NO_EDGE: { type: 'trap', params: [0, 0, 0.08, 0.2] },
    WEAK_EDGE: { type: 'gauss', params: [0.35, 0.1] },
    STRONG_EDGE: { type: 'trap', params: [0.5, 0.65, 1.0, 1.0] },
  },
};

export const ENTROPY_VAR: LinguisticVariable = {
  name: 'Entropy',
  universe: [0, 4.64],
  terms: {
    LOW_ENTROPY: { type: 'trap', params: [0, 0, 0.8, 1.6] },
    MEDIUM_ENTROPY: { type: 'gauss', params: [2.5, 0.7] },
    HIGH_ENTROPY: { type: 'trap', params: [3.2, 4.0, 4.64, 4.64] },
  },
};

export const ENHANCEMENT_VAR: LinguisticVariable = {
  name: 'Enhancement',
  universe: [-40, 40],
  terms: {
    STRONG_DARKENING: { type: 'gauss', params: [-22, 10] },
    MODERATE_DARKENING: { type: 'gauss', params: [-10, 6] },
    NO_CHANGE: { type: 'gauss', params: [0, 8] },
    MODERATE_BRIGHTENING: { type: 'gauss', params: [10, 6] },
    STRONG_BRIGHTENING: { type: 'gauss', params: [22, 10] },
  },
};
