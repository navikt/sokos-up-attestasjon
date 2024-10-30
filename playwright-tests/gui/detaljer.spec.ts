import { expect, test } from "@playwright/test";
import { detaljerStateWith } from "./aDetaljerAppState";
import oppdragsdetaljerWith2Oppdragslinjer from "./detaljer_oppdragsdetaljer";

test.describe("Detaljer", () => {
  test(`med en attestant`, async ({ page }) => {
    await page.context().addInitScript(
      (appState) => {
        window.sessionStorage.setItem("app-state", JSON.stringify(appState));
      },
      detaljerStateWith({ antallAttestanter: 1 }),
    );

    await page.route("*/**/oppdragsdetaljer", async (route) => {
      await route.fulfill({ json: oppdragsdetaljerWith2Oppdragslinjer });
    });
    await page.goto("/attestasjon/detaljer");

    await expect(
      page.getByRole("heading", { name: "Attestasjon: Detaljer" }),
    ).toBeVisible();
    const tableRows = page.locator("table tbody tr");
    await expect(tableRows).toHaveCount(2);
  });

  test(`med to attestanter`, async ({ page }) => {
    await page.context().addInitScript(
      (appState) => {
        window.sessionStorage.setItem("app-state", JSON.stringify(appState));
      },
      detaljerStateWith({ antallAttestanter: 2 }),
    );

    await page.route("*/**/oppdragsdetaljer", async (route) => {
      await route.fulfill({ json: oppdragsdetaljerWith2Oppdragslinjer });
    });
    await page.goto("/attestasjon/detaljer");

    await expect(
      page.getByRole("heading", { name: "Attestasjon: Detaljer" }),
    ).toBeVisible();

    const tableRows = page.locator("table tbody tr");
    await expect(tableRows).toHaveCount(4);
  });
});
