import sharp from 'sharp';

export interface DecodedImage {
  pixels: Uint8Array;
  width: number;
  height: number;
  channels: 1 | 3 | 4;
}

export async function decode(filePath: string, maxDimension?: number): Promise<DecodedImage> {
  let pipeline = sharp(filePath);
  const meta = await pipeline.metadata();
  let width = meta.width ?? 0;
  let height = meta.height ?? 0;
  if (width <= 0 || height <= 0) {
    throw new Error('Invalid image dimensions');
  }
  if (maxDimension != null && maxDimension > 0 && (width > maxDimension || height > maxDimension)) {
    pipeline = pipeline.resize({
      width: maxDimension,
      height: maxDimension,
      fit: 'inside',
      withoutEnlargement: true,
    });
    const resizedMeta = await pipeline.metadata();
    width = resizedMeta.width ?? width;
    height = resizedMeta.height ?? height;
  }
  const { data, info } = await pipeline
    .raw()
    .toBuffer({ resolveWithObject: true });
  const ch = info.channels ?? 3;
  const channels = (ch === 1 ? 1 : ch === 3 ? 3 : 4) as 1 | 3 | 4;
  const pixels = new Uint8Array(data);
  return {
    pixels,
    width: info.width,
    height: info.height,
    channels,
  };
}
