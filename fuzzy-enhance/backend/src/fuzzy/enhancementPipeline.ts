import { RULE_BASE } from './ruleBase';
import { fuzzifyPixel } from './fuzzification';
import { evaluateRules, aggregateOutputs, buildConsequentMFTable } from './inferenceEngine';
import { defuzzify } from './defuzzification';
import type { DefuzzMethod } from './defuzzification';
import type { FeatureTensor } from '../types/feature.types';

const MF_TABLE_CACHE: Map<number, Record<string, Float32Array>> = new Map();

export interface PipelineConfig {
  nDelta: number;
  defuzzMethod: DefuzzMethod;
  tnorm: 'min' | 'product';
  implicationMethod: 'min' | 'product';
}

export interface PipelineOutput {
  adjustmentMap: Float32Array;
  confidenceMap: Float32Array;
  avgFiringStrengths: Record<number, number>;
}

function getCachedMFTable(nDelta: number): Record<string, Float32Array> {
  let table = MF_TABLE_CACHE.get(nDelta);
  if (!table) {
    table = buildConsequentMFTable(nDelta) as unknown as Record<string, Float32Array>;
    MF_TABLE_CACHE.set(nDelta, table);
  }
  return table;
}

export function processImage(
  pixelBuffer: Uint8Array,
  featureTensor: FeatureTensor,
  width: number,
  height: number,
  config: PipelineConfig
): PipelineOutput {
  const n = width * height;
  const adjustmentMap = new Float32Array(n);
  const confidenceMap = new Float32Array(n);
  const ruleSums: Record<number, number> = {};
  const consequentMFTable = getCachedMFTable(config.nDelta);
  const deltaGrid = new Float32Array(config.nDelta);
  const step = (40 - -40) / (config.nDelta - 1);
  for (let k = 0; k < config.nDelta; k++) {
    deltaGrid[k] = -40 + k * step;
  }

  for (let i = 0; i < n; i++) {
    const intensity = featureTensor.intensity[i] !== undefined ? featureTensor.intensity[i] * 255 : 0;
    const contrast = featureTensor.localContrast[i] ?? 0;
    const localMean = featureTensor.localMean[i] ?? 0;
    const stddev = featureTensor.localStdDev[i] ?? 0;
    const edgeMag = featureTensor.edgeMagnitude[i] ?? 0;
    const entropy = featureTensor.entropy[i] ?? 0;

    const fuzzyState = fuzzifyPixel(intensity, contrast, localMean, stddev, edgeMag, entropy);
    const activations = evaluateRules(fuzzyState, RULE_BASE, config.tnorm);

    let maxStrength = 0;
    for (let a = 0; a < activations.length; a++) {
      const str = activations[a].firingStrength;
      if (str > maxStrength) maxStrength = str;
      const rid = activations[a].ruleId;
      ruleSums[rid] = (ruleSums[rid] ?? 0) + str;
    }

    if (maxStrength <= 0.001) {
      adjustmentMap[i] = 0;
      confidenceMap[i] = 0;
      continue;
    }

    const aggregateOutput = aggregateOutputs(activations, consequentMFTable, config.implicationMethod);
    const delta = defuzzify(aggregateOutput, config.defuzzMethod);
    adjustmentMap[i] = delta * 0.65;
    confidenceMap[i] = maxStrength;
  }

  const avgFiringStrengths: Record<number, number> = {};
  for (const rid of Object.keys(ruleSums)) {
    const id = Number(rid);
    avgFiringStrengths[id] = (ruleSums[id] ?? 0) / n;
  }

  const smoothedMap = smoothAdjustmentMap(adjustmentMap, width, height);
  return {
    adjustmentMap: smoothedMap,
    confidenceMap,
    avgFiringStrengths,
  };
}

function smoothAdjustmentMap(map: Float32Array, width: number, height: number): Float32Array {
  const out = new Float32Array(map.length);
  const r = 1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      let sum = 0;
      let count = 0;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const nx = Math.max(0, Math.min(width - 1, x + dx));
          const ny = Math.max(0, Math.min(height - 1, y + dy));
          sum += map[ny * width + nx] ?? 0;
          count++;
        }
      }
      out[i] = count > 0 ? sum / count : map[i] ?? 0;
    }
  }
  return out;
}
