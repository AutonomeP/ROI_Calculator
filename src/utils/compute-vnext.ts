/**
 * ROI vNext Compute Engine — mirrors Autonome Blueprint vNext (ROI v1.0).
 *
 * Canonical formula chain:
 *   runsPerYear → hoursSaved → realizedHours → timeValue
 *   → allocate across LS / OC / RG
 *   → compute ER, HS, TG independently
 *   → directSavings = LS + ER + HS
 *   → growthValue  = TG + RG + OC
 *   → compounded   = (directSavings + growthValue * VM) * WLS
 *   → net / payback / pricing
 */

import type {
  RoiInputPayload,
  RoiComputedResult,
  WlsRubric,
  EffortResult,
} from '../types/roi-vnext';

import {
  ROI_VNEXT_MODEL_VERSION,
  WLS_MAP,
  WLS_RUBRIC_WEIGHTS,
  VM_BOUNDS,
  REDEPLOY_FACTOR_CAP_NO_PLAN,
  AGENTIC_VALUE_MULTIPLIER,
  clamp,
} from './constants';

import { calculateEffort } from './effort';
import { calculatePriority } from './prioritize';
import { calculateServicePrice } from './pricing';

// ---------------------------------------------------------------------------
// WLS helpers
// ---------------------------------------------------------------------------

export function computeWlsFromRubric(rubric: WlsRubric): number {
  const weighted =
    rubric.teams_impacted * WLS_RUBRIC_WEIGHTS.teams_impacted +
    rubric.workflows_unlocked * WLS_RUBRIC_WEIGHTS.workflows_unlocked +
    rubric.reusability * WLS_RUBRIC_WEIGHTS.reusability +
    rubric.durability * WLS_RUBRIC_WEIGHTS.durability +
    rubric.downstream_enablement * WLS_RUBRIC_WEIGHTS.downstream_enablement;

  return clamp(Math.round(weighted), 1, 5);
}

export function getWlsMultiplier(score: number): number {
  const clamped = clamp(Math.round(score), 1, 5);
  return WLS_MAP[clamped] ?? 2.0;
}

// ---------------------------------------------------------------------------
// VM helpers
// ---------------------------------------------------------------------------

export function computeVmFromCycleTime(cycleTimeReduction: number): number {
  const raw = 1 + cycleTimeReduction * 1.2;
  return clamp(raw, VM_BOUNDS.min, VM_BOUNDS.max);
}

// ---------------------------------------------------------------------------
// Allocation resolver
// ---------------------------------------------------------------------------

interface AllocationSplit {
  labor_pct: number;
  capacity_pct: number;
  revenue_pct: number;
}

