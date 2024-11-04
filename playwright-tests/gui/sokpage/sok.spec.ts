import { Page, expect, test } from "@playwright/test";
import { AppState } from "../../../src/store/AppState";
import faggrupper from "../../stubs/faggrupper";
import fagomraader from "../../stubs/fagomraader";
import { aStateWith } from "./aSokPageAppState";

test.describe("When using Sok in Attestasjoner", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.route("*/**/faggrupper", async (route) => {
      await route.fulfill({ json: faggrupper });
    });
    await page.route("*/**/fagomraader", async (route) => {
      await route.fulfill({ json: fagomraader });
    });
    await page.waitForLoadState("networkidle");

    await page.goto("/attestasjon");
    await page.waitForLoadState("networkidle");
  });

  test(`a letter in gjelderId-field should display error`, async ({ page }) => {
    const fnrfelt = page.getByLabel("Gjelder");
    await fnrfelt.fill("123456a");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();
    await expect(
      page.getByText(
        "Du må fikse disse feilene før du kan fortsetteGjelder-feltet kan bare inneholde",
      ),
    ).toBeVisible();
  });

  test(`8 decimals in gjelderId-field should display error`, async ({
    page,
  }) => {
    const fnrfelt = page.getByLabel("Gjelder");
    await fnrfelt.fill("12345678");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();
    await expect(
      page.getByText(
        "Du må fikse disse feilene før du kan fortsetteGjelder-feltet må inneholde et",
      ),
    ).toBeVisible();
  });

  test(`10 decimals in gjelderId-field should display error`, async ({
    page,
  }) => {
    const fnrfelt = page.getByLabel("Gjelder");
    await fnrfelt.fill("1234567890");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();
    await expect(
      page.getByText(
        "Du må fikse disse feilene før du kan fortsetteGjelder-feltet må inneholde et",
      ),
    ).toBeVisible();
  });

  test(`more than 11 decimals in gjelderId-field should display error`, async ({
    page,
  }) => {
    const fnrfelt = page.getByLabel("Gjelder");
    await fnrfelt.fill("123456789012");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();
    await expect(
      page.getByText(
        "Du må fikse disse feilene før du kan fortsetteGjelder-feltet må inneholde et",
      ),
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
      page.getByText(
        "Du må fikse disse feilene før du kan fortsetteFagsystem id kan bare inneholde",
      ),
    ).toBeVisible();
  });

  test(`a valid gjelderId should show informative text when no oppdrags are returned from backend`, async ({
    page,
  }) => {
    await page.route("*/**/sok", async (route) => {
      await route.fulfill({ json: [] });
    });

    const fnrfelt = page.getByLabel("Gjelder");
    await fnrfelt.fill("12345612345");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();
    await expect(page.getByText("Ingen treff på søket. Prøv")).toBeVisible();
  });
});

function testStore(page: Page, appState: { state: AppState; version: number }) {
  page.context().addInitScript((appState) => {
    window.sessionStorage.setItem("app-state", JSON.stringify(appState));
  }, appState);
}

test.describe("When returning to Sok in Attestasjoner with Sokeparameters set in store", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("*/**/faggrupper", async (route) => {
      await route.fulfill({ json: faggrupper });
    });
    await page.route("*/**/fagomraader", async (route) => {
      await route.fulfill({ json: fagomraader });
    });
  });
  test(`should have Attestert radiobutton checked`, async ({ page }) => {
    testStore(page, aStateWith({ gjelderId: "", attestertStatus: "true" }));

    await page.goto("/attestasjon");

    await expect(page.getByLabel("Attestert", { exact: true })).toBeChecked();
    await expect(
      page.getByLabel("Ikke attestert", { exact: true }),
    ).not.toBeChecked();
    await expect(page.getByLabel("Alle", { exact: true })).not.toBeChecked();

    await expect(page.getByRole("heading", { name: "Søk" })).toBeVisible();
  });
  test(`should have Ikke Attestert radiobutton checked`, async ({ page }) => {
    testStore(page, aStateWith({ gjelderId: "", attestertStatus: "false" }));

    await page.goto("/attestasjon");

    await expect(
      page.getByLabel("Attestert", { exact: true }),
    ).not.toBeChecked();
    await expect(
      page.getByLabel("Ikke attestert", { exact: true }),
    ).toBeChecked();
    await expect(page.getByLabel("Alle", { exact: true })).not.toBeChecked();

    await expect(page.getByRole("heading", { name: "Søk" })).toBeVisible();
  });
  test(`should have Alle radiobutton checked`, async ({ page }) => {
    testStore(
      page,
      aStateWith({ gjelderId: "", attestertStatus: "undefined" }),
    );

    await page.goto("/attestasjon");

    await expect(
      page.getByLabel("Attestert", { exact: true }),
    ).not.toBeChecked();
    await expect(
      page.getByLabel("Ikke attestert", { exact: true }),
    ).not.toBeChecked();
    await expect(page.getByLabel("Alle", { exact: true })).toBeChecked();

    await expect(page.getByRole("heading", { name: "Søk" })).toBeVisible();
  });
  test(`should have value from store in faggruppe combobox`, async ({
    page,
  }) => {
    testStore(
      page,
      aStateWith({
        gjelderId: "",
        attestertStatus: "false",
        fagGruppe: { navn: "Barnebidrag", type: "BA" },
      }),
    );

    await page.goto("/attestasjon");

    await expect(page.getByText("Barnetrygd (BA)")).toBeVisible();
  });
});
