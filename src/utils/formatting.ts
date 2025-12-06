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
