export const isEmpty = (array: Array<unknown> | undefined | null) =>
  !array || !Array.isArray(array) || !array.length;

export function formatterNorsk(sats: number) {
  return new Intl.NumberFormat("no-NO", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(sats);
}

export function generateNumbers(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}
