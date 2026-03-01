export * from '../shared/index';

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  base64?: string;
  mimeType: string;
  fileSize?: number;
}

export interface UIState {
  isPickerOpen: boolean;
  activeTab: 'upload' | 'enhance' | 'about';
  comparisonMode: 'side-by-side' | 'overlay' | 'swipe';
  showMetrics: boolean;
  showHistogram: boolean;
}

export interface SliderConfig {
  label: string;
  key: keyof import('../shared/types/enhancement.types').EnhancementParameters;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
}
