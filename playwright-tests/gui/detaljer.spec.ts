import { expect, test } from "@playwright/test";
import { setupStub } from "../setup";
import oppdragsdetaljer from "../stubs/oppdragsdetaljer";
import { detaljerStateWith } from "./aDetaljerAppState";

test.describe("Detaljer", () => {
  test(`med en attestant`, async ({ page }) => {
    await page.context().addInitScript(
      (appState) => {
        window.sessionStorage.setItem("app-state", JSON.stringify(appState));
      },
      detaljerStateWith({ antallAttestanter: 1 }),
    );

    await setupStub({
      uri: "*/**/attestasjon/98765432/oppdragsdetaljer",
      json: oppdragsdetaljer,
      page,
    });
    await page.goto("/attestasjon/detaljer");

    await expect(
      page.getByRole("heading", { name: "Attestasjon: Detaljer" }),
    ).toBeVisible();
    const tableRows = page.locator("table tbody tr");
    await expect(tableRows).toHaveCount(1);
  });

  test(`med to attestanter`, async ({ page }) => {
    await page.context().addInitScript(
      (appState) => {
        window.sessionStorage.setItem("app-state", JSON.stringify(appState));
      },
      detaljerStateWith({ antallAttestanter: 2 }),
    );

    await setupStub({
      uri: "*/**/attestasjon/98765432/oppdragsdetaljer",
      json: oppdragsdetaljer,
      page,
    });
    await page.goto("/attestasjon/detaljer");

    await expect(
      page.getByRole("heading", { name: "Attestasjon: Detaljer" }),
    ).toBeVisible();

    const tableRows = page.locator("table tbody tr");
    await expect(tableRows).toHaveCount(2);
  });
});
