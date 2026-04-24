import { formatCurrency } from './formatting';
import type { SessionResult } from '../types/chat';

function download(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCSV(result: SessionResult): void {
  const headers = [
    'System',
    'Solution Mode',
    'Automation Depth',
    'WLS',
    'Monthly Leveraged Value',
    'Service Price',
    'Year 1 Net',
    'Payback (months)',
    'Direct Savings (annual)',
    'Growth Value (annual)',
  ];

  const rows = result.systems.map((s) => [
    s.inputs.systemName,
    s.inputs.solutionMode,
    s.inputs.automationDepth,
    s.inputs.wls,
    s.roiResult.monthly_leveraged_value.toFixed(2),
    s.servicePrice,
    s.roiResult.year1_net.toFixed(2),
    s.roiResult.payback_months.toFixed(1),
    s.roiResult.direct_savings.toFixed(2),
    s.roiResult.growth_value.toFixed(2),
  ]);

  const csv = [headers, ...rows].map((row) => row.map(String).join(',')).join('\n');
  download(`autonome-roi-${Date.now()}.csv`, csv, 'text/csv');
}

export function exportJSON(result: SessionResult): void {
  const data = {
    clientName: result.clientName,
    sessionType: result.sessionType,
    generatedAt: new Date().toISOString(),
    systems: result.systems.map((s) => ({
      inputs: s.inputs,
      servicePrice: s.servicePrice,
      roiSummary: {
        monthlyLeveragedValue: s.roiResult.monthly_leveraged_value,
        year1Net: s.roiResult.year1_net,
        paybackMonths: s.roiResult.payback_months,
        directSavings: s.roiResult.direct_savings,
        growthValue: s.roiResult.growth_value,
        compoundedValue: s.roiResult.compounded_value,
        wlsScore: s.roiResult.wls_score,
        wlsMultiplier: s.roiResult.wls_multiplier,
        velocityMultiplier: s.roiResult.velocity_multiplier,
      },
    })),
  };
  download(`autonome-roi-${Date.now()}.json`, JSON.stringify(data, null, 2), 'application/json');
}

export function exportHTMLReport(result: SessionResult): void {
  const totalServicePrice = result.systems.reduce((sum, s) => sum + s.servicePrice, 0);
  const totalMonthlyValue = result.systems.reduce((sum, s) => sum + s.roiResult.monthly_leveraged_value, 0);
  const totalYear1Net = result.systems.reduce((sum, s) => sum + s.roiResult.year1_net, 0);

  const systemRows = result.systems
    .map(
      (s) => `
      <div style="margin-bottom:24px;padding:20px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
          <div>
            <h3 style="margin:0;font-size:18px;font-weight:700;color:#111;">${s.inputs.systemName}</h3>
            <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">${s.inputs.description}</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:24px;font-weight:800;color:#f97316;">${formatCurrency(s.servicePrice)}</div>
            <div style="font-size:12px;color:#6b7280;">Service Price</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
          <div style="background:#f9fafb;border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:16px;font-weight:700;color:#111;">${formatCurrency(s.roiResult.monthly_leveraged_value)}</div>
            <div style="font-size:11px;color:#6b7280;">Monthly Value</div>
          </div>
          <div style="background:#f9fafb;border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:16px;font-weight:700;color:#111;">${formatCurrency(s.roiResult.year1_net)}</div>
            <div style="font-size:11px;color:#6b7280;">Year 1 Net</div>
          </div>
          <div style="background:#f9fafb;border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:16px;font-weight:700;color:#111;">${s.roiResult.payback_months.toFixed(1)}mo</div>
            <div style="font-size:11px;color:#6b7280;">Payback</div>
          </div>
          <div style="background:#f9fafb;border-radius:8px;padding:12px;text-align:center;">
            <div style="font-size:16px;font-weight:700;color:#111;">WLS ${s.roiResult.wls_score}</div>
            <div style="font-size:11px;color:#6b7280;">Leverage Score</div>
          </div>
        </div>
      </div>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Autonome AI — ROI Report</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:40px;background:#f9fafb;color:#111;}
  .header{background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;padding:32px;border-radius:16px;margin-bottom:32px;}
  .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px;}
  .summary-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;text-align:center;}
  .summary-card .value{font-size:28px;font-weight:800;color:#f97316;}
  .summary-card .label{font-size:13px;color:#6b7280;margin-top:4px;}
  @media print{body{padding:20px;}}
</style>
</head>
<body>
<div class="header">
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <div>
      <div style="font-size:12px;color:#f97316;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Autonome AI</div>
      <h1 style="margin:8px 0 4px;font-size:28px;font-weight:800;">ROI Analysis Report</h1>
      <div style="color:#9ca3af;font-size:14px;">${result.clientName} · ${new Date().toLocaleDateString()}</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:12px;color:#9ca3af;">${result.systems.length} System${result.systems.length !== 1 ? 's' : ''}</div>
      <div style="font-size:12px;color:#9ca3af;margin-top:4px;">${result.sessionType === 'platform' ? 'Platform Package' : 'Single System'}</div>
    </div>
  </div>
</div>

<div class="summary">
  <div class="summary-card">
    <div class="value">${formatCurrency(totalServicePrice)}</div>
    <div class="label">Total Investment</div>
  </div>
  <div class="summary-card">
    <div class="value">${formatCurrency(totalMonthlyValue)}</div>
    <div class="label">Monthly Value</div>
  </div>
  <div class="summary-card">
    <div class="value">${formatCurrency(totalYear1Net)}</div>
    <div class="label">Year 1 Net ROI</div>
  </div>
</div>

<h2 style="font-size:18px;font-weight:700;margin-bottom:16px;">System Breakdown</h2>
${systemRows}

<div style="margin-top:32px;padding:16px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center;">
  Generated by Autonome AI ROI Calculator · ${new Date().toISOString()}
</div>
</body>
</html>`;

  const tab = window.open('', '_blank');
  if (tab) {
    tab.document.write(html);
    tab.document.close();
  }
}
