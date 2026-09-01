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
