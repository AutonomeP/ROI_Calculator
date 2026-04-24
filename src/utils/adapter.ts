/**
 * Adapter layer — bridges the legacy flat ROIInputs / ROICalculations
 * to the vNext RoiInputPayload / RoiComputedResult.
 *
 * This allows the existing UI to keep working while the engine underneath
 * switches to the spec-compliant vNext formulas.
 */

import type { ROIInputs, ROICalculations } from '../types/roi';
import type { RoiInputPayload, RoiComputedResult } from '../types/roi-vnext';
import {
  DEFAULT_SALARY,
  DEFAULT_OVERHEAD,
  STANDARD_ANNUAL_HOURS,
  DEFAULT_DEFECT_RATE,
  DEFAULT_COST_PER_DEFECT,
  SCENARIO_EXPECTED,
  VM_BY_COMPLEXITY,
} from './constants';
import { computeInitiativeROI } from './compute-vnext';

// ---------------------------------------------------------------------------
// Legacy inputs → vNext payload
// ---------------------------------------------------------------------------

// Map UI automation depth selector to vNext automation_coverage
function automationCoverageFromDepth(depth: string): number {
  switch (depth) {
    case 'light':    return 0.25;  // conservative — humans drive most of the workflow
    case 'workflow': return 0.45;  // expected — most of end-to-end is automated
    case 'agentic':  return 0.30;  // AI creates value through reasoning/orchestration; multiplier carries the rest
    default:         return 0.25;
  }
}

export function legacyToVnext(inputs: ROIInputs): RoiInputPayload {
  const hourlyRate = inputs.hourlyRate || 0;

  // If user entered an hourly rate directly, use it.
  // Otherwise fall back to default salary-based computation.
  const fullyLoadedRate =
    hourlyRate > 0
      ? hourlyRate
      : (DEFAULT_SALARY * (1 + DEFAULT_OVERHEAD / 100)) / STANDARD_ANNUAL_HOURS;

  // Map error inputs: legacy uses monthly lump sum OR percentage,
  // vNext wants defect_rate + cost_per_defect.
  // When user gave a monthly lump sum, reverse-engineer approximate defect_rate
  // so the formula still produces a meaningful value.
  let defectRate = DEFAULT_DEFECT_RATE;
  let costPerDefect = DEFAULT_COST_PER_DEFECT;

  if (inputs.baselineErrorCostMonthly > 0) {
    // Approximate: monthlyCost ≈ defectRate * (runsPerMonth) * costPerDefect
    const runsPerMonth = inputs.runsPerMonth || 1;
    costPerDefect = inputs.baselineErrorCostMonthly / (defectRate * runsPerMonth) || DEFAULT_COST_PER_DEFECT;
  }

  // VM: use user override, or derive from complexity
  const vm =
    inputs.velocityMultiplier > 0
      ? inputs.velocityMultiplier
      : VM_BY_COMPLEXITY[inputs.complexity] ?? 1.35;

  // Effort index: drives price floors and effort adjustment in calculateServicePrice.
  const EFFORT_INDEX_BY_COMPLEXITY: Record<string, number> = {
    simple:   1.5,
    moderate: 2.0,
    complex:  2.5,
  };
  const effortIndex = EFFORT_INDEX_BY_COMPLEXITY[inputs.complexity] ?? 2.0;

  // Map user-entered OC and RG (monthly) into vNext growth inputs (annual).
  // The engine applies adoption, so we divide by adoption to preserve the
  // user's intended dollar amount: engine computes margin * adoption = user value.
  const adoption = SCENARIO_EXPECTED.adoption;
  const userOC = inputs.opportunityValue || 0;
  const userRG = inputs.revenueGenerated || 0;
  const userGrowthMonthly = userOC + userRG;

  // When user provides OC/RG, route time value through a split allocation
  // so OC maps to capacity redeploy and the rest stays as labor savings.
  // When no user values, keep pure labor_savings allocation.
  const hasUserGrowth = userGrowthMonthly > 0;

  return {
    baseline: {
      volume: { runs_per_month: inputs.runsPerMonth || 0 },
      time: {
        minutes_per_run: inputs.tOldMinutes || 0,
        people_affected: 1,
      },
      labor: {
        fully_loaded_rate: fullyLoadedRate,
        value_rate: fullyLoadedRate,
      },
      quality: {
        defect_rate: defectRate,
        cost_per_defect: costPerDefect,
      },
      hard_savings: {
        annual_cost_removed: (inputs.toolSavings || 0) * 12,
      },
      growth: {
        // Map user-entered OC+RG as throughput gains.
        // incremental_units=1 is a single "annual bundle" so
        // margin_per_unit carries the full annual value / adoption.
        incremental_units_per_year: hasUserGrowth ? 1 : 0,
        margin_per_unit: hasUserGrowth ? (userGrowthMonthly * 12) / adoption : 0,
        conversion_lift: 0,
        value_per_conversion: 0,
      },
    },
    costs: {
      implementation_cost: inputs.platformCost || 0,
      run_cost_monthly: inputs.monthlyRunCost || 0,
      year1_extra_costs: 0,
    },
    allocation: {
      time_value_allocation: 'labor_savings',
    },
    assumptions: {},
    multipliers: {
      vm,
      wls: inputs.wls || 2,
    },
    adoption,
    automation_coverage: automationCoverageFromDepth(inputs.automationDepth),
    error_reduction:
      inputs.errorReductionPercent > 0
        ? inputs.errorReductionPercent
        : SCENARIO_EXPECTED.error_reduction,
    solution_mode:
      inputs.solutionMode === 'agentic' ? 'agentic_intelligent_ai' : 'automation',
    automation_depth: inputs.automationDepth,
    effort_index: effortIndex,
  };
}

