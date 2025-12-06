import { ROIInputs, ROICalculations, Complexity, SolutionMode } from '../types/roi';

const AGENTIC_MULTIPLIER = 2.1107;

export function getWLSMultiplier(wls: number): number {
  const wlsClamped = Math.min(Math.max(Math.round(wls), 1), 5);
  const multipliers: Record<number, number> = {
    1: 1.0,
    2: 1.5,
    3: 2.0,
    4: 2.5,
    5: 3.0,
  };
  return multipliers[wlsClamped] || 2.0;
}

const complexityTimeFactor: Record<Complexity, number> = {
  simple: 0.24,
  moderate: 0.40,
  complex: 0.60,
};

const revenueMultiplierByComplexity: Record<Complexity, number> = {
  simple: 1.10,
  moderate: 1.20,
  complex: 1.30,
};

const errorSavingsFactorByComplexity: Record<Complexity, number> = {
  simple: 0.05,
  moderate: 0.08,
  complex: 0.15,
};

type PlatformCostResult = {
  suggestedAnnualCost: number;
  suggestedMonthlyEquivalent: number;
  platformAnnualUsed: number;
  platformMonthlyUsed: number;
};

/**
 * Calculate a dynamic, ROI-based platform cost.
 *
 * Inputs:
 *  - monthlyValue: value created per month BEFORE platform cost
 *                  (this should be roiBeforeCost)
 *  - userOverrideAnnual: user-entered TOTAL platform price (one-time),
 *                        or 0/undefined if not provided
 *  - solutionMode: 'automation' or 'agentic' to apply pricing multiplier
 *
 * Logic:
 *  - annualValue = monthlyValue * 12
 *  - baselineAnnual = annualValue * 0.1825   // 18.25%
 *  - maxAnnual = monthlyValue * 3            // ≤ 3 months to recoup
 *  - suggestedAnnualCost = min(baselineAnnual, maxAnnual)
 *  - For agentic mode: suggestedAnnualCost *= AGENTIC_MULTIPLIER (2.1107)
 *  - suggestedMonthlyEquivalent = suggestedAnnualCost / 12
 *
 *  - If userOverrideAnnual > 0, we use that as platformAnnualUsed
 *    and recompute platformMonthlyUsed = userOverrideAnnual / 12.
 */
export function calculatePlatformCost(
  monthlyValue: number,
  userOverrideAnnual: number | undefined | null,
  solutionMode: SolutionMode
): PlatformCostResult {
  // If no value created, no suggested cost.
  if (!monthlyValue || monthlyValue <= 0) {
    const overrideAnnual =
      userOverrideAnnual && userOverrideAnnual > 0
        ? userOverrideAnnual
        : 0;

    return {
      suggestedAnnualCost: 0,
      suggestedMonthlyEquivalent: 0,
      platformAnnualUsed: overrideAnnual,
      platformMonthlyUsed: overrideAnnual / 12,
    };
  }

  const annualValue = monthlyValue * 12;

  // Baseline: 18.25% of annual value.
  let baselineAnnualCost = annualValue * 0.1825;

  // Cap: recoup in ≤ 3 months.
  const maxAnnualCost = monthlyValue * 3;
  if (baselineAnnualCost > maxAnnualCost) {
    baselineAnnualCost = maxAnnualCost;
  }

  let modeAdjustedSuggestedAnnual = baselineAnnualCost;

  if (solutionMode === 'agentic') {
    modeAdjustedSuggestedAnnual = baselineAnnualCost * AGENTIC_MULTIPLIER;
  }

  const suggestedAnnualCost = modeAdjustedSuggestedAnnual;
  const suggestedMonthlyEquivalent = suggestedAnnualCost / 12;

  // If user typed a custom TOTAL price, honor override.
  const platformAnnualUsed =
    userOverrideAnnual && userOverrideAnnual > 0
      ? userOverrideAnnual
      : suggestedAnnualCost;

  const platformMonthlyUsed = platformAnnualUsed / 12;

  return {
    suggestedAnnualCost,
    suggestedMonthlyEquivalent,
    platformAnnualUsed,
    platformMonthlyUsed,
  };
}

