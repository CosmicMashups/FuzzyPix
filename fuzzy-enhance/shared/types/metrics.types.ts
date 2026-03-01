export interface EnhancementMetrics {
  entropyBefore: number;
  entropyAfter: number;
  entropyDelta: number;
  meanBefore: number;
  meanAfter: number;
  stddevBefore: number;
  stddevAfter: number;
  contrastImprovementIndex: number;
  mse: number | null;
  psnr: number | null;
}
