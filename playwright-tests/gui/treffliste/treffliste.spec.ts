import { expect, type Page, test } from "@playwright/test";
import type { OppdragsDetaljerDTO } from "../../../src/types/OppdragsDetaljerDTO";
import oppdragsDetaljerDto from "../../stubs/oppdragsdetaljer";
import aTrefflisteAppState from "./aTrefflisteAppState";

async function setStore(page: Page) {
	await page.context().addInitScript((appState) => {
		window.sessionStorage.setItem("app-state", JSON.stringify(appState));
	}, aTrefflisteAppState);
}

// TrefflistePage henter trefflisten på nytt fra backend ved mount/refresh,
// så vi må mocke /sok med samme data som er injisert i sessionStorage
// for at eksisterende testoppsett fortsatt skal gi forutsigbart resultat.
async function mockSokWillReturnInjectedTreffliste(page: Page) {
	await page.route("**/attestasjon/sok", async (route) => {
		await route.fulfill({
			json: {
				data: aTrefflisteAppState.state.oppdragDtoList,
				errorMessage: "",
			},
		});
	});
}

async function mockSokWillFail(page: Page, errorMessage: string) {
	await page.route("**/attestasjon/sok", async (route) => {
		await route.fulfill({
			json: {
				data: [],
				errorMessage,
			},
		});
	});
}

// Første kall lykkes, påfølgende kall feiler. Brukes for å teste at
// "Sist oppdatert" viser tidspunktet for siste vellykkede henting.
async function mockSokWillSucceedThenFail(page: Page, errorMessage: string) {
	let callCount = 0;

	await page.route("**/attestasjon/sok", async (route) => {
		callCount += 1;

		await route.fulfill({
			json:
				callCount === 1
					? {
							data: aTrefflisteAppState.state.oppdragDtoList,
							errorMessage: "",
						}
					: { data: [], errorMessage },
		});
	});
}

// Lar testen bytte hva /sok returnerer underveis, slik at man kan verifisere at
// trefflisten faktisk hentes på nytt fra backend. Bevisst uten telling av kall,
// siden React.StrictMode dobbelkjører effekter i dev.
async function mockSokWithControllableResponse(page: Page) {
	const oppdragDtoList = aTrefflisteAppState.state.oppdragDtoList ?? [];
	const respons = { data: oppdragDtoList };

	await page.route("**/attestasjon/sok", async (route) => {
		await route.fulfill({
			json: { data: respons.data, errorMessage: "" },
		});
	});

	return {
		backendReturnerer: (data: typeof oppdragDtoList) => {
			respons.data = data;
		},
		alleOppdrag: oppdragDtoList,
	};
}

async function gotoAndAssertBeingOnTrefflistePage(page: Page) {
	await page.goto("/attestasjon/treffliste");
	await expect(
		page.getByRole("heading", { name: "Attestasjon: Treffliste" }),
	).toBeVisible();
}

async function backendWillReturn(
	page: Page,
	oppdragsDetaljerDto: OppdragsDetaljerDTO,
) {
	await page.route("*/**/oppdragsdetaljer", async (route) => {
		await route.fulfill({ json: oppdragsDetaljerDto });
	});
}

