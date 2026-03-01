export type TNorm = 'min' | 'product';
export type ImplicationMethod = 'min' | 'product';
export type DefuzzificationMethod = 'centroid' | 'bisector' | 'mom';

export interface FuzzyVariable {
  name: string;
  universe: [number, number];
  terms: Record<string, FuzzyTermDefinition>;
}

export interface FuzzyTermDefinition {
  label: string;
  mfType: 'tri' | 'trap' | 'gauss' | 'gbell' | 'sig';
  params: number[];
}

export interface FuzzyInferenceConfig {
  tnorm: TNorm;
  implicationMethod: ImplicationMethod;
  defuzzMethod: DefuzzificationMethod;
  nDelta: number;
  activationThreshold: number;
}
