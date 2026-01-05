export const isEmpty = (array: Array<unknown> | undefined | null) =>
	!array || !Array.isArray(array) || !array.length;

export function formaterTilNorskTall(sats: number) {
	return new Intl.NumberFormat("no-NO", {
		style: "decimal",
		minimumFractionDigits: 2,
	}).format(sats);
}
