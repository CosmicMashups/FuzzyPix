import { evaluateMF } from './membershipFunctions';
import {
  INTENSITY_VAR,
  CONTRAST_VAR,
  LOCAL_MEAN_VAR,
  STDDEV_VAR,
  EDGE_VAR,
  ENTROPY_VAR,
  type IntensityTerm,
  type ContrastTerm,
  type LocalMeanTerm,
  type StdDevTerm,
  type EdgeTerm,
  type EntropyTerm,
} from './linguisticVariables';

export interface FuzzyState {
  intensity: Record<IntensityTerm, number>;
  contrast: Record<ContrastTerm, number>;
  localMean: Record<LocalMeanTerm, number>;
  stddev: Record<StdDevTerm, number>;
  edge: Record<EdgeTerm, number>;
  entropy: Record<EntropyTerm, number>;
}

function evalVarTerms(
  x: number,
  terms: Record<string, { type: 'tri' | 'trap' | 'gauss' | 'gbell' | 'sig'; params: number[] }>
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const key of Object.keys(terms)) {
    const mf = terms[key];
    let v = evaluateMF(x, mf);
    if (Number.isNaN(v) || !Number.isFinite(v)) v = 0;
    if (v < 0) v = 0;
    if (v > 1) v = 1;
    out[key] = v;
  }
  return out;
}

export function fuzzifyPixel(
  intensity: number,
  contrast: number,
  localMean: number,
  stddev: number,
  edgeMag: number,
  entropy: number
): FuzzyState {
  return {
    intensity: evalVarTerms(intensity, INTENSITY_VAR.terms) as Record<IntensityTerm, number>,
    contrast: evalVarTerms(contrast, CONTRAST_VAR.terms) as Record<ContrastTerm, number>,
    localMean: evalVarTerms(localMean, LOCAL_MEAN_VAR.terms) as Record<LocalMeanTerm, number>,
    stddev: evalVarTerms(stddev, STDDEV_VAR.terms) as Record<StdDevTerm, number>,
    edge: evalVarTerms(edgeMag, EDGE_VAR.terms) as Record<EdgeTerm, number>,
    entropy: evalVarTerms(entropy, ENTROPY_VAR.terms) as Record<EntropyTerm, number>,
  };
}
