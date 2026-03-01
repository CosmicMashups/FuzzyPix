import type { ImageSlice } from './imageSlice';
import type { EnhancementSlice } from './enhancementSlice';
import type { UISlice } from './uiSlice';

export type StoreState = ImageSlice & EnhancementSlice & UISlice;