export function calculateROI(inputs: ROIInputs): ROICalculations {
  const tOld = Math.max(inputs.tOldMinutes || 0, 1);
  const timeFactor = complexityTimeFactor[inputs.complexity] || 0;
  const tSavedPerRun = tOld * timeFactor;
  const tNew = Math.max(tOld - tSavedPerRun, 0.5);
  const vm = tOld / tNew;

  const totalHoursSaved = (tSavedPerRun * (inputs.runsPerMonth || 0)) / 60;
  const msFromTS = totalHoursSaved * (inputs.hourlyRate || 0);

  const errorFactor = errorSavingsFactorByComplexity[inputs.complexity] || 0;
  const suggestedErrorSavings = msFromTS * errorFactor;
  const errorSavings = (inputs.errorSavings && inputs.errorSavings > 0)
    ? inputs.errorSavings
    : suggestedErrorSavings;

  const msOther = errorSavings + (inputs.toolSavings || 0);
  const msTotal = msFromTS + msOther;

  const suggestedOC = msFromTS * 0.5;
  const complexityRevenueMultiplier = revenueMultiplierByComplexity[inputs.complexity] || 1;
  const suggestedRG = suggestedOC * (complexityRevenueMultiplier - 1);

  const oc = (inputs.opportunityValue && inputs.opportunityValue > 0) ? inputs.opportunityValue : suggestedOC;
  const rg = (inputs.revenueGenerated && inputs.revenueGenerated > 0) ? inputs.revenueGenerated : suggestedRG;

  const wlsRaw = inputs.wls || 0;
  const wls = Math.min(Math.max(wlsRaw, 1), 5);
  const wlsMultiplier = getWLSMultiplier(wls);

  const growthMonthly = (oc + rg) * vm;

  const baseMonthlyValue = msTotal + growthMonthly;

  const leveragedMonthly = baseMonthlyValue * wlsMultiplier;

  let monthlyLeveragedValue = leveragedMonthly;
  if (inputs.solutionMode === 'agentic') {
    const agenticLeveraged = leveragedMonthly * AGENTIC_MULTIPLIER;
    const maxLeveraged = baseMonthlyValue * 5;
    monthlyLeveragedValue = Math.min(agenticLeveraged, maxLeveraged);
  }

  const {
    suggestedAnnualCost,
    suggestedMonthlyEquivalent,
    platformAnnualUsed,
    platformMonthlyUsed,
  } = calculatePlatformCost(monthlyLeveragedValue, inputs.platformCost, inputs.solutionMode);

  const roiBeforeCost = monthlyLeveragedValue;
  const totalRoi = monthlyLeveragedValue - platformMonthlyUsed;

  const roiPercentMonthly = platformMonthlyUsed > 0
    ? (totalRoi / platformMonthlyUsed) * 100
    : 0;

  const grossQuarter = monthlyLeveragedValue * 3;
  const gross6m = monthlyLeveragedValue * 6;
  const gross1y = monthlyLeveragedValue * 12;

  const roiQuarterNet = grossQuarter - platformAnnualUsed;
  const roi6mNet = gross6m - platformAnnualUsed;
  const roi1yNet = gross1y - platformAnnualUsed;

  const roiQuarterPercent = platformAnnualUsed > 0
    ? (roiQuarterNet / platformAnnualUsed) * 100
    : 0;

  const roi6mPercent = platformAnnualUsed > 0
    ? (roi6mNet / platformAnnualUsed) * 100
    : 0;

  const roi1yPercent = platformAnnualUsed > 0
    ? (roi1yNet / platformAnnualUsed) * 100
    : 0;

  const monthsToRoi = monthlyLeveragedValue > 0
    ? platformAnnualUsed / monthlyLeveragedValue
    : 0;

  const quartersToRoi = monthsToRoi / 3;

  const paybackMonths = monthlyLeveragedValue > 0
    ? platformAnnualUsed / monthlyLeveragedValue
    : 0;

  const directSavings = msTotal;
  const growthValue = growthMonthly;

  return {
    tOld,
    vm,
    tNew,
    totalHoursSaved,
    msFromTS,
    msOther,
    msTotal,
    oc,
    rg,
    directSavings,
    growthValue,
    wlsMultiplier,
    monthlyLeveragedValue,
    roiBeforeCost,
    totalRoi,
    roiPercent: roiPercentMonthly,
    platformAnnual: platformAnnualUsed,
    platformMonthly: platformMonthlyUsed,
    suggestedPlatformAnnual: suggestedAnnualCost,
    suggestedPlatformMonthly: suggestedMonthlyEquivalent,
    suggestedOC,
    suggestedRG,
    suggestedErrorSavings,
    errorSavings,
    grossQuarter,
    gross6m,
    gross1y,
    roiQuarterNet,
    roi6mNet,
    roi1yNet,
    roiQuarterPercent,
    roi6mPercent,
    roi1yPercent,
    monthsToRoi,
    quartersToRoi,
    paybackMonths,
  };
}
