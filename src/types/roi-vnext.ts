/**
 * ROI vNext Type Definitions — Pricing-focused subset of the Autonome Blueprint vNext engine.
 * Mirrors the canonical RoiInputPayload / output shape from compute.ts + constants.ts.
 */

// ---------------------------------------------------------------------------
// Input payload
// ---------------------------------------------------------------------------

export interface RoiBaseline {
  volume: {
    runs_per_month: number;
  };
  time: {
    minutes_per_run: number;
    people_affected: number;
  };
  labor: {
    fully_loaded_rate: number;
    value_rate?: number; // $/hr for redeployed capacity
  };
  quality: {
    defect_rate: number;      // fraction, e.g. 0.05
    cost_per_defect: number;
  };
  hard_savings: {
    annual_cost_removed: number;
  };
  growth: {
    incremental_units_per_year: number;
    margin_per_unit: number;
    conversion_lift: number;        // fraction, user-level override
    value_per_conversion: number;
  };
}

export interface RoiCosts {
  implementation_cost: number;
  run_cost_monthly: number;
  year1_extra_costs: number;
}

export type TimeValueAllocation =
  | 'labor_savings'
  | 'capacity'
  | 'revenue'
  | 'split';

export interface RoiAllocation {
  time_value_allocation: TimeValueAllocation;
  split?: {
    labor_savings_pct: number;
    capacity_pct: number;
    revenue_pct: number;
  };
}

export interface RoiAssumptions {
  redeploy_factor?: number;
  redeploy_requires_plan?: boolean;
  is_platform_initiative?: boolean;
  delay_loss?: {
    annual_revenue_at_risk: number;
    recovery_rate: number;
  };
}

export interface RoiMultipliers {
  vm: number | 'auto';            // override or compute from cycle_time_reduction
  wls: number | 'auto';           // override (1–5) or compute from rubric
  cycle_time_reduction?: number;  // fraction, used to derive VM when vm='auto'
}

export interface WlsRubric {
  teams_impacted: number;          // 1–5
  workflows_unlocked: number;      // 1–5
  reusability: number;             // 1–5
  durability: number;              // 1–5
  downstream_enablement: number;   // 1–5
}

export interface RoiInputPayload {
  baseline: RoiBaseline;
  costs: RoiCosts;
  allocation: RoiAllocation;
  assumptions: RoiAssumptions;
  multipliers: RoiMultipliers;
  wls_rubric?: WlsRubric;
  adoption: number;               // 0–1, expected adoption rate (default 0.80)
  automation_coverage: number;    // 0–1, expected automation coverage (default 0.45)
  error_reduction: number;        // 0–1, expected error reduction rate (default 0.50)
  solution_mode: 'automation' | 'agentic_intelligent_ai';
  automation_depth: string;          // light, workflow, agentic — feeds pricing floors
  effort?: EffortDrivers;
  effort_index?: number;            // direct override 1.0–3.0
}

// ---------------------------------------------------------------------------
// Scenario presets (for reference / optional use)
// ---------------------------------------------------------------------------

export interface ScenarioParams {
  automation_coverage: number;
  adoption: number;
  error_reduction: number;
  cycle_time_reduction: number;
  conversion_delta: number;
}

// ---------------------------------------------------------------------------
// Output shape — 6-bucket breakdown + pricing
// ---------------------------------------------------------------------------

export interface RoiBuckets {
  labor_savings: number;           // LS
  error_reduction: number;         // ER
  hard_cost_savings: number;       // HS
  throughput_gains: number;        // TG
  revenue_generated: number;       // RG
  opportunity_redeploy: number;    // OC
}

export interface RoiComputedResult {
  model_version: string;

  // Intermediate values
  runs_per_year: number;
  hours_saved_per_year: number;
  realized_hours_saved: number;
  time_value: number;
  fully_loaded_rate: number;

  // 6 buckets
  buckets: RoiBuckets;

  // Aggregates
  direct_savings: number;          // LS + ER + HS
  growth_value: number;            // TG + RG + OC

  // Multipliers applied
  velocity_multiplier: number;
  wls_score: number;
  wls_multiplier: number;

  // Compounded
  compounded_value: number;        // (direct + growth * VM) * WLS

  // Cost structure
  run_cost_annual: number;
  total_cost: number;              // implementation_cost + run_cost_annual

  // Net ROI (for justification display)
  net_annual: number;
  year1_net: number;
  roi_pct_y1: number;
  monthly_net: number;
  payback_months: number;

  // Service pricing
  service_price: number;           // computed implementation cost
  monthly_leveraged_value: number; // compounded / 12

  // Allocation breakdown (how time value was distributed)
  allocation_applied: {
    labor_pct: number;
    capacity_pct: number;
    revenue_pct: number;
  };

  // Effort & priority
  effort: EffortResult;
  priority: PriorityResult;
}

// ---------------------------------------------------------------------------
// Effort system — feeds into pricing and priority
// ---------------------------------------------------------------------------

export type EffortSeverity = number; // 0–100 per driver

export interface EffortDrivers {
  integrations_count_severity: number;
  integration_complexity_severity: number;
  data_readiness_severity: number;
  exception_rate_severity: number;
  security_constraints_severity: number;
  change_mgmt_severity: number;
}

export interface EffortResult {
  index: number;   // 1.0–3.0
  score: number;   // 0–100
}

// ---------------------------------------------------------------------------
// Priority scoring
// ---------------------------------------------------------------------------

export interface PriorityResult {
  score: number;
  penalized: boolean;
  boosted: boolean;
}

// ---------------------------------------------------------------------------
// Context resolver — precedence chain for default values
// ---------------------------------------------------------------------------

export interface ContextDefaults {
  salary?: number;
  overhead_pct?: number;
  minutes_per_run?: number;
  runs_per_year?: number;
  defect_rate?: number;
  cost_per_defect?: number;
  velocity_multiplier?: number;
  weighted_leverage_score?: number;
}

// ---------------------------------------------------------------------------
// Fully loaded rate helper input
// ---------------------------------------------------------------------------

export interface FullyLoadedRateInput {
  salary: number;
  overhead_pct: number;            // e.g. 25 for 25%
}
