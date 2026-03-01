import { useMemo } from 'react';
import { useStore } from '../store';

export function useHistogram(): {
  originalData: number[] | null;
  enhancedData: number[] | null;
  normalizedOriginal: number[] | null;
  normalizedEnhanced: number[] | null;
  maxBinValue: number;
} {
  const originalHistogram = useStore((s) => s.originalHistogram);
  const enhancedHistogram = useStore((s) => s.enhancedHistogram);

  return useMemo(() => {
    const orig = originalHistogram ?? null;
    const enh = enhancedHistogram ?? null;
    let maxBinValue = 0;
    if (orig) for (let i = 0; i < 256; i++) if ((orig[i] ?? 0) > maxBinValue) maxBinValue = orig[i] ?? 0;
    if (enh) for (let i = 0; i < 256; i++) if ((enh[i] ?? 0) > maxBinValue) maxBinValue = enh[i] ?? 0;
    const norm = (arr: number[]): number[] => {
      if (maxBinValue <= 0) return arr.map(() => 0);
      return arr.map((v) => v / maxBinValue);
    };
    return {
      originalData: orig,
      enhancedData: enh,
      normalizedOriginal: orig ? norm(orig) : null,
      normalizedEnhanced: enh ? norm(enh) : null,
      maxBinValue,
    };
  }, [originalHistogram, enhancedHistogram]);
}
