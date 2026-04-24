/**
 * ROI vNext Constants — All magic numbers from the spec in one place.
 */

import type { ScenarioParams } from '../types/roi-vnext';

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
export const ROI_VNEXT_MODEL_VERSION = 'ROI v1.0';

// ---------------------------------------------------------------------------
// Fully loaded rate defaults
// ---------------------------------------------------------------------------
export const DEFAULT_SALARY = 75_000;
export const DEFAULT_OVERHEAD = 25;          // percent
export const STANDARD_ANNUAL_HOURS = 2_080;  // 40h/wk × 52wk

// ---------------------------------------------------------------------------
// Baseline defaults (used by context resolver when inputs are incomplete)
// ---------------------------------------------------------------------------
export const DEFAULT_MINUTES_PER_RUN = 30;
export const DEFAULT_RUNS_PER_YEAR = 260;    // ~1/business-day
export const DEFAULT_DEFECT_RATE = 0.05;
export const DEFAULT_COST_PER_DEFECT = 50;
export const DEFAULT_CONFIDENCE = 35;

// ---------------------------------------------------------------------------
// Velocity Multiplier (VM)
// ---------------------------------------------------------------------------
export const VM_BOUNDS = { min: 1.0, max: 1.6 } as const;

export const VM_BY_COMPLEXITY = {
  simple: 1.2,
  moderate: 1.35,
  complex: 1.5,
} as const;

export const DEFAULT_VELOCITY_MULTIPLIER = 1.10;

// ---------------------------------------------------------------------------
// Weighted Leverage Score (WLS)
// ---------------------------------------------------------------------------
export const WLS_MAP: Record<number, number> = {
  1: 1.0,
  2: 1.5,
  3: 2.0,
  4: 2.5,
  5: 3.0,
};

export const DEFAULT_WEIGHTED_LEVERAGE_SCORE = 1.20;

export const WLS_RUBRIC_WEIGHTS = {
  teams_impacted: 0.25,
  workflows_unlocked: 0.25,
  reusability: 0.20,
  durability: 0.15,
  downstream_enablement: 0.15,
} as const;

// ---------------------------------------------------------------------------
// Default scenario parameters (expected)
// ---------------------------------------------------------------------------
export const SCENARIO_CONSERVATIVE: ScenarioParams = {
  automation_coverage: 0.25,
  adoption: 0.60,
  error_reduction: 0.30,
  cycle_time_reduction: 0.10,
  conversion_delta: 0,
};

export const SCENARIO_EXPECTED: ScenarioParams = {
  automation_coverage: 0.45,
  adoption: 0.80,
  error_reduction: 0.50,
  cycle_time_reduction: 0.20,
  conversion_delta: 0.03,
};

export const SCENARIO_AGGRESSIVE: ScenarioParams = {
  automation_coverage: 0.65,
  adoption: 0.90,
  error_reduction: 0.70,
  cycle_time_reduction: 0.35,
  conversion_delta: 0.06,
};

// ---------------------------------------------------------------------------
// Effort system weights (6 drivers)
// ---------------------------------------------------------------------------
export const EFFORT_WEIGHTS = {
  integrations_count_severity: 0.25,
  integration_complexity_severity: 0.20,
  data_readiness_severity: 0.20,
  exception_rate_severity: 0.15,
  security_constraints_severity: 0.10,
  change_mgmt_severity: 0.10,
} as const;

export const EFFORT_INDEX_BOUNDS = { min: 1.0, max: 3.0 } as const;
export const DEFAULT_EFFORT_INDEX = 2.0;

// ---------------------------------------------------------------------------
// Service pricing
// ---------------------------------------------------------------------------

// Agentic systems create compoundly more leverage than rule-based automation.
// Matches the legacy AGENTIC_MULTIPLIER from calculations.ts.
export const AGENTIC_VALUE_MULTIPLIER = 2.1107;

export const PRICING_BASE_MONTHS = {
  automation: 2.8,
  agentic_intelligent_ai: 3.8,
} as const;

export const PRICING_CAP_MONTHS = {
  automation: 5,
  agentic_intelligent_ai: 7,
} as const;

/** Price floors keyed by effort index thresholds (lower bound inclusive). */
export const PRICING_FLOORS: [number, number][] = [
  [1.0, 5_000],
  [1.5, 12_500],
  [2.5, 35_000],
  [3.5, 75_000],
  [5.0, 150_000],
];

// ---------------------------------------------------------------------------
// Absolute minimum build costs by solution category.
// These represent real-world minimum build costs regardless of value created.
// When value doesn't justify the minimum, ROI will simply be negative — honest.
// ---------------------------------------------------------------------------
export const ABSOLUTE_PRICE_FLOORS: Record<string, Record<string, number>> = {
  automation: {
    light:    3_000,   // simple Zapier/Make workflow
    workflow: 8_000,   // custom multi-step automation
    agentic:  15_000,  // automation with AI components
  },
  agentic_intelligent_ai: {
    light:    10_000,  // AI-assisted single task
    workflow: 20_000,  // AI-powered workflow
    agentic:  35_000,  // full agentic system
  },
};

// ---------------------------------------------------------------------------
// Redeploy cap
// ---------------------------------------------------------------------------
export const REDEPLOY_FACTOR_CAP_NO_PLAN = 0.3;

// ---------------------------------------------------------------------------
// Confidence multiplier tiers (not primary for pricing, but referenced)
// ---------------------------------------------------------------------------
export const CONFIDENCE_MULTIPLIER_TIERS: [number, number][] = [
  [90, 1.00],
  [70, 0.90],
  [50, 0.75],
  [30, 0.60],
  [0, 0.50],
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** VM lookup by complexity label — used by the UI when complexity selector changes. */
export function getVMByComplexity(complexity: string): number {
  return VM_BY_COMPLEXITY[complexity as keyof typeof VM_BY_COMPLEXITY] ?? 1.35;
}
