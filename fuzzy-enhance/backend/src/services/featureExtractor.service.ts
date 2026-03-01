import type { FeatureTensor } from '../types/feature.types';
import {
  buildIntegralImage,
  buildIntegralImageSquared,
  queryRectangleSum,
} from '../utils/mathUtils';

function reflect(x: number, min: number, max: number): number {
  if (x < min) return min + (min - x);
  if (x > max) return max - (x - max);
  return x;
}

function getPixel(pixels: Uint8Array, x: number, y: number, width: number, height: number): number {
  const xx = Math.floor(reflect(x, 0, width - 1));
  const yy = Math.floor(reflect(y, 0, height - 1));
  return pixels[yy * width + xx] ?? 0;
}

export function extract(
  pixels: Uint8Array,
  width: number,
  height: number,
  windowRadius: number
): FeatureTensor {
  const n = width * height;
  const intensity = new Float32Array(n);
  const localContrast = new Float32Array(n);
  const localMean = new Float32Array(n);
  const localStdDev = new Float32Array(n);
  const edgeMagnitude = new Float32Array(n);
  const entropy = new Float32Array(n);

  const gray = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    gray[i] = pixels[i] ?? 0;
  }

  const sat = buildIntegralImage(gray, width, height);
  const sat2 = buildIntegralImageSquared(gray, width, height);
  const w = width + 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const x1 = Math.max(0, x - windowRadius);
      const y1 = Math.max(0, y - windowRadius);
      const x2 = Math.min(width - 1, x + windowRadius);
      const y2 = Math.min(height - 1, y + windowRadius);
      const area = (x2 - x1 + 1) * (y2 - y1 + 1);
      const sum = queryRectangleSum(sat, x1, y1, x2, y2, width);
      const sumSq = queryRectangleSum(sat2, x1, y1, x2, y2, width);
      const mean = area > 0 ? sum / area : 0;
      const variance = area > 0 ? Math.max(0, sumSq / area - mean * mean) : 0;
      const std = Math.sqrt(variance);

      intensity[i] = (pixels[i] ?? 0) / 255;
      localMean[i] = mean;
      localStdDev[i] = std;
      if (mean > 1e-9) {
        const c = (std / 255) * (255 / (mean + 1e-9));
        localContrast[i] = Math.min(1, Math.max(0, c));
      } else {
        localContrast[i] = 0;
      }
    }
  }

  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let gx = 0;
      let gy = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const p = getPixel(pixels, x + dx, y + dy, width, height);
          const ki = (dy + 1) * 3 + (dx + 1);
          gx += p * sobelX[ki];
          gy += p * sobelY[ki];
        }
      }
      const mag = Math.sqrt(gx * gx + gy * gy);
      edgeMagnitude[y * width + x] = Math.min(1, mag / 255);
    }
  }

  const side = 2 * windowRadius + 1;
  const hist = new Int32Array(256);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      hist.fill(0);
      let total = 0;
      for (let dy = -windowRadius; dy <= windowRadius; dy++) {
        for (let dx = -windowRadius; dx <= windowRadius; dx++) {
          const p = getPixel(pixels, x + dx, y + dy, width, height);
          hist[p]++;
          total++;
        }
      }
      let e = 0;
      for (let b = 0; b < 256; b++) {
        if (hist[b] > 0 && total > 0) {
          const p = hist[b] / total;
          e -= p * Math.log2(p);
        }
      }
      entropy[y * width + x] = Math.min(4.64, e);
    }
  }

  return {
    intensity,
    localContrast,
    localMean,
    localStdDev,
    edgeMagnitude,
    entropy,
    width,
    height,
  };
}
