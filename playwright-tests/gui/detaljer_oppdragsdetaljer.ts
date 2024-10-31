import { OppdragsDetaljer } from "../../src/types/OppdragsDetaljer";
import { OppdragsLinje } from "../../src/types/OppdragsLinje";
import { generateNumbers } from "../../src/util/commonUtils";

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
      kodeKlasse: "SPREFAGFER-IOP",
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
): OppdragsDetaljer {
  return {
    linjer: generateNumbers(antallLinjer).map((n) =>
      anOppdragslinje(n, antallAttestasjoner),
    ),
    saksbehandlerIdent: "H135685",
  };
}

export default oppdragsdetaljer;
