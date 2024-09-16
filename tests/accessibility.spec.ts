import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pagesToTest = [
  "/attestasjon",
  "/attestasjon/treffliste",
  "/attestasjon/detaljer",
];

test.describe("Axe a11y", () => {
  pagesToTest.forEach((url) => {
    test(`should not have any automatically detectable accessibility issues on ${url}`, async ({
      page,
    }) => {
      await page.goto(url);

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });
});
