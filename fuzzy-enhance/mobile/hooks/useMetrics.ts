import { useMemo } from 'react';
import { useStore } from '../store';
import type { EnhancementMetrics } from '../../shared';

export function useMetrics(): {
  metrics: EnhancementMetrics | null;
  hasImproved: boolean;
  entropyDelta: number | null;
  ciiFormatted: string | null;
} {
  const metrics = useStore((s) => s.metrics);

  return useMemo(() => {
    if (!metrics) {
      return { metrics: null, hasImproved: false, entropyDelta: null, ciiFormatted: null };
    }
    const entropyDelta = metrics.entropyDelta;
    const hasImproved = entropyDelta > 0;
    const ciiFormatted =
      metrics.contrastImprovementIndex != null
        ? metrics.contrastImprovementIndex.toFixed(2)
        : null;
    return {
      metrics,
      hasImproved,
      entropyDelta,
      ciiFormatted,
    };
  }, [metrics]);
}
