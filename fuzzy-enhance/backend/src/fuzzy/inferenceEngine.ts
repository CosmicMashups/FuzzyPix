import type { FuzzyState } from './fuzzification';
import type { FuzzyRule, FuzzyAntecedent } from './ruleBase';
import type { EnhancementTerm } from './linguisticVariables';
import { evaluateMF } from './membershipFunctions';
import { ENHANCEMENT_VAR } from './linguisticVariables';

export interface RuleActivation {
  ruleId: number;
  firingStrength: number;
  consequentTerm: EnhancementTerm;
}

export interface AggregateOutput {
  values: Float32Array;
  deltaGrid: Float32Array;
  ruleActivations: RuleActivation[];
}

const DELTA_MIN = -40;
const DELTA_MAX = 40;

export function computeFiringStrength(
  fuzzyState: FuzzyState,
  antecedents: FuzzyAntecedent[],
  tnorm: 'min' | 'product'
): number {
  let strength = 1;
  for (let i = 0; i < antecedents.length; i++) {
    const a = antecedents[i];
    const rec = fuzzyState[a.variable as keyof FuzzyState];
    if (!rec || typeof rec !== 'object') return 0;
    const deg = (rec as Record<string, number>)[a.term];
    if (deg === undefined) return 0;
    if (deg <= 0) return 0;
    if (tnorm === 'min') {
      if (deg < strength) strength = deg;
    } else {
      strength *= deg;
    }
  }
  return strength;
}

export function evaluateRules(
  fuzzyState: FuzzyState,
  rules: FuzzyRule[],
  tnorm: 'min' | 'product'
): RuleActivation[] {
  const out: RuleActivation[] = [];
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    const firingStrength = computeFiringStrength(fuzzyState, rule.antecedents, tnorm) * rule.weight;
    if (firingStrength > 0) {
      out.push({
        ruleId: rule.id,
        firingStrength,
        consequentTerm: rule.consequentTerm,
      });
    }
  }
  return out;
}

export function applyImplication(
  consequentMF: Float32Array,
  firingStrength: number,
  method: 'min' | 'product'
): Float32Array {
  const out = new Float32Array(consequentMF.length);
  for (let k = 0; k < consequentMF.length; k++) {
    const mu = consequentMF[k] ?? 0;
    if (method === 'min') {
      out[k] = Math.min(mu, firingStrength);
    } else {
      out[k] = mu * firingStrength;
    }
  }
  return out;
}

export function aggregateOutputs(
  activations: RuleActivation[],
  consequentMFTable: Record<EnhancementTerm, Float32Array>,
  implicationMethod: 'min' | 'product'
): AggregateOutput {
  const n = activations.length > 0 ? consequentMFTable.STRONG_BRIGHTENING.length : 0;
  const values = new Float32Array(n);
  const deltaGrid = new Float32Array(n);
  if (n > 0) {
    const step = (DELTA_MAX - DELTA_MIN) / (n - 1);
    for (let k = 0; k < n; k++) {
      deltaGrid[k] = DELTA_MIN + k * step;
    }
  }
  for (let i = 0; i < activations.length; i++) {
    const act = activations[i];
    if (act.firingStrength < 0.001) continue;
    const mf = consequentMFTable[act.consequentTerm];
    if (!mf || mf.length !== n) continue;
    const implied = applyImplication(mf, act.firingStrength, implicationMethod);
    for (let k = 0; k < n; k++) {
      const v = implied[k] ?? 0;
      if (v > (values[k] ?? 0)) values[k] = v;
    }
  }
  return { values, deltaGrid, ruleActivations: activations };
}

export function buildConsequentMFTable(nDelta: number): Record<EnhancementTerm, Float32Array> {
  const deltaGrid = new Float32Array(nDelta);
  const step = (DELTA_MAX - DELTA_MIN) / (nDelta - 1);
  for (let k = 0; k < nDelta; k++) {
    deltaGrid[k] = DELTA_MIN + k * step;
  }
  const terms: EnhancementTerm[] = [
    'STRONG_DARKENING',
    'MODERATE_DARKENING',
    'NO_CHANGE',
    'MODERATE_BRIGHTENING',
    'STRONG_BRIGHTENING',
  ];
  const table: Record<EnhancementTerm, Float32Array> = {} as Record<EnhancementTerm, Float32Array>;
  for (const t of terms) {
    const mf = ENHANCEMENT_VAR.terms[t];
    const arr = new Float32Array(nDelta);
    for (let k = 0; k < nDelta; k++) {
      const x = deltaGrid[k];
      let v = evaluateMF(x, mf);
      if (Number.isNaN(v) || !Number.isFinite(v)) v = 0;
      if (v < 0) v = 0;
      if (v > 1) v = 1;
      arr[k] = v;
    }
    table[t] = arr;
  }
  return table;
}
