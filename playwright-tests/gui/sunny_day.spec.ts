import { expect, test } from "@playwright/test";
import { GjelderNavn } from "../../src/types/GjelderNavn";
import { OppdaterAttestasjonResponse } from "../../src/types/OppdaterAttestasjonResponse";
import { Oppdrag } from "../../src/types/Oppdrag";
import { OppdragsDetaljer } from "../../src/types/OppdragsDetaljer";
import { setupStub } from "../setup";
import detaljer2 from "../stubs/detaljer2";
import faggrupper from "../stubs/faggrupper";
import fagomraader from "../stubs/fagomraader";
import oppdaterAttestasjonResponse from "../stubs/oppdaterAttestasjonResponse";
import oppdragsdetaljer from "../stubs/oppdragsdetaljer";
import sok from "../stubs/sok";

test.describe("Attestasjon", () => {
  test(`søk, velg oppdrag, hent detaljer og attester en linje uten problemer`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await setupStub({ url: "*/**/faggrupper", json: faggrupper })({ page });
    await setupStub({ url: "*/**/fagomraader", json: fagomraader })({ page });
    await page.waitForLoadState("networkidle");

    await page.goto("/attestasjon");
    await setupStub<Oppdrag[]>({ url: "*/**/sok", json: sok })({ page });
    await setupStub<GjelderNavn>({
      url: "*/**/hentnavn",
      json: { navn: "William J. Shakespeare" },
    })({ page });
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Gjelder").fill("12345678901");
    await page
      .getByRole("button", { name: "Søk Ikon som viser et forstø" })
      .click();

    await setupStub<OppdragsDetaljer>({
      url: "*/**/oppdragsdetaljer",
      json: oppdragsdetaljer,
    })({ page });
    await page.waitForLoadState("networkidle");

    await page
      .getByRole("row", { name: "12345678901 Memoposteringer" })
      .getByRole("link")
      .click();

    await setupStub<OppdaterAttestasjonResponse>({
      url: "*/**/attestere",
      json: oppdaterAttestasjonResponse,
    })({
      page,
    });
    await page.getByLabel("Attester", { exact: true }).check();
    await page.waitForLoadState("networkidle");

    await setupStub<OppdragsDetaljer>({
      url: "*/**/oppdragsdetaljer",
      json: detaljer2,
    })({ page });
    await page.getByRole("button", { name: "Oppdater" }).click();
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("cell", { name: "H135685" })).toBeVisible();
  });
});
