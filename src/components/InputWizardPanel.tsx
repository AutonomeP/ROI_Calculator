import { useState } from 'react';
import { ROIInputs, ROIInputStrings, ROICalculations, Complexity, AutomationDepth, ErrorReductionPreset } from '../types/roi';
import FormSection from './FormSection';
import FormInput from './FormInput';
import ComplexitySelector from './ComplexitySelector';
import AutomationDepthSelector from './AutomationDepthSelector';
import LeverageSlider from './LeverageSlider';
import CollapsibleInput from './CollapsibleInput';
import ErrorReductionSelector from './ErrorReductionSelector';
import { formatCurrency } from '../utils/formatting';
import { useTheme } from '../contexts/ThemeContext';

interface InputWizardPanelProps {
  inputs: ROIInputs;
  inputStrings: ROIInputStrings;
  calculations: ROICalculations;
  onChange: (field: keyof ROIInputs, value: string | number) => void;
  onErrorReductionPresetChange: (preset: ErrorReductionPreset) => void;
}

export default function InputWizardPanel({ inputs, inputStrings, calculations, onChange, onErrorReductionPresetChange }: InputWizardPanelProps) {
  const { theme } = useTheme();
  const [platformCostOverrideEnabled, setPlatformCostOverrideEnabled] = useState(false);

  const handleChange = (field: keyof ROIInputs) => (value: string) => {
    onChange(field, value);
  };

  const handleComplexityChange = (value: Complexity) => {
    onChange('complexity', value);
  };

  const handleAutomationDepthChange = (value: AutomationDepth) => {
    onChange('automationDepth', value);
  };

  const hasUserEnteredPlatformCost = inputStrings.platformCost && parseFloat(inputStrings.platformCost) > 0;

  const platformCostHelperText = hasUserEnteredPlatformCost
    ? `Your price: ${formatCurrency(calculations.platformAnnual, 2)} total (${formatCurrency(calculations.platformMonthly, 2)}/month over 12 months). Suggested: ${formatCurrency(calculations.suggestedPlatformAnnual, 2)} total`
    : `Suggested: ${formatCurrency(calculations.suggestedPlatformAnnual, 2)} total (${formatCurrency(calculations.suggestedPlatformMonthly, 2)}/month over 12 months)`;

  const revenueGeneratedHelperText = `Suggested: ${formatCurrency(calculations.suggestedRG, 2)}/month (10% of direct savings)`;
  const opportunityValueHelperText = `Suggested: ${formatCurrency(calculations.suggestedOC, 2)}/month (15% of direct savings)`;

  return (
    <div className="space-y-6">
      <FormSection
        title="Process Basics"
        helperText="Identify the process and how often it runs"
      >
        <FormInput
          label="Process Name"
          type="text"
          value={inputs.processName}
          onChange={handleChange('processName')}
          placeholder="e.g., Invoice Processing"
        />
        <FormInput
          label="Runs per Month"
          type="number"
          value={inputStrings.runsPerMonth}
          onChange={handleChange('runsPerMonth')}
          placeholder="e.g., 20"
        />
      </FormSection>

      <FormSection
        title="Time & Cost"
        helperText="Measure current time and savings potential"
      >
        <FormInput
          label="Current Time per Run (minutes)"
          type="number"
          value={inputStrings.tOldMinutes}
          onChange={handleChange('tOldMinutes')}
          placeholder="e.g., 30"
        />
        <AutomationDepthSelector
          value={inputs.automationDepth}
          onChange={handleAutomationDepthChange}
        />
        <ComplexitySelector
          value={inputs.complexity}
          onChange={handleComplexityChange}
        />
        <FormInput
          label="Hourly Rate ($/hr)"
          type="number"
          value={inputStrings.hourlyRate}
          onChange={handleChange('hourlyRate')}
          placeholder="e.g., 50"
          helperText="Average cost per hour of people doing this work"
        />
      </FormSection>

      <FormSection
        title="Leverage & Cost"
        helperText="Impact multipliers and platform investment"
      >
        <LeverageSlider
          value={inputStrings.wls}
          onChange={handleChange('wls')}
        />
        <div className="mb-5">
          <label className={`block text-xs uppercase tracking-widest font-semibold mb-3 ${
            'text-gray-400'
          }`}>
            Velocity Multiplier (VM)
          </label>
          <div className="p-4">
            <div className="text-3xl font-black text-roi-orange mb-2">
              {calculations.vm.toFixed(2)}×
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Auto-calculated based on complexity: Simple (1.20×), Moderate (1.35×), Complex (1.50×)
            </p>
          </div>
        </div>
        <CollapsibleInput
          label="Platform Build Cost"
          defaultCollapsed={true}
        >
          {!platformCostOverrideEnabled ? (
            <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-white/10 bg-black/20' : 'border-black/10 bg-white/40'}`}>
              <div className={`text-2xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-roi-text-primary'}`}>
                {formatCurrency(calculations.suggestedPlatformAnnual)}
              </div>
              <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
                Suggested one-time build cost ({formatCurrency(calculations.suggestedPlatformMonthly, 2)}/month over 12 months)
              </p>
              <button
                type="button"
                onClick={() => setPlatformCostOverrideEnabled(true)}
                className="text-xs text-roi-orange hover:underline font-semibold"
              >
                Override build cost →
              </button>
            </div>
          ) : (
            <FormInput
              label="Platform Cost (one-time total)"
              type="number"
              value={inputStrings.platformCost}
              onChange={handleChange('platformCost')}
              placeholder="Enter custom build cost"
              helperText={platformCostHelperText}
            />
          )}
        </CollapsibleInput>
        <CollapsibleInput
          label="Operating Costs (OPEX)"
          defaultCollapsed={false}
        >
          <FormInput
            label="Monthly Run Cost ($/month)"
            type="number"
            value={inputStrings.monthlyRunCost}
            onChange={handleChange('monthlyRunCost')}
            placeholder="e.g., 50"
            helperText="LLM API costs, hosting, and ongoing maintenance expenses"
          />
        </CollapsibleInput>
      </FormSection>

      <FormSection
        title="Direct Savings"
        helperText="Calculate savings from reduced errors, time saved, and eliminated costs"
        collapsible={true}
        defaultCollapsed={false}
      >
        <CollapsibleInput
          label="Savings from tools / contractors (optional)"
          defaultCollapsed={true}
        >
          <FormInput
            label="Monthly savings from tools/contractors"
            type="number"
            value={inputStrings.toolSavings}
            onChange={handleChange('toolSavings')}
            placeholder="e.g., 200"
            helperText="Licenses, agencies, or services you can reduce or remove"
          />
        </CollapsibleInput>
        <FormInput
          label="Baseline monthly error cost ($/month)"
          type="number"
          value={inputStrings.baselineErrorCostMonthly}
          onChange={handleChange('baselineErrorCostMonthly')}
          placeholder="e.g., 500"
          helperText="Current monthly cost of mistakes and rework before automation"
        />
        <ErrorReductionSelector
          value={inputs.errorReductionPreset}
          onChange={onErrorReductionPresetChange}
        />
      </FormSection>

      <FormSection
        title="Revenue & Opportunity"
        helperText="Value created by automation capabilities (optional - leave blank for auto-calculated suggestions)"
        collapsible={true}
        defaultCollapsed={true}
      >
        <FormInput
          label="Extra Revenue from Automation ($/month)"
          type="number"
          value={inputStrings.revenueGenerated}
          onChange={handleChange('revenueGenerated')}
          placeholder="Optional - leave blank for suggestion"
          helperText={revenueGeneratedHelperText}
        />
        <FormInput
          label="Value of New Capacity/Capability ($/month)"
          type="number"
          value={inputStrings.opportunityValue}
          onChange={handleChange('opportunityValue')}
          placeholder="Optional - leave blank for suggestion"
          helperText={opportunityValueHelperText}
        />
      </FormSection>
    </div>
  );
}
