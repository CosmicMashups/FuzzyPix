import { useMutation } from '@tanstack/react-query';
import { useStore } from '../store';
import { enhanceImage, type EnhanceImageParams } from '../services/enhancementService';
import type { ApiError } from '../services/apiClient';

export function useEnhancement(): {
  enhance: (params: EnhanceImageParams) => void;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  isSuccess: boolean;
  reset: () => void;
} {
  const setEnhancedImage = useStore((s) => s.setEnhancedImage);
  const setHistograms = useStore((s) => s.setHistograms);
  const setMetrics = useStore((s) => s.setMetrics);
  const setProcessingTime = useStore((s) => s.setProcessingTime);
  const setMetadata = useStore((s) => s.setMetadata);

  const mutation = useMutation({
    mutationFn: enhanceImage,
    onSuccess: (data) => {
      setEnhancedImage(data.enhancedImageBase64);
      setHistograms(data.originalHistogram, data.enhancedHistogram);
      setMetrics(data.metrics);
      setProcessingTime(data.processingTimeMs);
      setMetadata(data.metadata);
    },
  });

  return {
    enhance: (params: EnhanceImageParams) => mutation.mutate(params),
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: (mutation.error as ApiError) ?? null,
    isSuccess: mutation.isSuccess,
    reset: () => mutation.reset(),
  };
}
