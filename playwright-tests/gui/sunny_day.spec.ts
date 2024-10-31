import { expect, test } from "@playwright/test";
import faggrupper from "../stubs/faggrupper";
import fagomraader from "../stubs/fagomraader";
import oppdaterAttestasjonResponse from "../stubs/oppdaterAttestasjonResponse";
import sok from "../stubs/sok";
import oppdragsdetaljer from "./sunny_day_oppdragsdetaljer";
import oppdragsdetaljerEtterAttestering from "./sunny_day_oppdragsdetaljerEtterAttestering";

test.describe("Attestasjon", () => {
  test(`søk, velg oppdrag, hent detaljer og attester en linje uten problemer`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.route("*/**/faggrupper", async (route) => {
      await route.fulfill({ json: faggrupper });
    });
    await page.route("*/**/fagomraader", async (route) => {
      await route.fulfill({ json: fagomraader });
    });
    await page.waitForLoadState("networkidle");

    await page.goto("/attestasjon");
    await page.route("*/**/sok", async (route) => {
      await route.fulfill({ json: sok });
    });
    await page.route("*/**/hentnavn", async (route) => {
      await route.fulfill({ json: { navn: "William J. Shakespeare" } });
    });
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Gjelder").fill("12345678901");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();

    await page.route("*/**/oppdragsdetaljer", async (route) => {
      await route.fulfill({ json: oppdragsdetaljer });
    });
    await page.waitForLoadState("networkidle");

    await page
      .getByRole("row", { name: "12345678901 Memoposteringer" })
      .getByRole("link")
      .click();

    await page.route("*/**/attestere", async (route) => {
      await route.fulfill({ json: oppdaterAttestasjonResponse });
    });
    await page.getByLabel("Attester", { exact: true }).check();
    await page.waitForLoadState("networkidle");

    await page.route("*/**/oppdragsdetaljer", async (route) => {
      await route.fulfill({ json: oppdragsdetaljerEtterAttestering });
    });
    await page.getByRole("button", { name: "Oppdater" }).click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("cell", { name: "H135685" })).toBeVisible();
  });
});