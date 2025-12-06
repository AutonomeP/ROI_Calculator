import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { ROIInputs, ROICalculations } from '../types/roi';

export async function logRoiSession(
  session: Session | null,
  inputs: ROIInputs,
  calculations: ROICalculations
): Promise<void> {
  if (!session?.user) return;

  try {
    const sanitizedInput = {
      processName: inputs.processName,
      complexity: inputs.complexity,
      solutionMode: inputs.solutionMode,
      tOldMinutes: inputs.tOldMinutes,
      runsPerMonth: inputs.runsPerMonth,
      wls: inputs.wls,
      velocityMultiplier: inputs.velocityMultiplier,
      percentAutomated: inputs.percentAutomated,
    };

    const { error } = await supabase.from('roi_sessions').insert({
      user_id: session.user.id,
      mode: inputs.solutionMode,
      raw_input: sanitizedInput,
      roi_quarter: calculations.roiQuarterNet,
      roi_year: calculations.roi1yNet,
    });

    if (error) {
      console.error('Error logging ROI session:', error);
    }
  } catch (err) {
    console.error('Unexpected error logging session:', err);
  }
}