test.describe("Treffliste", () => {
	test.describe("One oppdrag is skjermet the other is not", () => {
		test.beforeEach(({ page }) => {
			setStore(page);
			mockSokWillReturnInjectedTreffliste(page);
		});
		test(`clicking on skjermet oppdrag shows warning while not skjermet takes user to detaljer page`, async ({
			page,
		}) => {
			await gotoAndAssertBeingOnTrefflistePage(page);
			await page.getByRole("link", { name: "98765498765" }).click();
			expect(page.getByText("Denne personen er skjermet")).toBeVisible();

			backendWillReturn(page, oppdragsDetaljerDto);
			await page.getByRole("link", { name: "12345612345" }).click();

			await expect(
				page.getByRole("heading", { name: "Attestasjon: Detaljer" }),
			).toBeVisible();
		});
	});

	test.describe("Sist oppdatert", () => {
		test.beforeEach(({ page }) => {
			setStore(page);
		});

		test(`viser tidspunkt for hentingen når trefflisten er oppdatert`, async ({
			page,
		}) => {
			await mockSokWillReturnInjectedTreffliste(page);

			await gotoAndAssertBeingOnTrefflistePage(page);

			await expect(page.getByText(/^Sist oppdatert /)).toBeVisible();
		});

		test(`beholder tidspunktet fra siste vellykkede henting når oppdatering feiler`, async ({
			page,
		}) => {
			const feilmelding =
				"Simulert feil: klarte ikke å hente trefflisten fra sokos-oppdrag.";
			await mockSokWillSucceedThenFail(page, feilmelding);

			await gotoAndAssertBeingOnTrefflistePage(page);
			const sistOppdatert = page.getByText(/^Sist oppdatert /);
			await expect(sistOppdatert).toBeVisible();
			const tidspunktEtterForsteHenting = await sistOppdatert.textContent();

			await page.getByRole("button", { name: "Last inn på nytt" }).click();
			await expect(page.getByText(feilmelding)).toBeVisible();

			await expect(sistOppdatert).toHaveText(
				tidspunktEtterForsteHenting as string,
			);
		});
	});

	test.describe("Henting ved navigasjon", () => {
		test.beforeEach(({ page }) => {
			setStore(page);
		});

		test(`henter trefflisten på nytt når man går til detaljer og tilbake`, async ({
			page,
		}) => {
			const sok = await mockSokWithControllableResponse(page);
			await backendWillReturn(page, oppdragsDetaljerDto);

			await gotoAndAssertBeingOnTrefflistePage(page);
			await expect(
				page.getByRole("link", { name: "12345612345" }),
			).toBeVisible();

			await page.getByRole("link", { name: "12345612345" }).click();
			await expect(
				page.getByRole("heading", { name: "Attestasjon: Detaljer" }),
			).toBeVisible();

			// Simulerer at oppdraget er ferdig attestert mens bruker var på
			// detaljer-siden, og derfor ikke lenger er med i trefflisten.
			sok.backendReturnerer(
				sok.alleOppdrag.filter(
					(oppdrag) => oppdrag.oppdragGjelderId !== "12345612345",
				),
			);

			await page.getByRole("link", { name: "Treffliste" }).click();
			await expect(
				page.getByRole("heading", { name: "Attestasjon: Treffliste" }),
			).toBeVisible();

			// Trefflisten skal reflektere det nye backend-svaret, ikke forrige visning.
			await expect(
				page.getByRole("link", { name: "98765498765" }),
			).toBeVisible();
			await expect(
				page.getByRole("link", { name: "12345612345" }),
			).toBeHidden();
		});
	});

	test.describe("Statusikon på Last inn på nytt", () => {
		const reloadKnapp = (page: Page) =>
			page.getByRole("button", { name: "Last inn på nytt" });

		test.beforeEach(({ page }) => {
			setStore(page);
		});

		test(`viser ikke status etter automatisk henting ved sidelasting`, async ({
			page,
		}) => {
			await mockSokWillReturnInjectedTreffliste(page);

			await gotoAndAssertBeingOnTrefflistePage(page);
			await expect(page.getByText(/^Sist oppdatert /)).toBeVisible();

			await expect(reloadKnapp(page)).toHaveAttribute("data-status", "idle");
		});

		test(`viser suksess-status først etter at knappen er trykket`, async ({
			page,
		}) => {
			await mockSokWillReturnInjectedTreffliste(page);

			await gotoAndAssertBeingOnTrefflistePage(page);
			await expect(reloadKnapp(page)).toHaveAttribute("data-status", "idle");

			await reloadKnapp(page).click();

			await expect(reloadKnapp(page)).toHaveAttribute("data-status", "success");
		});

		test(`viser feil-status når manuell oppdatering feiler`, async ({
			page,
		}) => {
			const feilmelding =
				"Simulert feil: klarte ikke å hente trefflisten fra sokos-oppdrag.";
			await mockSokWillSucceedThenFail(page, feilmelding);

			await gotoAndAssertBeingOnTrefflistePage(page);
			await expect(reloadKnapp(page)).toHaveAttribute("data-status", "idle");

			await reloadKnapp(page).click();

			await expect(reloadKnapp(page)).toHaveAttribute("data-status", "error");
			await expect(page.getByText(feilmelding)).toBeVisible();
		});
	});

	test.describe("Henting av treffliste feiler", () => {
		const feilmelding =
			"Simulert feil: klarte ikke å hente trefflisten fra sokos-oppdrag.";

		test.beforeEach(({ page }) => {
			setStore(page);
		});

		test(`viser feilmelding når automatisk henting av treffliste feiler ved sidelasting`, async ({
			page,
		}) => {
			await mockSokWillFail(page, feilmelding);

			await gotoAndAssertBeingOnTrefflistePage(page);

			await expect(page.getByText(feilmelding)).toBeVisible();
		});

		test(`kan lukke feilmeldingen med lukkeknappen`, async ({ page }) => {
			await mockSokWillFail(page, feilmelding);

			await gotoAndAssertBeingOnTrefflistePage(page);
			await expect(page.getByText(feilmelding)).toBeVisible();

			await page.getByRole("button", { name: "Lukk" }).click();

			await expect(page.getByText(feilmelding)).not.toBeVisible();
		});

		test(`viser feilmelding på nytt når "Last inn på nytt" fortsatt feiler`, async ({
			page,
		}) => {
			await mockSokWillFail(page, feilmelding);

			await gotoAndAssertBeingOnTrefflistePage(page);
			await expect(page.getByText(feilmelding)).toBeVisible();

			await page.getByRole("button", { name: "Lukk" }).click();
			await expect(page.getByText(feilmelding)).not.toBeVisible();

			await page.getByRole("button", { name: "Last inn på nytt" }).click();

			await expect(page.getByText(feilmelding)).toBeVisible();
		});

		test(`viser trefflisten fra tidligere søk selv om oppdatering feiler`, async ({
			page,
		}) => {
			await mockSokWillFail(page, feilmelding);

			await gotoAndAssertBeingOnTrefflistePage(page);
			await expect(page.getByText(feilmelding)).toBeVisible();

			await expect(
				page.getByRole("link", { name: "98765498765" }),
			).toBeVisible();
			await expect(
				page.getByRole("link", { name: "12345612345" }),
			).toBeVisible();
		});
	});
});
