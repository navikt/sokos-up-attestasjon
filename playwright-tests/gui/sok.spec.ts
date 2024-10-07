import { expect, test } from "@playwright/test";
import { Oppdrag } from "../../src/types/Oppdrag";
import { setupFaggrupper, setupFagomraader } from "../setup";

test.describe("When using Sok in Attestasjoner", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await setupFaggrupper({ page });
    await setupFagomraader({ page });
    await page.waitForLoadState("networkidle");

    await page.goto("/attestasjon");
    await page.route("*/**/attestasjon/sok", async (route) => {
      const json: Oppdrag[] = [];
      await route.fulfill({ json });
    });
    await page.waitForLoadState("networkidle");
  });

  test(`a letter in gjelderId-field should display error`, async ({ page }) => {
    const fnrfelt = await page.getByPlaceholder("Fødselsnummer eller");
    fnrfelt.fill("123456a");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();
    await expect(
      page
        .getByLabel("Du må fikse disse feilene før")
        .getByText("Gjelder-feltet kan bare"),
    ).toBeVisible();
  });

  test(`8 decimals in gjelderId-field should display error`, async ({
    page,
  }) => {
    const fnrfelt = await page.getByPlaceholder("Fødselsnummer eller");
    fnrfelt.fill("12345678");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();
    await expect(
      page
        .getByLabel("Du må fikse disse feilene før")
        .getByText("Gjelder-feltet må inneholde"),
    ).toBeVisible();
  });

  test(`10 decimals in gjelderId-field should display error`, async ({
    page,
  }) => {
    const fnrfelt = await page.getByPlaceholder("Fødselsnummer eller");
    fnrfelt.fill("1234567890");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();
    await expect(
      page
        .getByLabel("Du må fikse disse feilene før")
        .getByText("Gjelder-feltet må inneholde"),
    ).toBeVisible();
  });

  test(`more than 11 decimals in gjelderId-field should display error`, async ({
    page,
  }) => {
    const fnrfelt = await page.getByPlaceholder("Fødselsnummer eller");
    fnrfelt.fill("123456789012");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();
    await expect(
      page
        .getByLabel("Du må fikse disse feilene før")
        .getByText("Gjelder-feltet må inneholde"),
    ).toBeVisible();
  });

  test(`a single quote in fagSystemId-field should display error`, async ({
    page,
  }) => {
    await page.getByLabel("Fagsystem id").fill("asdf'");
    await page.getByLabel("Faggruppe").fill("PEN");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();
    await expect(
      page
        .getByLabel("Du må fikse disse feilene før")
        .getByText("Fagsystem id kan bare"),
    ).toBeVisible();
  });

  test(`a valid gjelderId should show informative text when no oppdrags are returned from backend`, async ({
    page,
  }) => {
    const fnrfelt = await page.getByPlaceholder("Fødselsnummer eller");
    fnrfelt.fill("12345612345");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();
    await expect(page.getByText("Ingen treff på søket. Prøv")).toBeVisible();
  });
});