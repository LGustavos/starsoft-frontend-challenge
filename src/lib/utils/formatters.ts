export function formatPrice(price: number | string, decimals = 2): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numericPrice.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
