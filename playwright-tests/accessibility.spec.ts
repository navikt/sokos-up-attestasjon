import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import aDetaljerAppState from "./aDetaljerAppState";
import aTrefflisteAppState from "./aTrefflisteAppState";

test.describe("Axe a11y", () => {
  test(`/attestasjon should not have any automatically detectable accessibility issues`, async ({
    page,
  }) => {
    await page.goto("/attestasjon");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    await expect(
      page.getByRole("heading", { name: "Attestasjon" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Søk" })).toBeVisible();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test(`/attestasjon/treffliste should not have any automatically detectable accessibility issues`, async ({
    page,
  }) => {
    await page.context().addInitScript((appState) => {
      window.sessionStorage.setItem("app-state", JSON.stringify(appState));
    }, aTrefflisteAppState);
    await page.goto("/attestasjon/treffliste");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Attestasjon: Treffliste" }),
    ).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test(`/attestasjon/detaljer should not have any automatically detectable accessibility issues`, async ({
    page,
  }) => {
    await page.context().addInitScript((appState) => {
      window.sessionStorage.setItem("app-state", JSON.stringify(appState));
    }, aDetaljerAppState);

    await page.goto("/attestasjon/detaljer");

    await expect(
      page.getByRole("heading", { name: "Attestasjon: Detaljer" }),
    ).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
