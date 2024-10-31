import { Page, expect, test } from "@playwright/test";
import { OppdragsDetaljer } from "../../src/types/OppdragsDetaljer";
import { detaljerStateWith } from "./aDetaljerAppState";
import oppdragsdetaljerWith from "./detaljer_oppdragsdetaljer";

async function setStore(page: Page, antallAttestanterSomTrengs: number) {
  await page.context().addInitScript(
    (appState) => {
      window.sessionStorage.setItem("app-state", JSON.stringify(appState));
    },
    detaljerStateWith({ antallAttestanter: antallAttestanterSomTrengs }),
  );
}

async function gotoAndAssertBeingOnDetaljerPage(page: Page) {
  await page.goto("/attestasjon/detaljer");
  await expect(
    page.getByRole("heading", { name: "Attestasjon: Detaljer" }),
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

test.describe("Detaljer", () => {
  test.describe("et fagområde som trenger 1 attestasjon", () => {
    test(`har 0 attestasjoner fra før skal ha blanke linjer som kan attesteres`, async ({
      page,
    }) => {
      setStore(page, 1);
      const antallLinjer = 3;
      const antallAttestasjonerFraFør = 0;
      const oppdragsdetaljer = oppdragsdetaljerWith(
        antallLinjer,
        antallAttestasjonerFraFør,
      );
      await backendWillReturn(page, oppdragsdetaljer);
      await gotoAndAssertBeingOnDetaljerPage(page);

      const tableRows = page.locator("table tbody tr");
      await expect(tableRows).toHaveCount(antallLinjer);
    });

    test(`har 1 attestasjon fra før skal ikke ha blanke linjer som kan attesteres`, async ({
      page,
    }) => {
      setStore(page, 1);
      const antallLinjer = 3;
      const antallAttestasjonerFraFør = 1;
      const oppdragsdetaljer = oppdragsdetaljerWith(
        antallLinjer,
        antallAttestasjonerFraFør,
      );
      await backendWillReturn(page, oppdragsdetaljer);
      await gotoAndAssertBeingOnDetaljerPage(page);

      const tableRows = page.locator("table tbody tr");
      await expect(tableRows).toHaveCount(antallLinjer);
    });
  });

  test.describe("et fagområde som trenger 2 attestasjoner", () => {
    test(`har 0 attestasjoner fra før skal ha blanke linjer som kan attesteres, men hver linje vises bare 1 gang`, async ({
      page,
    }) => {
      setStore(page, 2);
      const antallLinjer = 3;
      const antallAttestasjonerFraFør = 1;
      const oppdragsdetaljer = oppdragsdetaljerWith(
        antallLinjer,
        antallAttestasjonerFraFør,
      );
      await backendWillReturn(page, oppdragsdetaljer);
      await gotoAndAssertBeingOnDetaljerPage(page);

      const tableRows = page.locator("table tbody tr");
      await expect(tableRows).toHaveCount(antallLinjer);
    });

    test(`har 1 attestasjon fra før skal ha blanke linjer som kan attesteres`, async ({
      page,
    }) => {
      setStore(page, 2);
      const antallLinjer = 3;
      const antallAttestasjonerFraFør = 1;
      const oppdragsdetaljer = oppdragsdetaljerWith(
        antallLinjer,
        antallAttestasjonerFraFør,
      );
      await backendWillReturn(page, oppdragsdetaljer);
      await gotoAndAssertBeingOnDetaljerPage(page);

      const tableRows = page.locator("table tbody tr");
      await expect(tableRows).toHaveCount(antallLinjer * 2);
    });

    test(`har 2 attestasjoner fra før skal ikke ha blanke linjer som kan attesteres`, async ({
      page,
    }) => {
      setStore(page, 2);
      const antallLinjer = 3;
      const antallAttestasjonerFraFør = 1;
      const oppdragsdetaljer = oppdragsdetaljerWith(
        antallLinjer,
        antallAttestasjonerFraFør,
      );
      await backendWillReturn(page, oppdragsdetaljer);
      await gotoAndAssertBeingOnDetaljerPage(page);

      const tableRows = page.locator("table tbody tr");
      await expect(tableRows).toHaveCount(antallLinjer * 2);
    });
  });
});
