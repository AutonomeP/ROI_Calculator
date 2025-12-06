export function formatCurrency(value: number, decimals: number = 0): string {
  if (!isFinite(value)) return '$0';
  return `$${value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function formatNumber(value: number, decimals: number = 1): string {
  if (!isFinite(value)) return '0';
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatPercent(value: number, decimals: number = 0): string {
  if (!isFinite(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

export function formatTimeToRoi(months: number): string {
  if (!isFinite(months) || months === null || months === undefined) {
    return 'N/A';
  }

  // If < 1 month → "< 1 month"
  if (months < 1) {
    return '< 1 month';
  }

  // If < 1 quarter (< 3 months) → "< 1 quarter"
  if (months < 3) {
    return '< 1 quarter';
  }

  // Else show: "X months (Y quarters)"
  const roundedMonths = Math.round(months);
  const quarters = Math.round(months / 3);

  return `${roundedMonths} months (${quarters} ${quarters === 1 ? 'quarter' : 'quarters'})`;
}
