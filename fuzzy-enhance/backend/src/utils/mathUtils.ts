export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function arrayMean(arr: Float32Array | number[]): number {
  const n = arr.length;
  if (n === 0) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += arr[i];
  return sum / n;
}

export function arrayStdDev(arr: Float32Array, mean: number): number {
  const n = arr.length;
  if (n === 0) return 0;
  let sumSq = 0;
  for (let i = 0; i < n; i++) {
    const d = arr[i] - mean;
    sumSq += d * d;
  }
  return Math.sqrt(sumSq / n);
}

export function normalizeArray(arr: Float32Array, min: number, max: number): Float32Array {
  const out = new Float32Array(arr.length);
  const range = max - min;
  if (range <= 0) return out;
  for (let i = 0; i < arr.length; i++) {
    out[i] = (arr[i] - min) / range;
  }
  return out;
}

export function buildIntegralImage(pixels: Float32Array, width: number, height: number): Float64Array {
  const sat = new Float64Array((width + 1) * (height + 1));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const v = pixels[i] ?? 0;
      sat[(y + 1) * (width + 1) + (x + 1)] =
        v +
        (sat[(y + 1) * (width + 1) + x] ?? 0) +
        (sat[y * (width + 1) + (x + 1)] ?? 0) -
        (sat[y * (width + 1) + x] ?? 0);
    }
  }
  return sat;
}

export function buildIntegralImageSquared(pixels: Float32Array, width: number, height: number): Float64Array {
  const sat = new Float64Array((width + 1) * (height + 1));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const v = pixels[i] ?? 0;
      const v2 = v * v;
      sat[(y + 1) * (width + 1) + (x + 1)] =
        v2 +
        (sat[(y + 1) * (width + 1) + x] ?? 0) +
        (sat[y * (width + 1) + (x + 1)] ?? 0) -
        (sat[y * (width + 1) + x] ?? 0);
    }
  }
  return sat;
}

export function queryRectangleSum(
  sat: Float64Array,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number
): number {
  const w = width + 1;
  return (
    (sat[(y2 + 1) * w + (x2 + 1)] ?? 0) -
    (sat[(y2 + 1) * w + x1] ?? 0) -
    (sat[y1 * w + (x2 + 1)] ?? 0) +
    (sat[y1 * w + x1] ?? 0)
  );
}
