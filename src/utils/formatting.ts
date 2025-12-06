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
    const days = Math.ceil(months * 30);
    return days < 1 ? '< 1 day' : `Approximately ${days} day${days > 1 ? 's' : ''}`;
  }

  const roundedMonths = Math.round(months);

  if (roundedMonths === 3) {
    return 'Approximately 1 quarter';
  }

  if (roundedMonths >= 1 && roundedMonths <= 2) {
    return `Approximately ${roundedMonths} month${roundedMonths > 1 ? 's' : ''} (1 quarter)`;
  }

  if (roundedMonths === 6) {
    return 'Approximately 2 quarters';
  }

  if (roundedMonths >= 4 && roundedMonths <= 5) {
    return `Approximately ${roundedMonths} months (2 quarters)`;
  }

  if (roundedMonths === 9) {
    return 'Approximately 3 quarters';
  }

  if (roundedMonths >= 7 && roundedMonths <= 8) {
    return `Approximately ${roundedMonths} months (3 quarters)`;
  }

  if (roundedMonths === 12) {
    return 'Approximately 1 year';
  }

  if (roundedMonths >= 10 && roundedMonths <= 11) {
    return `Approximately ${roundedMonths} months (4 quarters)`;
  }

  if (roundedMonths >= 13 && roundedMonths <= 24) {
    const quarters = Math.round(roundedMonths / 3);
    if (roundedMonths % 3 === 0) {
      const years = roundedMonths / 12;
      if (years === Math.floor(years)) {
        return `Approximately ${Math.floor(years)} year${years > 1 ? 's' : ''}`;
      }
      return `Approximately ${quarters} quarters`;
    }
    return `Approximately ${roundedMonths} months (${quarters} quarters)`;
  }

  if (roundedMonths > 24) {
    const years = (roundedMonths / 12).toFixed(1);
    const yearValue = parseFloat(years);
    return `Approximately ${years} year${yearValue !== 1 ? 's' : ''}`;
  }

  return `Approximately ${roundedMonths} months`;
}
