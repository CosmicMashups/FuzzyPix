import type { AggregateOutput } from './inferenceEngine';

export type DefuzzMethod = 'centroid' | 'bisector' | 'mom';

export function centroidDefuzz(values: Float32Array, deltaGrid: Float32Array): number {
  let num = 0;
  let den = 0;
  for (let k = 0; k < values.length; k++) {
    const v = values[k] ?? 0;
    const d = deltaGrid[k] ?? 0;
    num += d * v;
    den += v;
  }
  if (den < 1e-9) return 0;
  return num / den;
}

export function bisectorDefuzz(values: Float32Array, deltaGrid: Float32Array): number {
  let total = 0;
  for (let k = 0; k < values.length; k++) {
    total += values[k] ?? 0;
  }
  if (total < 1e-9) return 0;
  const half = total / 2;
  let sum = 0;
  for (let k = 0; k < values.length; k++) {
    sum += values[k] ?? 0;
    if (sum >= half) {
      return deltaGrid[k] ?? 0;
    }
  }
  return deltaGrid[values.length - 1] ?? 0;
}

export function meanOfMaximumDefuzz(values: Float32Array, deltaGrid: Float32Array): number {
  let maxVal = 0;
  for (let k = 0; k < values.length; k++) {
    const v = values[k] ?? 0;
    if (v > maxVal) maxVal = v;
  }
  if (maxVal < 1e-9) return 0;
  const threshold = maxVal - 1e-6;
  let sum = 0;
  let count = 0;
  for (let k = 0; k < values.length; k++) {
    if ((values[k] ?? 0) >= threshold) {
      sum += deltaGrid[k] ?? 0;
      count++;
    }
  }
  if (count === 0) return 0;
  return sum / count;
}

export function defuzzify(aggregateOutput: AggregateOutput, method: DefuzzMethod): number {
  const { values, deltaGrid } = aggregateOutput;
  switch (method) {
    case 'centroid':
      return centroidDefuzz(values, deltaGrid);
    case 'bisector':
      return bisectorDefuzz(values, deltaGrid);
    case 'mom':
      return meanOfMaximumDefuzz(values, deltaGrid);
    default:
      return centroidDefuzz(values, deltaGrid);
  }
}
