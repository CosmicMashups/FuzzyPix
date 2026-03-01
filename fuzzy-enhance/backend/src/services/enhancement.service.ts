import * as fs from 'fs';
import type { EnhancementParameters, ProcessingMetadata, RuleActivationSummary } from '../../../shared/types/enhancement.types';
import type { EnhancementMetrics } from '../../../shared/types/metrics.types';
import { RULE_BASE } from '../fuzzy/ruleBase';
import { decode } from './imageDecoder.service';
import { extract } from './featureExtractor.service';
import { processImage as pipelineProcess } from '../fuzzy/enhancementPipeline';
import { reconstruct } from './reconstruction.service';
import { compute as computeMetrics } from './metrics.service';
import { toGrayLuminance } from '../utils/imageBuffer';

function computeHistogram(pixels: Uint8Array): number[] {
  const h = new Array<number>(256).fill(0);
  for (let i = 0; i < pixels.length; i++) {
    h[pixels[i] ?? 0]++;
  }
  return h;
}

export interface ValidatedEnhancementParams {
  windowRadius: number;
  nDelta: number;
  defuzzMethod: 'centroid' | 'bisector' | 'mom';
  applyPostFilter: boolean;
  tnorm: 'min' | 'product';
  implicationMethod: 'min' | 'product';
}

export interface ProcessingResult {
  enhancedImageBase64: string;
  metrics: EnhancementMetrics;
  originalHistogram: number[];
  enhancedHistogram: number[];
  processingTimeMs: number;
  metadata: ProcessingMetadata;
}

export async function processImage(
  filePath: string,
  params: ValidatedEnhancementParams
): Promise<ProcessingResult> {
  const startTime = Date.now();

  const decoded = await decode(filePath);
  const { pixels, width, height, channels } = decoded;

  let grayPixels: Uint8Array;
  if (channels === 1) {
    grayPixels = pixels;
  } else {
    grayPixels = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const r = pixels[i * channels] ?? 0;
      const g = pixels[i * channels + 1] ?? 0;
      const b = pixels[i * channels + 2] ?? 0;
      grayPixels[i] = toGrayLuminance(r, g, b);
    }
  }

  const featureTensor = extract(grayPixels, width, height, params.windowRadius);

  const pipelineOutput = pipelineProcess(grayPixels, featureTensor, width, height, {
    nDelta: params.nDelta,
    defuzzMethod: params.defuzzMethod,
    tnorm: params.tnorm,
    implicationMethod: params.implicationMethod,
  });

  const { enhancedPixels, enhancedBase64 } = await reconstruct(
    pixels,
    pipelineOutput.adjustmentMap,
    width,
    height,
    channels
  );

  const originalHistogram = computeHistogram(channels === 1 ? pixels : grayPixels);
  let enhancedHistogram: number[];
  if (channels === 1) {
    enhancedHistogram = computeHistogram(enhancedPixels);
  } else {
    const enhGray = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const r = enhancedPixels[i * channels] ?? 0;
      const g = enhancedPixels[i * channels + 1] ?? 0;
      const b = enhancedPixels[i * channels + 2] ?? 0;
      enhGray[i] = toGrayLuminance(r, g, b);
    }
    enhancedHistogram = computeHistogram(enhGray);
  }

  const origForMetrics = channels === 1 ? pixels : grayPixels;
  const enhForMetrics = channels === 1 ? enhancedPixels : (() => {
    const out = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const r = enhancedPixels[i * channels] ?? 0;
      const g = enhancedPixels[i * channels + 1] ?? 0;
      const b = enhancedPixels[i * channels + 2] ?? 0;
      out[i] = toGrayLuminance(r, g, b);
    }
    return out;
  })();

  const metrics = computeMetrics(origForMetrics, enhForMetrics, width, height) as EnhancementMetrics;

  const processingTimeMs = Date.now() - startTime;

  const activationsList: RuleActivationSummary[] = [];
  const ids = Object.keys(pipelineOutput.avgFiringStrengths)
    .map(Number)
    .sort((a, b) => (pipelineOutput.avgFiringStrengths[b] ?? 0) - (pipelineOutput.avgFiringStrengths[a] ?? 0))
    .slice(0, 10);
  for (const id of ids) {
    const rule = RULE_BASE.find((r) => r.id === id);
    activationsList.push({
      ruleId: id,
      description: rule?.description ?? '',
      consequentTerm: rule?.consequentTerm ?? '',
      avgFiringStrength: pipelineOutput.avgFiringStrengths[id] ?? 0,
    });
  }

  const totalPixels = width * height;
  let activeCount = 0;
  for (let i = 0; i < pipelineOutput.confidenceMap.length; i++) {
    if ((pipelineOutput.confidenceMap[i] ?? 0) > 0.001) activeCount++;
  }
  const avgActiveRulesPerPixel = totalPixels > 0 ? activeCount / totalPixels : 0;

  const metadata: ProcessingMetadata = {
    imageWidth: width,
    imageHeight: height,
    totalPixels,
    rulesEvaluated: RULE_BASE.length,
    avgActiveRulesPerPixel,
    topRuleActivations: activationsList,
    parametersUsed: params,
  };

  return {
    enhancedImageBase64: enhancedBase64,
    metrics,
    originalHistogram,
    enhancedHistogram,
    processingTimeMs,
    metadata,
  };
}
