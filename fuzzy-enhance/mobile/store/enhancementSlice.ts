import type { StateCreator } from 'zustand';
import type { EnhancementParameters, EnhancementMetrics, ProcessingMetadata } from '../../shared';
import { DEFAULT_ENHANCEMENT_PARAMS } from '../../shared';
import type { StoreState } from './types';

export interface EnhancementSlice {
  parameters: EnhancementParameters;
  metrics: EnhancementMetrics | null;
  processingTimeMs: number | null;
  metadata: ProcessingMetadata | null;
  setParameters: (params: Partial<EnhancementParameters>) => void;
  resetParameters: () => void;
  setMetrics: (metrics: EnhancementMetrics) => void;
  setProcessingTime: (ms: number) => void;
  setMetadata: (m: ProcessingMetadata | null) => void;
}

export function createEnhancementSlice(
  ...args: Parameters<StateCreator<StoreState, [['zustand/immer', never]], [], EnhancementSlice>>
): ReturnType<StateCreator<StoreState, [['zustand/immer', never]], [], EnhancementSlice>> {
  const [set] = args;
  return {
    parameters: { ...DEFAULT_ENHANCEMENT_PARAMS },
    metrics: null,
    processingTimeMs: null,
    metadata: null,
    setParameters: (params) =>
      set((s) => {
        if (params.windowRadius != null) s.parameters.windowRadius = params.windowRadius;
        if (params.nDelta != null) s.parameters.nDelta = params.nDelta;
        if (params.defuzzMethod != null) s.parameters.defuzzMethod = params.defuzzMethod;
        if (params.applyPostFilter != null) s.parameters.applyPostFilter = params.applyPostFilter;
        if (params.tnorm != null) s.parameters.tnorm = params.tnorm;
        if (params.implicationMethod != null) s.parameters.implicationMethod = params.implicationMethod;
      }),
    resetParameters: () =>
      set((s) => {
        s.parameters = { ...DEFAULT_ENHANCEMENT_PARAMS };
      }),
    setMetrics: (metrics) => set((s) => { s.metrics = metrics; }),
    setProcessingTime: (ms) => set((s) => { s.processingTimeMs = ms; }),
    setMetadata: (m) => set((s) => { s.metadata = m; }),
  };
}
