import { OppdragsDetaljer } from "../../src/types/OppdragsDetaljer";
import { OppdragsLinje } from "../../src/types/OppdragsLinje";

function generateNumbers(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

function anAttestasjon(n: number) {
  return {
    attestant: n === 1 ? "A111111" : "B222222",
    datoUgyldigFom: "9999-12-31",
  };
}

function anOppdragslinje(
  n: number,
  antallAttestasjoner: 0 | 1 | 2,
): OppdragsLinje {
  return {
    oppdragsLinje: {
      attestert: false,
      datoVedtakFom: `2024-${n.toString().padStart(2, "0")}-01`,
      datoVedtakTom: `2024-${n.toString().padStart(2, "0")}-31`,
      delytelseId: `${n}`,
      kodeKlasse: "KODEKLASSE",
      linjeId: n,
      oppdragsId: 98765432,
      sats: 1234.0 + n * 100,
      typeSats: "ENG",
    },
    attestasjoner:
      antallAttestasjoner === 0
        ? []
        : generateNumbers(antallAttestasjoner).map((n) => anAttestasjon(n)),
  };
}

function oppdragsdetaljer(
  antallLinjer: number,
  antallAttestasjoner: 0 | 1 | 2,
  saksbehandlerIdent?: string,
): OppdragsDetaljer {
  return {
    linjer: generateNumbers(antallLinjer).map((n) =>
      anOppdragslinje(n, antallAttestasjoner),
    ),
    saksbehandlerIdent: saksbehandlerIdent ?? "X31337",
  };
}

export default oppdragsdetaljer;
