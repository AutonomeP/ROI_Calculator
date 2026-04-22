/**
 * Priority Scoring
 *
 * Spec formula:
 *   priorityScore = expected.annual.net / effort.index
 *
 * Penalties:
 *   if payback > 18 && confidence < 50: score *= 0.7
 *
 * Platform boost:
 *   if is_platform_initiative && WLS >= 2.5: score *= 1.1
 */

import type { PriorityResult } from '../types/roi-vnext';

export interface PriorityInput {
  expectedAnnualNet: number;
  effortIndex: number;
  paybackMonths: number;
  confidenceScore: number;
  isPlatformInitiative: boolean;
  wlsScore: number;
}

export function calculatePriority(input: PriorityInput): PriorityResult {
  const {
    expectedAnnualNet,
    effortIndex,
    paybackMonths,
    confidenceScore,
    isPlatformInitiative,
    wlsScore,
  } = input;

  let score = effortIndex > 0 ? expectedAnnualNet / effortIndex : 0;
  let penalized = false;
  let boosted = false;

  // Penalty for high payback + low confidence
  if (paybackMonths > 18 && confidenceScore < 50) {
    score *= 0.7;
    penalized = true;
  }

  // Platform initiative boost
  if (isPlatformInitiative && wlsScore >= 2.5) {
    score *= 1.1;
    boosted = true;
  }

  return { score, penalized, boosted };
}
