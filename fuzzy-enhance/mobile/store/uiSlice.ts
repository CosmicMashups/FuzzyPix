import type { StateCreator } from 'zustand';
import type { UIState } from '../types';
import type { StoreState } from './types';

const initialUI: UIState = {
  isPickerOpen: false,
  activeTab: 'upload',
  comparisonMode: 'side-by-side',
  showMetrics: false,
  showHistogram: true,
};

export interface UISlice {
  ui: UIState;
  setPickerOpen: (open: boolean) => void;
  setComparisonMode: (mode: UIState['comparisonMode']) => void;
  toggleMetrics: () => void;
  toggleHistogram: () => void;
}

export function createUISlice(
  ...args: Parameters<StateCreator<StoreState, [['zustand/immer', never]], [], UISlice>>
): ReturnType<StateCreator<StoreState, [['zustand/immer', never]], [], UISlice>> {
  const [set] = args;
  return {
    ui: initialUI,
    setPickerOpen: (open) => set((s) => { s.ui.isPickerOpen = open; }),
    setComparisonMode: (mode) => set((s) => { s.ui.comparisonMode = mode; }),
    toggleMetrics: () => set((s) => { s.ui.showMetrics = !s.ui.showMetrics; }),
    toggleHistogram: () => set((s) => { s.ui.showHistogram = !s.ui.showHistogram; }),
  };
}
