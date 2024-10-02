import { expect, test } from "@playwright/test";
import {
  setupAttester,
  setupFaggrupper,
  setupFagomraader,
  setupHentDetaljer,
  setupHentDetaljer2,
  setupHentNavn,
  setupSok,
} from "../setup";

test.describe("Attestasjon", () => {
  test(`søk, velg oppdrag, hent detaljer og attester en linje uten problemer`, async ({
    page,
  }) => {
    // Lar denne stå nå som note to self hvordan simulere feil fra backend
    // await setupError({page: page, route: "*/**/faggrupper", status: HttpStatusCode.BadRequest, message: "Fy skam!"})
    await page.setViewportSize({ width: 1920, height: 1080 });
    await setupFaggrupper({ page });
    await setupFagomraader({ page });
    await page.waitForLoadState("networkidle");

    await page.goto("/attestasjon");
    await setupSok({ page });
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder("Fødselsnummer eller").fill("12345678901");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();

    await setupHentNavn({ page });
    await setupHentDetaljer({ page });
    await page.waitForLoadState("networkidle");

    await page
      .getByRole("row", { name: "12345678901 Memoposteringer" })
      .getByRole("link")
      .click();

    // await setupError({page: page, route: "*/**/attestasjon/attestere", status: HttpStatusCode.BadRequest, message: "Statuskode noe fra ZOS!"})
    await setupAttester({ page });
    await page.getByLabel("Attester", { exact: true }).check();
    await page.waitForLoadState("networkidle");

    await setupHentDetaljer2({ page });
    await page.getByRole("button", { name: "Oppdater" }).click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("cell", { name: "H135685" })).toBeVisible();
  });
});
