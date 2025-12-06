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
 *  - solutionMode: 'automation' or 'agentic' to apply payback window
 *
 * Logic:
 *  - baselineAnnualCost = monthlyValue * 12 * 0.20   // 20% baseline
 *  - maxCost = monthlyValue * (automation: 3, agentic: 4)
 *  - suggestedAnnualCost = min(baselineAnnualCost, maxCost)
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

  // Baseline: 20% of annual value.
  const baselineAnnualCost = monthlyValue * 12 * 0.20;

  // Cap: recoup in ≤ 3 months (automation) or 4 months (agentic).
  const paybackMonthsLimit = solutionMode === 'automation' ? 3 : 4;
  const maxCost = monthlyValue * paybackMonthsLimit;

  const suggestedAnnualCost = Math.min(baselineAnnualCost, maxCost);
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

  // NEW: Calculate time saved using percentAutomated and realization factor
  const percentAutomated = inputs.percentAutomated > 0 ? inputs.percentAutomated : 0.25;
  const realizationFactor = 0.85;
  const timeSavedPerRunMinutes = tOld * percentAutomated * realizationFactor;
  const tNew = Math.max(tOld - timeSavedPerRunMinutes, 0.5);

  // NEW: Use user-specified velocity multiplier with defaults
  let vm = inputs.velocityMultiplier;
  if (!vm || vm <= 0) {
    // Default based on mode
    vm = inputs.solutionMode === 'automation' ? 1.2 : 1.5;
  }
  // Enforce mode-specific constraints
  if (inputs.solutionMode === 'automation') {
    vm = Math.max(1.0, Math.min(vm, 1.6));
  } else {
    vm = Math.max(1.2, Math.min(vm, 2.0));
  }

  const totalHoursSaved = (timeSavedPerRunMinutes * (inputs.runsPerMonth || 0)) / 60;
  const msFromTS = totalHoursSaved * (inputs.hourlyRate || 0);

  // NEW: Structured error savings model
  const defaultErrorReduction = inputs.solutionMode === 'automation' ? 0.40 : 0.70;
  let errorReductionPercent = inputs.errorReductionPercent > 0 ? inputs.errorReductionPercent : defaultErrorReduction;
  errorReductionPercent = Math.max(0, Math.min(errorReductionPercent, 1));

  let errorSavings: number;
  if (inputs.baselineErrorCostMonthly > 0) {
    errorSavings = inputs.baselineErrorCostMonthly * errorReductionPercent;
  } else {
    // Fallback to old method if no baseline provided
    const errorFactor = errorSavingsFactorByComplexity[inputs.complexity] || 0;
    const suggestedErrorSavings = msFromTS * errorFactor;
    errorSavings = (inputs.errorSavings && inputs.errorSavings > 0)
      ? inputs.errorSavings
      : suggestedErrorSavings;
  }

  const msOther = errorSavings + (inputs.toolSavings || 0);
  const msTotal = msFromTS + msOther;

  const suggestedOC = msFromTS * 0.5;
  const complexityRevenueMultiplier = revenueMultiplierByComplexity[inputs.complexity] || 1;
  const suggestedRG = suggestedOC * (complexityRevenueMultiplier - 1);
  const suggestedErrorSavings = msFromTS * (errorSavingsFactorByComplexity[inputs.complexity] || 0);

  const oc = (inputs.opportunityValue && inputs.opportunityValue > 0) ? inputs.opportunityValue : suggestedOC;
  const rg = (inputs.revenueGenerated && inputs.revenueGenerated > 0) ? inputs.revenueGenerated : suggestedRG;

  const wlsRaw = inputs.wls || 0;
  const wls = Math.min(Math.max(wlsRaw, 1), 5);
  const wlsMultiplier = getWLSMultiplier(wls);

  // Growth now uses user-specified velocity multiplier
  const growthMonthly = (oc + rg) * vm;

  const baseMonthlyValue = msTotal + growthMonthly;
  const leveragedMonthly = baseMonthlyValue * wlsMultiplier;

  // Remove agentic multiplier - it's only in platform cost now
  let monthlyLeveragedValue = leveragedMonthly;

  const {
    suggestedAnnualCost,
    suggestedMonthlyEquivalent,
    platformAnnualUsed,
    platformMonthlyUsed,
  } = calculatePlatformCost(monthlyLeveragedValue, inputs.platformCost, inputs.solutionMode);

  const roiBeforeCost = monthlyLeveragedValue;

  // NEW: Include monthlyRunCost in calculations
  const monthlyRunCost = inputs.monthlyRunCost || 0;
  const netMonthlyAfterRunCost = monthlyLeveragedValue - platformMonthlyUsed - monthlyRunCost;
  const totalRoi = netMonthlyAfterRunCost;

  const roiPercentMonthly = platformMonthlyUsed > 0
    ? (totalRoi / platformMonthlyUsed) * 100
    : 0;

  const grossQuarter = monthlyLeveragedValue * 3;
  const gross6m = monthlyLeveragedValue * 6;
  const gross1y = monthlyLeveragedValue * 12;

  const roiQuarterNet = grossQuarter - platformAnnualUsed - (monthlyRunCost * 3);
  const roi6mNet = gross6m - platformAnnualUsed - (monthlyRunCost * 6);
  const roi1yNet = gross1y - platformAnnualUsed - (monthlyRunCost * 12);

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

  // NEW: Scenario bands (LOW, BASE, HIGH)
  const lowCaseMonthlyROI = (monthlyLeveragedValue * 0.60) - platformMonthlyUsed - monthlyRunCost;
  const baseCaseMonthlyROI = (monthlyLeveragedValue * 0.80) - platformMonthlyUsed - monthlyRunCost;
  const highCaseMonthlyROI = (monthlyLeveragedValue * 1.00) - platformMonthlyUsed - monthlyRunCost;

  const lowCaseQuarterlyROI = (monthlyLeveragedValue * 0.60 * 3) - platformAnnualUsed - (monthlyRunCost * 3);
  const baseCaseQuarterlyROI = (monthlyLeveragedValue * 0.80 * 3) - platformAnnualUsed - (monthlyRunCost * 3);
  const highCaseQuarterlyROI = (monthlyLeveragedValue * 1.00 * 3) - platformAnnualUsed - (monthlyRunCost * 3);

  const lowCase6mROI = (monthlyLeveragedValue * 0.60 * 6) - platformAnnualUsed - (monthlyRunCost * 6);
  const baseCase6mROI = (monthlyLeveragedValue * 0.80 * 6) - platformAnnualUsed - (monthlyRunCost * 6);
  const highCase6mROI = (monthlyLeveragedValue * 1.00 * 6) - platformAnnualUsed - (monthlyRunCost * 6);

  const lowCase1yROI = (monthlyLeveragedValue * 0.60 * 12) - platformAnnualUsed - (monthlyRunCost * 12);
  const baseCase1yROI = (monthlyLeveragedValue * 0.80 * 12) - platformAnnualUsed - (monthlyRunCost * 12);
  const highCase1yROI = (monthlyLeveragedValue * 1.00 * 12) - platformAnnualUsed - (monthlyRunCost * 12);

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
    timeSavedPerRunMinutes,
    calculatedErrorReductionPercent: errorReductionPercent,
    netMonthlyAfterRunCost,
    lowCaseMonthlyROI,
    baseCaseMonthlyROI,
    highCaseMonthlyROI,
    lowCaseQuarterlyROI,
    baseCaseQuarterlyROI,
    highCaseQuarterlyROI,
    lowCase6mROI,
    baseCase6mROI,
    highCase6mROI,
    lowCase1yROI,
    baseCase1yROI,
    highCase1yROI,
  };
}
