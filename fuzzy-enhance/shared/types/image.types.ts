export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageMetadata extends ImageDimensions {
  channels: 1 | 3 | 4;
  format: 'jpeg' | 'png' | 'webp';
  fileSizeBytes: number;
}

export interface RawPixelBuffer {
  data: Uint8Array;
  width: number;
  height: number;
  channels: 1 | 3 | 4;
}
