export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  'http://localhost:3001/api';

export const DEFAULT_WINDOW_RADIUS = 2;
export const DEFAULT_N_DELTA = 255;
export const DEFAULT_DEFUZZ_METHOD = 'centroid' as const;
export const MAX_IMAGE_DIMENSION = 1024;
export const SUPPORTED_FORMATS = ['jpeg', 'png'] as const;
export const QUERY_STALE_TIME = 5 * 60 * 1000;
