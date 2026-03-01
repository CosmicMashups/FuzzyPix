import sharp from 'sharp';
import { clampU8, toGrayLuminance } from '../utils/imageBuffer';

export interface ReconstructionResult {
  enhancedPixels: Uint8Array;
  enhancedBase64: string;
}

export async function reconstruct(
  originalPixels: Uint8Array,
  adjustmentMap: Float32Array,
  width: number,
  height: number,
  channels: 1 | 3 | 4
): Promise<ReconstructionResult> {
  const n = width * height;
  const enhancedPixels = new Uint8Array(originalPixels.length);

  if (channels === 1) {
    for (let i = 0; i < n; i++) {
      const orig = originalPixels[i] ?? 0;
      const adj = adjustmentMap[i] ?? 0;
      enhancedPixels[i] = clampU8(orig + adj);
    }
  } else {
    for (let i = 0; i < n; i++) {
      const adj = adjustmentMap[i] ?? 0;
      const r = originalPixels[i * channels] ?? 0;
      const g = originalPixels[i * channels + 1] ?? 0;
      const b = originalPixels[i * channels + 2] ?? 0;
      const L = toGrayLuminance(r, g, b);
      const LNew = clampU8(L + adj);
      const scale = L > 0 ? LNew / L : 1;
      enhancedPixels[i * channels] = clampU8(r * scale);
      enhancedPixels[i * channels + 1] = clampU8(g * scale);
      enhancedPixels[i * channels + 2] = clampU8(b * scale);
      if (channels === 4) {
        enhancedPixels[i * channels + 3] = originalPixels[i * channels + 3] ?? 255;
      }
    }
  }

  const format: 'png' = 'png';
  const rawBuffer = Buffer.from(enhancedPixels);
  const base64 = await sharp(rawBuffer, {
    raw: { width, height, channels },
  })
    .png()
    .toBuffer()
    .then((buf) => buf.toString('base64'));

  return { enhancedPixels, enhancedBase64: base64 };
}
