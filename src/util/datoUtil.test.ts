import { describe, expect, it, vi } from "vitest";
import {
	dagensDato,
	isDateInThePast,
	isInvalidDateFormat,
	isoDatoTilNorskDato,
	norskDatoTilIsoDato,
} from "./datoUtil";

describe("datoUtil", () => {
	describe("isoDatoTilNorskDato", () => {
		it("konverterer ISO-dato til norsk format", () => {
			expect(isoDatoTilNorskDato("2024-01-15")).toBe("15.01.2024");
			expect(isoDatoTilNorskDato("2024-12-31")).toBe("31.12.2024");
			expect(isoDatoTilNorskDato("2023-07-04")).toBe("04.07.2023");
		});

		it("returnerer tom streng for undefined", () => {
			expect(isoDatoTilNorskDato(undefined)).toBe("");
		});

		it("returnerer tom streng for tom streng", () => {
			expect(isoDatoTilNorskDato("")).toBe("");
		});
	});

	describe("norskDatoTilIsoDato", () => {
		it("konverterer norsk dato til ISO-format", () => {
			expect(norskDatoTilIsoDato("15.01.2024")).toBe("2024-01-15");
			expect(norskDatoTilIsoDato("31.12.2024")).toBe("2024-12-31");
			expect(norskDatoTilIsoDato("04.07.2023")).toBe("2023-07-04");
		});

		it("håndterer undefined input", () => {
			expect(norskDatoTilIsoDato(undefined)).toBe("Invalid Date");
		});
	});

	describe("dagensDato", () => {
		it("returnerer dagens dato i norsk format", () => {
			// Mock dayjs til å returnere en fast dato
			const mockDate = new Date("2024-03-15");
			vi.setSystemTime(mockDate);

			expect(dagensDato()).toBe("15.03.2024");

			vi.useRealTimers();
		});
	});

	describe("isInvalidDateFormat", () => {
		it("validerer gyldig norsk datoformat", () => {
			expect(isInvalidDateFormat("15.01.2024")).toBe(false);
			expect(isInvalidDateFormat("31.12.2024")).toBe(false);
			expect(isInvalidDateFormat("01.01.2023")).toBe(false);
		});

		it("fanger opp ugyldig datoformat", () => {
			expect(isInvalidDateFormat("2024-01-15")).toBe(true); // ISO format
			expect(isInvalidDateFormat("32.01.2024")).toBe(true); // Ugyldig dag
			expect(isInvalidDateFormat("15.13.2024")).toBe(true); // Ugyldig måned
			expect(isInvalidDateFormat("abc")).toBe(true); // Ikke en dato
			expect(isInvalidDateFormat("")).toBe(true); // Tom streng
		});
	});

	describe("isDateInThePast", () => {
		it("returnerer true for datoer i fortiden", () => {
			const mockDate = new Date("2024-03-15");
			vi.setSystemTime(mockDate);

			expect(isDateInThePast("14.03.2024")).toBe(true);
			expect(isDateInThePast("01.01.2024")).toBe(true);
			expect(isDateInThePast("31.12.2023")).toBe(true);

			vi.useRealTimers();
		});

		it("returnerer false for dagens dato", () => {
			const mockDate = new Date("2024-03-15");
			vi.setSystemTime(mockDate);

			expect(isDateInThePast("15.03.2024")).toBe(false);

			vi.useRealTimers();
		});

		it("returnerer false for datoer i fremtiden", () => {
			const mockDate = new Date("2024-03-15");
			vi.setSystemTime(mockDate);

			expect(isDateInThePast("16.03.2024")).toBe(false);
			expect(isDateInThePast("31.12.2024")).toBe(false);
			expect(isDateInThePast("01.01.2025")).toBe(false);

			vi.useRealTimers();
		});
	});
});
