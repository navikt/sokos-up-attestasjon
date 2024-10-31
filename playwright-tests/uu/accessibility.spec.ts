import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import faggrupper from "../stubs/faggrupper";
import fagomraader from "../stubs/fagomraader";
import oppdragsdetaljer from "../stubs/oppdragsdetaljer";
import aDetaljerAppState from "./aDetaljerAppState";
import aTrefflisteAppState from "./aTrefflisteAppState";

test.describe("Axe a11y", () => {
  test(`/attestasjon should not have any automatically detectable accessibility issues`, async ({
    page,
  }) => {
    await page.route("*/**/faggrupper", async (route) => {
      await route.fulfill({ json: faggrupper });
    });
    await page.route("*/**/fagomraader", async (route) => {
      await route.fulfill({ json: fagomraader });
    });
    await page.waitForLoadState("networkidle");

    await page.goto("/attestasjon");
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
    await page.route("*/**/hentnavn", async (route) => {
      await route.fulfill({
        json: {
          navn: "William J. Shakespeare",
        },
      });
    });
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

    await page.route("*/**/oppdragsdetaljer", async (route) => {
      await route.fulfill({ json: oppdragsdetaljer });
    });
    await page.goto("/attestasjon/detaljer");

    await expect(
      page.getByRole("heading", { name: "Attestasjon: Detaljer" }),
    ).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
