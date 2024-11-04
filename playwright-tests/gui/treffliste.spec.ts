import { Page, expect, test } from "@playwright/test";
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

// async function backendWillReturn(
//     page: Page,
//     oppdragsdetaljer:,
// ) {
//     await page.route("*/**/oppdragsdetaljer", async (route) => {
//         await route.fulfill({ json: oppdragsdetaljer });
//     });
// }

test.describe("Treffliste", () => {
  test.describe("hva skal man teste", () => {
    test.beforeEach(({ page }) => {
      setStore(page);
    });
    test(`hva skjer`, async ({ page }) => {
      // await backendWillReturn(page, oppdragsdetaljer);
      await gotoAndAssertBeingOnTrefflistePage(page);

      await page.getByRole("link", { name: "98765498765" }).click();
    });
  });
});
