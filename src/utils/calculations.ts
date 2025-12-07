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

// Helper function to get VM based on complexity
export function getVMByComplexity(complexity: Complexity): number {
  const vmMap: Record<Complexity, number> = {
    simple: 1.20,
    moderate: 1.35,
    complex: 1.50,
  };
  return vmMap[complexity] || 1.35;
}

// Helper function to get automation share from automation depth
export function getAutomationShareByDepth(depth: string): number {
  if (depth === 'light') return 0.25;      // 25%
  if (depth === 'workflow') return 0.40;   // 40%
  if (depth === 'agentic') return 0.30;    // 30%
  return 0.25; // default to light
}

// Helper function to get error reduction default based on complexity
export function getErrorReductionByComplexity(complexity: Complexity): number {
  const errorMap: Record<Complexity, number> = {
    simple: 0.40,   // 40%
    moderate: 0.50, // 50%
    complex: 0.60,  // 60%
  };
  return errorMap[complexity] || 0.50;
}

export function calculateROI(inputs: ROIInputs): ROICalculations {
  const tOld = Math.max(inputs.tOldMinutes || 0, 1);

  // STEP 1: Determine automationShare from automationDepth
  const automationShare = getAutomationShareByDepth(inputs.automationDepth);

  const realizationFactor = 0.85;
  const timeSavedPerRunMinutes = tOld * automationShare * realizationFactor;
  const tNew = Math.max(tOld - timeSavedPerRunMinutes, 0.5);

  // STEP 2: Compute time savings (MS part 1)
  const totalHoursSaved = (timeSavedPerRunMinutes * (inputs.runsPerMonth || 0)) / 60;
  const msFromTS = totalHoursSaved * (inputs.hourlyRate || 0);

  // STEP 3: Compute error savings (MS part 2)
  const errorReductionPercent = inputs.errorReductionPercent > 0
    ? inputs.errorReductionPercent
    : getErrorReductionByComplexity(inputs.complexity);

  let errorSavings: number;
  if (inputs.baselineErrorCostMonthly > 0) {
    errorSavings = inputs.baselineErrorCostMonthly * errorReductionPercent;
  } else {
    const errorFactor = errorSavingsFactorByComplexity[inputs.complexity] || 0;
    const suggestedErrorSavings = msFromTS * errorFactor;
    errorSavings = (inputs.errorSavings && inputs.errorSavings > 0)
      ? inputs.errorSavings
      : suggestedErrorSavings;
  }

  // STEP 4: Compute tool savings (MS part 3)
  const toolSavings = inputs.toolSavings || 0;

  // STEP 5: Sum MS = total direct savings
  const msOther = errorSavings + toolSavings;
  const msTotal = msFromTS + msOther;

  // STEP 6: Determine opportunity & revenue defaults (unless overridden)
  const suggestedOC = msTotal * 0.15;  // 15% of total direct savings
  const suggestedRG = msTotal * 0.10;  // 10% of total direct savings
  const suggestedErrorSavings = msFromTS * (errorSavingsFactorByComplexity[inputs.complexity] || 0);

  const oc = (inputs.opportunityValue && inputs.opportunityValue > 0) ? inputs.opportunityValue : suggestedOC;
  const rg = (inputs.revenueGenerated && inputs.revenueGenerated > 0) ? inputs.revenueGenerated : suggestedRG;

  // STEP 7: Compute baseGrowth = OC + RG
  const baseGrowth = oc + rg;

  // STEP 8: Apply VM based on complexity (or mode)
  const vm = inputs.velocityMultiplier > 0
    ? inputs.velocityMultiplier
    : getVMByComplexity(inputs.complexity);

  // STEP 9: Compute growthMonthly = baseGrowth * VM
  const growthMonthly = baseGrowth * vm;

  // STEP 10: Compute monthlyLeveragedValue = (MS + growthMonthly) * WLSmultiplier
  const wlsRaw = inputs.wls || 0;
  const wls = Math.min(Math.max(wlsRaw, 1), 5);
  const wlsMultiplier = getWLSMultiplier(wls);

  const baseMonthlyValue = msTotal + growthMonthly;
  let monthlyLeveragedValue = baseMonthlyValue * wlsMultiplier;

  // STEP 11: If agenticMode: monthlyLeveragedValue *= 2.1107
  if (inputs.solutionMode === 'agentic') {
    monthlyLeveragedValue *= AGENTIC_MULTIPLIER;
  }

  // STEP 12: Compute baselineAnnual
  // STEP 13: Compute maxCost from payback caps
  // STEP 14: platformCost = min(baselineAnnual, maxCost)
  const {
    suggestedAnnualCost,
    suggestedMonthlyEquivalent,
    platformAnnualUsed,
    platformMonthlyUsed,
  } = calculatePlatformCost(monthlyLeveragedValue, inputs.platformCost, inputs.solutionMode);

  const roiBeforeCost = monthlyLeveragedValue;

  // Include monthlyRunCost (OPEX) in calculations
  const monthlyRunCost = inputs.monthlyRunCost || 0;

  // STEP 15: Compute ROI quarter/6-month/annual net:
  //   grossX = monthlyLeveragedValue * X
  //   netX = grossX - platformCost - opex*X
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

  // Net monthly after platform cost and run cost
  const netMonthlyAfterRunCost = monthlyLeveragedValue - platformMonthlyUsed - monthlyRunCost;
  const totalRoi = netMonthlyAfterRunCost;

  const roiPercentMonthly = platformMonthlyUsed > 0
    ? (totalRoi / platformMonthlyUsed) * 100
    : 0;

  // STEP 16: Compute TTV months & quarters
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
