import type { EnhancementTerm } from './linguisticVariables';

export interface FuzzyAntecedent {
  variable: 'intensity' | 'contrast' | 'localMean' | 'stddev' | 'edge' | 'entropy';
  term: string;
}

export interface FuzzyRule {
  id: number;
  antecedents: FuzzyAntecedent[];
  consequentTerm: EnhancementTerm;
  weight: number;
  description: string;
}

export const RULE_BASE: FuzzyRule[] = [
  {
    id: 1,
    antecedents: [
      { variable: 'intensity', term: 'VERY_DARK' },
      { variable: 'contrast', term: 'LOW_CONTRAST' },
      { variable: 'edge', term: 'NO_EDGE' },
    ],
    consequentTerm: 'STRONG_BRIGHTENING',
    weight: 0.9,
    description: 'Very dark featureless area requires brightening',
  },
  {
    id: 2,
    antecedents: [
      { variable: 'intensity', term: 'VERY_DARK' },
      { variable: 'contrast', term: 'MEDIUM_CONTRAST' },
      { variable: 'edge', term: 'NO_EDGE' },
    ],
    consequentTerm: 'MODERATE_BRIGHTENING',
    weight: 0.9,
    description: 'Very dark with medium contrast, no edge',
  },
  {
    id: 3,
    antecedents: [
      { variable: 'intensity', term: 'DARK' },
      { variable: 'contrast', term: 'LOW_CONTRAST' },
      { variable: 'edge', term: 'NO_EDGE' },
    ],
    consequentTerm: 'MODERATE_BRIGHTENING',
    weight: 1.0,
    description: 'Dark featureless area',
  },
  {
    id: 4,
    antecedents: [
      { variable: 'intensity', term: 'DARK' },
      { variable: 'localMean', term: 'DARK_REGION' },
      { variable: 'edge', term: 'WEAK_EDGE' },
    ],
    consequentTerm: 'MODERATE_BRIGHTENING',
    weight: 1.0,
    description: 'Dark region with weak edge',
  },
  {
    id: 5,
    antecedents: [
      { variable: 'intensity', term: 'DARK' },
      { variable: 'entropy', term: 'LOW_ENTROPY' },
      { variable: 'edge', term: 'NO_EDGE' },
    ],
    consequentTerm: 'MODERATE_BRIGHTENING',
    weight: 1.0,
    description: 'Dark low entropy no edge',
  },
  {
    id: 6,
    antecedents: [
      { variable: 'intensity', term: 'VERY_DARK' },
      { variable: 'entropy', term: 'HIGH_ENTROPY' },
    ],
    consequentTerm: 'MODERATE_BRIGHTENING',
    weight: 0.85,
    description: 'Very dark but textured',
  },
  {
    id: 7,
    antecedents: [
      { variable: 'intensity', term: 'DARK' },
      { variable: 'contrast', term: 'HIGH_CONTRAST' },
      { variable: 'edge', term: 'STRONG_EDGE' },
    ],
    consequentTerm: 'NO_CHANGE',
    weight: 1.0,
    description: 'Dark but high contrast edge preserve',
  },
  {
    id: 8,
    antecedents: [
      { variable: 'intensity', term: 'MEDIUM' },
      { variable: 'contrast', term: 'LOW_CONTRAST' },
      { variable: 'stddev', term: 'FLAT' },
    ],
    consequentTerm: 'MODERATE_BRIGHTENING',
    weight: 0.8,
    description: 'Medium but flat dull',
  },
  {
    id: 9,
    antecedents: [
      { variable: 'intensity', term: 'MEDIUM' },
      { variable: 'localMean', term: 'MID_REGION' },
      { variable: 'contrast', term: 'MEDIUM_CONTRAST' },
    ],
    consequentTerm: 'NO_CHANGE',
    weight: 1.0,
    description: 'Well-exposed mid region',
  },
  {
    id: 10,
    antecedents: [
      { variable: 'intensity', term: 'MEDIUM' },
      { variable: 'stddev', term: 'TEXTURED' },
      { variable: 'edge', term: 'WEAK_EDGE' },
    ],
    consequentTerm: 'NO_CHANGE',
    weight: 1.0,
    description: 'Textured medium preserve',
  },
  {
    id: 11,
    antecedents: [
      { variable: 'intensity', term: 'MEDIUM' },
      { variable: 'entropy', term: 'MEDIUM_ENTROPY' },
    ],
    consequentTerm: 'NO_CHANGE',
    weight: 0.9,
    description: 'Medium entropy balanced',
  },
  {
    id: 12,
    antecedents: [
      { variable: 'intensity', term: 'MEDIUM' },
      { variable: 'contrast', term: 'HIGH_CONTRAST' },
      { variable: 'edge', term: 'STRONG_EDGE' },
    ],
    consequentTerm: 'NO_CHANGE',
    weight: 1.0,
    description: 'High contrast edge preserve',
  },
  {
    id: 13,
    antecedents: [
      { variable: 'intensity', term: 'BRIGHT' },
      { variable: 'localMean', term: 'BRIGHT_REGION' },
      { variable: 'contrast', term: 'LOW_CONTRAST' },
    ],
    consequentTerm: 'MODERATE_DARKENING',
    weight: 0.8,
    description: 'Bright region low contrast',
  },
  {
    id: 14,
    antecedents: [
      { variable: 'intensity', term: 'BRIGHT' },
      { variable: 'stddev', term: 'FLAT' },
    ],
    consequentTerm: 'MODERATE_DARKENING',
    weight: 0.9,
    description: 'Bright flat area',
  },
  {
    id: 15,
    antecedents: [
      { variable: 'intensity', term: 'BRIGHT' },
      { variable: 'edge', term: 'NO_EDGE' },
      { variable: 'entropy', term: 'LOW_ENTROPY' },
    ],
    consequentTerm: 'MODERATE_DARKENING',
    weight: 0.8,
    description: 'Bright featureless',
  },
  {
    id: 16,
    antecedents: [
      { variable: 'intensity', term: 'VERY_BRIGHT' },
      { variable: 'contrast', term: 'LOW_CONTRAST' },
      { variable: 'edge', term: 'NO_EDGE' },
    ],
    consequentTerm: 'MODERATE_DARKENING',
    weight: 0.9,
    description: 'Very bright featureless',
  },
  {
    id: 17,
    antecedents: [
      { variable: 'intensity', term: 'VERY_BRIGHT' },
      { variable: 'localMean', term: 'BRIGHT_REGION' },
    ],
    consequentTerm: 'MODERATE_DARKENING',
    weight: 0.85,
    description: 'Very bright region',
  },
  {
    id: 18,
    antecedents: [
      { variable: 'intensity', term: 'VERY_BRIGHT' },
      { variable: 'stddev', term: 'FLAT' },
      { variable: 'entropy', term: 'LOW_ENTROPY' },
    ],
    consequentTerm: 'MODERATE_DARKENING',
    weight: 0.9,
    description: 'Specular or highlight',
  },
  {
    id: 19,
    antecedents: [
      { variable: 'intensity', term: 'VERY_BRIGHT' },
      { variable: 'edge', term: 'STRONG_EDGE' },
    ],
    consequentTerm: 'NO_CHANGE',
    weight: 0.9,
    description: 'Specular highlight edge preserve',
  },
  {
    id: 20,
    antecedents: [
      { variable: 'intensity', term: 'DARK' },
      { variable: 'localMean', term: 'DARK_REGION' },
      { variable: 'entropy', term: 'HIGH_ENTROPY' },
      { variable: 'contrast', term: 'MEDIUM_CONTRAST' },
    ],
    consequentTerm: 'MODERATE_BRIGHTENING',
    weight: 0.85,
    description: 'Complex dark region',
  },
  {
    id: 21,
    antecedents: [
      { variable: 'intensity', term: 'MEDIUM' },
      { variable: 'localMean', term: 'DARK_REGION' },
    ],
    consequentTerm: 'MODERATE_BRIGHTENING',
    weight: 0.8,
    description: 'Pixel medium but in dark region',
  },
  {
    id: 22,
    antecedents: [
      { variable: 'intensity', term: 'MEDIUM' },
      { variable: 'localMean', term: 'BRIGHT_REGION' },
    ],
    consequentTerm: 'MODERATE_DARKENING',
    weight: 0.8,
    description: 'Pixel medium but in bright region',
  },
  {
    id: 23,
    antecedents: [
      { variable: 'intensity', term: 'DARK' },
      { variable: 'stddev', term: 'HIGHLY_VARIABLE' },
      { variable: 'edge', term: 'WEAK_EDGE' },
    ],
    consequentTerm: 'MODERATE_BRIGHTENING',
    weight: 0.85,
    description: 'Dark textured',
  },
  {
    id: 24,
    antecedents: [
      { variable: 'intensity', term: 'BRIGHT' },
      { variable: 'stddev', term: 'HIGHLY_VARIABLE' },
      { variable: 'edge', term: 'WEAK_EDGE' },
    ],
    consequentTerm: 'MODERATE_DARKENING',
    weight: 0.85,
    description: 'Bright textured',
  },
  {
    id: 25,
    antecedents: [
      { variable: 'intensity', term: 'MEDIUM' },
      { variable: 'contrast', term: 'LOW_CONTRAST' },
      { variable: 'localMean', term: 'MID_REGION' },
      { variable: 'stddev', term: 'FLAT' },
    ],
    consequentTerm: 'NO_CHANGE',
    weight: 0.9,
    description: 'Optimal exposure preserve',
  },
  {
    id: 26,
    antecedents: [
      { variable: 'stddev', term: 'TEXTURED' },
      { variable: 'contrast', term: 'LOW_CONTRAST' },
      { variable: 'edge', term: 'WEAK_EDGE' },
    ],
    consequentTerm: 'MODERATE_BRIGHTENING',
    weight: 0.7,
    description: 'Texture enhancement',
  },
  {
    id: 27,
    antecedents: [
      { variable: 'intensity', term: 'VERY_DARK' },
      { variable: 'localMean', term: 'DARK_REGION' },
      { variable: 'entropy', term: 'LOW_ENTROPY' },
    ],
    consequentTerm: 'MODERATE_BRIGHTENING',
    weight: 0.9,
    description: 'Extreme dark shadow',
  },
  {
    id: 28,
    antecedents: [
      { variable: 'intensity', term: 'VERY_BRIGHT' },
      { variable: 'localMean', term: 'BRIGHT_REGION' },
      { variable: 'entropy', term: 'LOW_ENTROPY' },
    ],
    consequentTerm: 'MODERATE_DARKENING',
    weight: 0.9,
    description: 'Extreme bright highlight',
  },
  {
    id: 29,
    antecedents: [
      { variable: 'intensity', term: 'MEDIUM' },
      { variable: 'entropy', term: 'LOW_ENTROPY' },
      { variable: 'contrast', term: 'MEDIUM_CONTRAST' },
    ],
    consequentTerm: 'NO_CHANGE',
    weight: 0.85,
    description: 'Nuanced medium scene',
  },
  {
    id: 30,
    antecedents: [
      { variable: 'intensity', term: 'MEDIUM' },
      { variable: 'entropy', term: 'HIGH_ENTROPY' },
      { variable: 'localMean', term: 'MID_REGION' },
    ],
    consequentTerm: 'NO_CHANGE',
    weight: 0.85,
    description: 'Nuanced medium scene high entropy',
  },
];
