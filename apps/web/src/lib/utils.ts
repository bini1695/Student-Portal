export function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString();
}

export function formatCurrency(n: number) {
  return `$${Number(n).toFixed(2)}`;
}