function resolveAllocation(input: RoiInputPayload): AllocationSplit {
  switch (input.allocation.time_value_allocation) {
    case 'labor_savings':
      return { labor_pct: 1, capacity_pct: 0, revenue_pct: 0 };
    case 'capacity':
      return { labor_pct: 0, capacity_pct: 1, revenue_pct: 0 };
    case 'revenue':
      return { labor_pct: 0, capacity_pct: 0, revenue_pct: 1 };
    case 'split': {
      const s = input.allocation.split;
      if (!s) return { labor_pct: 1, capacity_pct: 0, revenue_pct: 0 };
      const total = s.labor_savings_pct + s.capacity_pct + s.revenue_pct;
      if (total <= 0) return { labor_pct: 1, capacity_pct: 0, revenue_pct: 0 };
      return {
        labor_pct: s.labor_savings_pct / total,
        capacity_pct: s.capacity_pct / total,
        revenue_pct: s.revenue_pct / total,
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Main compute function
// ---------------------------------------------------------------------------

export function computeInitiativeROI(input: RoiInputPayload): RoiComputedResult {
  const b = input.baseline;
  const adoption = input.adoption;
  const automationCoverage = input.automation_coverage;
  const errorReductionRate = input.error_reduction;

  // --- Volume ---
  const runsPerYear = b.volume.runs_per_month * 12;

  // --- Time savings ---
  const minutesSavedPerRun = b.time.minutes_per_run * automationCoverage;
  const hoursSavedPerYear =
    (minutesSavedPerRun / 60) * runsPerYear * b.time.people_affected;
  const realizedHoursSaved = hoursSavedPerYear * adoption;

  // --- Time value ---
  const fullyLoadedRate = b.labor.fully_loaded_rate;
  const timeValue = realizedHoursSaved * fullyLoadedRate;

  // --- Allocation ---
  const alloc = resolveAllocation(input);
  const laborSavings = timeValue * alloc.labor_pct;

  // --- Opportunity redeploy ---
  const valueRate = b.labor.value_rate ?? fullyLoadedRate;
  let redeployFactor = input.assumptions.redeploy_factor ?? 1;
  if (input.assumptions.redeploy_requires_plan === false) {
    redeployFactor = Math.min(redeployFactor, REDEPLOY_FACTOR_CAP_NO_PLAN);
  }
  const opportunityRedeploy =
    realizedHoursSaved * valueRate * redeployFactor * alloc.capacity_pct;

  // --- Time-derived revenue ---
  const timeDerivedRevenue = timeValue * alloc.revenue_pct;

  // --- Error reduction ---
  const annualDefects = b.quality.defect_rate * runsPerYear;
  const errorReduction =
    annualDefects * b.quality.cost_per_defect * errorReductionRate * adoption;

  // --- Hard cost savings ---
  const hardCostSavings = b.hard_savings.annual_cost_removed * adoption;

  // --- Throughput gains ---
  const throughputFromUnits =
    b.growth.incremental_units_per_year * b.growth.margin_per_unit * adoption;

  const conversionDelta = b.growth.conversion_lift;
  const throughputFromConversion =
    runsPerYear * conversionDelta * b.growth.value_per_conversion * adoption;

  const throughputGains = throughputFromUnits + throughputFromConversion;

  // --- Delay loss recovery ---
  let delayLossRecovered = 0;
  if (input.assumptions.delay_loss) {
    const dl = input.assumptions.delay_loss;
    delayLossRecovered = dl.annual_revenue_at_risk * dl.recovery_rate * adoption;
  }

  // --- Revenue generated ---
  const revenueGenerated = timeDerivedRevenue + delayLossRecovered;

  // --- Aggregates ---
  const directSavings = laborSavings + errorReduction + hardCostSavings;
  const growthValue = throughputGains + revenueGenerated + opportunityRedeploy;

  // --- Velocity multiplier ---
  let vm: number;
  if (typeof input.multipliers.vm === 'number') {
    vm = clamp(input.multipliers.vm, VM_BOUNDS.min, VM_BOUNDS.max);
  } else if (input.multipliers.cycle_time_reduction != null) {
    vm = computeVmFromCycleTime(input.multipliers.cycle_time_reduction);
  } else {
    vm = 1.0;
  }

  // --- WLS ---
  let wlsScore: number;
  if (typeof input.multipliers.wls === 'number') {
    wlsScore = clamp(Math.round(input.multipliers.wls), 1, 5);
  } else if (input.wls_rubric) {
    wlsScore = computeWlsFromRubric(input.wls_rubric);
  } else {
    wlsScore = 2; // default rubric all-2 rounds to 2
  }
  const wlsMultiplier = getWlsMultiplier(wlsScore);

  // --- Compounded value ---
  const compoundedBase = (directSavings + growthValue * vm) * wlsMultiplier;
  // Agentic systems create compoundly more leverage than rule-based automation.
  const compoundedValue =
    input.solution_mode === 'agentic_intelligent_ai'
      ? compoundedBase * AGENTIC_VALUE_MULTIPLIER
      : compoundedBase;

  // --- Effort ---
  let effort: EffortResult;
  if (input.effort_index != null) {
    const idx = clamp(input.effort_index, 1.0, 3.0);
    effort = { index: idx, score: idx * 33 };
  } else if (input.effort) {
    effort = calculateEffort(input.effort);
  } else {
    effort = { index: 2.0, score: 66 };
  }

  // --- Service pricing (implementation cost) ---
  const monthlyLeveragedValue = compoundedValue / 12;
  const servicePrice = calculateServicePrice({
    monthlyLeveragedValue,
    effortIndex: effort.index,
    solutionMode: input.solution_mode,
    automationDepth: input.automation_depth,
    linkedSystemCount: 0,
    regulatedSystemCount: 0,
    evidenceCount: -1, // -1 = evidence system not active, neutral adjustment
  });

  // Use user-provided implementation_cost if > 0, otherwise computed price
  const implementationCost =
    input.costs.implementation_cost > 0
      ? input.costs.implementation_cost
      : servicePrice;

  // --- Cost structure ---
  const runCostAnnual =
    input.costs.run_cost_monthly * 12 + input.costs.year1_extra_costs;
  const totalCost = implementationCost + runCostAnnual;

  // --- Net ROI ---
  const netAnnual = compoundedValue - runCostAnnual;
  const year1Net = netAnnual - implementationCost;
  const roiPctY1 = totalCost > 0 ? (year1Net / totalCost) * 100 : 0;
  const monthlyNet = netAnnual / 12;
  const paybackMonths = monthlyNet > 0 ? implementationCost / monthlyNet : 999;

  // --- Priority ---
  const priority = calculatePriority({
    expectedAnnualNet: netAnnual,
    effortIndex: effort.index,
    paybackMonths,
    confidenceScore: 50, // default when confidence system not active
    isPlatformInitiative: input.assumptions.is_platform_initiative ?? false,
    wlsScore,
  });

  return {
    model_version: ROI_VNEXT_MODEL_VERSION,

    runs_per_year: runsPerYear,
    hours_saved_per_year: hoursSavedPerYear,
    realized_hours_saved: realizedHoursSaved,
    time_value: timeValue,
    fully_loaded_rate: fullyLoadedRate,

    buckets: {
      labor_savings: laborSavings,
      error_reduction: errorReduction,
      hard_cost_savings: hardCostSavings,
      throughput_gains: throughputGains,
      revenue_generated: revenueGenerated,
      opportunity_redeploy: opportunityRedeploy,
    },

    direct_savings: directSavings,
    growth_value: growthValue,

    velocity_multiplier: vm,
    wls_score: wlsScore,
    wls_multiplier: wlsMultiplier,

    compounded_value: compoundedValue,

    run_cost_annual: runCostAnnual,
    total_cost: totalCost,

    net_annual: netAnnual,
    year1_net: year1Net,
    roi_pct_y1: roiPctY1,
    monthly_net: monthlyNet,
    payback_months: paybackMonths,

    service_price: servicePrice,
    monthly_leveraged_value: monthlyLeveragedValue,

    allocation_applied: {
      labor_pct: alloc.labor_pct,
      capacity_pct: alloc.capacity_pct,
      revenue_pct: alloc.revenue_pct,
    },

    effort,
    priority,
  };
}
