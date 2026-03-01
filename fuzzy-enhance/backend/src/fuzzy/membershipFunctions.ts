export type MFType = 'tri' | 'trap' | 'gauss' | 'gbell' | 'sig';

export interface MFDefinition {
  type: MFType;
  params: number[];
}

export function triangularMF(x: number, a: number, b: number, c: number): number {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (a >= c) return 0;
  if (x > a && x < b) {
    if (b === a) return 0;
    return (x - a) / (b - a);
  }
  if (x > b && x < c) {
    if (c === b) return 0;
    return (c - x) / (c - b);
  }
  return 0;
}

export function trapezoidalMF(x: number, a: number, b: number, c: number, d: number): number {
  if (x <= a || x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x > a && x < b) {
    if (b === a) return 0;
    return (x - a) / (b - a);
  }
  if (x > c && x < d) {
    if (d === c) return 0;
    return (d - x) / (d - c);
  }
  return 0;
}

export function gaussianMF(x: number, center: number, sigma: number): number {
  if (sigma <= 0) return 0;
  const t = (x - center) / sigma;
  return Math.exp(-0.5 * t * t);
}

export function generalizedBellMF(x: number, a: number, b: number, c: number): number {
  if (a <= 0) return 0;
  const t = (x - c) / a;
  return 1 / (1 + Math.pow(Math.abs(t), 2 * b));
}

export function sigmoidMF(x: number, a: number, c: number): number {
  return 1 / (1 + Math.exp(-a * (x - c)));
}

export function evaluateMF(x: number, mf: MFDefinition): number {
  const p = mf.params;
  switch (mf.type) {
    case 'tri':
      return triangularMF(x, p[0], p[1], p[2]);
    case 'trap':
      return trapezoidalMF(x, p[0], p[1], p[2], p[3]);
    case 'gauss':
      return gaussianMF(x, p[0], p[1]);
    case 'gbell':
      return generalizedBellMF(x, p[0], p[1], p[2]);
    case 'sig':
      return sigmoidMF(x, p[0], p[1]);
    default:
      return 0;
  }
}

export function buildLUT(mf: MFDefinition, min: number, max: number, steps: number): Float32Array {
  const out = new Float32Array(steps);
  const step = (max - min) / (steps - 1);
  for (let i = 0; i < steps; i++) {
    const x = min + i * step;
    let v = evaluateMF(x, mf);
    if (Number.isNaN(v) || !Number.isFinite(v)) v = 0;
    if (v < 0) v = 0;
    if (v > 1) v = 1;
    out[i] = v;
  }
  return out;
}
