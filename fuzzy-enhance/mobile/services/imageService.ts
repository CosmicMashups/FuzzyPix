import { decode } from 'base64-arraybuffer';

export function base64ToDataUri(base64: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64}`;
}

export function getImageDimensions(_uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const { Image } = require('react-native');
    Image.getSize(
      _uri,
      (width: number, height: number) => resolve({ width, height }),
      (err: unknown) => reject(err)
    );
  });
}

export async function resizeImageIfNeeded(
  uri: string,
  maxDimension: number
): Promise<string> {
  const { width, height } = await getImageDimensions(uri);
  if (width <= maxDimension && height <= maxDimension) return uri;
  return uri;
}

export async function computeHistogramFromBase64(base64: string): Promise<number[]> {
  const buffer = decode(base64);
  const arr = new Uint8Array(buffer);
  const h = new Array<number>(256).fill(0);
  for (let i = 0; i < arr.length; i += 4) {
    const r = arr[i] ?? 0;
    const g = arr[i + 1] ?? 0;
    const b = arr[i + 2] ?? 0;
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    h[Math.min(255, gray)]++;
  }
  return h;
}
