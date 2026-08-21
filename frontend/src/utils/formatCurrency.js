/**
 * Global Currency Formatter for PromoAlign
 * Supports INR (₹), USD ($), EUR (€), GBP (£).
 */
export function formatCurrency(amount, currency = 'INR') {
  const numeric = Number(amount) || 0;

  switch (currency) {
    case 'USD':
      return '$' + Math.round(numeric).toLocaleString('en-US');
    case 'EUR':
      return '€' + Math.round(numeric).toLocaleString('de-DE');
    case 'GBP':
      return '£' + Math.round(numeric).toLocaleString('en-GB');
    case 'INR':
    default:
      return '₹' + Math.round(numeric).toLocaleString('en-IN');
  }
}

export function formatRupees(amount) {
  return formatCurrency(amount, 'INR');
}

export function formatRupeesDecimals(amount) {
  const numeric = Number(amount) || 0;
  return '₹' + numeric.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