// ---------------------------------------------------------------------------
// vNext result → legacy output
// ---------------------------------------------------------------------------

export function vnextToLegacy(
  result: RoiComputedResult,
  inputs: ROIInputs,
): ROICalculations {
  const monthly = result.monthly_leveraged_value;
  const runCostMonthly = inputs.monthlyRunCost || 0;
  const platformAnnual = result.total_cost - result.run_cost_annual;
  const platformMonthly = platformAnnual / 12;

  const grossQuarter = monthly * 3;
  const gross6m = monthly * 6;
  const gross1y = monthly * 12;

  const roiQuarterNet = grossQuarter - platformAnnual - runCostMonthly * 3;
  const roi6mNet = gross6m - platformAnnual - runCostMonthly * 6;
  const roi1yNet = result.year1_net;

  const totalCost = platformAnnual + runCostMonthly * 3;
  const totalCost6m = platformAnnual + runCostMonthly * 6;
  const totalCost1y = result.total_cost;
  const roiQuarterPercent = totalCost > 0 ? (roiQuarterNet / totalCost) * 100 : 0;
  const roi6mPercent = totalCost6m > 0 ? (roi6mNet / totalCost6m) * 100 : 0;
  const roi1yPercent = result.roi_pct_y1;

  const netMonthlyAfterRunCost = monthly - platformMonthly - runCostMonthly;

  // OC and RG: use user-entered values when provided, otherwise derive from engine.
  // User values are monthly; engine throughput_gains contains both combined (annual).
  const userOC = inputs.opportunityValue || 0;
  const userRG = inputs.revenueGenerated || 0;
  const hasUserGrowth = (userOC + userRG) > 0;

  const oc = hasUserGrowth ? userOC : result.buckets.opportunity_redeploy / 12;
  const rg = hasUserGrowth ? userRG : result.buckets.revenue_generated / 12;

  // Scenario bands — keep legacy 60/80/100 for display compat
  const lowFactor = 0.60;
  const baseFactor = 0.80;
  const highFactor = 1.00;

  return {
    tOld: inputs.tOldMinutes || 0,
    vm: result.velocity_multiplier,
    tNew: Math.max((inputs.tOldMinutes || 0) - (result.hours_saved_per_year / (result.runs_per_year || 1)) * 60, 0),
    totalHoursSaved: result.realized_hours_saved / 12, // monthly for legacy display
    msFromTS: result.buckets.labor_savings / 12,
    msOther: (result.buckets.error_reduction + result.buckets.hard_cost_savings) / 12,
    msTotal: result.direct_savings / 12,
    oc,
    rg,
    directSavings: result.direct_savings / 12,
    growthValue: result.growth_value / 12,
    wlsMultiplier: result.wls_multiplier,
    monthlyLeveragedValue: monthly,
    roiBeforeCost: monthly,
    totalRoi: netMonthlyAfterRunCost,
    roiPercent: platformMonthly > 0 ? (netMonthlyAfterRunCost / platformMonthly) * 100 : 0,
    platformAnnual,
    platformMonthly,
    suggestedPlatformAnnual: result.service_price,
    suggestedPlatformMonthly: result.service_price / 12,
    suggestedOC: result.direct_savings / 12 * 0.15,
    suggestedRG: result.direct_savings / 12 * 0.10,
    suggestedErrorSavings: result.buckets.error_reduction / 12,
    errorSavings: result.buckets.error_reduction / 12,
    grossQuarter,
    gross6m,
    gross1y,
    roiQuarterNet,
    roi6mNet,
    roi1yNet,
    roiQuarterPercent,
    roi6mPercent,
    roi1yPercent,
    monthsToRoi: result.payback_months,
    quartersToRoi: result.payback_months / 3,
    paybackMonths: result.payback_months,
    timeSavedPerRunMinutes:
      (result.hours_saved_per_year / (result.runs_per_year || 1)) * 60,
    calculatedErrorReductionPercent: inputs.errorReductionPercent || SCENARIO_EXPECTED.error_reduction,
    netMonthlyAfterRunCost,

    lowCaseMonthlyROI: monthly * lowFactor - platformMonthly - runCostMonthly,
    baseCaseMonthlyROI: monthly * baseFactor - platformMonthly - runCostMonthly,
    highCaseMonthlyROI: monthly * highFactor - platformMonthly - runCostMonthly,

    lowCaseQuarterlyROI: monthly * lowFactor * 3 - platformAnnual - runCostMonthly * 3,
    baseCaseQuarterlyROI: monthly * baseFactor * 3 - platformAnnual - runCostMonthly * 3,
    highCaseQuarterlyROI: monthly * highFactor * 3 - platformAnnual - runCostMonthly * 3,

    lowCase6mROI: monthly * lowFactor * 6 - platformAnnual - runCostMonthly * 6,
    baseCase6mROI: monthly * baseFactor * 6 - platformAnnual - runCostMonthly * 6,
    highCase6mROI: monthly * highFactor * 6 - platformAnnual - runCostMonthly * 6,

    lowCase1yROI: monthly * lowFactor * 12 - platformAnnual - runCostMonthly * 12,
    baseCase1yROI: monthly * baseFactor * 12 - platformAnnual - runCostMonthly * 12,
    highCase1yROI: monthly * highFactor * 12 - platformAnnual - runCostMonthly * 12,
  };
}

// ---------------------------------------------------------------------------
// Drop-in replacement for the legacy calculateROI function
// ---------------------------------------------------------------------------

export function calculateROIVnext(inputs: ROIInputs): ROICalculations {
  const payload = legacyToVnext(inputs);
  const result = computeInitiativeROI(payload);
  return vnextToLegacy(result, inputs);
}
