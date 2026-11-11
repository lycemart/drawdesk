export function formatGBP(pence: number, decimals = 2): string {
  const value = pence / 100;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatGBPCompact(pence: number): string {
  const pounds = Math.round(pence / 100);
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(pounds);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatSignedGBP(pence: number): string {
  const sign = pence > 0 ? "+" : pence < 0 ? "−" : "";
  return `${sign}${formatGBP(Math.abs(pence))}`;
}

export function poundsToPence(value: number): number {
  return Math.round(value * 100);
}
