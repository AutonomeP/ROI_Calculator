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

  if (months < 1) {
    return '< 1 month';
  }

  const roundedMonths = Math.round(months);

  if (roundedMonths >= 1 && roundedMonths <= 3) {
    return `approximately 1 quarter (~${roundedMonths} month${roundedMonths > 1 ? 's' : ''})`;
  }

  if (roundedMonths > 3 && roundedMonths <= 6) {
    return `approximately 2 quarters (~${roundedMonths} months)`;
  }

  if (roundedMonths > 24) {
    const years = (roundedMonths / 12).toFixed(1);
    return `approximately ${years} years`;
  }

  return `approximately ${roundedMonths} months`;
}
