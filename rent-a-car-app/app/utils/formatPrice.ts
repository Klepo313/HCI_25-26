/**
 * Formats a number as currency with European formatting
 * Example: 1789.66 -> 1.789,66
 * @param price - The price to format
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
