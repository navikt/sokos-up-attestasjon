import { Page, expect, test } from "@playwright/test";
import { AppState } from "../../../src/store/AppState";
import faggrupper from "../../stubs/faggrupper";
import fagomraader from "../../stubs/fagomraader";
import { aStateWith } from "./aSokPageAppState";

function testStore(page: Page, appState: { state: AppState; version: number }) {
  page.context().addInitScript((appState) => {
    window.sessionStorage.setItem("app-state", JSON.stringify(appState));
  }, appState);
}
function radiobutton(page: Page, label: string) {
  return page.getByLabel(label, { exact: true });
}
function dropdownbox(page: Page, label: string) {
  return page.getByLabel(label).locator("../..");
}

test.describe("When using Sok in Attestasjoner", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.route("*/**/faggrupper", async (route) => {
      await route.fulfill({ json: faggrupper });
    });
    await page.route("*/**/fagomraader", async (route) => {
      await route.fulfill({ json: fagomraader });
    });
    await page.goto("/attestasjon");
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

  test("Backspace should remove faggruppe", async ({ page }) => {
    await page.getByLabel("Faggruppe").fill("sap");

    const option = page.getByRole("option", { name: "Behandleroppgjør" });
    await expect(option).toBeVisible();
    await option.click();
    await expect(
      dropdownbox(page, "Faggruppe").getByText("Behandleroppgjør"),
    ).toBeVisible();

    await dropdownbox(page, "Faggruppe").focus();
    await page.keyboard.press("Backspace");
    await expect(
      page.getByRole("option", { name: "Behandleroppgjør" }),
    ).not.toBeVisible();
  });

  test("xyz should not match any faggruppe", async ({ page }) => {
    const faggruppecombobox = page.getByLabel("Faggruppe");

    await faggruppecombobox.fill("xyz");

    await expect(page.getByText("Ingen søketreff")).toBeVisible();
  });
});

test.describe("When returning to Sok in Attestasjoner with Sokeparameters set in store", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("*/**/faggrupper", async (route) => {
      await route.fulfill({ json: faggrupper });
    });
    await page.route("*/**/fagomraader", async (route) => {
      await route.fulfill({ json: fagomraader });
    });
  });
  test(`Attestert radiobutton should be checked`, async ({ page }) => {
    testStore(page, aStateWith({ attestertStatus: "true" }));

    await page.goto("/attestasjon");
    await expect(page.getByRole("heading", { name: "Søk" })).toBeVisible();

    await expect(radiobutton(page, "Attestert")).toBeChecked();
    await expect(radiobutton(page, "Ikke attestert")).not.toBeChecked();
    await expect(radiobutton(page, "Alle")).not.toBeChecked();
  });
  test(`Ikke Attestert radiobutton should be checked`, async ({ page }) => {
    testStore(page, aStateWith({ attestertStatus: "false" }));

    await page.goto("/attestasjon");
    await expect(page.getByRole("heading", { name: "Søk" })).toBeVisible();

    await expect(radiobutton(page, "Attestert")).not.toBeChecked();
    await expect(radiobutton(page, "Ikke attestert")).toBeChecked();
    await expect(radiobutton(page, "Alle")).not.toBeChecked();
  });
  test(`Alle radiobutton should be checked`, async ({ page }) => {
    testStore(page, aStateWith({ attestertStatus: "alle" }));

    await page.goto("/attestasjon");
    await expect(page.getByRole("heading", { name: "Søk" })).toBeVisible();

    await expect(radiobutton(page, "Attestert")).not.toBeChecked();
    await expect(radiobutton(page, "Ikke attestert")).not.toBeChecked();
    await expect(radiobutton(page, "Alle")).toBeChecked();
  });

  test(`faggruppe combobox should have value from store`, async ({ page }) => {
    testStore(
      page,
      aStateWith({ fagGruppe: { navn: "Barnebidrag", type: "BA" } }),
    );
    await page.goto("/attestasjon");

    await expect(
      dropdownbox(page, "Faggruppe").getByText("Barnetrygd (BA)"),
    ).toBeVisible();
    await expect(
      dropdownbox(page, "Fagområde").getByText("Barnetrygd (BA)"),
    ).not.toBeVisible();
  });

  test(`fagområde combobox should have value from store`, async ({ page }) => {
    testStore(
      page,
      aStateWith({ fagOmraade: { navn: "Barnetrygd", kode: "BA" } }),
    );
    await page.goto("/attestasjon");

    await expect(
      dropdownbox(page, "Faggruppe").getByText("Barnetrygd (BA)"),
    ).not.toBeVisible();
    await expect(
      dropdownbox(page, "Fagområde").getByText("Barnetrygd (BA)"),
    ).toBeVisible();
  });

  test(`gjelderId and fagsystemId inputs should have values from store`, async ({
    page,
  }) => {
    testStore(
      page,
      aStateWith({ gjelderId: "12345678901", fagSystemId: "1234" }),
    );
    await page.goto("/attestasjon");

    await expect(page.getByLabel("Gjelder")).toHaveValue("12345678901");
    await expect(page.getByLabel("Fagsystem id")).toHaveValue("1234");
  });
});
