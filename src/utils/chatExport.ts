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
      <div style="margin-bottom:24px;padding:24px;border:1px solid #e5e7eb;border-radius:16px;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,0.03);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
          <div>
            <h3 style="margin:0;font-size:20px;font-weight:800;color:#000;">${s.inputs.systemName}</h3>
            <p style="margin:6px 0 0;color:#6b7280;font-size:14px;line-height:1.5;">${s.inputs.description}</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:24px;font-weight:900;color:#0052FF;">${formatCurrency(s.servicePrice)}</div>
            <div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Service Price</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">
          <div style="background:#f8fafc;border:1px solid #f1f5f9;border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:18px;font-weight:800;color:#000;">${formatCurrency(s.roiResult.monthly_leveraged_value)}</div>
            <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:4px;">Monthly Value</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #f1f5f9;border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:18px;font-weight:800;color:#0052FF;">${formatCurrency(s.roiResult.year1_net)}</div>
            <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:4px;">Year 1 Net</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #f1f5f9;border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:18px;font-weight:800;color:#000;">${s.roiResult.payback_months.toFixed(1)}mo</div>
            <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:4px;">Payback</div>
          </div>
          <div style="background:#f8fafc;border:1px solid #f1f5f9;border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:18px;font-weight:800;color:#000;">WLS ${s.roiResult.wls_score}</div>
            <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:4px;">Leverage Score</div>
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
<title>Autonome — ROI Report</title>
<style>
  body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:60px;background:#f8fafc;color:#0f172a;line-height:1.5;}
  .container{max-width:900px;margin:0 auto;}
  .header{background:linear-gradient(135deg,#0052FF 0%,#0035A3 100%);color:#fff;padding:48px;border-radius:24px;margin-bottom:40px;box-shadow:0 20px 40px rgba(0,82,255,0.15);}
  .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:48px;}
  .summary-card{background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:28px;text-align:center;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);}
  .summary-card .value{font-size:32px;font-weight:900;color:#0052FF;letter-spacing:-0.02em;}
  .summary-card .label{font-size:12px;font-weight:700;color:#64748b;margin-top:8px;text-transform:uppercase;letter-spacing:0.05em;}
  h2{font-size:24px;font-weight:900;margin-bottom:24px;color:#0f172a;letter-spacing:-0.02em;}
  @media print{body{padding:20px;background:#fff;}.header{box-shadow:none;border:1px solid #eee;}}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-size:11px;color:rgba(255,255,255,0.7);font-weight:800;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:12px;">ROI Analysis Report</div>
        <h1 style="margin:0;font-size:36px;font-weight:900;letter-spacing:-0.03em;">Autonome AI</h1>
        <div style="margin-top:16px;color:rgba(255,255,255,0.8);font-size:16px;font-weight:500;">${result.clientName}</div>
        <div style="margin-top:4px;color:rgba(255,255,255,0.5);font-size:13px;">Generated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
      </div>
      <div style="text-align:right;">
        <div style="background:rgba(255,255,255,0.1);padding:12px 20px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);">
          <div style="font-size:11px;color:rgba(255,255,255,0.6);font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Configuration</div>
          <div style="font-size:15px;font-weight:700;margin-top:4px;">${result.sessionType === 'platform' ? 'Multi-System Platform' : 'Single System'}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:2px;">${result.systems.length} Integrated System${result.systems.length !== 1 ? 's' : ''}</div>
        </div>
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
      <div class="label">Monthly Value Unlocked</div>
    </div>
    <div class="summary-card">
      <div class="value">${formatCurrency(totalYear1Net)}</div>
      <div class="label">Projected Year 1 Net</div>
    </div>
  </div>

  <h2>System Architecture & ROI</h2>
  ${systemRows}

  <div style="margin-top:60px;padding:32px;background:#f1f5f9;border-radius:20px;font-size:13px;color:#64748b;text-align:center;line-height:1.6;">
    <strong>Confidential ROI Analysis</strong><br>
    This report was generated using the Autonome Agentic ROI Engine.<br>
    © ${new Date().getFullYear()} Autonome Partners. All rights reserved.
  </div>
</div>
</body>
</html>`;

  const tab = window.open('', '_blank');
  if (tab) {
    tab.document.write(html);
    tab.document.close();
  }
}
