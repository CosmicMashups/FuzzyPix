import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ImageSlice } from './imageSlice';
import type { EnhancementSlice } from './enhancementSlice';
import type { UISlice } from './uiSlice';
import type { StoreState } from './types';
import { createImageSlice } from './imageSlice';
import { createEnhancementSlice } from './enhancementSlice';
import { createUISlice } from './uiSlice';

export type StoreState = ImageSlice & EnhancementSlice & UISlice;

export const useStore = create<StoreState>()(
  devtools(
    subscribeWithSelector(
      immer((...args) => ({
        ...createImageSlice(...args),
        ...createEnhancementSlice(...args),
        ...createUISlice(...args),
      }))
    ),
    { name: 'FuzzyEnhanceStore' }
  )
);

export const useOriginalImage = () => useStore((s) => s.originalImage);
export const useEnhancedImage = () => useStore((s) => s.enhancedImageBase64);
export const useParameters = () => useStore((s) => s.parameters);
export const useMetrics = () => useStore((s) => s.metrics);
export const useUIState = () => useStore((s) => s.ui);
export const useSetParameters = () => useStore((s) => s.setParameters);
export const useResetAll = () =>
  useStore((s) => () => {
    s.resetImages();
    s.resetParameters();
  });
