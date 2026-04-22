/**
 * Effort system — 6 drivers → weighted score → effort index (1.0–3.0).
 *
 * Spec formula:
 *   effortScore = sum(driver_severity * weight)
 *   effort.index = 1 + (effortScore / 100) * 2
 */

import type { EffortDrivers, EffortResult } from '../types/roi-vnext';
import { EFFORT_WEIGHTS, EFFORT_INDEX_BOUNDS, clamp } from './constants';

export function calculateEffort(drivers: EffortDrivers): EffortResult {
  const score =
    drivers.integrations_count_severity * EFFORT_WEIGHTS.integrations_count_severity +
    drivers.integration_complexity_severity * EFFORT_WEIGHTS.integration_complexity_severity +
    drivers.data_readiness_severity * EFFORT_WEIGHTS.data_readiness_severity +
    drivers.exception_rate_severity * EFFORT_WEIGHTS.exception_rate_severity +
    drivers.security_constraints_severity * EFFORT_WEIGHTS.security_constraints_severity +
    drivers.change_mgmt_severity * EFFORT_WEIGHTS.change_mgmt_severity;

  const effortScore = clamp(Math.round(score), 0, 100);
  const index = clamp(
    1 + (effortScore / 100) * 2,
    EFFORT_INDEX_BOUNDS.min,
    EFFORT_INDEX_BOUNDS.max,
  );

  return { index, score: effortScore };
}

/**
 * Derive effort index from a raw effort score (0–100).
 */
export function effortIndexFromScore(effortScore: number): number {
  return clamp(
    1 + (effortScore / 100) * 2,
    EFFORT_INDEX_BOUNDS.min,
    EFFORT_INDEX_BOUNDS.max,
  );
}

/**
 * Derive effort score from an effort index (1.0–3.0).
 */
export function effortScoreFromIndex(effortIndex: number): number {
  return clamp(Math.round((effortIndex - 1) / 2 * 100), 0, 100);
}
