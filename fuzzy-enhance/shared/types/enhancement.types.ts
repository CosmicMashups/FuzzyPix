import type { EnhancementMetrics } from './metrics.types';

export interface EnhancementParameters {
  windowRadius: number;
  nDelta: number;
  defuzzMethod: 'centroid' | 'bisector' | 'mom';
  applyPostFilter: boolean;
  tnorm: 'min' | 'product';
  implicationMethod: 'min' | 'product';
}

export const DEFAULT_ENHANCEMENT_PARAMS: EnhancementParameters = {
  windowRadius: 2,
  nDelta: 255,
  defuzzMethod: 'centroid',
  applyPostFilter: false,
  tnorm: 'min',
  implicationMethod: 'min',
};

export interface EnhancementRequest {
  imageBase64?: string;
  parameters: EnhancementParameters;
}

export interface RuleActivationSummary {
  ruleId: number;
  description: string;
  consequentTerm: string;
  avgFiringStrength: number;
}

export interface ProcessingMetadata {
  imageWidth: number;
  imageHeight: number;
  totalPixels: number;
  rulesEvaluated: number;
  avgActiveRulesPerPixel: number;
  topRuleActivations: RuleActivationSummary[];
  parametersUsed: EnhancementParameters;
}

export interface EnhancementResponse {
  success: boolean;
  data: {
    enhancedImageBase64: string;
    originalHistogram: number[];
    enhancedHistogram: number[];
    metrics: EnhancementMetrics;
    processingTimeMs: number;
    metadata: ProcessingMetadata;
  };
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
}
