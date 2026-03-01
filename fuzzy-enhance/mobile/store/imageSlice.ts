import type { StateCreator } from 'zustand';
import type { ImagePickerResult } from '../types';
import type { StoreState } from './types';

export interface ImageSlice {
  originalImage: ImagePickerResult | null;
  enhancedImageBase64: string | null;
  originalHistogram: number[] | null;
  enhancedHistogram: number[] | null;
  setOriginalImage: (image: ImagePickerResult | null) => void;
  setEnhancedImage: (base64: string | null) => void;
  setHistograms: (original: number[], enhanced: number[]) => void;
  resetImages: () => void;
}

export function createImageSlice(
  ...args: Parameters<StateCreator<StoreState, [['zustand/immer', never]], [], ImageSlice>>
): ReturnType<StateCreator<StoreState, [['zustand/immer', never]], [], ImageSlice>> {
  const [set] = args;
  return {
    originalImage: null,
    enhancedImageBase64: null,
    originalHistogram: null,
    enhancedHistogram: null,
    setOriginalImage: (image) => set((s) => { s.originalImage = image; }),
    setEnhancedImage: (base64) => set((s) => { s.enhancedImageBase64 = base64; }),
    setHistograms: (original, enhanced) =>
      set((s) => {
        s.originalHistogram = original;
        s.enhancedHistogram = enhanced;
      }),
    resetImages: () =>
      set((s) => {
        s.originalImage = null;
        s.enhancedImageBase64 = null;
        s.originalHistogram = null;
        s.enhancedHistogram = null;
      }),
  };
}
