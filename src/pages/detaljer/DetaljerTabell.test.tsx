import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { OppdragsDetaljerDTO } from "../../types/OppdragsDetaljerDTO";
import DetaljerTabell from "./DetaljerTabell";

const mockOppdragsDetaljer: OppdragsDetaljerDTO = {
	oppdragsLinjeList: [
		{
			oppdragsLinje: {
				attestert: false,
				datoVedtakFom: "2024-01-01",
				datoVedtakTom: "2024-01-31",
				delytelseId: "1",
				kodeKlasse: "TEST1",
				linjeId: 1,
				oppdragsId: 12345,
				sats: 1000.0,
				typeSats: "ENG",
				hovedkontonr: "123",
				underkontonr: "456",
			},
			attestasjonList: [],
		},
		{
			oppdragsLinje: {
				attestert: false,
				datoVedtakFom: "2024-02-01",
				datoVedtakTom: "2024-02-28",
				delytelseId: "2",
				kodeKlasse: "TEST2",
				linjeId: 2,
				oppdragsId: 12345,
				sats: 2000.0,
				typeSats: "ENG",
				hovedkontonr: "123",
				underkontonr: "456",
			},
			attestasjonList: [
				{
					attestantId: "A111111",
					datoUgyldigFom: "9999-12-31",
				},
			],
		},
		{
			oppdragsLinje: {
				attestert: false,
				datoVedtakFom: "2024-03-01",
				datoVedtakTom: "2024-03-31",
				delytelseId: "3",
				kodeKlasse: "TEST3",
				linjeId: 3,
				oppdragsId: 12345,
				sats: 3000.0,
				typeSats: "ENG",
				hovedkontonr: "123",
				underkontonr: "456",
			},
			attestasjonList: [],
		},
	],
	saksbehandlerIdent: "B222222",
};

describe("DetaljerTabell - Attester alle checkbox", () => {
	it("should only include unattested lines when 'Attester alle' is checked", async () => {
		const user = userEvent.setup();
		const handleSubmit = vi.fn();

		render(
			<DetaljerTabell
				antallAttestanter={1}
				oppdragsDetaljer={mockOppdragsDetaljer}
				handleSubmit={handleSubmit}
				isLoading={false}
				disable={false}
			/>,
		);

		const allCheckboxes = screen.getAllByRole("checkbox", {
			name: /attester/i,
		});

		// vi skal ha tak i den andre checkboxen; "Attester alle"
		const attesterAlleCheckbox = allCheckboxes[1];
		await user.click(attesterAlleCheckbox);

		const oppdaterButton = screen.getByRole("button", { name: /oppdater/i });
		await user.click(oppdaterButton);

		await waitFor(() => {
			expect(handleSubmit).toHaveBeenCalledTimes(1);
		});

		const submittedLinjer = handleSubmit.mock.calls[0][0];

		const attesterLines = submittedLinjer.filter(
			(linje: { linjeId: number; properties: { attester: boolean } }) =>
				linje.properties.attester,
		);
		expect(attesterLines).toHaveLength(2);
		expect(attesterLines[0].linjeId).toBe(1);
		expect(attesterLines[1].linjeId).toBe(3);

		const line2 = submittedLinjer.find(
			(linje: { linjeId: number; properties: { attester: boolean } }) =>
				linje.linjeId === 2,
		);
		expect(line2.properties.attester).toBeFalsy();
	});

	it("should only include attested lines when 'Avattester alle' is checked", async () => {
		const user = userEvent.setup();
		const handleSubmit = vi.fn();

		render(
			<DetaljerTabell
				antallAttestanter={1}
				oppdragsDetaljer={mockOppdragsDetaljer}
				handleSubmit={handleSubmit}
				isLoading={false}
				disable={false}
			/>,
		);

		const allCheckboxes = screen.getAllByRole("checkbox", {
			name: /attester/i,
		});

		// vi skal ha tak i den første checkboxen; "Avattester alle"
		const avattesterAlleCheckbox = allCheckboxes[0];
		await user.click(avattesterAlleCheckbox);

		const oppdaterButton = screen.getByRole("button", { name: /oppdater/i });
		await user.click(oppdaterButton);

		await waitFor(() => {
			expect(handleSubmit).toHaveBeenCalledTimes(1);
		});

		const submittedLinjer = handleSubmit.mock.calls[0][0];

		// kun linje 2 som er attestert skal settes til fjern: true
		const fjernLines = submittedLinjer.filter(
			(linje: { linjeId: number; properties: { fjern: boolean } }) =>
				linje.properties.fjern,
		);
		expect(fjernLines).toHaveLength(1);
		expect(fjernLines[0].linjeId).toBe(2);

		// linje 1 og 3 (uten attestant) skal ikke ha fjern: true
		const line1 = submittedLinjer.find(
			(linje: { linjeId: number }) => linje.linjeId === 1,
		);
		const line3 = submittedLinjer.find(
			(linje: { linjeId: number }) => linje.linjeId === 3,
		);
		expect(line1.properties.fjern).toBeFalsy();
		expect(line3.properties.fjern).toBeFalsy();
	});

	it("should not affect already attested line when checking individual unattested line", async () => {
		const user = userEvent.setup();
		const handleSubmit = vi.fn();

		render(
			<DetaljerTabell
				antallAttestanter={1}
				oppdragsDetaljer={mockOppdragsDetaljer}
				handleSubmit={handleSubmit}
				isLoading={false}
				disable={false}
			/>,
		);

		const allCheckboxes = screen.getAllByRole("checkbox", {
			name: /attester/i,
		});

		// linje 1
		await user.click(allCheckboxes[2]);

		const oppdaterButton = screen.getByRole("button", { name: /oppdater/i });
		await user.click(oppdaterButton);

		await waitFor(() => {
			expect(handleSubmit).toHaveBeenCalledTimes(1);
		});

		const submittedLinjer = handleSubmit.mock.calls[0][0];

		// bare linje 1 skal ha attester: true
		const attesterLines = submittedLinjer.filter(
			(linje: { properties: { attester: boolean } }) =>
				linje.properties.attester,
		);
		expect(attesterLines).toHaveLength(1);
		expect(attesterLines[0].linjeId).toBe(1);
	});

	it("should toggle off when clicking 'Attester alle' twice", async () => {
		const user = userEvent.setup();
		const handleSubmit = vi.fn();

		render(
			<DetaljerTabell
				antallAttestanter={1}
				oppdragsDetaljer={mockOppdragsDetaljer}
				handleSubmit={handleSubmit}
				isLoading={false}
				disable={false}
			/>,
		);

		const allCheckboxes = screen.getAllByRole("checkbox", {
			name: /attester/i,
		});

		const attesterAlleCheckbox = allCheckboxes[1];

		await user.click(attesterAlleCheckbox);
		await user.click(attesterAlleCheckbox);

		const oppdaterButton = screen.getByRole("button", { name: /oppdater/i });
		await user.click(oppdaterButton);

		await waitFor(() => {
			expect(handleSubmit).toHaveBeenCalledTimes(1);
		});

		const submittedLinjer = handleSubmit.mock.calls[0][0];

		const attesterLines = submittedLinjer.filter(
			(linje: { properties: { attester: boolean } }) =>
				linje.properties.attester,
		);
		expect(attesterLines).toHaveLength(0);
	});
});
