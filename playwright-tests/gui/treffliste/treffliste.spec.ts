import { Page, expect, test } from "@playwright/test";
import { OppdragsDetaljer } from "../../../src/types/OppdragsDetaljer";
import oppdragsdetaljer from "../../stubs/oppdragsdetaljer";
import aTrefflisteAppState from "./aTrefflisteAppState";

async function setStore(page: Page) {
  await page.context().addInitScript((appState) => {
    window.sessionStorage.setItem("app-state", JSON.stringify(appState));
  }, aTrefflisteAppState);
}

async function gotoAndAssertBeingOnTrefflistePage(page: Page) {
  await page.goto("/attestasjon/treffliste");
  await expect(
    page.getByRole("heading", { name: "Attestasjon: Treffliste" }),
  ).toBeVisible();
}

async function backendWillReturn(
  page: Page,
  oppdragsdetaljer: OppdragsDetaljer,
) {
  await page.route("*/**/oppdragsdetaljer", async (route) => {
    await route.fulfill({ json: oppdragsdetaljer });
  });
}

test.describe("Treffliste", () => {
  test.describe("One oppdrag is skjermet the other is not", () => {
    test.beforeEach(({ page }) => {
      setStore(page);
    });
    test(`clicking on skjermet oppdrag shows warning while not skjermet takes user to detaljer page`, async ({
      page,
    }) => {
      await gotoAndAssertBeingOnTrefflistePage(page);
      await page.getByRole("link", { name: "98765498765" }).click();
      expect(page.getByText("Denne personen er skjermet")).toBeVisible();

      backendWillReturn(page, oppdragsdetaljer);
      await page.getByRole("link", { name: "12345612345" }).click();

      await expect(
        page.getByRole("heading", { name: "Attestasjon: Detaljer" }),
      ).toBeVisible();
    });
  });
});
