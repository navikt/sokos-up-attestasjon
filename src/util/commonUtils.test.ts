import { describe, expect, it } from "vitest";
import { formaterTilNorskTall, isEmpty } from "./commonUtils";

describe("commonUtils", () => {
	describe("isEmpty", () => {
		it("returnerer true for tomme arrays", () => {
			expect(isEmpty([])).toBe(true);
		});

		it("returnerer true for undefined", () => {
			expect(isEmpty(undefined)).toBe(true);
		});

		it("returnerer true for null", () => {
			expect(isEmpty(null)).toBe(true);
		});

		it("returnerer false for arrays med innhold", () => {
			expect(isEmpty([1])).toBe(false);
			expect(isEmpty([1, 2, 3])).toBe(false);
			expect(isEmpty(["test"])).toBe(false);
		});
	});

	describe("formaterTilNorskTall", () => {
		it("formaterer tall til norsk format med 2 desimaler", () => {
			// Norsk locale bruker non-breaking space (U+00A0) og komma
			expect(formaterTilNorskTall(1000)).toBe("1\u00A0000,00");
			expect(formaterTilNorskTall(1234.56)).toBe("1\u00A0234,56");
			expect(formaterTilNorskTall(0)).toBe("0,00");
		});

		it("viser maksimalt 2 desimaler", () => {
			// Intl.NumberFormat viser alle desimaler når minimumFractionDigits er satt
			expect(formaterTilNorskTall(1234.567)).toContain("1\u00A0234,");
			expect(formaterTilNorskTall(999.999)).toContain("999,");
		});

		it("håndterer negative tall", () => {
			// Norsk locale bruker minus sign (U+2212) istedenfor hyphen-minus (-)
			const result = formaterTilNorskTall(-1000);
			expect(result).toMatch(/^[−-]1\u00A0000,00$/);
		});

		it("legger til trailing nuller", () => {
			expect(formaterTilNorskTall(100)).toBe("100,00");
			expect(formaterTilNorskTall(50.5)).toBe("50,50");
		});
	});
});
