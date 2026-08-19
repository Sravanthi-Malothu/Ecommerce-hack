/**
 * Global Indian Rupee (₹ / INR) Currency Formatter
 */
export function formatRupees(amount) {
  const numeric = Number(amount) || 0;
  return '₹' + Math.round(numeric).toLocaleString('en-IN');
}

export function formatRupeesDecimals(amount) {
  const numeric = Number(amount) || 0;
  return '₹' + numeric.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
