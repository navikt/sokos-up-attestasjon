import { OppdragsDetaljerDTO } from "../../src/types/OppdragsDetaljerDTO";

/**
 * Mock data with a single unattested line
 * Use this to test the redirect from DetaljerPage to TrefflistePage
 * when the last line is attested
 */
export const oppdragsDetaljerSingleLine: OppdragsDetaljerDTO = {
  oppdragsLinjeList: [
    {
      oppdragsLinje: {
        attestert: false,
        datoVedtakFom: "2024-01-01",
        datoVedtakTom: "2024-01-31",
        delytelseId: "TEST20240101001",
        kodeKlasse: "SPATFER",
        linjeId: 1,
        oppdragsId: 99999001,
        sats: 5000,
        typeSats: "ENG",
        hovedkontonr: "123",
        underkontonr: "5678",
        kid: "123456789012345678",
        skyldnerId: "33333333333",
        refunderesId: "REF001",
        utbetalesTilId: "33333333333",
        grad: 100,
      },
      attestasjonList: [],
    },
  ],
  saksbehandlerIdent: "TEST001",
};

/**
 * Mock data with all lines already attested
 * Use this to test immediate redirect from DetaljerPage when no lines are available
 */
export const oppdragsDetaljerAllAttested: OppdragsDetaljerDTO = {
  oppdragsLinjeList: [
    {
      oppdragsLinje: {
        attestert: true,
        datoVedtakFom: "2024-01-01",
        datoVedtakTom: "2024-01-31",
        delytelseId: "TEST20240101001",
        kodeKlasse: "SPATFER",
        linjeId: 1,
        oppdragsId: 99999001,
        sats: 5000,
        typeSats: "ENG",
        hovedkontonr: "123",
        underkontonr: "5678",
        kid: "123456789012345678",
        skyldnerId: "33333333333",
        refunderesId: "REF001",
        utbetalesTilId: "33333333333",
        grad: 100,
      },
      attestasjonList: [
        {
          attestantId: "K2786FPW",
          datoUgyldigFom: "9999-12-31",
        },
      ],
    },
  ],
  saksbehandlerIdent: "TEST001",
};
