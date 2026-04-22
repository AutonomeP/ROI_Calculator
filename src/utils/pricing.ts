/**
 * Service Pricing — derives implementation cost from value and effort.
 *
 * Spec formula:
 *   monthsTarget = baseMonths
 *     + clamp((effortIndex - 2) * 0.65, -0.35, 1.5)
 *     + clamp(max(0, linkedSystemCount - 1) * 0.22, 0, 1.2)
 *     + clamp(regulatedSystemCount * 0.18, 0, 0.8)
 *     + evidenceAdjustment
 *
 *   rawPrice = monthlyLeveragedValue * monthsTarget
 *   priceCap = monthlyLeveragedValue * capMonths
 *   servicePrice = round(min(max(rawPrice, priceFloor), priceCap))
 */

import {
  PRICING_BASE_MONTHS,
  PRICING_CAP_MONTHS,
  PRICING_FLOORS,
  ABSOLUTE_PRICE_FLOORS,
  clamp,
} from './constants';

export interface PricingInput {
  monthlyLeveragedValue: number;
  effortIndex: number;
  solutionMode: 'automation' | 'agentic_intelligent_ai';
  automationDepth: string;
  linkedSystemCount: number;
  regulatedSystemCount: number;
  evidenceCount: number;
}

function getPriceFloor(effortIndex: number): number {
  let floor = PRICING_FLOORS[0][1]; // lowest
  for (const [threshold, value] of PRICING_FLOORS) {
    if (effortIndex >= threshold) {
      floor = value;
    }
  }
  return floor;
}

function getEvidenceAdjustment(evidenceCount: number): number {
  // When evidence system is not active (count < 0 or undefined), neutral.
  if (evidenceCount < 0) return 0;
  if (evidenceCount >= 6) return -0.2;
  if (evidenceCount === 0) return 0.2;
  return 0;
}

function getAbsoluteFloor(solutionMode: string, automationDepth: string): number {
  const modeFloors = ABSOLUTE_PRICE_FLOORS[solutionMode];
  if (!modeFloors) return 3_000;
  return modeFloors[automationDepth] ?? modeFloors['workflow'] ?? 8_000;
}

export function calculateServicePrice(input: PricingInput): number {
  const {
    monthlyLeveragedValue,
    effortIndex,
    solutionMode,
    automationDepth,
    linkedSystemCount,
    regulatedSystemCount,
    evidenceCount,
  } = input;

  if (monthlyLeveragedValue <= 0) return 0;

  const baseMonths = PRICING_BASE_MONTHS[solutionMode];
  const capMonths = PRICING_CAP_MONTHS[solutionMode];

  const effortAdj = clamp((effortIndex - 2) * 0.65, -0.35, 1.5);
  const systemAdj = clamp(Math.max(0, linkedSystemCount - 1) * 0.22, 0, 1.2);
  const regulatedAdj = clamp(regulatedSystemCount * 0.18, 0, 0.8);
  const evidenceAdj = getEvidenceAdjustment(evidenceCount);

  const monthsTarget =
    baseMonths + effortAdj + systemAdj + regulatedAdj + evidenceAdj;

  const rawPrice = monthlyLeveragedValue * monthsTarget;
  const priceCap = monthlyLeveragedValue * capMonths;
  const effortFloor = getPriceFloor(effortIndex);

  // Value-based price: capped by value, floored by effort
  const valueBased = Math.min(Math.max(rawPrice, effortFloor), priceCap);

  // Absolute floor: minimum real-world build cost for this solution category.
  // This ensures we never quote below what it actually costs to build.
  const absoluteFloor = getAbsoluteFloor(solutionMode, automationDepth);

  return Math.round(Math.max(valueBased, absoluteFloor));
}
