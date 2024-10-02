import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  setupFaggrupper,
  setupFagomraader,
  setupHentDetaljer,
  setupHentNavn,
  setupSok,
} from "../setup";

test.describe("Axe a11y", () => {
  test(`should not have any automatically detectable accessibility issues on /attestasjon`, async ({
    page,
  }) => {
    await setupFaggrupper({ page });
    await setupFagomraader({ page });
    await page.goto("/attestasjon");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test(`should not have any automatically detectable accessibility issues on /attestasjon/treffliste`, async ({
    page,
  }) => {
    await page.context().addInitScript(() => {
      window.sessionStorage.setItem(
        "attestasjon_sok",
        btoa(
          '{"gjelderId":"12345678901","fagSystemId":"13175913","kodeFagGruppe":"PEN","kodeFagOmraade":"PENSJON","attestertStatus":"null"}',
        ),
      );
    });
    await page.waitForLoadState("networkidle");

    setupSok({ page });
    await page.goto("/attestasjon/treffliste");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test(`should not have any automatically detectable accessibility issues on /attestasjon/detaljer`, async ({
    page,
  }) => {
    await page.context().addInitScript(() => {
      window.sessionStorage.setItem(
        "attestasjon_sok",
        btoa(
          '{"gjelderId":"12345678901","fagSystemId":"13175913","kodeFagGruppe":"PEN","kodeFagOmraade":"PENSJON","attestertStatus":"null"}',
        ),
      );
    });
    setupHentNavn({ page });
    setupSok({ page });
    await page.goto("/attestasjon/treffliste");
    await page.waitForLoadState("networkidle");

    setupHentDetaljer({ page });
    await page
      .getByRole("row", { name: "12345678901 Memoposteringer" })
      .getByRole("link")
      .click();
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
