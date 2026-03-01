import type { EnhancementMetrics } from '../../../shared/types/metrics.types';

function computeHistogram(pixels: Uint8Array): number[] {
  const h = new Array<number>(256).fill(0);
  for (let i = 0; i < pixels.length; i++) {
    const b = pixels[i] ?? 0;
    h[b]++;
  }
  return h;
}

function computeEntropy(histogram: number[], totalPixels: number): number {
  if (totalPixels <= 0) return 0;
  let e = 0;
  for (let i = 0; i < 256; i++) {
    if (histogram[i] > 0) {
      const p = histogram[i] / totalPixels;
      e -= p * Math.log2(p);
    }
  }
  return e;
}

function computeMean(pixels: Uint8Array): number {
  if (pixels.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < pixels.length; i++) {
    sum += pixels[i] ?? 0;
  }
  return sum / pixels.length;
}

function computeStdDev(pixels: Uint8Array, mean: number): number {
  if (pixels.length === 0) return 0;
  let sumSq = 0;
  for (let i = 0; i < pixels.length; i++) {
    const d = (pixels[i] ?? 0) - mean;
    sumSq += d * d;
  }
  return Math.sqrt(sumSq / pixels.length);
}

export function compute(
  original: Uint8Array,
  enhanced: Uint8Array,
  width: number,
  height: number
): EnhancementMetrics {
  const total = width * height;
  const histOrig = computeHistogram(original);
  const histEnh = computeHistogram(enhanced);
  const entropyBefore = computeEntropy(histOrig, total);
  const entropyAfter = computeEntropy(histEnh, total);
  const meanBefore = computeMean(original);
  const meanAfter = computeMean(enhanced);
  const stddevBefore = computeStdDev(original, meanBefore);
  const stddevAfter = computeStdDev(enhanced, meanAfter);
  const cii = stddevBefore > 1e-9 ? stddevAfter / stddevBefore : 1;

  let mse: number | null = null;
  let psnr: number | null = null;
  if (original.length === enhanced.length) {
    let sumSq = 0;
    for (let i = 0; i < original.length; i++) {
      const d = (original[i] ?? 0) - (enhanced[i] ?? 0);
      sumSq += d * d;
    }
    mse = sumSq / original.length;
    if (mse > 1e-9) {
      psnr = 10 * Math.log10((255 * 255) / mse);
    } else {
      psnr = 100;
    }
  }

  return {
    entropyBefore,
    entropyAfter,
    entropyDelta: entropyAfter - entropyBefore,
    meanBefore,
    meanAfter,
    stddevBefore,
    stddevAfter,
    contrastImprovementIndex: cii,
    mse,
    psnr,
  };
}
