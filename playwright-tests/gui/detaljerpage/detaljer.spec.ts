import { Page, expect, test } from "@playwright/test";
import { OppdragsDetaljer } from "../../../src/types/OppdragsDetaljer";
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
    test.beforeEach(({ page }) => {
      setStore(page, 1);
    });
    test(`har 0 attestasjoner fra før skal ha linjer som kan attesteres`, async ({
      page,
    }) => {
      const linjerCount = 3;
      const previousAttestasjoner = 0;
      const oppdragsdetaljer = oppdragsdetaljerWith(
        linjerCount,
        previousAttestasjoner,
      );
      await backendWillReturn(page, oppdragsdetaljer);
      await gotoAndAssertBeingOnDetaljerPage(page);

      const tableRows = page.locator("#detaljertabell tbody tr");
      await expect(tableRows).toHaveCount(linjerCount);

      const attesterbareRows = await tableRows.getByLabel("Attester");
      await expect(attesterbareRows).toHaveCount(3);

      const fjernbareRows = await tableRows.getByLabel("Fjern");
      await expect(fjernbareRows).toHaveCount(0);

      const rowsWithKodeklasse = page.getByRole("cell", { name: "KODEKLASSE" });
      await expect(rowsWithKodeklasse).toHaveCount(3);

      const blankRowsCount =
        (await tableRows.count()) - (await rowsWithKodeklasse.count());
      expect(blankRowsCount).toBe(0);
    });

    test(`har 1 attestasjon fra før skal ikke ha blanke linjer eller noen som kan attesteres`, async ({
      page,
    }) => {
      const linjerCount = 3;
      const previousAttestasjoner = 1;
      const oppdragsdetaljer = oppdragsdetaljerWith(
        linjerCount,
        previousAttestasjoner,
      );
      await backendWillReturn(page, oppdragsdetaljer);
      await gotoAndAssertBeingOnDetaljerPage(page);

      const tableRows = page.locator("#detaljertabell tbody tr");
      await expect(tableRows).toHaveCount(3);

      const attesterbareRows = await tableRows.getByLabel("Attester");
      await expect(attesterbareRows).toHaveCount(0);

      const fjernbareRows = await tableRows.getByLabel("Fjern");
      await expect(fjernbareRows).toHaveCount(3);

      const rowsWithKodeklasse = page.getByRole("cell", { name: "KODEKLASSE" });
      await expect(rowsWithKodeklasse).toHaveCount(3);

      const blankRowsCount =
        (await tableRows.count()) - (await rowsWithKodeklasse.count());
      expect(blankRowsCount).toBe(0);
    });
  });

  test.describe("et fagområde som trenger 2 attestasjoner", () => {
    test.beforeEach(({ page }) => {
      setStore(page, 2);
    });
    test(`har 0 attestasjoner fra før skal bare ha 1 attesterbar linje per oppdragslinje`, async ({
      page,
    }) => {
      const linjerCount = 3;
      const previousAttestasjoner = 0;
      const oppdragsdetaljer = oppdragsdetaljerWith(
        linjerCount,
        previousAttestasjoner,
      );
      await backendWillReturn(page, oppdragsdetaljer);
      await gotoAndAssertBeingOnDetaljerPage(page);

      const tableRows = page.locator("#detaljertabell tbody tr");
      await expect(tableRows).toHaveCount(3);

      const attesterbareRows = await tableRows.getByLabel("Attester");
      await expect(attesterbareRows).toHaveCount(3);

      const fjernbareRows = await tableRows.getByLabel("Fjern");
      await expect(fjernbareRows).toHaveCount(0);

      const rowsWithKodeklasse = page.getByRole("cell", { name: "KODEKLASSE" });
      await expect(rowsWithKodeklasse).toHaveCount(3);

      const blankRowsCount =
        (await tableRows.count()) - (await rowsWithKodeklasse.count());
      expect(blankRowsCount).toBe(0);
    });

    test(`har 1 attestasjon fra før skal ha blanke linjer som kan attesteres`, async ({
      page,
    }) => {
      const linjerCount = 3;
      const previousAttestasjoner = 1;
      const oppdragsdetaljer = oppdragsdetaljerWith(
        linjerCount,
        previousAttestasjoner,
      );
      await backendWillReturn(page, oppdragsdetaljer);
      await gotoAndAssertBeingOnDetaljerPage(page);

      const tableRows = page.locator("#detaljertabell tbody tr");
      await expect(tableRows).toHaveCount(linjerCount * 2);

      const attesterbareRows = await tableRows.getByLabel("Attester");
      await expect(attesterbareRows).toHaveCount(3);

      const fjernbareRows = await tableRows.getByLabel("Fjern");
      await expect(fjernbareRows).toHaveCount(3);

      const rowsWithKodeklasse = page.getByRole("cell", { name: "KODEKLASSE" });
      await expect(rowsWithKodeklasse).toHaveCount(3);

      const blankRowsCount =
        (await tableRows.count()) - (await rowsWithKodeklasse.count());
      expect(blankRowsCount).toBe(3);
    });

    test(`har 1 attestasjon fra før av samme saksbehandler skal ikke se blanke linjer`, async ({
      page,
    }) => {
      const linjerCount = 3;
      const previousAttestasjoner = 1;
      const oppdragsdetaljer = oppdragsdetaljerWith(
        linjerCount,
        previousAttestasjoner,
        "A111111",
      );
      await backendWillReturn(page, oppdragsdetaljer);
      await gotoAndAssertBeingOnDetaljerPage(page);

      const tableRows = page.locator("#detaljertabell tbody tr");
      await expect(tableRows).toHaveCount(3);

      const attesterbareRows = await tableRows.getByLabel("Attester");
      await expect(attesterbareRows).toHaveCount(0);

      const fjernbareRows = await tableRows.getByLabel("Fjern");
      await expect(fjernbareRows).toHaveCount(3);

      const rowsWithKodeklasse = page.getByRole("cell", { name: "KODEKLASSE" });
      await expect(rowsWithKodeklasse).toHaveCount(3);

      const blankRowsCount =
        (await tableRows.count()) - (await rowsWithKodeklasse.count());
      expect(blankRowsCount).toBe(0);
    });

    test(`har 2 attestasjoner fra før skal ha blanke, ikke attesterbare linjer`, async ({
      page,
    }) => {
      const linjerCount = 3;
      const previousAttestasjoner = 2;
      const oppdragsdetaljer = oppdragsdetaljerWith(
        linjerCount,
        previousAttestasjoner,
      );
      await backendWillReturn(page, oppdragsdetaljer);
      await gotoAndAssertBeingOnDetaljerPage(page);

      const tableRows = page.locator("#detaljertabell tbody tr");
      await expect(tableRows).toHaveCount(linjerCount * 2);

      const attesterbareRows = await tableRows.getByLabel("Attester");
      await expect(attesterbareRows).toHaveCount(0);

      const fjernbareRows = await tableRows.getByLabel("Fjern");
      await expect(fjernbareRows).toHaveCount(6);

      const rowsWithKodeklasse = page.getByRole("cell", { name: "KODEKLASSE" });
      await expect(rowsWithKodeklasse).toHaveCount(3);

      const blankRowsCount =
        (await tableRows.count()) - (await rowsWithKodeklasse.count());
      expect(blankRowsCount).toBe(3);
    });
  });
});
