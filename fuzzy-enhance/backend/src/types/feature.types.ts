export interface FeatureTensor {
  intensity: Float32Array;
  localContrast: Float32Array;
  localMean: Float32Array;
  localStdDev: Float32Array;
  edgeMagnitude: Float32Array;
  entropy: Float32Array;
  width: number;
  height: number;
}
