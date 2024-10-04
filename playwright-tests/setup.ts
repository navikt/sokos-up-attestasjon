import { Page } from "@playwright/test";
import { HttpStatusCode } from "axios";
import { HttpStatusCodeError } from "../src/types/errors";

export async function setupFaggrupper({ page }: { page: Page }) {
  await page.route("*/**/faggrupper", async (route) => {
    const json = [
      {
        navn: "Apotek og bandasjistoppgjør",
        type: "ERESEPT",
      },
      {
        navn: "Arbeidsytelser",
        type: "ARBYT",
      },
      {
        navn: "Barnebriller",
        type: "BARNBRIL",
      },
      {
        navn: "Barnetrygd",
        type: "BA",
      },
      {
        navn: "Behandleroppgjør",
        type: "SAPO01",
      },
    ];
    await route.fulfill({ json });
  });
}

export async function setupFagomraader({ page }: { page: Page }) {
  await page.route("*/**/fagomraader", async (route) => {
    const json = [
      {
        navn: "Arbeidsavklaringspenger",
        kode: "AAP",
      },
      {
        navn: "Arbeidsavklaringspenger",
        kode: "AAPARENA",
      },
      {
        navn: "Lønnskomp arbeidsgiver, permitterte",
        kode: "AGPERM",
      },
      {
        navn: "Barnetrygd",
        kode: "BA",
      },
    ];
    await route.fulfill({ json });
  });
}

export async function setupSok({ page }: { page: Page }) {
  await page.route("*/**/attestasjon/sok", async (route) => {
    const json = [
      {
        ansvarsSted: "1337",
        antallAttestanter: 2,
        fagGruppe: "Pensjoner",
        fagOmraade: "Avtalefestet pensjon manuell postering",
        fagSystemId: "detteErEtLiteOppdrag",
        gjelderId: "12345678901",
        kodeFagGruppe: "PEN",
        kodeFagOmraade: "MPENAFP",
        kostnadsSted: "8128",
        oppdragsId: 87654321,
      },
      {
        ansvarsSted: "1234",
        antallAttestanter: 2,
        fagGruppe: "Memoposteringer pensjon",
        fagOmraade: "Kontoplan pensjon",
        fagSystemId: "detteErEtLiteOppdragTil",
        gjelderId: "12345678901",
        kodeFagGruppe: "PENPOST",
        kodeFagOmraade: "MPENALLE",
        kostnadsSted: "5972",
        oppdragsId: 98765432,
      },
    ];
    await route.fulfill({ json });
  });
}

export async function setupHentNavn({ page }: { page: Page }) {
  await page.route("*/**/hentnavn", async (route) => {
    const json = {
      navn: "William J. Shakespeare",
    };
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(json),
    });
  });
}

export async function setupHentDetaljer({ page }: { page: Page }) {
  await page.route(
    "*/**/attestasjon/98765432/oppdragsdetaljer",
    async (route) => {
      const json = {
        linjer: [
          {
            oppdragsLinje: {
              attestert: false,
              datoVedtakFom: "2024-05-01",
              datoVedtakTom: "2024-05-31",
              delytelseId: "1",
              kodeKlasse: "SPREFAGFER-IOP",
              linjeId: 1,
              oppdragsId: 98765432,
              sats: 1234.0,
              typeSats: "ENG",
            },
            attestasjoner: [
              {
                attestant: "G133837",
                datoUgyldigFom: "9999-12-31",
              },
            ],
          },
        ],
        saksbehandlerIdent: "H135685",
      };
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(json),
      });
    },
  );
}

export async function hentDetaljerError({ page }: { page: Page }) {
  await page.route(
    "*/**/attestasjon/98765432/oppdragsdetaljer",
    async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "text/plain",
        body: "You shall not pass!",
      });
    },
  );
}

export async function setupError({
  page,
  route,
  status,
  message,
}: {
  page: Page;
  route: string;
  status: HttpStatusCode;
  message: string;
}) {
  await page.route(route, async (route) => {
    const error: HttpStatusCodeError = {
      message,
      name: "A rose would smell as sweet",
    };

    await route.fulfill({
      status,
      contentType: "text/plain",
      body: JSON.stringify(error),
    });
  });
}

export async function setupAttester({ page }: { page: Page }) {
  await page.route("*/**/attestasjon/attestere", async (route) => {
    const json = {
      OSAttestasjonOperationResponse: {
        Attestasjonskvittering: {
          ResponsAttestasjon: {
            GjelderId: "17508716508",
            OppdragsId: 73418649,
            AntLinjerMottatt: 1,
            Statuskode: 0,
            Melding: "",
          },
        },
      },
    };
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(json),
    });
  });
}

export async function setupHentDetaljer2({ page }: { page: Page }) {
  await page.route(
    "*/**/attestasjon/98765432/oppdragsdetaljer",
    async (route) => {
      const json = {
        linjer: [
          {
            oppdragsLinje: {
              attestert: false,
              datoVedtakFom: "2024-05-01",
              datoVedtakTom: "2024-05-31",
              delytelseId: "1",
              kodeKlasse: "SPREFAGFER-IOP",
              linjeId: 1,
              oppdragsId: 98765432,
              sats: 1234.0,
              typeSats: "ENG",
            },
            attestasjoner: [
              {
                attestant: "G133837",
                datoUgyldigFom: "9999-12-31",
              },
              {
                attestant: "H135685",
                datoUgyldigFom: "9999-12-31",
              },
            ],
          },
        ],
        saksbehandlerIdent: "H135685",
      };
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(json),
      });
    },
  );
}
